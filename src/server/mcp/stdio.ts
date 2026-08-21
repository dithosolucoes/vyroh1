#!/usr/bin/env node
/**
 * Vyroh Model Context Protocol (MCP) Stdio Server
 * Connect this directly to Claude Code / Cursor / AnythingLLM by running:
 * claude mcp add vyroh node dist/mcp.cjs
 */
import readline from "readline";
import { VYROH_MCP_TOOLS, executeMCPTool } from "./server";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Stored in-memory state or read from Postgres if configured
const mockVaultContext = {
  projects: [
    {
      id: "proj_1",
      name: "SaaS Multi-tenant Fintech",
      description: "Plataforma de conciliação bancária para profissionais PJ",
      status: "em_andamento",
      budgetCents: 1500000,
    },
    {
      id: "proj_2",
      name: "App Mobile de Agendamentos",
      description: "Aplicativo React Native com offline sync para barbearias",
      status: "planejamento",
      budgetCents: 850000,
    },
  ],
  prompts: [
    {
      id: "prm_1",
      title: "Auditor de Código & Rerender",
      category: "Frontend",
      content: "Você é um auditor sênior de React. Analise componentes procurando por rerenders desnecessários...",
    },
    {
      id: "prm_2",
      title: "Arquiteto de Schemas Postgres",
      category: "Backend",
      content: "Você é um DBA Postgres experiente. Projete índices e chaves estrangeiras com soft-delete...",
    },
  ],
  boilerplates: [
    {
      id: "bp_1",
      name: "Next.js 15 + Postgres Starter",
      repoUrl: "https://github.com/vyroh/nextjs-postgres-starter",
      description: "Template base com Drizzle ORM, Better-Auth e Tailwind CSS",
      stack: ["Next.js", "PostgreSQL", "Tailwind CSS", "TypeScript"],
    },
  ],
};

function sendResponse(id: string | number | null, result: any, error?: any) {
  const response: any = {
    jsonrpc: "2.0",
    id,
  };
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  process.stdout.write(JSON.stringify(response) + "\n");
}

rl.on("line", async (line) => {
  if (!line.trim()) return;

  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    switch (method) {
      case "initialize":
        sendResponse(id, {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
            resources: {},
          },
          serverInfo: {
            name: "vyroh-vault-mcp",
            version: "1.0.0",
          },
        });
        break;

      case "tools/list":
        sendResponse(id, {
          tools: VYROH_MCP_TOOLS.map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.parameters,
          })),
        });
        break;

      case "tools/call": {
        const { name, arguments: args } = params || {};
        const toolResult = await executeMCPTool(name, args || {}, mockVaultContext);
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify(toolResult, null, 2),
            },
          ],
        });
        break;
      }

      case "ping":
        sendResponse(id, {});
        break;

      default:
        sendResponse(id, null, {
          code: -32601,
          message: `Method not found: ${method}`,
        });
    }
  } catch (err: any) {
    sendResponse(null, null, {
      code: -32700,
      message: "Parse error: " + err.message,
    });
  }
});
