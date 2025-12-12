import { redirect } from "next/navigation";
import { stripe } from "@/app/_lib/stripe";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

interface PageProps {
  searchParams: {
    session_id?: string;
  };
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  if (!searchParams.session_id) {
    redirect("/");
  }

  const session = await stripe.checkout.sessions.retrieve(
    searchParams.session_id,
  );

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-green-600">
          Pagamento Confirmado!
        </h1>

        <div className="space-y-2">
          <p className="text-gray-600">Pedido #{session.metadata?.orderId}</p>
          <p className="text-2xl font-bold">
            R$ {((session.amount_total || 0) / 100).toFixed(2)}
          </p>
        </div>

        <p className="text-gray-500">
          Seu pedido foi confirmado e está sendo preparado.
        </p>

        <div className="flex gap-4">
          <Link href="/my-orders">
            <Button>Ver Meus Pedidos</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
