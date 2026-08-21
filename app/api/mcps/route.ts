import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/src/lib/db";
import { getSession } from "@/src/lib/auth";
import { eq, desc, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    const orgId = user?.orgId || "org_default";

    const all = await db.query.mcps.findMany({
      where: eq(schema.mcps.orgId, orgId),
      orderBy: [desc(schema.mcps.createdAt)],
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
    const newId = `mcp_${Date.now()}`;

    const [created] = await db
      .insert(schema.mcps)
      .values({
        id: newId,
        orgId: user.orgId,
        name: body.name,
        endpoint: body.endpoint,
        description: body.description || "",
        transport: body.transport || "sse",
        toolsCount: body.toolsCount || 0,
        status: "connected",
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
      .update(schema.mcps)
      .set({ status: body.status })
      .where(and(eq(schema.mcps.id, body.id), eq(schema.mcps.orgId, user.orgId)))
      .returning();

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
