import { typeClass, types } from "../lib/pokedex";

type Props = { selected: number | null; onChange: (typeId: number | null) => void };

/** Botões de filtro por tipo, usando os tipos presentes no pokedex-data.json. */
export function Filters({ selected, onChange }: Props) {
  const base = "shrink-0 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide transition";

  return (
    <div
      role="group"
      aria-label="Filtrar por tipo"
      className="scrollbar-none -mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      <button
        onClick={() => onChange(null)}
        aria-pressed={selected === null}
        className={`${base} ${
          selected === null
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        Todos
      </button>
      {types.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(selected === t.id ? null : t.id)}
          aria-pressed={selected === t.id}
          className={`${typeClass(t.name)} ${base} border-type ${
            selected === t.id ? "bg-type text-background" : "text-type hover:bg-type hover:text-background"
          }`}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}
