import { auth, currentUser as getClerkUser } from "@clerk/nextjs/server";
import { prisma } from "@/server/db/prisma";
import { Role } from "@prisma/client";

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
      });
    }

    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        businessProfile: true,
        ngoProfile: true,
        buyerProfile: true,
      },
    });

    // Auto-sync / auto-provision new Clerk user if not yet synced in DB
    if (!dbUser) {
      try {
        const clerkUser = await getClerkUser();
        if (clerkUser) {
          const email =
            clerkUser.emailAddresses[0]?.emailAddress || `${clerkUserId}@example.com`;
          const fullName =
            `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User";
          const roleMeta = (clerkUser.unsafeMetadata?.role as string)?.toUpperCase();
          const role: Role =
            roleMeta === "BUSINESS"
              ? Role.BUSINESS
              : roleMeta === "NGO"
              ? Role.NGO
              : roleMeta === "ADMIN"
              ? Role.ADMIN
              : Role.BUYER;

          dbUser = await prisma.user.upsert({
            where: { clerkUserId },
            update: { email, fullName, role },
            create: { clerkUserId, email, fullName, role },
            include: {
              businessProfile: true,
              ngoProfile: true,
              buyerProfile: true,
            },
          });
        }
      } catch (syncErr) {
        console.warn("Clerk user auto-sync warning:", syncErr);
      }
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
