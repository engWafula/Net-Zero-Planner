import { db } from "@/lib/db";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, name, password } = body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (!password || password.length < 5) {
    return NextResponse.json({ error: "Password must be at least 5 characters" }, { status: 400 });
  }

  const existingUser: User | null = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const createdUser: User = await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword
    }
  });

  return NextResponse.json(createdUser);
}
