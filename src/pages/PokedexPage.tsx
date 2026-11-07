import { useCallback, useMemo, useState } from "react";
import { Filters } from "../components/Filters";
import { PokemonDetails } from "../components/PokemonDetails";
import { PokemonList } from "../components/PokemonList";
import { SearchBar } from "../components/SearchBar";
import { Toolbar } from "../components/Toolbar";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePokedex } from "../hooks/usePokedex";
import { filterPokemons, pokemons, sortPokemons, type Pokemon, type SortDir, type SortKey } from "../lib/pokedex";

export function PokedexPage() {
  useDocumentTitle("Pokédex — Os 151 Pokémon de Kanto");
  const { favorites } = usePokedex();

  const [query, setQuery] = useState("");
  const [typeId, setTypeId] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selected, setSelected] = useState<Pokemon | null>(null);

  // Estado derivado: a lista exibida é recalculada a partir da pesquisa, do filtro e da ordenação.
  const visible = useMemo(() => {
    let list = filterPokemons(pokemons, query, typeId);
    if (onlyFavorites) list = list.filter((p) => favorites.includes(p.id));
    return sortPokemons(list, sortKey, sortDir);
  }, [query, typeId, onlyFavorites, favorites, sortKey, sortDir]);

  const closeDetails = useCallback(() => setSelected(null), []);
  const openRandom = () => setSelected(pokemons[Math.floor(Math.random() * pokemons.length)] ?? null);

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-3 py-6 pb-24 sm:px-4 sm:py-8">
      <section className="space-y-2">
        <h1 className="font-display text-lg leading-relaxed sm:text-2xl">Temos que pegar!</h1>
        <p className="text-muted-foreground" aria-live="polite">
          {visible.length} de {pokemons.length} Pokémon
        </p>
      </section>

      <SearchBar value={query} onChange={setQuery} />
      <Filters selected={typeId} onChange={setTypeId} />
      <Toolbar
        sortKey={sortKey}
        sortDir={sortDir}
        onSortKey={setSortKey}
        onToggleDir={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
        onlyFavorites={onlyFavorites}
        onToggleFavorites={() => setOnlyFavorites((v) => !v)}
        favoritesCount={favorites.length}
        onRandom={openRandom}
      />

      <PokemonList pokemons={visible} onSelect={setSelected} />
      <PokemonDetails pokemon={selected} onClose={closeDetails} />
    </main>
  );
}
