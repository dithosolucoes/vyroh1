import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/src/lib/db";
import { getSession } from "@/src/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    const orgId = user?.orgId || "org_default";

    const all = await db.query.boilerplates.findMany({
      where: eq(schema.boilerplates.orgId, orgId),
      orderBy: [desc(schema.boilerplates.createdAt)],
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
    const newId = `bp_${Date.now()}`;

    const [created] = await db
      .insert(schema.boilerplates)
      .values({
        id: newId,
        orgId: user.orgId,
        name: body.name,
        repoUrl: body.repoUrl,
        description: body.description || "",
        techStack: body.stack || body.techStack || [],
        visibility: body.visibility || "private",
      })
      .returning();

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
