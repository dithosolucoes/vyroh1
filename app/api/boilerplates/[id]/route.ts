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
    const [updated] = await db
      .update(schema.boilerplates)
      .set({
        name: body.name,
        description: body.description,
        repoUrl: body.repoUrl,
        techStack: body.stack || body.techStack,
        visibility: body.visibility,
        updatedAt: new Date(),
      })
      .where(and(eq(schema.boilerplates.id, id), eq(schema.boilerplates.orgId, user.orgId)))
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

    await db
      .delete(schema.boilerplates)
      .where(and(eq(schema.boilerplates.id, id), eq(schema.boilerplates.orgId, user.orgId)));

    return NextResponse.json({ success: true, deleted: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
