import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role?: "USER" | "ADMIN";
  phoneNo?: string;
  imageUrl?: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
