import { useEffect, useState } from "react";

/** Igual ao useState, mas o valor fica salvo no navegador (localStorage) e volta ao recarregar a página. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Navegação anônima ou armazenamento cheio: segue funcionando só na memória.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
