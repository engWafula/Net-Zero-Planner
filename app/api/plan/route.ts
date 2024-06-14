
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

const currentYear = new Date().getFullYear();

export async function POST(req: Request) {
  const body = await req.json();
  const session = await getServerSession(authOptions);
  const email = session?.user?.email  as string
  const user = await db.user.findUnique({ where: { email } });


  const targetYear = body.targetYear;
  const currentEmissions = body.currentEmissions;

  if (!targetYear || !currentEmissions) {
    throw new Error('Target year and the current year must be provided');
  }

  if (targetYear <= currentYear) {
    throw new Error('Target year must be a future year');
  }


  const plan = await db.netZeroPlan.create({
    data: {
      targetYear,
      currentEmissions,
      userId:user?.id
    }
  });
return Response.json(plan);

}



export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session?.user?.email as string;
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('pageSize') || '9', 10);

  const offset = (page - 1) * pageSize;

  const [userNetZeroPlans, totalPlans] = await Promise.all([
    db.netZeroPlan.findMany({
      where: { userId: user.id },
      include: {
        climateActions: true,
      },
      skip: offset,
      take: pageSize,
    }),
    db.netZeroPlan.count({
      where: { userId: user.id },
    }),
  ]);

  const totalPages = Math.ceil(totalPlans / pageSize);

  return NextResponse.json({
    data: userNetZeroPlans,
    meta: {
      totalPlans,
      page,
      totalPages,
    },
  });
}