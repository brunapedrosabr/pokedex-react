import data from "../data/pokedex-data.json";

export type Stats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};
export type PokeType = { id: number; name: string };
export type Pokemon = { id: number; name: string; stats: Stats; types: PokeType[] };
export type Trainer = { id: number; name: string; badges: number; pokemonIds: number[] };

export const pokemons: Pokemon[] = data.pokemon;
export const trainers: Trainer[] = data.trainers;

/** Só os tipos que aparecem em pelo menos um Pokémon (ex.: "Dark" não tem nenhum na 1ª geração). */
export const types: PokeType[] = data.types.filter((t) =>
  pokemons.some((p) => p.types.some((pt) => pt.id === t.id)),
);

export const getPokemon = (id: number) => pokemons.find((p) => p.id === id);
export const typeClass = (name: string) => `type-${name.toLowerCase()}`;
export const mainTypeClass = (p: Pokemon) => typeClass(p.types[0]?.name ?? "Typeless");
export const spriteUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
export const formatId = (id: number) => `#${String(id).padStart(3, "0")}`;

export const STAT_LABELS: { key: keyof Stats; label: string; short: string }[] = [
  { key: "hp", label: "HP", short: "HP" },
  { key: "attack", label: "Ataque", short: "ATQ" },
  { key: "defense", label: "Defesa", short: "DEF" },
  { key: "specialAttack", label: "Atq. Especial", short: "A.ESP" },
  { key: "specialDefense", label: "Def. Especial", short: "D.ESP" },
  { key: "speed", label: "Velocidade", short: "VEL" },
];

/** Pesquisa por nome (parte do nome) ou ID (aceita "25", "025" ou "#025") e filtra por tipo. */
export function filterPokemons(list: Pokemon[], query: string, typeId: number | null) {
  const q = query.trim().toLowerCase().replace(/^#/, "");
  return list.filter((p) => {
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || String(p.id) === String(Number(q));
    const matchesType = typeId === null || p.types.some((t) => t.id === typeId);
    return matchesQuery && matchesType;
  });
}

export type SortKey = "id" | "name" | keyof Stats;
export type SortDir = "asc" | "desc";
export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "id", label: "Número (ID)" },
  { key: "name", label: "Nome" },
  ...STAT_LABELS,
];

export function sortPokemons(list: Pokemon[], key: SortKey, dir: SortDir) {
  const sign = dir === "asc" ? 1 : -1;
  return [...list].sort((a, b) => {
    if (key === "name") return a.name.localeCompare(b.name) * sign;
    const va = key === "id" ? a.id : a.stats[key];
    const vb = key === "id" ? b.id : b.stats[key];
    return (va - vb) * sign || a.id - b.id;
  });
}

export const totalStats = (p: Pokemon) => Object.values(p.stats).reduce((x, y) => x + y, 0);

export type Winner = "a" | "b" | "tie";

/** Para cada atributo (e o total), diz quem vence: "a", "b" ou "tie" (empate). */
export function compareStats(a: Pokemon, b: Pokemon) {
  const pick = (x: number, y: number): Winner => (x > y ? "a" : y > x ? "b" : "tie");
  const result = {} as Record<keyof Stats | "total", Winner>;
  STAT_LABELS.forEach(({ key }) => (result[key] = pick(a.stats[key], b.stats[key])));
  result.total = pick(totalStats(a), totalStats(b));
  return result;
}
