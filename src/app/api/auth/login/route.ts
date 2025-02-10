import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { loginSchema } from "@/schemas";
import { NextResponse } from "next/server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function POST(req: Request) {
  const validatedFields = loginSchema.safeParse(await req.json());

  if (!validatedFields.success) {
    return NextResponse.json({
      status: 400,
      message: "Invalid fields",
    });
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({
        status: 401,
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({
        status: 401,
        message: "Invalid credentials",
      });
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return NextResponse.json({
      status: 200,
      message: "Logged in successfully",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json({
            error: "Invalid credentials from auth error",
          });
        default:
          return NextResponse.json({ error: "Something went wrong!" });
      }
    }

    throw error;
  }
}
