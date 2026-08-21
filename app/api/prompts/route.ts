import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "../../../../src/lib/db";
import { getSession } from "../../../../src/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    const orgId = user?.orgId || "org_default";

    const allPrompts = await db.query.prompts.findMany({
      where: eq(schema.prompts.orgId, orgId),
      orderBy: [desc(schema.prompts.createdAt)],
    });

    return NextResponse.json({ success: true, data: allPrompts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const newId = `prm_${Date.now()}`;

    const [created] = await db
      .insert(schema.prompts)
      .values({
        id: newId,
        orgId: user.orgId,
        title: body.title,
        content: body.content,
        category: body.category || "Geral",
        targetModel: body.targetModel || "universal",
        visibility: body.visibility || "private",
      })
      .returning();

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
