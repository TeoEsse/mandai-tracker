/**
 * api/get-cache.js
 * MandAI Iran Conflict Tracker — Serve Cached Data
 *
 * Called by App.jsx on every page load.
 * Returns the latest AI-generated card data + Intel Brief from Upstash Redis.
 * If cache is empty or expired, returns { data: null } → frontend falls back
 * to hardcoded data in App.jsx.
 *
 * Env vars required:
 *   KV_REST_API_URL
 *   KV_REST_API_TOKEN   (or KV_REST_API_READ_ONLY_TOKEN for read-only access)
 */

const CACHE_KEY = "mandai_tracker_data";

// ─── Upstash Redis GET (REST API, no SDK) ─────────────────────────────────────

async function redisGet(key) {
  const url = process.env.KV_REST_API_URL;
  const token =
    process.env.KV_REST_API_READ_ONLY_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) throw new Error("Upstash env vars not configured");

  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upstash GET failed: ${res.status} — ${text}`);
  }

  const json = await res.json();

  // Upstash returns { result: "<stringified JSON>" } or { result: null }
  if (json.result === null || json.result === undefined) return null;

  const parsed = JSON.parse(json.result);

  // When redisSet stores {value, ex} as a JSON body, Upstash saves the whole
  // object — unwrap the inner .value string if present
  if (parsed && typeof parsed.value === "string") {
    return JSON.parse(parsed.value);
  }

  return parsed;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");

  try {
    const data = await redisGet(CACHE_KEY);

    if (!data) {
      return res.status(200).json({ data: null, source: "cache_miss" });
    }

    return res.status(200).json({
      data,
      source: "cache",
      updatedAt: data.updatedAt || null,
    });
  } catch (err) {
    console.error("[get-cache] ERROR:", err.message);
    return res.status(200).json({
      data: null,
      source: "error",
      error: err.message,
    });
  }
}
