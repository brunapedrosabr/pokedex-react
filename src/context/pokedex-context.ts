import { createContext } from "react";

export type Theme = "dark" | "light";

/** Estado compartilhado entre as páginas: favoritos, comparação e tema. */
export type PokedexStore = {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
  compare: number[];
  toggleCompare: (id: number) => void;
  clearCompare: () => void;
  theme: Theme;
  toggleTheme: () => void;
};

export const PokedexContext = createContext<PokedexStore | null>(null);
