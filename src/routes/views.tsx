import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, RefreshCw } from "lucide-react";
import { fetchPortfolioViews } from "@/lib/views";

type CounterResponse = { value?: number; data?: { value?: number } };

export const Route = createFileRoute("/views")({ component: ViewsPage });

function ViewsPage() {
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "setup" | "error">("loading");

  async function loadCount() {
    setStatus("loading");
    try {
      const response = await fetchPortfolioViews();
      if (response.status === 503) {
        setStatus("setup");
        return;
      }
      if (!response.ok) throw new Error("Unable to load views");
      const result = (await response.json()) as CounterResponse;
      const value = result.value ?? result.data?.value;
      if (typeof value !== "number") throw new Error("Unexpected counter response");
      setCount(value);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    void loadCount();
  }, []);

  return (
    <main className="views-page">
      <div className="views-orbit views-orbit-one" />
      <div className="views-orbit views-orbit-two" />
      <section className="views-panel" aria-labelledby="views-title">
        <Link to="/" className="views-back"><ArrowLeft size={15} /> Back to portfolio</Link>
        <div className="views-mark"><Eye size={18} strokeWidth={1.5} /><span>LIVE COUNTER</span></div>
        <p className="views-kicker">OMKAR KUDALKAR · PORTFOLIO</p>
        <h1 id="views-title">Every visit<br />leaves a trace.</h1>
        <p className="views-description">A running count of portfolio visits from across the web.</p>
        <div className="views-count" aria-live="polite">
          {status === "ready" ? count!.toLocaleString("en-IN") : status === "loading" ? "···" : "—"}
        </div>
        <p className="views-caption">TOTAL VISITS</p>
        <div className={`views-status views-status-${status}`}>
          <span className="views-status-dot" />
          {status === "ready" && "Counter is up to date"}
          {status === "loading" && "Connecting to counter"}
          {status === "setup" && "Counter setup required — configure COUNTERAPI_WORKSPACE and COUNTERAPI_TOKEN on the server."}
          {status === "error" && "Could not reach the counter. Try refreshing."}
        </div>
        <button className="views-refresh" onClick={() => void loadCount()} disabled={status === "loading"}>
          <RefreshCw size={14} /> Refresh count
        </button>
        <div className="views-footer"><span>BUILT TO BE SEEN</span><span>© OMKAR</span></div>
      </section>
    </main>
  );
}
