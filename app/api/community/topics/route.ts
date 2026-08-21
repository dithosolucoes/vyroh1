import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/src/lib/db";
import { getSession } from "@/src/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.query.communityPosts.findMany({
      orderBy: [desc(schema.communityPosts.createdAt)],
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
    const newId = `top_${Date.now()}`;

    const [created] = await db
      .insert(schema.communityPosts)
      .values({
        id: newId,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatarUrl,
        category: body.category || "dev",
        title: body.title,
        content: body.content,
        tags: body.tags || [],
      })
      .returning();

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
