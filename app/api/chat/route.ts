import { NextRequest, NextResponse } from "next/server";
import { generateAiCompletion, AiProvider } from "../../../../src/lib/ai";
import { getSession } from "../../../../src/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { user } = await getSession(req);
    const body = await req.json();
    const { prompt, systemInstruction, provider, model, apiKey, temperature } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt é obrigatório" }, { status: 400 });
    }

    const selectedProvider = (provider || user?.aiProviderPref || "gemini") as AiProvider;

    const result = await generateAiCompletion({
      prompt,
      systemInstruction: systemInstruction || "Você é o assistente inteligente do Vyroh Central Hub. Responda em português com clareza técnica e precisão.",
      provider: selectedProvider,
      model,
      apiKey,
      temperature,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro no processamento de IA" },
      { status: 500 }
    );
  }
}
