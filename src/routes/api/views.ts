import { createFileRoute } from "@tanstack/react-router";

const COUNTER_NAME = "portfolio-views";

function getCounterConfig() {
  const workspace = process.env.COUNTERAPI_WORKSPACE;
  const token = process.env.COUNTERAPI_TOKEN;
  return workspace && token ? { workspace, token } : null;
}

async function counterRequest(action: "up" | "") {
  const config = getCounterConfig();
  if (!config) {
    return Response.json({ error: "Counter service is not configured" }, { status: 503 });
  }

  try {
    const response = await fetch(
      `https://api.counterapi.dev/v2/${encodeURIComponent(config.workspace)}/${COUNTER_NAME}/${action}`,
      { headers: { Authorization: `Bearer ${config.token}` } },
    );
    const body = await response.json();
    if (!response.ok) {
      return Response.json({ error: "Counter service request failed" }, { status: 502 });
    }
    return Response.json(body, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ error: "Counter service is unavailable" }, { status: 502 });
  }
}

export const Route = createFileRoute("/api/views")({
  server: {
    handlers: {
      GET: async () => counterRequest(""),
      POST: async () => counterRequest("up"),
    },
  },
});
