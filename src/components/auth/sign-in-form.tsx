"use client";

import { useState } from "react";
import Link from "next/link";
import { RiLoader5Line } from "@remixicon/react";
import { authClient } from "../../lib/auth-client";

// Import UI components from src/components
import { Button } from "../Button";
import { Card } from "../Card";
import { Input } from "../Input";
import { Label } from "../Label";
import { Checkbox } from "../Checkbox";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  async function handleSignIn(e: React.MouseEvent) {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);

      await authClient.signIn.email({
        email,
        password,
      });

      // Use setTimeout to ensure cookies are properly set before redirect
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Innlogging feilet. Sjekk brukernavn og passord.");
    } finally {
      setLoading(false);
    }
  }

  async function seedTestUser() {
    try {
      setSeedMessage("Creating test user...");
      const response = await fetch("/api/seed-auth");
      const data = await response.json();

      if (data.success) {
        setSeedMessage("Test user created successfully! You can now sign in.");
      } else {
        setSeedMessage(
          `Failed: ${data.error || data.message || "Unknown error"}`
        );
      }
    } catch (err) {
      setSeedMessage("Failed to create test user. See console for details.");
      console.error("Seed error:", err);
    }
  }

  return (
    <Card className="w-full max-w-md bg-white rounded-lg border p-6 shadow-sm">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-500">
            Enter your email below to sign in to your account
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex flex-col text-sm">
          <div className="text-blue-800 font-medium mb-1">
            Test Credentials:
          </div>
          <p className="text-blue-700">Email: utleier@eksempel.com</p>
          <p className="text-blue-700">Passord: landlord123</p>

          <Button
            variant="secondary"
            className="mt-2 text-xs py-1"
            onClick={seedTestUser}
          >
            Create Test User
          </Button>

          {seedMessage && (
            <p className="text-xs mt-2 font-medium text-blue-800">
              {seedMessage}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                className="text-sm text-blue-600 hover:underline"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Button className="w-full" disabled={loading} onClick={handleSignIn}>
            {loading ? (
              <>
                <RiLoader5Line className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link className="text-blue-600 hover:underline" href="/sign-up">
            Sign up
          </Link>
        </div>
      </div>
    </Card>
  );
}
