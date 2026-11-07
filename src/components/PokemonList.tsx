import type { Pokemon } from "../lib/pokedex";
import { PokemonCard } from "./PokemonCard";

type Props = { pokemons: Pokemon[]; onSelect: (pokemon: Pokemon) => void };

export function PokemonList({ pokemons, onSelect }: Props) {
  if (pokemons.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center">
        <p className="font-display text-sm text-primary">Nenhum Pokémon encontrado</p>
        <p className="mt-3 text-muted-foreground">Tente outro nome, ID ou tipo.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {pokemons.map((p) => (
        <PokemonCard key={p.id} pokemon={p} onSelect={onSelect} />
      ))}
    </div>
  );
}
