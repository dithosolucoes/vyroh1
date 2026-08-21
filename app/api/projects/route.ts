import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/src/lib/db";
import { getSession } from "@/src/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    const orgId = user?.orgId || "org_default";

    const allProjects = await db.query.projects.findMany({
      where: eq(schema.projects.orgId, orgId),
      orderBy: [desc(schema.projects.createdAt)],
    });

    return NextResponse.json({ success: true, data: allProjects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const newId = `prj_${Date.now()}`;

    const [created] = await db
      .insert(schema.projects)
      .values({
        id: newId,
        orgId: user.orgId,
        name: body.name,
        description: body.description || "",
        status: body.status || "em_andamento",
        clientId: body.clientId || null,
        budgetCents: body.budgetCents || body.budget ? Math.round(Number(body.budget) * 100) : 0,
        roadmapPlan: body.roadmapPlan || [],
      })
      .returning();

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
