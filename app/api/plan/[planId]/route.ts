import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest,{ params }: { params: { planId: string } }) {
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
      
  return NextResponse.json({
    data: plan,
    meta: {}
  });
  
  }