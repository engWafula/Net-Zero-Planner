import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

export async function authenticate(req:Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Authorization header is missing');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Token is missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
    const decodedPayload = decoded as jwt.JwtPayload;
    const userId = decodedPayload.userId;
    if (!userId) {
      throw new Error('Invalid token: userId missing');
    }

    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
