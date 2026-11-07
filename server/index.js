import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { GoogleGenAI } from "@google/genai";

// Lê o arquivo .env (se existir) para carregar GEMINI_API_KEY.
try {
  process.loadEnvFile();
} catch {
  // Sem .env: a IA fica desativada e a página mostra um aviso.
}

const PORT = Number(process.env.API_PORT ?? 3001);
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const API_KEY = process.env.GEMINI_API_KEY;

const data = JSON.parse(
  readFileSync(
    new URL("../src/data/pokedex-data.json", import.meta.url),
    "utf8",
  ),
);
const pokemonById = new Map(data.pokemon.map((p) => [p.id, p]));
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

/** Formato que o Gemini deve devolver (JSON Schema). */
const teamSchema = {
  type: "object",
  properties: {
    strategy: {
      type: "string",
      description: "Estratégia geral, no máximo 4 frases.",
    },
    team: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "Número (ID) do Pokémon na lista disponível.",
          },
          role: {
            type: "string",
            description: "Papel na equipe, ex.: atacante, defensor.",
          },
          reason: {
            type: "string",
            description: "Motivo da escolha, no máximo 2 frases.",
          },
        },
        required: ["id", "role", "reason"],
      },
    },
    threats: {
      type: "array",
      items: { type: "string" },
      description: "Até 3 ameaças do adversário.",
    },
  },
  required: ["strategy", "team", "threats"],
};

const instructions =
  "Você é um especialista em batalhas Pokémon da primeira geração. Responda sempre em português do Brasil. " +
  "Use SOMENTE os Pokémon da lista disponível (no campo id use o número; nos textos cite-os pelo nome, nunca por #número). " +
  "Baseie-se nas vantagens de tipo e nos atributos fornecidos. " +
  "Seja direto: cada motivo com no máximo 2 frases; estratégia com no máximo 4 frases; até 3 ameaças do adversário.";

/** Valida o corpo do pedido. Devolve uma mensagem de erro ou null se estiver tudo certo. */
function validate(body) {
  if (!body || typeof body !== "object") return "Pedido inválido.";
  const { opponent, pokemonIds, teamSize } = body;
  if (
    typeof opponent !== "string" ||
    opponent.trim().length < 3 ||
    opponent.length > 1500
  )
    return "Descreva o adversário com 3 a 1500 caracteres.";
  if (
    !Array.isArray(pokemonIds) ||
    pokemonIds.length < 1 ||
    pokemonIds.length > 60
  )
    return "Escolha de 1 a 60 Pokémon disponíveis.";
  if (!pokemonIds.every((id) => Number.isInteger(id) && pokemonById.has(id)))
    return "Há Pokémon inválidos na lista.";
  if (!Number.isInteger(teamSize) || teamSize < 1 || teamSize > 6)
    return "O tamanho da equipe deve ser de 1 a 6.";
  return null;
}

async function recommendTeam({ opponent, pokemonIds, teamSize }) {
  if (!ai) {
    return {
      ok: false,
      error:
        "A IA não está configurada. Crie o arquivo .env com GEMINI_API_KEY (veja o README) e reinicie o projeto.",
    };
  }

  const available = [...new Set(pokemonIds)].map((id) => pokemonById.get(id));
  const size = Math.min(teamSize, available.length);
  const roster = available
    .map((p) => {
      const s = p.stats;
      const total =
        s.hp +
        s.attack +
        s.defense +
        s.specialAttack +
        s.specialDefense +
        s.speed;
      const types = p.types.map((t) => t.name).join("/") || "Typeless";
      return `#${p.id} ${p.name} | tipos: ${types} | HP ${s.hp}, Atq ${s.attack}, Def ${s.defense}, AtqEsp ${s.specialAttack}, DefEsp ${s.specialDefense}, Vel ${s.speed}, Total ${total}`;
    })
    .join("\n");

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `Adversário descrito pelo treinador:\n${opponent}\n\nPokémon disponíveis:\n${roster}\n\nMonte a melhor equipe com exatamente ${size} Pokémon diferentes da lista.`,
      config: {
        systemInstruction: instructions,
        responseMimeType: "application/json",
        responseJsonSchema: teamSchema,
      },
    });

    const output = JSON.parse(response.text ?? "");
    // Garante que a IA só usou Pokémon da lista, sem repetir, e no tamanho pedido.
    const allowed = new Set(available.map((p) => p.id));
    const seen = new Set();
    const team = (output.team ?? [])
      .filter((m) => allowed.has(m.id) && !seen.has(m.id) && seen.add(m.id))
      .slice(0, size);

    return {
      ok: true,
      data: {
        strategy: String(output.strategy ?? ""),
        team,
        threats: (output.threats ?? []).slice(0, 3),
      },
    };
  } catch (error) {
    console.error("[IA] Falha ao gerar a equipe:", error?.message ?? error);
    const status = error?.status ?? error?.code;
    if (status === 429)
      return {
        ok: false,
        error:
          "Muitos pedidos agora (limite do Gemini). Aguarde um pouco e tente de novo.",
      };
    if (status === 401 || status === 403)
      return {
        ok: false,
        error:
          "A chave do Gemini foi recusada. Confira GEMINI_API_KEY no arquivo .env.",
      };
    if (status === 400)
      return {
        ok: false,
        error:
          "O Gemini recusou o pedido (chave inválida ou modelo sem suporte). Confira GEMINI_API_KEY e GEMINI_MODEL no .env.",
      };
    if (status === 404)
      return {
        ok: false,
        error: `O modelo "${MODEL}" não foi encontrado. Ajuste GEMINI_MODEL no .env.`,
      };
    if (error instanceof SyntaxError)
      return {
        ok: false,
        error: "A IA não conseguiu montar a equipe. Tente de novo.",
      };
    return { ok: false, error: "Não foi possível falar com a IA agora." };
  }
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/equipe") {
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 20_000)
        return sendJson(res, 413, {
          ok: false,
          error: "Pedido grande demais.",
        });
    }
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return sendJson(res, 400, { ok: false, error: "Pedido inválido." });
    }
    const problem = validate(body);
    if (problem) return sendJson(res, 400, { ok: false, error: problem });
    return sendJson(res, 200, await recommendTeam(body));
  }

  if (req.method === "GET" && req.url === "/api/status") {
    return sendJson(res, 200, {
      ok: true,
      iaConfigurada: Boolean(ai),
      modelo: MODEL,
    });
  }

  sendJson(res, 404, { ok: false, error: "Rota não encontrada." });
});

server.listen(PORT, () => {
  console.log(
    `[IA] Servidor em http://localhost:${PORT} — ${ai ? `Gemini ativo (${MODEL})` : "sem GEMINI_API_KEY: IA desativada"}`,
  );
});
