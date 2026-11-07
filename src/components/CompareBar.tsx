import { Link } from "react-router";
import { getPokemon, spriteUrl } from "../lib/pokedex";
import { usePokedex } from "../hooks/usePokedex";

/** Barra flutuante com os Pokémon escolhidos para comparar. */
export function CompareBar() {
  const { compare, toggleCompare, clearCompare } = usePokedex();
  if (compare.length === 0) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md items-center gap-2 rounded-full border border-accent bg-card p-2 shadow-glow">
      {compare.map((id) => {
        const p = getPokemon(id);
        return p ? (
          <button
            key={id}
            onClick={() => toggleCompare(id)}
            title={`Remover ${p.name}`}
            className="flex min-w-0 items-center gap-1 rounded-full bg-muted py-1 pl-1 pr-3 text-xs font-bold"
          >
            <img src={spriteUrl(id)} alt="" className="h-7 w-7" />
            <span className="truncate">{p.name}</span> ×
          </button>
        ) : null;
      })}
      {compare.length < 2 && <span className="px-2 text-xs text-muted-foreground">Escolha mais 1</span>}
      <div className="ml-auto flex shrink-0 gap-1">
        <button onClick={clearCompare} className="rounded-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
          Limpar
        </button>
        {compare.length === 2 && (
          <Link to="/comparar" className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-accent-foreground">
            Comparar
          </Link>
        )}
      </div>
    </div>
  );
}
