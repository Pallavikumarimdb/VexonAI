import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface SignupRequestBody {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SignupRequestBody>;

    const { firstName, lastName, emailAddress, password } = body;

    if (!firstName || !lastName || !emailAddress || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    if (typeof emailAddress !== "string") {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { emailAddress },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }
    if (typeof password !== "string") {
      return NextResponse.json({ message: "Invalid password format" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User created", user }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Signup failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}