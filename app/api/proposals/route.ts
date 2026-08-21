import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/src/lib/db";
import { getSession } from "@/src/lib/auth";
import { eq, desc, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    const orgId = user?.orgId || "org_default";

    const all = await db.query.proposals.findMany({
      where: eq(schema.proposals.orgId, orgId),
      orderBy: [desc(schema.proposals.createdAt)],
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
    const newId = `prop_${Date.now()}`;

    const [created] = await db
      .insert(schema.proposals)
      .values({
        id: newId,
        orgId: user.orgId,
        title: body.title,
        clientName: body.clientName || "Cliente",
        status: body.status || "rascunho",
        tiers: body.tiers || body.scopeItems || [],
        validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
      })
      .returning();

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const [updated] = await db
      .update(schema.proposals)
      .set({ status: body.status, updatedAt: new Date() })
      .where(and(eq(schema.proposals.id, body.id), eq(schema.proposals.orgId, user.orgId)))
      .returning();

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
