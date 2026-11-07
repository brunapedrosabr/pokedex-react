type Props = { value: string; onChange: (value: string) => void };

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">⌕</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pesquisar Pokémon por nome ou ID..."
        aria-label="Pesquisar Pokémon por nome ou ID"
        className="w-full rounded-full border-2 border-border bg-card py-3 pl-11 pr-4 text-base outline-none transition placeholder:text-muted-foreground focus:border-ring"
      />
    </div>
  );
}
