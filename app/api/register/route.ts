import { db } from "@/lib/db";
import bcrypt from "bcrypt"
export async function POST(req: { json: () => any; }) {
  const body = await req.json();
  const pass = body.password;
  if (!pass?.length || pass.length < 5) {
    new Error('password must be at least 5 characters');
  }

  const notHashedPassword = pass;
  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(notHashedPassword, salt);

  const createdUser = await db.user.create({
    data: {
      email:body.email,
      name:body.name,
      password:body.password
    }
  });
  return Response.json(createdUser);
}