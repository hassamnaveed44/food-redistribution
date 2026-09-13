import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/server/db/prisma";
import { Role } from "@prisma/client";

export async function getCurrentUser() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      // Return first seeded user for local development demo if Clerk keys are not set
      const demoUser = await prisma.user.findFirst({
        include: {
          businessProfile: true,
          ngoProfile: true,
          buyerProfile: true,
        },
      });
      return demoUser;
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        businessProfile: true,
        ngoProfile: true,
        buyerProfile: true,
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Error fetching current user:", error);
    // Fallback to first user in demo mode
    return await prisma.user.findFirst({
      include: {
        businessProfile: true,
        ngoProfile: true,
        buyerProfile: true,
      },
    });
  }
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED: Session credential missing or invalid");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error(`FORBIDDEN: User lacks required role [${allowedRoles.join(", ")}]`);
  }

  return user;
}
