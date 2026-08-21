import { NextRequest, NextResponse } from "next/server";
import { generateAiCompletion, AiProvider } from "@/src/lib/ai";
import { getSession } from "@/src/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    const body = await req.json();
    const { promptContent, variables, systemInstruction, provider, model } = body;

    if (!promptContent) {
      return NextResponse.json({ error: "Conteúdo do prompt é obrigatório" }, { status: 400 });
    }

    let finalPrompt = promptContent;
    if (variables && typeof variables === "object") {
      Object.entries(variables).forEach(([key, val]) => {
        finalPrompt = finalPrompt.replaceAll(`{{${key}}}`, String(val));
      });
    }

    const selectedProvider = (provider || user?.aiProviderPref || "gemini") as AiProvider;
    const startTime = Date.now();

    try {
      const result = await generateAiCompletion({
        prompt: finalPrompt,
        systemInstruction,
        provider: selectedProvider,
        model,
      });

      return NextResponse.json({
        success: true,
        output: result.text,
        latencyMs: Date.now() - startTime,
        model: result.modelUsed,
        provider: result.providerUsed,
      });
    } catch (aiError: any) {
      // Modo híbrido: sem chave de IA configurada (ou provedor indisponível), o Vyroh
      // não quebra a tela — devolve uma simulação, deixando claro que é simulação.
      return NextResponse.json({
        success: true,
        simulated: true,
        output: `[SIMULAÇÃO VYROH — nenhuma chave de IA configurada para "${selectedProvider}"]\n\nEntrada recebida: "${finalPrompt.slice(0, 160)}${finalPrompt.length > 160 ? "..." : ""}"\n\nConfigure GEMINI_API_KEY, ANTHROPIC_API_KEY ou OPENAI_API_KEY (ou um Ollama local) nas variáveis de ambiente para receber a resposta real do modelo.`,
        latencyMs: Date.now() - startTime,
        model: "simulado",
        provider: selectedProvider,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro na execução do prompt" }, { status: 500 });
  }
}
