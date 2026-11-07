import { STAT_LABELS, formatId, mainTypeClass, spriteUrl, type Pokemon } from "../lib/pokedex";
import { usePokedex } from "../hooks/usePokedex";
import { TypeBadge } from "./TypeBadge";

type Props = { pokemon: Pokemon; onSelect: (pokemon: Pokemon) => void };

export function PokemonCard({ pokemon, onSelect }: Props) {
  const { isFavorite, toggleFavorite, compare, toggleCompare } = usePokedex();
  const fav = isFavorite(pokemon.id);
  const comparing = compare.includes(pokemon.id);

  return (
    <article
      className={`${mainTypeClass(pokemon)} group relative overflow-hidden rounded-2xl border bg-card bg-type-soft transition duration-300 hover:-translate-y-1 hover:border-type hover:shadow-glow ${
        comparing ? "border-accent" : "border-border"
      }`}
    >
      <div className="absolute right-2 top-2 z-10 flex gap-1">
        <button
          onClick={() => toggleCompare(pokemon.id)}
          aria-label={comparing ? `Remover ${pokemon.name} da comparação` : `Comparar ${pokemon.name}`}
          title="Comparar"
          className={`h-8 w-8 rounded-full text-sm transition ${
            comparing ? "bg-accent text-accent-foreground" : "bg-background/60 hover:bg-background"
          }`}
        >
          ⚔
        </button>
        <button
          onClick={() => toggleFavorite(pokemon.id)}
          aria-label={fav ? `Remover ${pokemon.name} dos favoritos` : `Favoritar ${pokemon.name}`}
          title="Favoritar"
          className={`h-8 w-8 rounded-full text-sm transition ${
            fav ? "bg-accent text-accent-foreground" : "bg-background/60 text-muted-foreground hover:bg-background"
          }`}
        >
          {fav ? "★" : "☆"}
        </button>
      </div>

      <button
        onClick={() => onSelect(pokemon)}
        className="block w-full p-3 text-left focus-visible:outline-2 focus-visible:outline-ring sm:p-4"
      >
        <span className="font-display text-[10px] text-muted-foreground">{formatId(pokemon.id)}</span>
        <img
          src={spriteUrl(pokemon.id)}
          alt={pokemon.name}
          loading="lazy"
          className="mx-auto my-2 h-24 w-24 object-contain drop-shadow-xl transition duration-300 group-hover:scale-110 sm:h-28 sm:w-28"
        />
        <h3 className="text-base font-bold sm:text-lg">{pokemon.name}</h3>
        <div className="mt-2 flex flex-wrap gap-1">
          {pokemon.types.map((t) => (
            <TypeBadge key={t.id} name={t.name} />
          ))}
        </div>
        <dl className="mt-3 grid grid-cols-3 gap-1 text-center">
          {STAT_LABELS.map(({ key, short }) => (
            <div key={key} className="rounded-md bg-background/50 py-1">
              <dt className="text-[9px] text-muted-foreground">{short}</dt>
              <dd className="text-sm font-bold">{pokemon.stats[key]}</dd>
            </div>
          ))}
        </dl>
      </button>
    </article>
  );
}
