import { GoogleGenAI } from "@google/genai";

export type AiProvider = "gemini" | "claude" | "openai" | "ollama";

export interface GenerateAiOptions {
  prompt: string;
  systemInstruction?: string;
  provider?: AiProvider;
  model?: string;
  apiKey?: string;
  ollamaBaseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AiResponse {
  text: string;
  providerUsed: AiProvider;
  modelUsed: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Universal Multi-Provider AI Generator
 * Supports: Google Gemini, Anthropic Claude, OpenAI, and Local Ollama (Section 10.5)
 */
export async function generateAiCompletion(options: GenerateAiOptions): Promise<AiResponse> {
  const provider = options.provider || (process.env.DEFAULT_AI_PROVIDER as AiProvider) || "gemini";

  switch (provider) {
    case "claude": {
      const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error("ANTHROPIC_API_KEY não configurada no servidor nem fornecida pelo usuário.");
      }
      const model = options.model || "claude-3-5-sonnet-20241022";

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: options.maxTokens || 4096,
          temperature: options.temperature ?? 0.7,
          system: options.systemInstruction,
          messages: [{ role: "user", content: options.prompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Erro Claude (${res.status}): ${err}`);
      }

      const data = await res.json();
      const content = data.content?.[0]?.text || "";
      return {
        text: content,
        providerUsed: "claude",
        modelUsed: model,
        usage: {
          promptTokens: data.usage?.input_tokens,
          completionTokens: data.usage?.output_tokens,
        },
      };
    }

    case "openai": {
      const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OPENAI_API_KEY não configurada no servidor nem fornecida pelo usuário.");
      }
      const model = options.model || "gpt-4o";

      const messages: any[] = [];
      if (options.systemInstruction) {
        messages.push({ role: "system", content: options.systemInstruction });
      }
      messages.push({ role: "user", content: options.prompt });

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens || 4096,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Erro OpenAI (${res.status}): ${err}`);
      }

      const data = await res.json();
      return {
        text: data.choices?.[0]?.message?.content || "",
        providerUsed: "openai",
        modelUsed: model,
        usage: data.usage,
      };
    }

    case "ollama": {
      const baseUrl = options.ollamaBaseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434";
      const model = options.model || "llama3.2";

      const res = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt: options.prompt,
          system: options.systemInstruction,
          stream: false,
          options: {
            temperature: options.temperature ?? 0.7,
            num_predict: options.maxTokens || 4096,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Erro Ollama Local (${res.status}): ${err}`);
      }

      const data = await res.json();
      return {
        text: data.response || "",
        providerUsed: "ollama",
        modelUsed: model,
      };
    }

    case "gemini":
    default: {
      const apiKey = options.apiKey || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey || "" });
      const model = options.model || "gemini-2.5-flash";

      const result = await ai.models.generateContent({
        model,
        contents: options.prompt,
        config: {
          systemInstruction: options.systemInstruction,
          temperature: options.temperature ?? 0.7,
        },
      });

      return {
        text: result.text || "",
        providerUsed: "gemini",
        modelUsed: model,
      };
    }
  }
}
