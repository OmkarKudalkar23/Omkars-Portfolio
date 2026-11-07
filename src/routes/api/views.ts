import { createFileRoute } from "@tanstack/react-router";
import { MongoClient } from "mongodb";

const COUNTER_ID = "portfolio-views";
const DATABASE_NAME = process.env.MONGODB_DB_NAME || "portfolio";

declare global {
  // Reuse the connection pool across warm serverless invocations.
  var portfolioMongoClient: MongoClient | undefined;
}

function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  globalThis.portfolioMongoClient ??= new MongoClient(uri, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });
  return globalThis.portfolioMongoClient;
}

async function getCount() {
  const client = getMongoClient();
  if (!client) {
    return Response.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  try {
    const counters = client.db(DATABASE_NAME).collection<{ count: number }>("counters");
    const counter = await counters.findOne({ _id: COUNTER_ID });
    return Response.json(
      { value: counter?.count ?? 0 },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("[api/views] MongoDB read failed:", error);
    return Response.json({ error: "Unable to read view count" }, { status: 502 });
  }
}

async function incrementCount() {
  const client = getMongoClient();
  if (!client) {
    return Response.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  try {
    const counters = client.db(DATABASE_NAME).collection<{ count: number }>("counters");
    const filter = { _id: COUNTER_ID };
    try {
      await counters.updateOne(filter, { $inc: { count: 1 } }, { upsert: true });
    } catch (error) {
      // Concurrent first visits can race to insert this unique _id. If another
      // request created it first, apply this visit as a normal increment.
      if (!(error && typeof error === "object" && "code" in error && error.code === 11000)) {
        throw error;
      }
      await counters.updateOne(filter, { $inc: { count: 1 } });
    }

    const counter = await counters.findOne(filter);
    return Response.json(
      { value: counter?.count ?? 0 },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("[api/views] MongoDB increment failed:", error);
    return Response.json({ error: "Unable to increment view count" }, { status: 502 });
  }
}

export const Route = createFileRoute("/api/views")({
  server: {
    handlers: {
      GET: async () => getCount(),
      POST: async () => incrementCount(),
    },
  },
});
