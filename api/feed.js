export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const name = req.query.name || "default";
  const apiKey = process.env.NEWS_API_KEY;

  const QUERIES = {
    default: "iran conflict war",
    "United States": "united states iran war strikes",
    "Israel": "israel iran strikes",
    "Iran": "iran war strikes",
    "Lebanon": "lebanon hezbollah israel",
    "UAE": "UAE iran missile strike",
    "Qatar": "qatar iran conflict",
    "Bahrain": "bahrain iran strike",
    "Saudi Arabia": "saudi arabia iran",
    "Kuwait": "kuwait iran conflict",
    "Oman": "oman iran",
    "Russia": "russia iran war",
    "China": "china iran conflict",
    "Turkey": "turkey iran",
    "Italy": "italy iran war crosetto",
    "Kurdish Forces": "kurdish iran pjak",
    "Azerbaijan": "azerbaijan iran nakhchivan",
    "Lebanon": "lebanon hezbollah israel",
    "Iraq": "iraq iran oil hormuz",
    "Spain": "spain iran nato",
    "Pakistan": "pakistan iran conflict",
    "Yemen / Houthis": "houthis yemen red sea",
    "Sri Lanka": "sri lanka iran ship",
    "European Naval Coalition": "europe naval cyprus iran",
    "Ukraine": "ukraine iran war",
    "Strait of Hormuz": "hormuz strait oil tanker",
    "Global Markets": "oil price iran war markets",
  };

  const q = encodeURIComponent(QUERIES[name] || QUERIES.default);
  const url = `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    if (!data.articles || data.articles.length === 0) {
      return res.status(200).json({ items: [] });
    }
    const items = data.articles.map(a => ({
      title: a.title,
      source: a.source?.name || "News",
      date: a.publishedAt ? new Date(a.publishedAt).toLocaleString() : "",
      link: a.url,
      snippet: a.description?.slice(0, 150) || "",
    }));
    res.status(200).json({ items });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
