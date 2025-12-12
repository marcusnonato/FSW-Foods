import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-10 w-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-red-600">Pagamento Cancelado</h1>

        <p className="text-gray-500">
          Você cancelou o processo de pagamento. Nenhum valor foi cobrado.
        </p>

        <div className="flex gap-4">
          <Link href="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
