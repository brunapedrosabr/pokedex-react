import { Link } from "react-router";
import { TypeBadge } from "../components/TypeBadge";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePokedex } from "../hooks/usePokedex";
import {
  STAT_LABELS,
  compareStats,
  formatId,
  getPokemon,
  mainTypeClass,
  spriteUrl,
  totalStats,
  type Pokemon,
} from "../lib/pokedex";

function Side({ pokemon }: { pokemon: Pokemon }) {
  return (
    <div
      className={`${mainTypeClass(pokemon)} bg-type-soft flex flex-col items-center rounded-2xl border border-type bg-card p-4 text-center`}
    >
      <img src={spriteUrl(pokemon.id)} alt={pokemon.name} className="animate-float h-28 w-28 object-contain sm:h-40 sm:w-40" />
      <span className="font-display text-[10px] text-muted-foreground">{formatId(pokemon.id)}</span>
      <h2 className="text-xl font-bold sm:text-2xl">{pokemon.name}</h2>
      <div className="mt-2 flex flex-wrap justify-center gap-1">
        {pokemon.types.map((t) => (
          <TypeBadge key={t.id} name={t.name} />
        ))}
      </div>
    </div>
  );
}

export function ComparePage() {
  useDocumentTitle("Comparar Pokémon — Pokédex");
  const { compare, clearCompare } = usePokedex();
  const [a, b] = compare.map(getPokemon);

  if (!a || !b) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-lg leading-relaxed">Comparar</h1>
        <p className="mt-4 text-muted-foreground">
          Selecione 2 Pokémon com o botão ⚔ na Pokédex. ({compare.length}/2 escolhidos)
        </p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground">
          Ir para a Pokédex
        </Link>
      </main>
    );
  }

  const winner = compareStats(a, b);
  const rows = [
    ...STAT_LABELS.map((s) => ({ key: s.key, label: s.label, va: a.stats[s.key], vb: b.stats[s.key], max: 200 })),
    { key: "total" as const, label: "Total", va: totalStats(a), vb: totalStats(b), max: 700 },
  ];
  const headline = winner.total === "tie" ? "Empate!" : `${winner.total === "a" ? a.name : b.name} vence no total`;
  const width = (value: number, max: number) => `${Math.min(100, (value / max) * 100)}%`;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-3 py-6 pb-24 sm:px-4 sm:py-8">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-display text-lg leading-relaxed sm:text-2xl">Comparar</h1>
        <button onClick={clearCompare} className="rounded-full border border-border px-4 py-2 text-sm hover:border-ring">
          Limpar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        <Side pokemon={a} />
        <Side pokemon={b} />
      </div>

      <p className="rounded-full bg-accent py-2 text-center font-bold text-accent-foreground">🏆 {headline}</p>

      <div className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-6">
        {rows.map((r) => {
          const w = winner[r.key];
          return (
            <div key={r.key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
              <div className={`${mainTypeClass(a)} flex items-center justify-end gap-2`}>
                <span className={`text-sm ${w === "a" ? "font-bold text-primary" : "text-muted-foreground"}`}>{r.va}</span>
                <div className="h-2.5 w-full max-w-48 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`animate-fill bg-type ml-auto h-full rounded-full ${w === "b" ? "opacity-40" : ""}`}
                    style={{ width: width(r.va, r.max) }}
                  />
                </div>
              </div>
              <span className="w-20 text-center text-[11px] font-bold uppercase text-muted-foreground sm:w-28 sm:text-xs">
                {r.label}
              </span>
              <div className={`${mainTypeClass(b)} flex items-center gap-2`}>
                <div className="h-2.5 w-full max-w-48 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`animate-fill bg-type h-full rounded-full ${w === "a" ? "opacity-40" : ""}`}
                    style={{ width: width(r.vb, r.max) }}
                  />
                </div>
                <span className={`text-sm ${w === "b" ? "font-bold text-primary" : "text-muted-foreground"}`}>{r.vb}</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
