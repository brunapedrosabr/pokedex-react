import { useEffect } from "react";
import { STAT_LABELS, formatId, mainTypeClass, spriteUrl, totalStats, trainers, type Pokemon } from "../lib/pokedex";
import { usePokedex } from "../hooks/usePokedex";
import { usePokeApi } from "../hooks/usePokeApi";
import { TypeBadge } from "./TypeBadge";

type Props = { pokemon: Pokemon | null; onClose: () => void };

/** Janela (modal) com os detalhes do Pokémon selecionado. */
export function PokemonDetails({ pokemon, onClose }: Props) {
  if (!pokemon) return null;
  // A key faz o modal "recomeçar" quando outro Pokémon é aberto.
  return <DetailsDialog key={pokemon.id} pokemon={pokemon} onClose={onClose} />;
}

function DetailsDialog({ pokemon, onClose }: { pokemon: Pokemon; onClose: () => void }) {
  const { isFavorite, toggleFavorite, compare, toggleCompare } = usePokedex();
  const extra = usePokeApi(pokemon.id);
  const owners = trainers.filter((t) => t.pokemonIds.includes(pokemon.id));
  const fav = isFavorite(pokemon.id);
  const comparing = compare.includes(pokemon.id);
  const chip = "rounded-full px-4 py-2 text-xs font-bold transition";

  // Fecha com a tecla Esc e trava a rolagem da página enquanto o modal está aberto.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={pokemon.name}
        onClick={(e) => e.stopPropagation()}
        className={`${mainTypeClass(pokemon)} relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border-2 border-type bg-card shadow-glow sm:rounded-3xl`}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 h-9 w-9 rounded-full bg-background/60 text-lg font-bold hover:bg-background"
        >
          ×
        </button>

        <div className="grid gap-4 bg-type-soft p-5 sm:grid-cols-2 sm:gap-6 sm:p-6">
          <div className="flex flex-col items-center justify-center">
            <img
              src={spriteUrl(pokemon.id)}
              alt={pokemon.name}
              className="animate-float h-40 w-40 object-contain drop-shadow-2xl sm:h-52 sm:w-52"
            />
          </div>
          <div>
            <span className="font-display text-xs text-muted-foreground">{formatId(pokemon.id)}</span>
            <h2 className="mt-1 text-3xl font-bold">{pokemon.name}</h2>
            <div className="mt-2 flex gap-1">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.id} name={t.name} />
              ))}
            </div>
            <div className="mt-5 space-y-2.5">
              {STAT_LABELS.map(({ key, label }) => {
                const value = pokemon.stats[key];
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-bold">{value}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="animate-fill bg-type h-full rounded-full"
                        style={{ width: `${Math.min(100, (value / 200) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <p className="pt-2 text-sm text-muted-foreground">
                Total: <b className="text-foreground">{totalStats(pokemon)}</b>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4 sm:px-6">
          <button
            onClick={() => toggleFavorite(pokemon.id)}
            className={`${chip} ${fav ? "bg-accent text-accent-foreground" : "bg-muted hover:bg-secondary"}`}
          >
            {fav ? "★ Favorito" : "☆ Favoritar"}
          </button>
          <button
            onClick={() => toggleCompare(pokemon.id)}
            className={`${chip} ${comparing ? "bg-accent text-accent-foreground" : "bg-muted hover:bg-secondary"}`}
          >
            ⚔ {comparing ? "Na comparação" : "Comparar"}
          </button>
        </div>

        <section className="border-t border-border px-5 py-4 text-sm sm:px-6">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Mais informações (PokéAPI)
          </h3>
          {extra.status === "loading" && <p className="text-muted-foreground">Carregando…</p>}
          {extra.status === "error" && (
            <p className="text-muted-foreground">Não foi possível carregar dados extras agora.</p>
          )}
          {extra.status === "success" && (
            <div className="space-y-3">
              {extra.data.description && <p className="italic">“{extra.data.description}”</p>}
              <dl className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted p-2">
                  <dt className="text-[10px] text-muted-foreground">Altura</dt>
                  <dd className="font-bold">{extra.data.height} m</dd>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <dt className="text-[10px] text-muted-foreground">Peso</dt>
                  <dd className="font-bold">{extra.data.weight} kg</dd>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <dt className="text-[10px] text-muted-foreground">Habilidades</dt>
                  <dd className="text-xs font-bold capitalize">{extra.data.abilities.join(", ")}</dd>
                </div>
              </dl>
            </div>
          )}
        </section>

        {owners.length > 0 && (
          <div className="border-t border-border px-5 py-4 text-sm sm:px-6">
            <span className="text-muted-foreground">Treinadores: </span>
            {owners.map((t) => t.name).join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
