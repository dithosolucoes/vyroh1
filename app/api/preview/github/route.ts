import { NextRequest, NextResponse } from "next/server";

function parseRepoPath(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    const parsed = parseRepoPath(url);
    if (!parsed) {
      return NextResponse.json({ error: "Link de repositório do GitHub inválido" }, { status: 400 });
    }

    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const [repoRes, readmeRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, { headers }),
      fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/readme`, { headers }),
    ]);

    if (!repoRes.ok) {
      return NextResponse.json({ error: "Repositório não encontrado ou privado" }, { status: repoRes.status });
    }

    const repo = await repoRes.json();
    let readmeExcerpt: string | null = null;
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      const decoded = Buffer.from(readmeData.content || "", "base64").toString("utf-8");
      readmeExcerpt = decoded.slice(0, 1500);
    }

    return NextResponse.json({
      success: true,
      repo: {
        fullName: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics || [],
        defaultBranch: repo.default_branch,
        pushedAt: repo.pushed_at,
        htmlUrl: repo.html_url,
        openIssues: repo.open_issues_count,
        license: repo.license?.name || null,
        readmeExcerpt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
