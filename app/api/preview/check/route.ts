import { NextRequest, NextResponse } from "next/server";

export type PreviewMode = "embed" | "github" | "card";

function isGithubUrl(url: URL): boolean {
  return url.hostname === "github.com" || url.hostname === "www.github.com";
}

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']*)["']`, "i"),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match?.[1]) return match[1];
  }
  return null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match?.[1]?.trim() || null;
}

export async function POST(req: NextRequest) {
  try {
    const { url: rawUrl } = await req.json();
    if (!rawUrl) {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 });
    }

    let url: URL;
    try {
      url = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
    } catch {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    // Conector nativo: GitHub tem API própria, nunca tentamos embutir a página dele
    if (isGithubUrl(url)) {
      return NextResponse.json({
        mode: "github" as PreviewMode,
        url: url.toString(),
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(url.toString(), {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; VyrohPreviewBot/1.0)" },
      });
      clearTimeout(timeout);

      const xfo = res.headers.get("x-frame-options");
      const csp = res.headers.get("content-security-policy");
      const blocksFraming =
        (xfo && /deny|sameorigin/i.test(xfo)) || (csp && /frame-ancestors\s+'none'|frame-ancestors\s+'self'/i.test(csp));

      const html = (await res.text()).slice(0, 100_000);
      const meta = {
        title: extractMeta(html, "og:title") || extractTitle(html) || url.hostname,
        description: extractMeta(html, "og:description") || extractMeta(html, "description") || "",
        image: extractMeta(html, "og:image"),
      };

      return NextResponse.json({
        mode: (blocksFraming ? "card" : "embed") as PreviewMode,
        url: url.toString(),
        meta,
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      return NextResponse.json({
        mode: "card" as PreviewMode,
        url: url.toString(),
        meta: { title: url.hostname, description: "Não foi possível carregar uma prévia deste site.", image: null },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
