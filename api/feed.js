export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const name = req.query.name || "default";
  const apiKey = process.env.NEWS_API_KEY;

  const QUERIES = {
  default: "iran war",
  "United States": "trump pentagon centcom iran strikes",
  "Israel": "idf netanyahu israel iran",
  "Iran": "tehran irgc khamenei iran regime",
  "Lebanon": "hezbollah beirut lebanon",
  "UAE": "dubai emirates uae missile",
  "Qatar": "qatar doha lng al udeid",
  "Bahrain": "bahrain manama fifth fleet",
  "Saudi Arabia": "saudi aramco riyadh mbs",
  "Kuwait": "kuwait ali al-salem",
  "Oman": "oman muscat mediator",
  "Russia": "russia putin iran war",
  "China": "china beijing xi iran",
  "Italy": "italy meloni crosetto iran",
  "Turkey": "turkey erdogan iran",
  "Kurdish Forces": "kurdish pjak iran iraq",
  "Azerbaijan": "azerbaijan nakhchivan iran drones",
  "Iraq": "iraq oil hormuz iran",
  "Spain": "spain iran nato",
  "Pakistan": "pakistan iran conflict",
  "Yemen / Houthis": "houthis yemen red sea bab",
  "Sri Lanka": "sri lanka iran ship",
  "European Naval Coalition": "europe naval mediterranean iran",
  "Ukraine": "ukraine zelensky iran shahed",
  "Strait of Hormuz": "hormuz strait tanker closure",
  "Global Markets": "oil brent market iran war",
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
