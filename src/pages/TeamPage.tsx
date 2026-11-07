import { useMemo, useState } from "react";
import { TypeBadge } from "../components/TypeBadge";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { filterPokemons, formatId, getPokemon, mainTypeClass, pokemons, spriteUrl, trainers } from "../lib/pokedex";
import { recommendTeam, type TeamResult } from "../lib/team";

const MAX_AVAILABLE = 60; // limite de Pokémon disponíveis por pedido
const GRID_LIMIT = 40; // quantos aparecem na grade de escolha de uma vez

export function TeamPage() {
  useDocumentTitle("Montar equipe com IA — Pokédex");

  const [opponent, setOpponent] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [teamSize, setTeamSize] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TeamResult | null>(null);
  const [requestedSize, setRequestedSize] = useState(0);

  const matches = useMemo(() => filterPokemons(pokemons, search, null), [search]);
  const options = matches.slice(0, GRID_LIMIT);

  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= MAX_AVAILABLE ? s : [...s, id]));

  const loadTrainer = (trainerId: string) => {
    const t = trainers.find((x) => String(x.id) === trainerId);
    if (t) setSelected([...new Set(t.pokemonIds)]);
  };

  const canSubmit = opponent.trim().length >= 3 && selected.length > 0 && !loading;

  async function handleSubmit() {
    setLoading(true);
    setResult(null);
    setRequestedSize(Math.min(teamSize, selected.length));
    setResult(await recommendTeam({ opponent, pokemonIds: selected, teamSize }));
    setLoading(false);
  }

  const field =
    "w-full rounded-2xl border-2 border-border bg-card px-4 py-3 outline-none transition placeholder:text-muted-foreground focus:border-ring";

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-3 py-6 pb-24 sm:px-4 sm:py-8">
      <section className="space-y-2">
        <h1 className="font-display text-lg leading-relaxed sm:text-2xl">Montar equipe com IA</h1>
        <p className="text-muted-foreground">
          Descreva o adversário, escolha os Pokémon que você tem e receba uma equipe recomendada.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-bold">1. Quem é o adversário?</span>
            <textarea
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              rows={5}
              maxLength={1500}
              placeholder="Ex.: Misty, líder de ginásio com Staryu e Starmie, muito rápidos e com ataques de água."
              className={field}
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="font-bold">Tamanho da equipe</span>
            <select
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="rounded-full border border-border bg-card px-4 py-2"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} Pokémon</option>
              ))}
            </select>
          </label>
          <button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="w-full rounded-full bg-gradient-dex py-3 font-bold text-dex-foreground shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {loading ? "Analisando tipos e atributos…" : "✨ Recomendar equipe"}
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold">2. Pokémon disponíveis ({selected.length})</span>
            <div className="flex gap-2">
              {/* value="" fixo: o select volta para "Usar time de…" e permite escolher o mesmo treinador de novo */}
              <select
                value=""
                onChange={(e) => loadTrainer(e.target.value)}
                aria-label="Usar o time de um treinador"
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm"
              >
                <option value="" disabled>Usar time de…</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {selected.length > 0 && (
                <button
                  onClick={() => setSelected([])}
                  className="rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selected.map((id) => {
                const p = getPokemon(id);
                return p ? (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    title={`Remover ${p.name}`}
                    className="flex items-center gap-1 rounded-full bg-accent py-0.5 pl-1 pr-3 text-xs font-bold text-accent-foreground"
                  >
                    <img src={spriteUrl(id)} alt="" className="h-6 w-6" /> {p.name} ×
                  </button>
                ) : null;
              })}
            </div>
          )}

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar Pokémon para adicionar…"
            aria-label="Buscar Pokémon para adicionar"
            className={field}
          />
          <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
            {options.map((p) => {
              const on = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  aria-pressed={on}
                  className={`${mainTypeClass(p)} bg-type-soft rounded-xl border p-1.5 text-center text-xs transition ${
                    on ? "border-accent" : "border-border hover:border-type"
                  }`}
                >
                  <img src={spriteUrl(p.id)} alt={p.name} loading="lazy" className="mx-auto h-12 w-12 object-contain" />
                  <span className="block truncate font-bold">{on ? "✓ " : ""}{p.name}</span>
                </button>
              );
            })}
            {options.length === 0 && (
              <p className="col-span-full py-6 text-center text-sm text-muted-foreground">Nenhum Pokémon encontrado.</p>
            )}
          </div>
          {matches.length > GRID_LIMIT && (
            <p className="text-xs text-muted-foreground">
              Mostrando {GRID_LIMIT} de {matches.length}. Use a busca para encontrar os outros.
            </p>
          )}
        </div>
      </div>

      {result && !result.ok && (
        <p role="alert" className="rounded-2xl border border-destructive p-4 text-sm">
          {result.error}
        </p>
      )}

      {result?.ok && (
        <section className="space-y-4 rounded-3xl border-2 border-accent bg-card p-5 sm:p-6">
          <h2 className="font-display text-sm leading-relaxed">Equipe recomendada</h2>
          {result.data.team.length < requestedSize && (
            <p className="text-sm text-muted-foreground">
              A IA sugeriu só {result.data.team.length} de {requestedSize} Pokémon válidos. Tente pedir de novo.
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.team.map((m) => {
              const p = getPokemon(m.id);
              if (!p) return null;
              return (
                <article key={m.id} className={`${mainTypeClass(p)} bg-type-soft rounded-2xl border border-type p-4`}>
                  <div className="flex items-center gap-3">
                    <img src={spriteUrl(p.id)} alt={p.name} className="h-16 w-16 object-contain" />
                    <div>
                      <span className="font-display text-[10px] text-muted-foreground">{formatId(p.id)}</span>
                      <h3 className="font-bold">{p.name}</h3>
                      <div className="mt-1 flex gap-1">
                        {p.types.map((t) => (
                          <TypeBadge key={t.id} name={t.name} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-type">{m.role}</p>
                  <p className="mt-1 text-sm">{m.reason}</p>
                </article>
              );
            })}
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Estratégia</h3>
            <p className="mt-1">{result.data.strategy}</p>
          </div>
          {result.data.threats.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Cuidado com</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                {result.data.threats.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-muted-foreground">Recomendação gerada por IA (Google Gemini) — confira antes da batalha.</p>
        </section>
      )}
    </main>
  );
}
