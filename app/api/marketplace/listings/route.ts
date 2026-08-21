import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "../../../../../src/lib/db";
import { getSession } from "../../../../../src/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allListings = await db.query.listings.findMany({
      orderBy: [desc(schema.listings.createdAt)],
    });

    return NextResponse.json({ success: true, data: allListings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const newId = `lst_${Date.now()}`;

    const [created] = await db
      .insert(schema.listings)
      .values({
        id: newId,
        sellerOrgId: user.orgId,
        sellerId: user.id,
        sellerName: user.name,
        type: body.type || "prompt",
        title: body.title,
        description: body.description,
        priceCents: body.priceCents || Math.round(Number(body.price || 0) * 100),
        category: body.category || "Desenvolvimento",
        flowType: body.flowType || "B",
        previewContent: body.previewContent || "",
        licenseType: body.licenseType || "comercial",
      })
      .returning();

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
