import { SORT_OPTIONS, type SortDir, type SortKey } from "../lib/pokedex";

type Props = {
  sortKey: SortKey;
  sortDir: SortDir;
  onSortKey: (key: SortKey) => void;
  onToggleDir: () => void;
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
  onRandom: () => void;
};

export function Toolbar(props: Props) {
  const btn = "rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:border-ring";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-4 pr-1 text-sm">
        <span className="text-muted-foreground">Ordenar</span>
        <select
          value={props.sortKey}
          onChange={(e) => props.onSortKey(e.target.value as SortKey)}
          className="rounded-full bg-muted px-3 py-1 text-sm outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
      </label>
      <button onClick={props.onToggleDir} className={btn} aria-label="Inverter ordem">
        {props.sortDir === "asc" ? "↑ Crescente" : "↓ Decrescente"}
      </button>
      <button
        onClick={props.onToggleFavorites}
        aria-pressed={props.onlyFavorites}
        className={`${btn} ${props.onlyFavorites ? "border-accent bg-accent text-accent-foreground" : ""}`}
      >
        ★ Favoritos ({props.favoritesCount})
      </button>
      <button onClick={props.onRandom} className={`${btn} sm:ml-auto`}>🎲 Aleatório</button>
    </div>
  );
}
