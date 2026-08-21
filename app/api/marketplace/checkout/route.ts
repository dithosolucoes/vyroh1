import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "../../../../../src/lib/db";
import { getSession } from "../../../../../src/lib/auth";
import { createStripeCheckoutSession, CommissionFlowType } from "../../../../../src/lib/stripe";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    const body = await req.json();
    const { listingId, flowType = "B" } = body;

    const listing = await db.query.listings.findFirst({
      where: eq(schema.listings.id, listingId),
    });

    if (!listing) {
      return NextResponse.json({ error: "Item não encontrado no Marketplace" }, { status: 404 });
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";

    const session = await createStripeCheckoutSession({
      listingId: listing.id,
      listingTitle: listing.title,
      amountCents: Number(listing.priceCents),
      flowType: (listing.flowType || flowType) as CommissionFlowType,
      successUrl: `${protocol}://${host}/minhas-compras?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancelUrl: `${protocol}://${host}/marketplace?canceled=true`,
      customerEmail: user?.email,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url || `/minhas-compras?simulated=true&listing_id=${listing.id}`,
      sessionId: session.sessionId,
      split: session.split,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
