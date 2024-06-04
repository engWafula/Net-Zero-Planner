import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: { json: () => any; }) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return Response.json({ error: "Email and password are required" });
  }

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return Response.json({ error: "Invalid email or password" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return Response.json({ error: "Invalid email or password" });
  }

  // Login successful, generate JWT token
  const token =  await jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET_KEY as string
  );

  const LoggedInUser = {
    id: user.id,
    email: user.email,
    name: user.name,
  };


  return Response.json({ token, LoggedInUser });
}
