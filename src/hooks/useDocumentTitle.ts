import { useEffect } from "react";

/** Troca o título da aba do navegador de acordo com a página. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
