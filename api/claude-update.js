/**
 * api/claude-update.js
 * MandAI Iran Conflict Tracker — Daily AI Update Function
 *
 * Trigger:  Manual GET /api/claude-update  (or cron-job.org / GitHub Actions)
 * Fix v2:   Split into TWO Claude calls (cards + brief) to avoid max_tokens
 *           truncation that caused "Unterminated string in JSON" error.
 *
 * Env vars required (Vercel → Settings → Environment Variables):
 *   ANTHROPIC_API_KEY
 *   NEWS_API_KEY
 *   KV_REST_API_URL
 *   KV_REST_API_TOKEN
 */

const CACHE_KEY         = "mandai_tracker_data";
const CACHE_TTL_SECONDS = 86400; // 24 hours

const ALL_TOPICS = [
  "United States", "Israel", "Iran",
  "UAE", "Qatar", "Bahrain", "Saudi Arabia", "Kuwait", "Oman",
  "Russia", "China", "United Kingdom", "France", "Italy", "EU Naval Coalition", "Ukraine",
  "Turkey", "Kurdish Forces", "Azerbaijan", "Lebanon", "Iraq", "Spain", "Pakistan",
  "Yemen Houthis", "Sri Lanka",
  "Strait of Hormuz", "Global Markets",
];

// ─── Upstash Redis SET ────────────────────────────────────────────────────────

async function redisSet(key, value, ttlSeconds) {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("Upstash env vars not configured");

  const res = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method:  "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body:    JSON.stringify({ value: JSON.stringify(value), ex: ttlSeconds }),
  });
  if (!res.ok) throw new Error(`Upstash SET failed: ${res.status} — ${await res.text()}`);
  return await res.json();
}

// ─── NewsAPI ──────────────────────────────────────────────────────────────────

async function fetchNewsForTopic(topic) {
  const key = process.env.NEWS_API_KEY;
  if (!key) throw new Error("NEWS_API_KEY not configured");

  const query = encodeURIComponent(`${topic} Iran conflict OR war OR military`);
  const from  = new Date(Date.now() - 48 * 3600 * 1000).toISOString().split("T")[0];
  const url   = `https://newsapi.org/v2/everything?q=${query}&from=${from}&sortBy=publishedAt&pageSize=4&language=en&apiKey=${key}`;

  const res = await fetch(url);
  if (!res.ok) { console.warn(`NewsAPI "${topic}": ${res.status}`); return []; }

  const data = await res.json();
  return (data.articles || []).map(a => ({
    title:  a.title,
    source: a.source?.name || "Unknown",
    date:   a.publishedAt?.slice(0, 10),
  }));
}

async function fetchAllNews() {
  const results = {};
  for (let i = 0; i < ALL_TOPICS.length; i += 5) {
    const batch   = ALL_TOPICS.slice(i, i + 5);
    const settled = await Promise.allSettled(
      batch.map(async t => ({ topic: t, articles: await fetchNewsForTopic(t) }))
    );
    settled.forEach(s => {
      if (s.status === "fulfilled") results[s.value.topic] = s.value.articles;
    });
    if (i + 5 < ALL_TOPICS.length) await new Promise(r => setTimeout(r, 200));
  }
  return results;
}

function buildNewsSummary(newsMap, topics) {
  return topics.map(topic => {
    const articles = newsMap[topic] || [];
    if (!articles.length) return `### ${topic}\nNo recent news.\n`;
    return `### ${topic}\n${articles.map(a => `- [${a.source}] ${a.title} (${a.date})`).join("\n")}\n`;
  }).join("\n");
}

// ─── Claude API call ──────────────────────────────────────────────────────────

