/**
 * Vyroh Central Hub - Typed REST API Client
 * Connects frontend views directly to Next.js API Routes and Express endpoints
 */

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
}

export class ApiClient {
  private static async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const token = typeof window !== "undefined" ? localStorage.getItem("vyroh_auth_token") : null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errText = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(errText);
      } catch {
        parsed = { error: errText || `Erro na requisição (${res.status})` };
      }
      throw new Error(parsed.error || parsed.message || `Erro ${res.status}`);
    }

    return res.json();
  }

  // 1. Projects
  static async getProjects() {
    return this.request<any[]>("/api/projects");
  }

  static async createProject(payload: any) {
    return this.request<any>("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // 2. Prompts
  static async getPrompts() {
    return this.request<any[]>("/api/prompts");
  }

  static async createPrompt(payload: any) {
    return this.request<any>("/api/prompts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // 3. Boilerplates & SOPs
  static async getBoilerplates() {
    return this.request<any[]>("/api/boilerplates");
  }

  static async getSOPs() {
    return this.request<any[]>("/api/sops");
  }

  // 4. Clients & Proposals
  static async getClients() {
    return this.request<any[]>("/api/clients");
  }

  static async createClient(payload: any) {
    return this.request<any>("/api/clients", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async getProposals() {
    return this.request<any[]>("/api/proposals");
  }

  // 5. Marketplace & Listings
  static async getListings() {
    return this.request<any[]>("/api/marketplace/listings");
  }

  static async createListing(payload: any) {
    return this.request<any>("/api/marketplace/listings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async createCheckout(listingId: string, flowType: string) {
    return this.request<{ checkoutUrl: string; sessionId: string }>("/api/marketplace/checkout", {
      method: "POST",
      body: JSON.stringify({ listingId, flowType }),
    });
  }

  // 6. Multi-Provider AI (Claude, OpenAI, Ollama, Gemini)
  static async generateAi(prompt: string, systemInstruction?: string, provider?: string, model?: string) {
    return this.request<{ text: string; providerUsed: string; modelUsed: string }>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ prompt, systemInstruction, provider, model }),
    });
  }

  // 7. Admin Commission Rules (Section 29)
  static async getCommissionRules() {
    return this.request<any[]>("/api/admin/commission-rules");
  }

  static async updateCommissionRule(flowType: string, percentage: number) {
    return this.request<any>("/api/admin/commission-rules", {
      method: "PUT",
      body: JSON.stringify({ flowType, percentage }),
    });
  }
}
