import { Link, NavLink } from "react-router";
import { usePokedex } from "../hooks/usePokedex";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `shrink-0 rounded-full px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
    isActive
      ? "bg-background/25 text-dex-foreground"
      : "text-dex-foreground/80 hover:bg-background/20 hover:text-dex-foreground"
  }`;

export function Header() {
  const { theme, toggleTheme, compare } = usePokedex();

  return (
    <header className="sticky top-0 z-30 bg-gradient-dex shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-4 sm:py-4">
        <Link to="/" className="flex items-center gap-2 sm:gap-3" aria-label="Pokédex — início">
          <span className="relative h-8 w-8 shrink-0 rounded-full border-4 border-dex-foreground bg-screen sm:h-9 sm:w-9">
            <span className="absolute inset-1.5 rounded-full bg-dex-foreground/30" />
          </span>
          <span className="hidden font-display text-sm text-dex-foreground sm:inline sm:text-base">Pokédex</span>
        </Link>

        <nav className="scrollbar-none flex items-center gap-1 overflow-x-auto">
          <NavLink to="/" end className={linkClass}>Pokémon</NavLink>
          <NavLink to="/treinadores" className={linkClass}>Treinadores</NavLink>
          <NavLink to="/equipe" className={linkClass}>Equipe IA</NavLink>
          <NavLink to="/comparar" className={linkClass}>
            Comparar{compare.length > 0 && ` (${compare.length})`}
          </NavLink>
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
            className="ml-1 h-9 w-9 shrink-0 rounded-full bg-background/20 text-base transition hover:bg-background/40"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}
