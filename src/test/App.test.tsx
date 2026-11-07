import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import { PokedexProvider } from "../context/PokedexProvider";

function renderApp(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <PokedexProvider>
        <App />
      </PokedexProvider>
    </MemoryRouter>,
  );
}

describe("Pokédex (tela principal)", () => {
  it("mostra os 151 Pokémon", () => {
    renderApp();
    expect(screen.getByText("151 de 151 Pokémon")).toBeInTheDocument();
  });

  it("a pesquisa atualiza a lista enquanto o usuário digita", async () => {
    renderApp();
    await userEvent.type(screen.getByLabelText("Pesquisar Pokémon por nome ou ID"), "Bulba");
    expect(screen.getByText("1 de 151 Pokémon")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Bulbasaur" })).toBeInTheDocument();
  });

  it("avisa quando nenhum Pokémon é encontrado", async () => {
    renderApp();
    await userEvent.type(screen.getByLabelText("Pesquisar Pokémon por nome ou ID"), "Agumon");
    expect(screen.getByText("Nenhum Pokémon encontrado")).toBeInTheDocument();
  });

  it("filtra por tipo", async () => {
    renderApp();
    await userEvent.click(screen.getByRole("button", { name: "Dragon" }));
    expect(screen.getByText("3 de 151 Pokémon")).toBeInTheDocument();
  });

  it("abre os detalhes ao clicar em um Pokémon", async () => {
    // A PokéAPI não é chamada de verdade nos testes.
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("sem rede"));
    renderApp();
    await userEvent.click(screen.getByRole("heading", { name: "Pikachu" }));
    const dialog = screen.getByRole("dialog", { name: "Pikachu" });
    expect(dialog).toHaveTextContent("Velocidade");
    expect(await screen.findByText("Não foi possível carregar dados extras agora.")).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});

describe("outras páginas", () => {
  it("lista os treinadores", () => {
    renderApp("/treinadores");
    expect(screen.getByRole("heading", { name: "Ash" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Lance" })).toBeInTheDocument();
  });

  it("mostra 404 para endereços inexistentes", () => {
    renderApp("/nao-existe");
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
