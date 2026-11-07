import { Route, Routes } from "react-router";
import { CompareBar } from "./components/CompareBar";
import { Header } from "./components/Header";
import { ComparePage } from "./pages/ComparePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PokedexPage } from "./pages/PokedexPage";
import { TeamPage } from "./pages/TeamPage";
import { TrainersPage } from "./pages/TrainersPage";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<PokedexPage />} />
        <Route path="/treinadores" element={<TrainersPage />} />
        <Route path="/comparar" element={<ComparePage />} />
        <Route path="/equipe" element={<TeamPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <CompareBar />
    </>
  );
}
