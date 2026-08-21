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
    const { questionTitle, questionContent, category, provider, model } = body;

    const promptText = `
Você é o assistente de Comunidade do Vyroh.
Um membro postou uma dúvida na categoria "${category || "dev"}":
Título: "${questionTitle}"
Conteúdo: "${questionContent}"

Faça uma análise rápida, forneça uma sugestão técnica direta de resolução, indique que tipo de ativos do cofre (boilerplates/prompts/SOPs) resolvem isso e recomende o perfil do profissional que pode ser contratado caso precise de ajuda.

Retorne APENAS um JSON válido, sem markdown, no formato:
{
  "summaryAnswer": "Resposta técnica e sintetizada em 1-2 parágrafos",
  "recommendedAssets": [
    { "type": "boilerplate | prompt | sop", "name": "Nome sugerido", "reason": "Motivo" }
  ],
  "recommendedExperts": [
    { "name": "Nome fictício", "role": "Especialidade", "rating": "4.9 (35 reviews)" }
  ]
}`;

    const selectedProvider = (provider || user?.aiProviderPref || "gemini") as AiProvider;

    const result = await generateAiCompletion({
      prompt: promptText,
      systemInstruction: "Responda apenas com JSON válido, técnico e objetivo.",
      provider: selectedProvider,
      model,
    });

    const aiAnalysis = extractJson(result.text);
    return NextResponse.json({ success: true, aiAnalysis });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Falha na análise de IA" }, { status: 500 });
  }
}
