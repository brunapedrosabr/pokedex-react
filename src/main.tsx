import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { PokedexProvider } from "./context/PokedexProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PokedexProvider>
        <App />
      </PokedexProvider>
    </BrowserRouter>
  </StrictMode>,
);
