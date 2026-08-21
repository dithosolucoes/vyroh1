import { NextRequest, NextResponse } from "next/server";
import { generateAiCompletion, AiProvider } from "@/src/lib/ai";
import { getSession } from "@/src/lib/auth";

function extractJson(text: string): any {
  const cleaned = text.replace(/```json\s*|```\s*/g, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    const body = await req.json();
    const { goalDescription, vaultContext, targetTimeline, provider, model } = body;

    if (!goalDescription) {
      return NextResponse.json({ error: "Descrição do objetivo é obrigatória" }, { status: 400 });
    }

    const promptText = `
Você é o Cérebro Inteligente do Vyroh, o agregador e hub central para profissionais-empresa ("solo developers").
O usuário quer executar um objetivo e precisa de um Roadmap estruturado em JSON que cruze as informações e recomende ativos do cofre, identifique lacunas (gaps) e informe se é necessário contratar um profissional.

Contexto do Cofre do Usuário (se houver):
${JSON.stringify(vaultContext || {})}

Objetivo do Usuário:
"${goalDescription}"
Prazo desejado: ${targetTimeline || "Automático"}

Retorne APENAS um JSON válido, sem markdown, sem texto fora do JSON, no seguinte formato:
{
  "title": "Título conciso do roadmap",
  "complexity": "Baixa | Média | Alta",
  "targetWeeks": "Ex: 2-3 semanas",
  "summary": "Resumo executivo da estratégia em 2 parágrafos objetivos",
  "matchedAssets": [
    { "type": "boilerplate | prompt | sop | client | mcp", "name": "Nome do ativo", "reason": "Por que este ativo acelera o projeto" }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Nome da fase/etapa",
      "duration": "Ex: 4 dias",
      "deliverables": ["Entregável 1", "Entregável 2"],
      "toolsNeeded": ["Ferramenta 1", "Ferramenta 2"],
      "vaultAssetMatched": "Nome do ativo do cofre aproveitado aqui (ou null)"
    }
  ],
  "gaps": ["Identificação de peças ou conhecimento faltantes no cofre"],
  "professionalNeeded": {
    "needed": true,
    "role": "Nome do cargo/especialista sugerido se houver lacuna técnica/design",
    "skills": ["Skill 1", "Skill 2"],
    "estimatedHours": "Ex: 10-15h",
    "reason": "Por que este profissional economiza tempo crítico"
  }
}`;

    const selectedProvider = (provider || user?.aiProviderPref || "gemini") as AiProvider;

    try {
      const result = await generateAiCompletion({
        prompt: promptText,
        systemInstruction:
          "Você é um arquiteto sênior e estrategista de produtos do Vyroh. Seja pragmático, objetivo, técnico e focado em alto ROI e reaproveitamento de código e processos. Responda apenas com JSON válido.",
        provider: selectedProvider,
        model,
      });

      const roadmap = extractJson(result.text);
      return NextResponse.json({ success: true, roadmap });
    } catch (aiError: any) {
      // Modo híbrido: sem chave de IA configurada, devolve um roadmap de exemplo
      // estruturado do mesmo jeito que o real, deixando claro que é simulação.
      return NextResponse.json({
        success: true,
        simulated: true,
        roadmap: {
          title: `[Simulação] Roadmap para: ${goalDescription.slice(0, 60)}`,
          complexity: "Média",
          targetWeeks: targetTimeline || "3-4 semanas",
          summary: `Esta é uma resposta simulada porque nenhuma chave de IA está configurada para "${selectedProvider}". Configure GEMINI_API_KEY, ANTHROPIC_API_KEY ou OPENAI_API_KEY (ou um Ollama local) para receber um roadmap real, gerado a partir do seu objetivo e do conteúdo do seu cofre.`,
          matchedAssets: [
            { type: "boilerplate", name: "(exemplo) Boilerplate mais recente do seu cofre", reason: "Ilustra como a IA cruzaria seu objetivo com o que você já tem guardado" },
          ],
          steps: [
            {
              stepNumber: 1,
              title: "Estruturação da fundação",
              duration: "3-4 dias",
              deliverables: ["Schema de banco", "Autenticação", "Configuração de ambiente"],
              toolsNeeded: ["PostgreSQL", "Next.js"],
              vaultAssetMatched: null,
            },
          ],
          gaps: ["Esta lista de lacunas é ilustrativa — conecte uma chave de IA para uma análise real do seu cofre."],
          professionalNeeded: { needed: false, role: "", skills: [], estimatedHours: "", reason: "" },
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Falha ao gerar roadmap com IA" }, { status: 500 });
  }
}