async function callClaude(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:  "POST",
    headers: {
      "x-api-key":         apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type":      "application/json",
    },
    body: JSON.stringify({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 8000,
      messages:   [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Claude API error: ${res.status} — ${await res.text()}`);

  const data    = await res.json();
  const rawText = data?.content?.[0]?.text || "";
  const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON parse failed. First 600 chars:\n", rawText.slice(0, 600));
    throw new Error(`Failed to parse Claude JSON: ${e.message}`);
  }
}

// ─── CALL 1 prompt: 27 country cards ─────────────────────────────────────────

function buildCardsPrompt(newsMap) {
  const today       = new Date().toISOString().split("T")[0];
  const newsSummary = buildNewsSummary(newsMap, ALL_TOPICS);

  return `You are a geopolitical intelligence analyst. Today is ${today}.
This is the 2026 Iran-US-Israel conflict tracker. Below is the latest news per actor.

${newsSummary}

Return ONLY a valid JSON array — no prose, no markdown, no code fences.
Each element must follow this exact schema:
{
  "name": "<exact actor name>",
  "threat": "<CRITICAL|HIGH|ELEVATED|MODERATE|LOW>",
  "summary": "<2-3 sentences on current status>",
  "military": "<1-2 sentences on military posture>",
  "economic": "<1-2 sentences on economic situation>",
  "diplomatic": "<1-2 sentences on diplomatic posture>",
  "keyWatch": "<single most critical watch item>"
}

Actor names — use EXACTLY these, in this order:
United States, Israel, Iran, UAE, Qatar, Bahrain, Saudi Arabia, Kuwait, Oman,
Russia, China, United Kingdom, France, Italy, EU Naval Coalition, Ukraine,
Turkey, Kurdish Forces, Azerbaijan, Lebanon, Iraq, Spain, Pakistan, Yemen Houthis, Sri Lanka,
Strait of Hormuz, Global Markets

Threat levels: CRITICAL=active combat/imminent escalation, HIGH=direct involvement,
ELEVATED=indirect but significant, MODERATE=monitoring, LOW=peripheral.

Keep each field SHORT — intelligence-brief style, no hedging. Return ONLY the JSON array, nothing else.`;
}

// ─── CALL 2 prompt: Intel Brief ───────────────────────────────────────────────

function buildBriefPrompt(newsMap) {
  const today       = new Date().toISOString().split("T")[0];
  const keyTopics   = ["United States", "Israel", "Iran", "UAE", "Saudi Arabia", "Qatar", "Kuwait", "Lebanon", "Strait of Hormuz", "Global Markets"];
  const newsSummary = buildNewsSummary(newsMap, keyTopics);

  return `You are a geopolitical intelligence analyst writing a classified daily brief. Today is ${today}.
This is the 2026 Iran-US-Israel conflict. Below is today's latest news.

${newsSummary}

Return ONLY a valid JSON object — no prose, no markdown, no code fences:
{
  "executiveSummary": "<3-4 sentences: overall situation summary>",
  "militaryCampaign": "<2-3 sentences: US/Israel combined strike campaign status>",
  "iranResponse": "<2-3 sentences: Iran retaliation posture and remaining capacity>",
  "gulfRegional": "<2-3 sentences: Gulf states and regional actor dynamics>",
  "energyMarkets": "<2-3 sentences: Hormuz, oil prices, shipping disruption>",
  "usPolitical": "<2-3 sentences: US political situation, War Powers, Congress>",
  "watchlist": ["<watch item 1>", "<watch item 2>", "<watch item 3>", "<watch item 4>", "<watch item 5>"],
  "breakingBanner": "<single line, max 200 chars: the 3-4 most important developments of the last 24h, separated by full stops. No day number prefix.>"
}

watchlist = JSON array of exactly 5 short strings, each a critical watch item.
breakingBanner = one compact line of the top developments, written like a wire ticker. No 'Day X' prefix.
Intelligence-brief style: factual, no hedging, no filler. Return ONLY the JSON object.`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optional: protect with CRON_SECRET env var
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const provided = req.query?.secret || req.headers?.["x-cron-secret"];
    if (provided !== cronSecret) return res.status(401).json({ error: "Unauthorized" });
  }

  console.log(`[claude-update] Starting — ${new Date().toISOString()}`);

  try {
    // 1. Fetch all news
    console.log("[claude-update] Fetching news from NewsAPI...");
    const newsMap = await fetchAllNews();
    console.log(`[claude-update] News fetched for ${Object.keys(newsMap).length} topics`);

    // 2. Call Claude for cards (Call 1)
    console.log("[claude-update] Calling Claude — cards...");
    const cards = await callClaude(buildCardsPrompt(newsMap));
    if (!Array.isArray(cards)) throw new Error("Cards response is not an array");
    console.log(`[claude-update] Cards received: ${cards.length}`);

    // 3. Call Claude for Intel Brief (Call 2)
    console.log("[claude-update] Calling Claude — Intel Brief...");
    const intelBrief = await callClaude(buildBriefPrompt(newsMap));
    console.log("[claude-update] Intel Brief received ✓");

    // 4. Assemble and cache
    const payload = {
      updatedAt:  new Date().toISOString(),
      cards,
      intelBrief,
    };

    console.log("[claude-update] Writing to Upstash Redis...");
    await redisSet(CACHE_KEY, payload, CACHE_TTL_SECONDS);
    console.log("[claude-update] All done ✓");

    return res.status(200).json({
      success:   true,
      updatedAt: payload.updatedAt,
      cardCount: cards.length,
    });

  } catch (err) {
    console.error("[claude-update] ERROR:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
