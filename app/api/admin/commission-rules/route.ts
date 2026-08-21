import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/src/lib/db";
import { getSession } from "@/src/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const rules = await db.query.commissionRules.findMany();
    return NextResponse.json({ success: true, data: rules });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Acesso restrito ao Administrador" }, { status: 403 });
    }

    const body = await req.json();
    const { flowType, percentage } = body;

    const [updated] = await db
      .insert(schema.commissionRules)
      .values({
        id: `rule_${flowType.toLowerCase()}`,
        flowType,
        percentage: Number(percentage).toFixed(2),
        label: `Taxa Fluxo ${flowType}`,
      })
      .onConflictDoUpdate({
        target: schema.commissionRules.flowType,
        set: {
          percentage: Number(percentage).toFixed(2),
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
