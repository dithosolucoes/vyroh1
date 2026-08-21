import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "../../../../../src/lib/db";
import { getSession } from "../../../../../src/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user } = await getSession(req);
    const orgId = user?.orgId || "org_default";

    const project = await db.query.projects.findFirst({
      where: and(eq(schema.projects.id, params.id), eq(schema.projects.orgId, orgId)),
    });

    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user } = await getSession(req);
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();

    const [updated] = await db
      .update(schema.projects)
      .set({
        name: body.name,
        description: body.description,
        status: body.status,
        budgetCents: body.budgetCents,
        roadmapPlan: body.roadmapPlan,
        updatedAt: new Date(),
      })
      .where(and(eq(schema.projects.id, params.id), eq(schema.projects.orgId, user.orgId)))
      .returning();

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user } = await getSession(req);
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    await db
      .delete(schema.projects)
      .where(and(eq(schema.projects.id, params.id), eq(schema.projects.orgId, user.orgId)));

    return NextResponse.json({ success: true, deleted: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
