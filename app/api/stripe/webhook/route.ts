import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/app/_lib/stripe";
import { db } from "@/app/_lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      await db.order.update({
        where: {
          id: checkoutSession.metadata!.orderId,
          userId: checkoutSession.metadata!.userId,
        },
        data: {
          status: "CONFIRMED",
        },
      });
      break;

    case "checkout.session.expired":
      const expiredSession = event.data.object as Stripe.Checkout.Session;

      await db.order.update({
        where: { id: expiredSession.metadata!.orderId },
        data: {
          status: "CANCELLED",
        },
      });
      break;
  }

  return NextResponse.json({ received: true });
}
