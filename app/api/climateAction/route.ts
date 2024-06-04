
import { getUserFromSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const currentYear = new Date().getFullYear();

export async function POST(req: Request) {
    const body = await req.json();
  
    const startYear = new Date(body.startYear);
    const emissionsReduction = body.emissionsReduction;
    const title = body.title;
    const netZeroPlanId = body.netZeroPlanId;
    const actionCost = body.cost
  
    if (!netZeroPlanId) {
      return Response.json({ error: "NetZeroPlan ID is required." }, { status: 400 });
    }
  
    try {
      const climateAction = await db.climateAction.create({
        data: {
          title,
          startYear,
          emissionsReduction,
          actionCost,
          netZeroPlan: {
            connect: {
              id: netZeroPlanId
            }
          }
        }
      });
  
      return Response.json(climateAction);
    } catch (error) {
      console.error(error);
      return Response.json({ error: "An error occurred while creating the ClimateAction." }, { status: 500 });
    }
  }
  


export async function GET(req:Request) {
  const plan = await db.climateAction.findMany();
return NextResponse.json(plan);
}





