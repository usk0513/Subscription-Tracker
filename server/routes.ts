import type { Express } from "express";
import { createServer, type Server } from "node:http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Feedback API - creates GitHub Issue for missing/outdated plans
  app.post("/api/feedback", async (req, res) => {
    try {
      const { serviceName, planName, details } = req.body;

      if (!serviceName || !details) {
        return res.status(400).json({ error: "サービス名と詳細は必須です" });
      }

      const pat = process.env.GITHUB_PAT;
      const owner = process.env.GITHUB_REPO_OWNER;
      const repo = process.env.GITHUB_REPO_NAME;

      if (!pat || !owner || !repo) {
        console.error("GitHub environment variables not configured");
        return res.status(500).json({ error: "サーバー設定エラー" });
      }

      const title = planName
        ? `[プラン追加リクエスト] ${serviceName} - ${planName}`
        : `[サービス追加リクエスト] ${serviceName}`;

      const body = `## フィードバック

**サービス名:** ${serviceName}
${planName ? `**プラン名:** ${planName}\n` : ""}
**詳細:**
${details}

---
*アプリから自動送信されました*`;

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${pat}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          body: JSON.stringify({
            title,
            body,
            labels: ["feedback", "preset-request"],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("GitHub API error:", response.status, errorData);
        return res.status(500).json({ error: "Issue作成に失敗しました" });
      }

      const issueData = await response.json();
      res.json({
        success: true,
        issueNumber: issueData.number,
        issueUrl: issueData.html_url,
      });
    } catch (error) {
      console.error("Feedback API error:", error);
      res.status(500).json({ error: "サーバーエラーが発生しました" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
