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
      return await prisma.user.findFirst({
        include: {
          businessProfile: true,
          ngoProfile: true,
          buyerProfile: true,
        },
      }).catch(() => null);
    }

    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        businessProfile: true,
        ngoProfile: true,
        buyerProfile: true,
      },
    }).catch(() => null);

    // Auto-sync / auto-provision new Clerk user if not yet in DB
    if (!dbUser) {
      let email = `${clerkUserId}@example.com`;
      let fullName = "User";
      let role: Role = Role.BUSINESS;

      try {
        const clerkUser = await getClerkUser();
        if (clerkUser) {
          email = clerkUser.emailAddresses[0]?.emailAddress || email;
          fullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || fullName;
          const roleMeta = (clerkUser.unsafeMetadata?.role as string)?.toUpperCase();
          if (roleMeta === "NGO") role = Role.NGO;
          else if (roleMeta === "ADMIN") role = Role.ADMIN;
          else if (roleMeta === "BUSINESS") role = Role.BUSINESS;
        }
      } catch (syncErr) {
        console.warn("Clerk user details fetch warning:", syncErr);
      }

      // Upsert user into database
      dbUser = await prisma.user.upsert({
        where: { clerkUserId },
        update: { email, fullName, role },
        create: { clerkUserId, email, fullName, role },
        include: {
          businessProfile: true,
          ngoProfile: true,
          buyerProfile: true,
        },
      }).catch(() => null);
    }

    return dbUser;
  } catch (error) {
    try {
      return await prisma.user.findFirst({
        include: {
          businessProfile: true,
          ngoProfile: true,
          buyerProfile: true,
        },
      });
    } catch {
      return null;
    }
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
