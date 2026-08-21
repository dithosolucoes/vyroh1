import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/src/lib/db";
import { getSession } from "@/src/lib/auth";
import { eq, desc, or } from "drizzle-orm";
import { calculatePlatformSplit } from "@/src/lib/stripe";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    const orgId = user?.orgId || "org_default";

    const all = await db.query.orders.findMany({
      where: or(eq(schema.orders.buyerOrgId, orgId), eq(schema.orders.sellerOrgId, orgId)),
      orderBy: [desc(schema.orders.createdAt)],
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
    const listing = await db.query.listings.findFirst({ where: eq(schema.listings.id, body.listingId) });
    if (!listing) return NextResponse.json({ error: "Listagem não encontrada" }, { status: 404 });

    const split = await calculatePlatformSplit(listing.priceCents, (listing.flowType as "A" | "B" | "C" | "D") || "B");
    const newId = `ord_${Date.now()}`;

    const [created] = await db
      .insert(schema.orders)
      .values({
        id: newId,
        listingId: listing.id,
        sellerId: listing.sellerId,
        sellerOrgId: listing.sellerOrgId,
        buyerId: user.id,
        buyerOrgId: user.orgId,
        amountCents: listing.priceCents,
        platformFeeCents: split.platformFeeCents,
        sellerPayoutCents: split.sellerPayoutCents,
        flowType: listing.flowType,
        status: "pago",
      })
      .returning();

    await db
      .update(schema.listings)
      .set({ salesCount: (listing.salesCount || 0) + 1 })
      .where(eq(schema.listings.id, listing.id));

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
