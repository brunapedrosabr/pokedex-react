import { useContext } from "react";
import { PokedexContext } from "../context/pokedex-context";

export function usePokedex() {
  const ctx = useContext(PokedexContext);
  if (!ctx) throw new Error("usePokedex precisa estar dentro de <PokedexProvider>");
  return ctx;
}
