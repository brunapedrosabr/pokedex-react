import { useEffect, useState } from "react";
import { fetchPokemonExtra, type PokeApiExtra } from "../lib/pokeapi";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: PokeApiExtra };

/** Busca altura, peso, habilidades e descrição na PokéAPI. Se falhar, a Pokédex continua funcionando. */
export function usePokeApi(id: number) {
  const [result, setResult] = useState<{ id: number; state: State }>({ id, state: { status: "loading" } });

  useEffect(() => {
    const controller = new AbortController();
    fetchPokemonExtra(id, controller.signal)
      .then((data) => setResult({ id, state: { status: "success", data } }))
      .catch(() => {
        if (!controller.signal.aborted) setResult({ id, state: { status: "error" } });
      });
    // Cancela a requisição se o usuário fechar os detalhes ou trocar de Pokémon.
    return () => controller.abort();
  }, [id]);

  // Enquanto a resposta do Pokémon atual não chega, mostra "carregando".
  return result.id === id ? result.state : ({ status: "loading" } as State);
}
