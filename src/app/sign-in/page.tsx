import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <SignInForm />
        <div className="mt-4 text-center text-sm">
          <p>
            Har du ikke en konto?{" "}
            <a href="/sign-up" className="text-blue-600 hover:underline">
              Registrer deg
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
