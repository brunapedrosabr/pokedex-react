import { Link } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function NotFoundPage() {
  useDocumentTitle("Página não encontrada — Pokédex");

  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-4xl text-primary">404</h1>
      <p className="mt-6 text-lg font-bold">Esta página fugiu da Pokébola.</p>
      <p className="mt-2 text-muted-foreground">O endereço não existe ou foi alterado.</p>
      <Link to="/" className="mt-8 inline-block rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground">
        Voltar para a Pokédex
      </Link>
    </main>
  );
}
