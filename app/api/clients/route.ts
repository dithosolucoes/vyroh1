import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/src/lib/db";
import { getSession } from "@/src/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    const orgId = user?.orgId || "org_default";

    const allClients = await db.query.clients.findMany({
      where: eq(schema.clients.orgId, orgId),
      orderBy: [desc(schema.clients.createdAt)],
    });

    return NextResponse.json({ success: true, data: allClients });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const newId = `cli_${Date.now()}`;

    const [created] = await db
      .insert(schema.clients)
      .values({
        id: newId,
        orgId: user.orgId,
        name: body.name,
        company: body.company || "",
        email: body.email || "",
        phone: body.phone || "",
        notes: body.notes || "",
        status: body.status || "ativo",
      })
      .returning();

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
