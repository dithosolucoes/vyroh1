import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/src/lib/db";
import { getSession } from "@/src/lib/auth";
import { eq, and } from "drizzle-orm";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user } = await getSession(req);
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const setValues: Record<string, unknown> = { updatedAt: new Date() };
    if (body.content !== undefined) setValues.content = body.content;
    if (body.title !== undefined) setValues.title = body.title;
    if (body.category !== undefined) setValues.category = body.category;
    if (body.favorite !== undefined) setValues.favorite = body.favorite;
    if (body.visibility !== undefined) setValues.visibility = body.visibility;

    const [updated] = await db
      .update(schema.prompts)
      .set(setValues)
      .where(and(eq(schema.prompts.id, id), eq(schema.prompts.orgId, user.orgId)))
      .returning();

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user } = await getSession(req);
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    await db.delete(schema.prompts).where(and(eq(schema.prompts.id, id), eq(schema.prompts.orgId, user.orgId)));

    return NextResponse.json({ success: true, deleted: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
