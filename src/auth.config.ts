import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const existingUser = await getUserByEmail(email);

          if (!existingUser || !existingUser.id || !existingUser.password)
            return null;

          const passwordMatch = await bcrypt.compare(
            password,
            existingUser.password
          );

          if (passwordMatch) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...user } = existingUser;
            return user;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
