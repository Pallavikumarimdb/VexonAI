import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { firstName, lastName, emailAddress, password } = await req.json();

    if (!firstName || !lastName || !emailAddress || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { emailAddress } });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
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
    return NextResponse.json({ message: "Signup failed", error }, { status: 500 });
  }
}
