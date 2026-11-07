import { useCallback, useState } from "react";
import { PokemonDetails } from "../components/PokemonDetails";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { formatId, getPokemon, mainTypeClass, spriteUrl, trainers, type Pokemon } from "../lib/pokedex";

export function TrainersPage() {
  useDocumentTitle("Treinadores — Pokédex");
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const closeDetails = useCallback(() => setSelected(null), []);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 pb-24">
      <h1 className="font-display text-xl leading-relaxed sm:text-2xl">Treinadores</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trainers.map((t) => (
          <article key={t.id} className="rounded-2xl border border-border bg-card p-5 transition hover:border-accent">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-xl font-bold">{t.name}</h2>
              <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                🏅 {t.badges} insígnia{t.badges === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {t.pokemonIds.map((id, i) => {
                const p = getPokemon(id);
                if (!p) return null;
                return (
                  <button
                    key={`${id}-${i}`}
                    onClick={() => setSelected(p)}
                    className={`${mainTypeClass(p)} bg-type-soft rounded-xl border border-border p-2 text-center transition hover:border-type`}
                  >
                    <img src={spriteUrl(id)} alt={p.name} loading="lazy" className="mx-auto h-14 w-14 object-contain" />
                    <p className="truncate text-xs font-bold">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{formatId(id)}</p>
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <PokemonDetails pokemon={selected} onClose={closeDetails} />
    </main>
  );
}
