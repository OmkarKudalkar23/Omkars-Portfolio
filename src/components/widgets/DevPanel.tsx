import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { omkar } from "@/lib/data";
import { WidgetShell } from "./shared";

type GhStats = { repos: number; followers: number; stars: number } | null;

export function DevPanel() {
  const [gh, setGh] = useState<GhStats>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const user = await fetch("https://api.github.com/users/OmkarKudalkar23").then((r) => r.json());
        const repos = await fetch("https://api.github.com/users/OmkarKudalkar23/repos?per_page=100").then((r) => r.json());
        const stars = Array.isArray(repos)
          ? repos.reduce((s: number, r: { stargazers_count?: number }) => s + (r.stargazers_count ?? 0), 0)
          : 0;
        if (alive)
          setGh({ repos: user.public_repos ?? (Array.isArray(repos) ? repos.length : 0), followers: user.followers ?? 0, stars });
      } catch {
        if (alive) setErr(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const json = {
    name: omkar.name,
    cgpa: omkar.cgpa,
    internships: omkar.experience.map((e) => `${e.company} · ${e.role}`),
    projects: omkar.projects.map((p) => p.name),
    wins: omkar.hackathons.filter((h) => h.place === 1).map((h) => h.event),
    leetcode: omkar.leetcodeLabel,
  };

  return (
    <WidgetShell>
      <div
        className="overflow-hidden rounded-2xl border bg-[#0a0a0b] font-mono-tech text-[12px]"
        style={{ borderColor: "rgba(62,207,142,0.25)", borderWidth: "0.5px" }}
      >
        <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: "rgba(62,207,142,0.2)" }}>
          <Terminal className="h-3.5 w-3.5 text-success" />
          <span className="text-success">~/omkar — dev mode</span>
        </div>
        <div className="space-y-4 p-4">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-success">
            $ You found the dev mode.
          </motion.p>

          <div>
            <p className="text-text-muted">// github.com/OmkarKudalkar23</p>
            {err ? (
              <p className="text-text-secondary">github stats unavailable (rate limited)</p>
            ) : gh ? (
              <p className="text-text-secondary">
                repos: <span className="text-accent-blue">{gh.repos}</span> · stars:{" "}
                <span className="text-accent-blue">{gh.stars}</span> · followers:{" "}
                <span className="text-accent-blue">{gh.followers}</span>
              </p>
            ) : (
              <p className="text-text-muted">fetching…</p>
            )}
          </div>

          <div>
            <p className="text-text-muted">// leetcode</p>
            <p className="text-text-secondary">{omkar.leetcodeLabel}</p>
          </div>

          <div>
            <p className="text-text-muted">// resume.json</p>
            <pre className="mt-1 whitespace-pre-wrap break-words text-text-secondary">{JSON.stringify(json, null, 2)}</pre>
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}
