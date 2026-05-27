import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await connectDB();
        const email = user.email.toLowerCase();
        let dbUser = await User.findOne({ email });
        if (!dbUser) {
          dbUser = await User.create({
            name: user.name ?? email.split("@")[0],
            email,
            avatar: user.image ?? "",
            role: "reader",
          });
        }
        user.id = String(dbUser._id);
        (user as { role?: string }).role = dbUser.role;
      }
      return true;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsed.success) return null;

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email })
          .select("+passwordHash")
          .lean() as { _id: unknown; name: string; email: string; passwordHash?: string; role: string; avatar?: string } | null;

        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatar ?? null,
        };
      },
    }),
  ],
});
