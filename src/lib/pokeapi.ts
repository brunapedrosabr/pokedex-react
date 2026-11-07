/** Informações extras buscadas na PokéAPI (https://pokeapi.co). */
export type PokeApiExtra = {
  height: number; // metros
  weight: number; // quilos
  abilities: string[];
  description: string | null;
};

type FlavorEntry = { flavor_text: string; language: { name: string } };

// Guarda o que já foi buscado para não repetir a mesma requisição.
const cache = new Map<number, PokeApiExtra>();

export async function fetchPokemonExtra(id: number, signal?: AbortSignal): Promise<PokeApiExtra> {
  const cached = cache.get(id);
  if (cached) return cached;

  const [pRes, sRes] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, { signal }),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`, { signal }),
  ]);
  if (!pRes.ok) throw new Error("PokéAPI indisponível");

  const p = await pRes.json();
  const s = sRes.ok ? await sRes.json() : null;
  const entries: FlavorEntry[] = s?.flavor_text_entries ?? [];
  const entry =
    entries.find((e) => e.language.name === "pt-BR") ?? entries.find((e) => e.language.name === "en");

  const extra: PokeApiExtra = {
    height: p.height / 10, // a API devolve em decímetros
    weight: p.weight / 10, // a API devolve em hectogramas
    abilities: p.abilities.map((a: { ability: { name: string } }) => a.ability.name.replaceAll("-", " ")),
    description: entry ? entry.flavor_text.replace(/[\f\n\r]/g, " ") : null,
  };
  cache.set(id, extra);
  return extra;
}
