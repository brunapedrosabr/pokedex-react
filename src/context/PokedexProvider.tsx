import { useEffect, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { PokedexContext, type PokedexStore, type Theme } from "./pokedex-context";

export function PokedexProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage<number[]>("pokedex-favorites", []);
  const [compare, setCompare] = useLocalStorage<number[]>("pokedex-compare", []);
  const [theme, setTheme] = useLocalStorage<Theme>("pokedex-theme", "dark");

  // O tema escuro é o padrão; a classe .light no <html> ativa o claro (ver index.css).
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const store: PokedexStore = {
    favorites,
    isFavorite: (id) => favorites.includes(id),
    toggleFavorite: (id) =>
      setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    compare,
    // Guarda no máximo 2 Pokémon: ao escolher um terceiro, o mais antigo sai.
    toggleCompare: (id) =>
      setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id].slice(-2))),
    clearCompare: () => setCompare([]),
    theme,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };

  return <PokedexContext.Provider value={store}>{children}</PokedexContext.Provider>;
}
