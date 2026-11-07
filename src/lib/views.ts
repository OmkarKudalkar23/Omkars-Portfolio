let visitRequest: Promise<Response> | undefined;

export function fetchPortfolioViews(): Promise<Response> {
  if (visitRequest) return visitRequest;

  let method: "GET" | "POST" = "GET";
  try {
    const visitKey = "portfolio-visit-counted";
    if (!sessionStorage.getItem(visitKey)) {
      sessionStorage.setItem(visitKey, "1");
      method = "POST";
    }
  } catch {
    // Count the visit when browser storage is unavailable.
    method = "POST";
  }

  visitRequest = fetch("/api/views", { method, keepalive: true }).finally(() => {
    visitRequest = undefined;
  });
  return visitRequest;
}
