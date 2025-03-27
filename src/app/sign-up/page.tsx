import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Registrer deg</h1>
        <SignUpForm />
        <div className="mt-4 text-center text-sm">
          <p>
            Har du allerede en konto?{" "}
            <a href="/sign-in" className="text-blue-600 hover:underline">
              Logg inn
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
