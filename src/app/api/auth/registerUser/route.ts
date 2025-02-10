import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signupSchema } from "@/schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const validatedFields = signupSchema.safeParse(await req.json());

  if (!validatedFields.success) {
    return NextResponse.json({
      status: 400,
      message: "Invalid fields",
    });
  }

  const { name, email, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Registered successfully",
    });
  } catch (error) {
    console.log("registerUserAPI error", error);
    return NextResponse.json({
      status: 500,
      message: "Internal server error",
    });
  }
}
