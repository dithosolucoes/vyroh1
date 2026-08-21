import Stripe from "stripe";
import { db, schema } from "./db";
import { eq } from "drizzle-orm";

let stripeClient: Stripe | null = null;

/**
 * Modo híbrido (Marco 4/7): sem STRIPE_SECRET_KEY real configurada, o Vyroh não
 * tenta chamar a API do Stripe (que falharia com erro de autenticação) — as
 * funções abaixo caem num fluxo simulado em vez de derrubar a tela do usuário.
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_"));
}

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_vyroh";
    stripeClient = new Stripe(key, {
      apiVersion: "2023-10-16" as any,
    });
  }
  return stripeClient;
}

export type CommissionFlowType = "A" | "B" | "C" | "D";

export interface CommissionRuleData {
  flowType: CommissionFlowType;
  percentage: number;
  label: string;
}

export const DEFAULT_COMMISSION_RULES: Record<CommissionFlowType, number> = {
  A: 0.0, // Assinatura Plataforma: 100% Vyroh (0% comissão repassada)
  B: 10.0, // Produto Digital: 10% Vyroh / 90% Vendedor
  C: 12.5, // Assinatura Criador: 12.5% Vyroh / 87.5% Vendedor
  D: 15.0, // Serviços & Contratos Escrow: 15% Vyroh / 85% Prestador
};

/**
 * Fetch dynamic commission rules from Database (Section 29 - Governança sem deploy)
 */
export async function getCommissionRate(flowType: CommissionFlowType): Promise<number> {
  try {
    const rule = await db.query.commissionRules.findFirst({
      where: eq(schema.commissionRules.flowType, flowType),
    });
    if (rule && rule.percentage) {
      return parseFloat(rule.percentage);
    }
  } catch (err) {
    console.warn("[Stripe] Using default commission rule due to DB fallback:", err);
  }
  return DEFAULT_COMMISSION_RULES[flowType] ?? 10.0;
}

/**
 * Calculates financial split for Marketplace transactions (Section 28 & 29)
 */
export async function calculatePlatformSplit(amountCents: number, flowType: CommissionFlowType) {
  const percentage = await getCommissionRate(flowType);
  const platformFeeCents = Math.round((amountCents * percentage) / 100);
  const sellerPayoutCents = amountCents - platformFeeCents;

  return {
    amountCents,
    platformFeeCents,
    sellerPayoutCents,
    commissionPercentage: percentage,
  };
}

/**
 * Creates a Stripe Connect Express onboarding account link for creators
 */
export async function createStripeConnectAccountLink(userId: string, returnUrl: string) {
  if (!isStripeConfigured()) {
    return {
      accountId: `acct_simulado_${userId}`,
      url: `${returnUrl}?stripe_connect=simulado`,
      simulated: true,
    };
  }

  const stripe = getStripeClient();

  const account = await stripe.accounts.create({
    type: "express",
    country: "BR",
    capabilities: {
      transfers: { requested: true },
      card_payments: { requested: true },
    },
    metadata: { userId },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${returnUrl}?stripe_connect=refresh`,
    return_url: `${returnUrl}?stripe_connect=success&account_id=${account.id}`,
    type: "account_onboarding",
  });

  return {
    accountId: account.id,
    url: accountLink.url,
  };
}

/**
 * Creates a checkout session using split transfers (Section 28)
 */
export async function createStripeCheckoutSession(params: {
  listingId: string;
  listingTitle: string;
  amountCents: number;
  sellerStripeAccountId?: string;
  flowType: CommissionFlowType;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}) {
  const split = await calculatePlatformSplit(params.amountCents, params.flowType);

  if (!isStripeConfigured()) {
    return {
      sessionId: `sess_simulado_${Date.now()}`,
      url: undefined,
      split,
      simulated: true,
    };
  }

  const stripe = getStripeClient();

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ["card", "boleto"] as any,
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: params.listingTitle,
            metadata: {
              listingId: params.listingId,
              flowType: params.flowType,
            },
          },
          unit_amount: params.amountCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  };

  // If seller has Stripe Connect active, attach application fee split
  if (params.sellerStripeAccountId && params.flowType !== "A") {
    sessionParams.payment_intent_data = {
      application_fee_amount: split.platformFeeCents,
      transfer_data: {
        destination: params.sellerStripeAccountId,
      },
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  return {
    sessionId: session.id,
    url: session.url,
    split,
  };
}
