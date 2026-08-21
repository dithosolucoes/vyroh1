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

    const result = await generateAiCompletion({
      prompt: finalPrompt,
      systemInstruction,
      provider: selectedProvider,
      model,
    });

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      output: result.text,
      latencyMs,
      model: result.modelUsed,
      provider: result.providerUsed,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro na execução do prompt" }, { status: 500 });
  }
}
