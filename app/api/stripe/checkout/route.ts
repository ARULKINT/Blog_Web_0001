import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Sign in to subscribe" }, { status: 401 });
  }

  const stripe = getStripe();

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: absoluteUrl("/subscribe/success?session_id={CHECKOUT_SESSION_ID}"),
    cancel_url: absoluteUrl("/subscribe"),
    customer_email: session.user.email ?? undefined,
    metadata: { userId: session.user.id },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
