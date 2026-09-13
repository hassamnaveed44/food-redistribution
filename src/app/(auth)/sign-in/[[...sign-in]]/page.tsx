import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F1E8] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-[#E3DBC9] flex flex-col items-center">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-2xl font-semibold text-[#211D19] mb-1">
            Welcome back to FoodBridge
          </h1>
          <p className="text-xs text-[#6B6157]">
            Sign in to access your Business, NGO, or Buyer console.
          </p>
        </div>
        <SignIn
          fallbackRedirectUrl="/redirect"
          appearance={{
            elements: {
              formButtonPrimary: "bg-[#B84A16] hover:bg-[#a14013] text-white text-xs",
              card: "shadow-none p-0 w-full",
            },
          }}
        />

      </div>
    </div>
  );
}
