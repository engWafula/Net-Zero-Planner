import { NextApiRequest } from "next";
import { db } from "./db";

export async function getUserFromSession(req:any) {
    const session = req?.session;
    const userId = session.userId;
  
    if (!userId) {
      return null;
    }
  
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
  
    return user;
  }
  