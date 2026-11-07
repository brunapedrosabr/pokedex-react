/** Cliente da página "Equipe IA": chama o servidor local (server/index.js) em /api/equipe. */

export type TeamMember = { id: number; role: string; reason: string };
export type TeamRecommendation = { strategy: string; team: TeamMember[]; threats: string[] };
export type TeamResult = { ok: true; data: TeamRecommendation } | { ok: false; error: string };

export type TeamRequest = { opponent: string; pokemonIds: number[]; teamSize: number };

export async function recommendTeam(body: TeamRequest): Promise<TeamResult> {
  try {
    const res = await fetch("/api/equipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await res.json()) as TeamResult;
  } catch {
    return {
      ok: false,
      error: "O servidor da IA não está rodando. Inicie o projeto com `npm run dev`.",
    };
  }
}
