
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const currentYear = new Date().getFullYear();

export async function POST(req: { json: () => any; }) {
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



export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email as string;
  const user = await db.user.findUnique({ where: { email } });

  const userNetZeroPlans = await db.netZeroPlan.findMany({
    where: { userId: user?.id  as string}, 
    include: {
      climateActions: true,
    },
  });

  return Response.json(userNetZeroPlans);
}
