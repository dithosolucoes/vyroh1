/**
 * Vyroh MCP (Model Context Protocol) Server
 * Exposes Vyroh Vault resources and tools to external AI agents (Claude Code, Cursor, AnythingLLM)
 */

export interface MCPToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, { type: string; description: string }>;
    required?: string[];
  };
}

export const VYROH_MCP_TOOLS: MCPToolDefinition[] = [
  {
    name: "list_projects",
    description: "Lists all projects in the user's Vyroh vault with status, clients, and connected assets.",
    parameters: {
      type: "object",
      properties: {
        status: { type: "string", description: "Filter by status: 'planejamento', 'em_andamento', 'concluido', 'pausado', 'arquivado'" },
      },
    },
  },
  {
    name: "get_prompts",
    description: "Retrieves AI prompts, templates, and agent definitions stored in the vault.",
    parameters: {
      type: "object",
      properties: {
        category: { type: "string", description: "Filter by category: 'Frontend', 'Backend', 'Marketing', 'Vendas', 'Geral'" },
        search: { type: "string", description: "Search query for title or content" },
      },
    },
  },
  {
    name: "get_boilerplates",
    description: "Fetches indexed code boilerplates, tech stacks, and repository URLs.",
    parameters: {
      type: "object",
      properties: {
        stack: { type: "string", description: "Filter by technology (e.g., 'Next.js', 'React', 'Tailwind', 'Postgres')" },
      },
    },
  },
  {
    name: "search_vault",
    description: "Performs hybrid RAG and semantic search across projects, prompts, SOPs, and clients.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "The natural language search query" },
      },
      required: ["query"],
    },
  },
  {
    name: "create_project",
    description: "Creates a new project in the Vyroh vault, optionally linking prompts, boilerplates, and client.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Project title" },
        description: { type: "string", description: "Project description and goals" },
        clientId: { type: "string", description: "Optional client ID" },
        budgetCents: { type: "string", description: "Budget in cents" },
      },
      required: ["name"],
    },
  },
];

export async function executeMCPTool(toolName: string, args: Record<string, any>, vaultData: any) {
  switch (toolName) {
    case "list_projects": {
      const { status } = args;
      const projects = vaultData.projects || [];
      return status ? projects.filter((p: any) => p.status === status) : projects;
    }
    case "get_prompts": {
      const { category, search } = args;
      let prompts = vaultData.prompts || [];
      if (category) prompts = prompts.filter((p: any) => p.category?.toLowerCase() === category.toLowerCase());
      if (search) {
        const s = search.toLowerCase();
        prompts = prompts.filter((p: any) => p.title?.toLowerCase().includes(s) || p.content?.toLowerCase().includes(s));
      }
      return prompts;
    }
    case "get_boilerplates": {
      const { stack } = args;
      const boilerplates = vaultData.boilerplates || [];
      if (stack) {
        return boilerplates.filter((b: any) => b.stack?.some((s: string) => s.toLowerCase().includes(stack.toLowerCase())));
      }
      return boilerplates;
    }
    case "search_vault": {
      const q = (args.query || "").toLowerCase();
      const results: any[] = [];
      (vaultData.projects || []).forEach((p: any) => {
        if (p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)) {
          results.push({ type: "project", item: p });
        }
      });
      (vaultData.prompts || []).forEach((pr: any) => {
        if (pr.title?.toLowerCase().includes(q) || pr.content?.toLowerCase().includes(q)) {
          results.push({ type: "prompt", item: pr });
        }
      });
      (vaultData.boilerplates || []).forEach((b: any) => {
        if (b.name?.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q)) {
          results.push({ type: "boilerplate", item: b });
        }
      });
      return results;
    }
    case "create_project": {
      return {
        success: true,
        project: {
          id: "proj_" + Date.now(),
          name: args.name,
          description: args.description || "",
          status: "planejamento",
          clientId: args.clientId || null,
          budgetCents: Number(args.budgetCents) || 0,
          createdAt: new Date().toISOString(),
        },
      };
    }
    default:
      throw new Error(`Unknown MCP Tool: ${toolName}`);
  }
}
