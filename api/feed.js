// Vercel serverless function — proxy RSS feeds to avoid CORS
// Deployed at: /api/feed?name=Iran

const FEEDS = [
  "https://feeds.reuters.com/reuters/worldNews",
  "https://www.aljazeera.com/xml/rss/all.xml",
  "https://feeds.bbci.co.uk/news/world/rss.xml",
];

const KEYWORDS = {
  default: ["iran", "conflict", "strike", "missile", "drone", "hormuz"],
  "United States": ["us ", "united states", "american", "pentagon", "trump", "centcom"],
  "Israel": ["israel", "idf", "netanyahu"],
  "Iran": ["iran", "irgc", "tehran", "khamenei"],
  "Lebanon": ["lebanon", "hezbollah", "beirut"],
  "UAE": ["uae", "dubai", "abu dhabi", "emirates"],
  "Qatar": ["qatar", "doha", "al udeid"],
  "Bahrain": ["bahrain", "manama"],
  "Saudi Arabia": ["saudi", "riyadh", "aramco"],
  "Kuwait": ["kuwait"],
  "Oman": ["oman", "muscat"],
  "Russia": ["russia", "putin", "moscow"],
  "China": ["china", "beijing", "xi"],
  "Turkey": ["turkey", "erdogan", "ankara"],
  "Strait of Hormuz": ["hormuz", "strait", "tanker", "oil"],
  "Global Markets": ["oil", "brent", "market", "stock"],
};

function parseRSS(xml) {
  const items = [];
  const matches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  for (const m of matches) {
    const block = m[1];
    const get = tag => {
      const r = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return r ? (r[1] || r[2] || "").trim() : "";
    };
    items.push({
      title: get("title"),
      description: get("description"),
      link: get("link"),
      pubDate: get("pubDate"),
    });
  }
  return items;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const name = req.query.name || "default";
  const kws = KEYWORDS[name] || KEYWORDS.default;
  const allItems = [];

  for (const feed of FEEDS) {
    try {
      const r = await fetch(feed, { headers: { "User-Agent": "MandAI-Tracker/1.0" } });
      const xml = await r.text();
      allItems.push(...parseRSS(xml));
    } catch(e) { /* skip */ }
  }

  const relevant = allItems
    .filter(item => kws.some(k => `${item.title} ${item.description}`.toLowerCase().includes(k)))
    .slice(0, 5);

  const result = (relevant.length > 0 ? relevant : allItems.slice(0, 5)).map(item => ({
    title: item.title,
    source: (() => { try { return new URL(item.link).hostname.replace("www.", ""); } catch(e) { return "News"; } })(),
    date: item.pubDate ? new Date(item.pubDate).toLocaleString() : "",
    link: item.link,
    snippet: item.description?.replace(/<[^>]*>/g, "").slice(0, 150),
  }));

  res.status(200).json({ items: result });
}
