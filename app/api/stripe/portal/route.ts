import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { absoluteUrl } from "@/lib/utils";

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.user.id).select("stripeCustomerId").lean() as { stripeCustomerId?: string } | null;

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No subscription found" }, { status: 404 });
  }

  const stripe = getStripe();
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: absoluteUrl("/profile"),
  });

  return NextResponse.json({ url: portalSession.url });
}
