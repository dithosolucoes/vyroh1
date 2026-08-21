import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/src/lib/db";
import { getSession } from "@/src/lib/auth";
import { eq } from "drizzle-orm";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user } = await getSession(req);
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const newId = `rep_${Date.now()}`;

    const [created] = await db
      .insert(schema.communityComments)
      .values({
        id: newId,
        postId: id,
        authorId: user.id,
        authorName: user.name,
        content: body.content,
      })
      .returning();

    const post = await db.query.communityPosts.findFirst({ where: eq(schema.communityPosts.id, id) });
    if (post) {
      await db
        .update(schema.communityPosts)
        .set({ repliesCount: (post.repliesCount || 0) + 1 })
        .where(eq(schema.communityPosts.id, id));
    }

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
