import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { ExtendedUser } from "./next-auth";
import { UserRole } from "@prisma/client";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  events: {},
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signIn({ user, account }) {
      if (!user.id) {
        return false;
      }

      if (account?.provider === "credentials") return true;

      return false;
    },

    // Extend the session
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email ?? "";
        session.user.role = token.role as UserRole;
        session.user.imageUrl = token.imageUrl as string;
      }

      return session;
    },

    async jwt({ token, user }) {
      if (!token.sub) return token;

      if (user) {
        const extendedUser = user as ExtendedUser;

        token.name = extendedUser.name;
        token.email = extendedUser.email;
        token.role = extendedUser.role;
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  ...authConfig,
});
