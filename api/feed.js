const QUERIES = {
  default: "iran+war+conflict",
  "United States": "trump+pentagon+iran+strikes",
  "Israel": "israel+idf+iran",
  "Iran": "iran+irgc+tehran",
  "Lebanon": "hezbollah+lebanon",
  "UAE": "UAE+dubai+missile",
  "Qatar": "qatar+LNG+al+udeid",
  "Bahrain": "bahrain+fifth+fleet",
  "Saudi Arabia": "saudi+aramco+iran",
  "Kuwait": "kuwait+iran",
  "Oman": "oman+muscat+iran",
  "Russia": "russia+iran+war",
  "China": "china+iran+war",
  "Italy": "italy+meloni+iran",
  "Turkey": "turkey+iran",
  "Kurdish Forces": "kurdish+iran+pjak",
  "Azerbaijan": "azerbaijan+nakhchivan+iran",
  "Iraq": "iraq+iran+oil",
  "Spain": "spain+iran+nato",
  "Pakistan": "pakistan+iran",
  "Yemen / Houthis": "houthis+yemen+redsea",
  "Sri Lanka": "srilanka+iran+ship",
  "European Naval Coalition": "europe+naval+iran",
  "Ukraine": "ukraine+zelensky+iran",
  "Strait of Hormuz": "hormuz+strait+tanker",
  "Global Markets": "oil+brent+iran+markets",
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
    items.push({ title: get("title"), description: get("description"), link: get("link"), pubDate: get("pubDate") });
  }
  return items;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const name = req.query.name || "default";
  const q = QUERIES[name] || QUERIES.default;
  const url = `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const xml = await r.text();
    const items = parseRSS(xml).slice(0, 5).map(item => ({
      title: item.title?.replace(/ - .*$/, ""),
      source: item.title?.match(/ - (.+)$/)?.[1] || "News",
      date: item.pubDate ? new Date(item.pubDate).toLocaleString() : "",
      link: item.link,
      snippet: item.description?.replace(/<[^>]*>/g, "").slice(0, 150) || "",
    }));
    res.status(200).json({ items });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
