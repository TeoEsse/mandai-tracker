
/**
 * api/claude-update.js
 * MandAI Iran Conflict Tracker — Daily AI Update Function
 *
 * Trigger:  Vercel Cron (daily at 07:00 CET) or manual GET /api/claude-update
 * Flow:     1. Fetch latest news from NewsAPI for each country/topic
 *           2. Send news + current conflict context to Claude Haiku
 *           3. Receive updated card data + Intel Brief as structured JSON
 *           4. Store result in Upstash Redis with 24 h TTL
 *
 * Env vars required (set in Vercel → Settings → Environment Variables):
 *   ANTHROPIC_API_KEY
 *   NEWS_API_KEY
 *   KV_REST_API_URL
 *   KV_REST_API_TOKEN
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const CACHE_KEY = "mandai_tracker_data";
const CACHE_TTL_SECONDS = 86400; // 24 hours

// All country / topic names used as NewsAPI search queries and card identifiers
const COUNTRIES = {
  belligerents: ["United States", "Israel", "Iran"],
  gulfStates: ["UAE", "Qatar", "Bahrain", "Saudi Arabia", "Kuwait", "Oman"],
  greatPowers: [
    "Russia",
    "China",
    "United Kingdom",
    "France",
    "Italy",
    "EU Naval Coalition",
    "Ukraine",
  ],
  regional: [
    "Turkey",
    "Kurdish Forces",
    "Azerbaijan",
    "Lebanon",
    "Iraq",
    "Spain",
    "Pakistan",
    "Yemen Houthis",
    "Sri Lanka",
  ],
  energyMarkets: ["Strait of Hormuz", "Global Markets"],
};

// Flat list used for news fetching
const ALL_TOPICS = Object.values(COUNTRIES).flat();

// ─── Upstash Redis helper (REST API, no SDK needed) ──────────────────────────

async function redisSet(key, value, ttlSeconds) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) throw new Error("Upstash env vars not configured");

  const res = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value: JSON.stringify(value), ex: ttlSeconds }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upstash SET failed: ${res.status} — ${text}`);
  }

  return await res.json();
}

// ─── NewsAPI helper ──────────────────────────────────────────────────────────

async function fetchNewsForTopic(topic) {
  const key = process.env.NEWS_API_KEY;
  if (!key) throw new Error("NEWS_API_KEY not configured");

  // Use "everything" endpoint for Iran-conflict-scoped queries
  const query = encodeURIComponent(`${topic} Iran conflict OR war OR military`);
  const from = new Date(Date.now() - 48 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0]; // last 48 h

  const url =
    `https://newsapi.org/v2/everything` +
    `?q=${query}` +
    `&from=${from}` +
    `&sortBy=publishedAt` +
    `&pageSize=5` +
    `&language=en` +
    `&apiKey=${key}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`NewsAPI error for "${topic}": ${res.status}`);
    return [];
  }

  const data = await res.json();
  return (data.articles || []).map((a) => ({
    title: a.title,
    description: a.description || "",
    publishedAt: a.publishedAt,
    source: a.source?.name || "Unknown",
  }));
}

// Fetch news for all topics concurrently (respect free-tier rate limits with
// a small stagger — 200 ms between batches of 5)
async function fetchAllNews() {
  const results = {};
  const topics = ALL_TOPICS;
  const batchSize = 5;

  for (let i = 0; i < topics.length; i += batchSize) {
    const batch = topics.slice(i, i + batchSize);
    const settled = await Promise.allSettled(
      batch.map(async (t) => ({ topic: t, articles: await fetchNewsForTopic(t) }))
    );
    settled.forEach((s) => {
      if (s.status === "fulfilled") {
        results[s.value.topic] = s.value.articles;
      } else {
        console.warn("News fetch failed:", s.reason);
      }
    });
    // Small stagger between batches to avoid NewsAPI rate limits
    if (i + batchSize < topics.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return results;
}

// ─── Claude prompt builder ───────────────────────────────────────────────────

function buildPrompt(newsMap) {
  const today = new Date().toISOString().split("T")[0];

  // Summarise news into the prompt — keep it compact for Haiku token budget
  const newsSummary = ALL_TOPICS.map((topic) => {
    const articles = newsMap[topic] || [];
    if (!articles.length) return `### ${topic}\nNo recent news available.\n`;
    const lines = articles
      .map((a) => `- [${a.source}] ${a.title} (${a.publishedAt?.slice(0, 10)})`)
      .join("\n");
    return `### ${topic}\n${lines}\n`;
  }).join("\n");

  return `You are a professional geopolitical intelligence analyst producing structured updates for the MandAI Iran Conflict Tracker (${today}).

The tracker monitors the 2026 Iran–US–Israel conflict and related actors. Below is today's latest news feed grouped by actor/topic.

---
${newsSummary}
---

Using the news above, produce an updated JSON object with the following exact structure. Be concise, factual, and intelligence-brief in style (no hedging phrases, no markdown inside strings).

Return ONLY valid JSON — no prose, no markdown fences. Schema:

{
  "updatedAt": "<ISO timestamp>",
  "cards": [
    {
      "name": "<exact actor name>",
      "threat": "<CRITICAL|HIGH|ELEVATED|MODERATE|LOW>",
      "summary": "<2–3 sentence current status summary>",
      "military": "<1–2 sentence military posture update>",
      "economic": "<1–2 sentence economic/sanctions update>",
      "diplomatic": "<1–2 sentence diplomatic posture update>",
      "keyWatch": "<single most critical watch item>"
    }
  ],
  "intelBrief": {
    "executiveSummary": "<3–4 sentence top-level situation summary>",
    "militaryCampaign": "<2–3 sentences on US/Israel air/strike campaign status>",
    "iranResponse": "<2–3 sentences on Iran retaliatory posture and actions>",
    "gulfRegional": "<2–3 sentences on Gulf states and regional actor dynamics>",
    "energyMarkets": "<2–3 sentences on Hormuz, oil prices, shipping disruption>",
    "usPolitical": "<2–3 sentences on US political situation, War Powers, Congress>",
    "watchlist": "<3–5 bullet points as a JSON array of strings, each a critical watch item>"
  }
}

Actor names to use exactly (in this order in the cards array):
United States, Israel, Iran,
UAE, Qatar, Bahrain, Saudi Arabia, Kuwait, Oman,
Russia, China, United Kingdom, France, Italy, EU Naval Coalition, Ukraine,
Turkey, Kurdish Forces, Azerbaijan, Lebanon, Iraq, Spain, Pakistan, Yemen Houthis, Sri Lanka,
Strait of Hormuz, Global Markets

Threat level guidance:
- CRITICAL: active combat operations / imminent escalation
- HIGH: significant military posture, direct involvement
- ELEVATED: strong indirect involvement, significant risk
- MODERATE: monitoring, indirect effects
- LOW: peripheral, minimal direct impact

Return ONLY the JSON object.`;
}

// ─── Claude API call ─────────────────────────────────────────────────────────

async function callClaude(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Claude API error: ${res.status} — ${text}`);
  }

  const data = await res.json();
  const rawText = data?.content?.[0]?.text || "";

  // Strip any accidental markdown fences before parsing
  const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON parse error. Raw Claude output:", rawText.slice(0, 500));
    throw new Error(`Failed to parse Claude response as JSON: ${e.message}`);
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // Allow only GET (Vercel Cron sends GET) and reject other methods
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optional: simple secret to prevent unauthorised manual triggers
  // Set CRON_SECRET in Vercel env vars and pass ?secret=xxx to protect endpoint
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const provided = req.query?.secret || req.headers?.["x-cron-secret"];
    if (provided !== cronSecret) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  console.log(`[claude-update] Starting daily update — ${new Date().toISOString()}`);

  try {
    // 1. Fetch news for all topics
    console.log("[claude-update] Fetching news from NewsAPI...");
    const newsMap = await fetchAllNews();
    const topicsWithNews = Object.values(newsMap).filter((a) => a.length > 0).length;
    console.log(`[claude-update] News fetched: ${topicsWithNews}/${ALL_TOPICS.length} topics have articles`);

    // 2. Build prompt and call Claude
    console.log("[claude-update] Calling Claude API...");
    const prompt = buildPrompt(newsMap);
    const payload = await callClaude(prompt);
    console.log(`[claude-update] Claude response received — ${payload.cards?.length || 0} cards`);

    // 3. Attach metadata
    payload.updatedAt = new Date().toISOString();
    payload.newsTopicsCovered = topicsWithNews;

    // 4. Store in Upstash Redis
    console.log("[claude-update] Writing to Upstash Redis...");
    await redisSet(CACHE_KEY, payload, CACHE_TTL_SECONDS);
    console.log("[claude-update] Cache written successfully");

    return res.status(200).json({
      success: true,
      updatedAt: payload.updatedAt,
      cardCount: payload.cards?.length || 0,
      newsTopicsCovered: topicsWithNews,
    });
  } catch (err) {
    console.error("[claude-update] ERROR:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
