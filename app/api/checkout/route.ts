import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/app/_lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, items } = await request.json();

    if (!orderId || !items || items.length === 0) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    for (const item of items) {
      if (!item.name || !item.price || !item.quantity) {
        return NextResponse.json(
          { error: "Dados do produto incompletos" },
          { status: 400 },
        );
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name,
            description: item.description,
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: String(orderId),
        userId: String(session.user.id),
      },
      success_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancel`,
    });

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Erro ao criar checkout session:", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão de pagamento" },
      { status: 500 },
    );
  }
}
