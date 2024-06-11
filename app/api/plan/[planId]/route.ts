import { db } from "@/lib/db";


export async function GET(req: Request,{ params }: { params: { planId: string } }) {
    const { planId } = params;

    const plan = await db.netZeroPlan.findUnique({
      where: { id: planId },
      include: {
        climateActions: {
          orderBy: {
            createdAt: 'desc', 
          },
        },
      },
    });
      
  return Response.json(plan);
  
  }