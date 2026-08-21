import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/src/lib/db";
import { getSession } from "@/src/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    const orgId = user?.orgId || "org_default";

    const all = await db.query.subscriptions.findMany({
      where: eq(schema.subscriptions.orgId, orgId),
      orderBy: [desc(schema.subscriptions.createdAt)],
    });

    return NextResponse.json({ success: true, data: all });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const newId = `sub_${Date.now()}`;

    const [created] = await db
      .insert(schema.subscriptions)
      .values({
        id: newId,
        orgId: user.orgId,
        serviceName: body.serviceName,
        category: body.category || "infra",
        costMonthlyCents: Math.round((body.costMonthly || 0) * 100),
        currency: body.currency || "BRL",
        renewalDate: body.renewalDate || "",
        paymentMethod: body.paymentMethod || "Cartão PJ",
        roiRating: body.roiRating || "bom",
        status: body.status || "active",
        url: body.url || "",
      })
      .returning();

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
