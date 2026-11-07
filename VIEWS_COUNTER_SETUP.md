# Portfolio view counter setup

The `/views` page uses CounterAPI to store a shared total. The portfolio records one visit per browser tab session and keeps the API token on the server.

1. Create a workspace and a private API token at [counterapi.dev](https://counterapi.dev/).
2. Add these server-side environment variables to your local `.env` and production deployment:
   - `COUNTERAPI_WORKSPACE` — the workspace name
   - `COUNTERAPI_TOKEN` — an API token with read and write access
3. Deploy/restart the app. The `portfolio-views` counter is incremented automatically on the next portfolio visit.

The count represents visits per tab session, rather than verified unique people. CounterAPI may briefly return a stale total while its counter buffer updates.
