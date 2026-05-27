import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectDB();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId && session.payment_status === "paid") {
        await User.findByIdAndUpdate(userId, {
          isSubscriber: true,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        });
      }
      break;
    }
    case "customer.subscription.deleted":
    case "customer.subscription.paused": {
      const sub = event.data.object as Stripe.Subscription;
      await User.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        { isSubscriber: false }
      );
      break;
    }
    case "customer.subscription.resumed":
    case "invoice.payment_succeeded": {
      const inv = event.data.object as Stripe.Invoice & { subscription?: string };
      if (inv.subscription) {
        await User.findOneAndUpdate(
          { stripeSubscriptionId: inv.subscription },
          { isSubscriber: true }
        );
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
