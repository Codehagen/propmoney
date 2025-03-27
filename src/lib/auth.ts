import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  cookies: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  emailAndPassword: {
    enabled: true,
    async sendVerificationEmail() {
      // In a real app, this would send a verification email
      console.log("Verification email would be sent here");
      return;
    },
    async sendResetPassword() {
      // In a real app, this would send a password reset email
      console.log("Password reset email would be sent here");
      return;
    },
  },
  plugins: [nextCookies()], // Add Next.js cookies plugin last
});
