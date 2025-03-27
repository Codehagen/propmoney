"use client";

import { useState } from "react";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import { RiLoader5Line } from "@remixicon/react";

// Import UI components from src/components
import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";
import { createUserProfile } from "@/actions/user/create-user";

export function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passordene stemmer ikke overens");
      return;
    }

    setLoading(true);

    try {
      // Create authentication account with Better Auth
      const response = await authClient.signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`,
      });

      if (response) {
        // Create user record in database using server action
        try {
          const result = await createUserProfile({
            email,
            role: "LANDLORD",
          });

          if (!result.success) {
            console.warn("Profile creation warning:", result.error);
          }

          // Sign in after successful signup
          await authClient.signIn.email({
            email,
            password,
          });

          // Force a server-side redirect by replacing the current URL
          // Use a small delay to allow cookies to be properly set
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1000);

          return;
        } catch (error) {
          console.error("Error during signup process:", error);
        }
      }

      // Fallback - redirect to sign-in page
      window.location.href = "/sign-in";
    } catch (err) {
      setError("Kunne ikke opprette konto");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="first-name">Fornavn</Label>
          <Input
            id="first-name"
            type="text"
            placeholder="Ola"
            required
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="last-name">Etternavn</Label>
          <Input
            id="last-name"
            type="text"
            placeholder="Nordmann"
            required
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLastName(e.target.value)
            }
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">E-post</Label>
        <Input
          id="email"
          type="email"
          placeholder="din@epost.no"
          required
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Passord</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirm-password">Bekreft passord</Label>
        <Input
          id="confirm-password"
          type="password"
          required
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setConfirmPassword(e.target.value)
          }
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <RiLoader5Line className="animate-spin h-4 w-4 mr-2" />
            Oppretter konto...
          </>
        ) : (
          "Registrer deg"
        )}
      </Button>
    </form>
  );
}
