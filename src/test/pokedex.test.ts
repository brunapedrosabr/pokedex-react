import { describe, expect, it } from "vitest";
import { compareStats, filterPokemons, getPokemon, pokemons, sortPokemons, trainers, types } from "../lib/pokedex";

describe("dados", () => {
  it("carrega os 151 Pokémon e os 12 treinadores do pokedex-data.json", () => {
    expect(pokemons).toHaveLength(151);
    expect(trainers).toHaveLength(12);
  });
  it("só oferece filtros de tipos que têm Pokémon", () => {
    expect(types.some((t) => t.name === "Dark")).toBe(false);
    expect(types.some((t) => t.name === "Fire")).toBe(true);
  });
});

describe("pesquisa e filtro", () => {
  it("encontra Bulbasaur ao digitar 'Bulba'", () => {
    expect(filterPokemons(pokemons, "Bulba", null).map((p) => p.name)).toEqual(["Bulbasaur"]);
  });
  it("pesquisa pelo ID 25, 025 ou #25 retorna Pikachu", () => {
    for (const q of ["25", "025", "#25"]) {
      expect(filterPokemons(pokemons, q, null).map((p) => p.name)).toEqual(["Pikachu"]);
    }
  });
  it("filtro por tipo Fire só retorna Pokémon de fogo", () => {
    const result = filterPokemons(pokemons, "", 2);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.types.some((t) => t.name === "Fire"))).toBe(true);
  });
  it("retorna vazio quando nada corresponde", () => {
    expect(filterPokemons(pokemons, "xyzxyz", null)).toEqual([]);
  });
});

describe("ordenação e comparação", () => {
  it("ordena por HP decrescente com Chansey primeiro", () => {
    expect(sortPokemons(pokemons, "hp", "desc")[0]?.name).toBe("Chansey");
  });
  it("ordena por nome crescente com Abra primeiro", () => {
    expect(sortPokemons(pokemons, "name", "asc")[0]?.name).toBe("Abra");
  });
  it("Mewtwo vence Pikachu no total", () => {
    expect(compareStats(getPokemon(150)!, getPokemon(25)!).total).toBe("a");
  });
});
