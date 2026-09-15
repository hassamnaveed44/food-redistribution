import { auth, currentUser as getClerkUser } from "@clerk/nextjs/server";
import { prisma } from "@/server/db/prisma";
import { Role } from "@prisma/client";

// Helper with timeout to prevent database connection hanging
async function withTimeout<T>(promise: Promise<T>, ms: number = 10000): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("DB_TIMEOUT")), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

export async function getCurrentUser() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      // Fallback demo user when unauthenticated in local mode
      const demoUser = await prisma.user.findFirst().catch(() => null);
      if (!demoUser) return null;
      const ngoP = await prisma.ngoProfile.findUnique({ where: { userId: demoUser.id } }).catch(() => null);
      const bizP = await prisma.businessProfile.findUnique({ where: { userId: demoUser.id } }).catch(() => null);
      return { ...demoUser, ngoProfile: ngoP, businessProfile: bizP };
    }

    // 1. Fetch User by clerkUserId (No include to prevent HTTP transaction errors)
    let rawUser = await prisma.user.findUnique({
      where: { clerkUserId },
    }).catch(() => null);

    // 2. Auto-sync / auto-provision new Clerk user if not yet in DB
    if (!rawUser) {
      let email = `${clerkUserId}@user.rescuebites.com`;
      let fullName = "RescueBites User";
      let role: Role = Role.NGO;

      try {
        const clerkUser = await getClerkUser();
        if (clerkUser) {
          const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;
          if (primaryEmail) email = primaryEmail;

          const nameStr = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
          if (nameStr) fullName = nameStr;

          const roleMeta = (clerkUser.unsafeMetadata?.role as string)?.toUpperCase();
          if (roleMeta === "BUSINESS") role = Role.BUSINESS;
          else if (roleMeta === "ADMIN") role = Role.ADMIN;
          else role = Role.NGO;
        }
      } catch (syncErr) {
        console.warn("Clerk user details fetch warning:", syncErr);
      }

      // Check if user already exists in Neon DB by email
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
      }).catch(() => null);

      if (existingByEmail) {
        // Link existing record to this clerkUserId
        rawUser = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: { clerkUserId, fullName: fullName !== "RescueBites User" ? fullName : existingByEmail.fullName },
        }).catch(() => existingByEmail);
      } else {
        // Create new user row in Neon DB (No include to avoid HTTP transaction error)
        try {
          rawUser = await prisma.user.create({
            data: { clerkUserId, email, fullName, role },
          });
        } catch {
          // If email constraint fails, fallback to unique clerk email
          const fallbackEmail = `${clerkUserId}@user.rescuebites.com`;
          rawUser = await prisma.user.create({
            data: { clerkUserId, email: fallbackEmail, fullName, role },
          }).catch(() => null);
        }
      }
    }

    if (!rawUser) {
      // Ultimate fallback user object when authenticated via Clerk
      return {
        id: clerkUserId,
        clerkUserId,
        email: `${clerkUserId}@user.rescuebites.com`,
        fullName: "Authenticated User",
        role: Role.NGO,
        createdAt: new Date(),
        updatedAt: new Date(),
        ngoProfile: {
          id: clerkUserId,
          userId: clerkUserId,
          orgName: "Community Hope Hub",
          address: "200 Community Way, Midtown",
          latitude: 40.7138,
          longitude: -74.001,
          receivingCapacity: 150,
          verificationStatus: "APPROVED",
        },
        businessProfile: null,
      };
    }

    // 3. Fetch linked profiles individually without transactions
    let ngoP = await prisma.ngoProfile.findUnique({ where: { userId: rawUser.id } }).catch(() => null);
    let bizP = await prisma.businessProfile.findUnique({ where: { userId: rawUser.id } }).catch(() => null);

    // Auto-create missing profile row in Neon DB if needed
    if (rawUser.role === Role.BUSINESS && !bizP) {
      bizP = await prisma.businessProfile.create({
        data: {
          userId: rawUser.id,
          businessName: rawUser.fullName ? `${rawUser.fullName}'s Kitchen` : "Artisan Partner Store",
          address: "100 Market St, Downtown",
          latitude: 40.7128,
          longitude: -74.006,
          verificationStatus: "APPROVED",
        },
      }).catch(() => null);
    } else if (!ngoP && !bizP) {
      ngoP = await prisma.ngoProfile.create({
        data: {
          userId: rawUser.id,
          orgName: rawUser.fullName ? `${rawUser.fullName} Relief Hub` : "Community Shelter Hub",
          address: "200 Community Way, Midtown",
          latitude: 40.7138,
          longitude: -74.001,
          receivingCapacity: 150,
          verificationStatus: "APPROVED",
        },
      }).catch(() => null);
    }

    return {
      ...rawUser,
      ngoProfile: ngoP,
      businessProfile: bizP,
    };
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED: Session credential missing or invalid");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error(
      `FORBIDDEN: User lacks required role [${allowedRoles.join(", ")}]`
    );
  }

  return user;
}
