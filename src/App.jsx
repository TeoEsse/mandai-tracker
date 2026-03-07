import { useState } from "react";

const UPD = "6 March 2026, 22:00 CET";
const DAY = 7;
const TL = {
  CRITICAL: { color: "#dc2626", bg: "#fef2f2", label: "CRITICAL" },
  HIGH:     { color: "#ea580c", bg: "#fff7ed", label: "HIGH" },
  ELEVATED: { color: "#ca8a04", bg: "#fefce8", label: "ELEVATED" },
  MODERATE: { color: "#2563eb", bg: "#eff6ff", label: "MODERATE" },
  LOW:      { color: "#16a34a", bg: "#f0fdf4", label: "LOW" },
};
const cats = [
  { id: "strikes", label: "⚡ Strike Logs" },
  { id: "bell",    label: "Belligerents" },
  { id: "gulf",    label: "Gulf States" },
  { id: "pow",     label: "Great Powers" },
  { id: "reg",     label: "Regional" },
  { id: "nrg",     label: "Energy & Markets" },
];
const SL = {
  "Iran (incoming)": {
    flag: "🇮🇷", threat: "CRITICAL",
    summary: "US/Israeli strikes ON Iran. 1,332 killed (Hengaw: 2,400), 6,000+ wounded. ~2,000 targets. 30+ ships sunk. Nuclear sites hit. Konarak + Bandar Abbas naval bases devastated.",
    stats: [{l:"Killed",v:"1,332",s:"Hengaw: 2,400"},{l:"Wounded",v:"6,000+",s:""},{l:"Targets",v:"~2,000",s:"CENTCOM"},{l:"Ships",v:"30+",s:"inc. drone carrier"},{l:"Launchers",v:"300",s:"IDF"}],
    days: [
      {date:"28 Feb",title:"Khamenei Killed — Epic Fury",t:"CRITICAL",items:["Op Epic Fury (US) + Roaring Lion (Israel)","Khamenei killed","7x B-2 bombers on Fordo + Natanz","Strikes: Tehran, Isfahan, Qom, Karaj"],def:"Gang of Eight pre-briefed."},
      {date:"1 Mar",title:"Navy Decimated — 9 Ships",t:"CRITICAL",items:["9 ships destroyed and sunk","IRIS Makran (121,000t) struck","Naval HQ largely destroyed","3 US KIA, 5 seriously wounded"],def:"Satellite: Shahid Bagheri + Makran burning."},
      {date:"2 Mar",title:"Gulf of Oman Cleared — 11→0",t:"CRITICAL",items:["CENTCOM: 11 ships → ZERO in 48hrs","Air superiority established","Kilo submarine appears sunk"],def:"CENTCOM: 11→0 in 48hrs."},
      {date:"3 Mar",title:"Nuclear + Govt Deep Strikes",t:"CRITICAL",items:["SNSC HQ destroyed","Bushehr Airport struck","Assembly of Experts bombed","Rosatom suspended Bushehr"],def:"17 ships. Nuclear/govt/media campaign."},
      {date:"4 Mar",title:"IRIS Dena Torpedoed + F-35 Kill",t:"CRITICAL",items:["IRIS Dena torpedoed by US sub off Sri Lanka","First US sub torpedo attack since WWII","F-35 shot down YAK-130","CENTCOM: 20+ ships"],def:"20+ ships. IRIS Dena torpedoed."},
      {date:"5 Mar",title:"Congress: Overwhelming Wave Coming",t:"CRITICAL",items:["Graham: 'firepower will be overwhelming'","Senate rejected war powers 53-47","Hegseth: 'they are toast'"],def:"Classified briefing."},
      {date:"6 Mar",title:"⚡ 30+ Ships — Drone Carrier Burning",t:"CRITICAL",items:["Iran dead: 1,332. UNICEF: 181 children","Trump: 'UNCONDITIONAL SURRENDER'","IDF: Khamenei bunker destroyed","Cooper: missiles -90%, drones -83%"],def:"Iran dead 1,332. Khamenei bunker destroyed."},
    ],
  },
  UAE: {
    flag: "🇦🇪", threat: "CRITICAL",
    summary: "Iranian strikes ON UAE. 1,270+ projectiles. 3 killed, 78 injured. Day 7: FIRST ballistic missile landing. Interception declining.",
    stats: [{l:"Ballistic",v:"196+",s:"181 intercepted"},{l:"Drones",v:"1,072+",s:"1,001 intercepted"},{l:"Killed",v:"3",s:""},{l:"Injured",v:"78",s:""},{l:"First Impact",v:"DAY 7",s:""}],
    days: [
      {date:"28 Feb",title:"Opening Barrage",t:"CRITICAL",items:["Palm Jumeirah: Shahed near Fairmont","DXB T3: 1 killed, 4 injured","Jebel Ali Port: fire","Al Dhafra: US forces targeted"],def:"137 missiles, 209 drones."},
      {date:"1 Mar",title:"Airspace Closed",t:"CRITICAL",items:["Full airspace closure","Abu Dhabi: 1 killed (Nepali)"],def:"165 ballistic, 541 drones."},
      {date:"2-5 Mar",title:"US Consulate + Fujairah",t:"HIGH",items:["US Consulate: drone fire","Fujairah storage struck","Emirates: reduced schedule"],def:"Volume down 86% missiles."},
      {date:"6 Mar",title:"⚡ First Missile Landing",t:"CRITICAL",items:["1 ballistic missile LANDED — first confirmed impact","6 drones landed","Dubai Police: SMS warning re social media"],def:"First ballistic impact."},
    ],
  },
  Israel: {
    flag: "🇮🇱", threat: "HIGH",
    summary: "Iranian strikes ON Israel. 11 killed, 160+ injured. Beit Shemesh synagogue: 9 killed. Strike rate declining: 90→20/day. 70K reservists called.",
    stats: [{l:"Killed",v:"11",s:""},{l:"Injured",v:"160+",s:""},{l:"Strikes D1",v:"90",s:"declining"},{l:"Beit Shemesh",v:"9 dead",s:""},{l:"Reservists",v:"70K",s:""}],
    days: [
      {date:"28 Feb",title:"Opening Retaliation — Tel Aviv Hit",t:"HIGH",items:["~90 missiles/drones at Israel","1 woman killed Tel Aviv","40 buildings damaged"],def:"90 strikes Day 1."},
      {date:"1 Mar",title:"Beit Shemesh Synagogue — 9 Dead",t:"CRITICAL",items:["65 strikes on Israel","Missile hit bomb shelter below synagogue","9 killed, 49 injured","20,000 reservists called up"],def:"Deadliest single incident."},
      {date:"2-6 Mar",title:"⚡ Hybrid Attack on Tel Aviv",t:"HIGH",items:["Rate declining: 25→20 strikes/day","Cluster sub-munitions confirmed","Hybrid drone + missile attack on Tel Aviv"],def:"Hybrid tactics. Arsenal depleting."},
    ],
  },
  Lebanon: {
    flag: "🇱🇧", threat: "CRITICAL",
    summary: "Israeli strikes ON Lebanon. 120+ killed, 437+ wounded. Ground invasion underway (91st Division). 500K+ evacuated. Hezbollah BANNED by Lebanese govt.",
    stats: [{l:"Killed",v:"120+",s:""},{l:"Wounded",v:"437+",s:""},{l:"Displaced",v:"60K+",s:""},{l:"IDF Strikes",v:"250+",s:""},{l:"Ground",v:"ACTIVE",s:""}],
    days: [
      {date:"1 Mar",title:"Hezbollah Enters War",t:"CRITICAL",items:["Hezbollah fired missiles at Israel","50+ killed first 24 hours"],def:"Second front opened."},
      {date:"2-4 Mar",title:"Ground Invasion + 250 Targets",t:"CRITICAL",items:["91st Division entered southern Lebanon","Lebanese govt BANNED Hezbollah","IDF struck 250+ targets"],def:"Ground invasion begins."},
      {date:"5-6 Mar",title:"⚡ Dahiyeh Mass Evacuation",t:"CRITICAL",items:["26 Israeli strikes on Dahiyeh overnight","500K+ evacuating — mass panic","Tripoli struck for FIRST TIME"],def:"500K+ evacuation."},
    ],
  },
};
const CC = [
  {cat:"bell",name:"United States",flag:"🇺🇸",threat:"CRITICAL",role:"Co-belligerent (offensive)",summary:"~2,000 targets. 30+ ships. B-2s. First 100hrs: $3.7B. Both chambers rejected war powers. Trump wants to pick successor.",military:"B-2s. 2,000 targets. 6 KIA. CIA arming Kurds.",economic:"Brent $82.76. US gas $3.19. Dow -400.",diplomatic:"House + Senate rejected. Trump: pick successor.",keyWatch:"Munitions. Trump successor. Ground troops."},
  {cat:"bell",name:"Israel",flag:"🇮🇱",threat:"CRITICAL",role:"Co-belligerent (offensive)",summary:"2,500 strikes / 6,000+ weapons. 80% Iran air defences destroyed. Ground invasion of Lebanon underway.",military:"4,000 munitions. F-35 vs YAK-130. Lebanon ground invasion.",economic:"War economy.",diplomatic:"Mossad Kurdish concept. Elections June/July.",keyWatch:"State collapse. Kurdish. Lebanon."},
  {cat:"bell",name:"Iran",flag:"🇮🇷",threat:"CRITICAL",role:"Primary target / retaliating",summary:"1,332 dead. 181 children. Navy eliminated. Araghchi REJECTED ceasefire. Internet blocked. Hormuz closed.",military:"True Promise IV. Navy eliminated. IRGC ground functional.",economic:"Rial collapsed. Banks restricting. Hormuz closed.",diplomatic:"Ceasefire REJECTED. Interim Leadership Council. China envoy.",keyWatch:"Trump successor. Arsenal. Kurdish. China mediation."},
  {cat:"gulf",name:"UAE",flag:"🇦🇪",threat:"CRITICAL",role:"Strike target",summary:"Day 7: FIRST ballistic missile landing. 1,270+ projectiles. 3 killed, 78 injured.",military:"1 missile impact + 6 drones landed Day 7.",economic:"Etihad limited schedule. Insurance 1% hull.",diplomatic:"Dubai Police social media crackdown.",keyWatch:"First impact precedent. Declining interception rate."},
  {cat:"gulf",name:"Qatar",flag:"🇶🇦",threat:"CRITICAL",role:"Strike target",summary:"Stay indoors order. Force majeure LNG. 2 Su-24s shot down. Al Udeid struck.",military:"115+ ballistic. Al Udeid struck.",economic:"Force majeure. European gas +50%.",diplomatic:"PM rejected Iran claims.",keyWatch:"LNG restart."},
  {cat:"gulf",name:"Bahrain",flag:"🇧🇭",threat:"CRITICAL",role:"Strike target",summary:"Oil refinery hit Day 7. 5th Fleet HQ struck. 1 killed. Shia crackdown.",military:"75+123 destroyed. Refinery hit.",economic:"Gulf Air suspended.",diplomatic:"Shia citizens arrested for treason.",keyWatch:"Refinery. 5th Fleet escalation."},
  {cat:"gulf",name:"Saudi Arabia",flag:"🇸🇦",threat:"HIGH",role:"Strike target",summary:"Ras Tanura hit twice. US Embassy Riyadh hit. Anti-Iran shift.",military:"15+ drones intercepted.",economic:"Pipeline bypass active.",diplomatic:"Condemned flagrant attack.",keyWatch:"Ras Tanura. Peninsula Shield Force."},
  {cat:"gulf",name:"Kuwait",flag:"🇰🇼",threat:"HIGH",role:"Strike target",summary:"6 US KIA. US Embassy CLOSED. Friendly fire: 3 F-15Es downed.",military:"97+283 intercepted. Ali al-Salem struck.",economic:"Airport closed.",diplomatic:"US Embassy closed.",keyWatch:"Friendly fire investigation."},
  {cat:"gulf",name:"Oman",flag:"🇴🇲",threat:"ELEVATED",role:"Mediator — largely spared",summary:"Largely spared. Oil storage damaged. Pre-war breakthrough brokered but ignored.",military:"Not directly struck.",economic:"Hub role.",diplomatic:"Pre-war breakthrough ignored.",keyWatch:"Mediation resumption."},
  {cat:"pow",name:"Russia",flag:"🇷🇺",threat:"MODERATE",role:"Passive beneficiary",summary:"Putin condemned Khamenei killing but refused to name US. No military support. Major oil/gas beneficiary.",military:"No intervention. Rosatom Bushehr pullout.",economic:"Oil +10-13%. European gas +50%.",diplomatic:"Positioning as mediator. No BRICS statement.",keyWatch:"Oil leverage. Ukraine weapons diversion."},
  {cat:"pow",name:"China",flag:"🇨🇳",threat:"MODERATE",role:"Envoy dispatched",summary:"Envoy Zhai Jun dispatched. Wang Yi called 7 counterparts. 40% oil via Hormuz.",military:"No involvement.",economic:"40% oil via Hormuz. BRI corridor threatened.",diplomatic:"Envoy Zhai Jun. Wang Yi called 7 counterparts.",keyWatch:"Zhai Jun mandate. Xi-Trump meeting."},
  {cat:"pow",name:"United Kingdom",flag:"🇬🇧",threat:"ELEVATED",role:"Allied (defensive)",summary:"HMS Dragon deploying to Cyprus. Akrotiri struck by drone. Bases authorised for defensive use.",military:"Akrotiri struck. HMS Dragon deploying.",economic:"BA suspended. Energy spike.",diplomatic:"Healey in Cyprus.",keyWatch:"HMS Dragon deployment."},
  {cat:"pow",name:"France",flag:"🇫🇷",threat:"ELEVATED",role:"Bases authorised + carrier deployed",summary:"Charles de Gaulle CSG to Mediterranean. Bases authorised for US (non-offensive).",military:"CdG CSG to Med. Rafales protecting UAE bases.",economic:"TotalEnergies +3.6%.",diplomatic:"Base authorisation. France-Spain NATO fracture.",keyWatch:"CdG deployment area."},
  {cat:"pow",name:"European Naval Coalition",flag:"🇪🇺",threat:"ELEVATED",role:"Cyprus Shield — 6+ nations",summary:"UK, France, Greece, Spain, Italy, Netherlands deploying naval assets to Cyprus.",military:"UK+France+Greece+Spain+Italy+Netherlands.",economic:"Defence stocks rising.",diplomatic:"IRGC threatening Cyprus.",keyWatch:"Command structure. Germany."},
  {cat:"reg",name:"Turkey",flag:"🇹🇷",threat:"HIGH",role:"NATO / reluctant",summary:"Missile intercepted near Incirlik. Strongly condemned Azerbaijan drone strikes.",military:"Kurecik BMD radar critical.",economic:"Iraq pipeline = key Hormuz bypass.",diplomatic:"Strongly condemned Azerbaijan strikes.",keyWatch:"Azerbaijan solidarity. Kurdish supply line."},
  {cat:"reg",name:"Kurdish Forces",flag:"🏔️",threat:"HIGH",role:"Ground front — CIA/Mossad",summary:"PJAK entered Iran midnight 2 Mar. CIA arming. IRGC actively striking Kurdish positions.",military:"PJAK around Mariwan. IRGC counter-striking.",economic:"Seeking autonomous region guarantee.",diplomatic:"Trump called KDPI/Barzani/Talabani.",keyWatch:"IRGC counter-offensive. US green light."},
  {cat:"reg",name:"Lebanon",flag:"🇱🇧",threat:"CRITICAL",role:"Active second front",summary:"120+ killed. Ground invasion underway. 500K+ evacuated. Hezbollah BANNED.",military:"Ground invasion active. 250+ targets.",economic:"60,000+ displaced.",diplomatic:"Hezbollah military BANNED — first time.",keyWatch:"Ground operation scope. Civilian toll."},
  {cat:"reg",name:"Azerbaijan",flag:"🇦🇿",threat:"HIGH",role:"New front",summary:"4 Iranian drones targeted Nakhchivan. Airport terminal hit. Army on FULL COMBAT READINESS.",military:"Army on full combat readiness.",economic:"Border closed to Iranian cargo.",diplomatic:"Ambassador summoned. Iran denied.",keyWatch:"Retaliatory measures. Turkey involvement."},
  {cat:"reg",name:"Iraq",flag:"🇮🇶",threat:"HIGH",role:"Crossfire — production collapsing",summary:"Oil cut 1.5M b/d. Victoria base drone intercepted. IRGC striking Kurdish bases.",military:"Victoria base intercepted. IRGC hitting Kurds.",economic:"1.5M b/d cut. Storage nearly full.",diplomatic:"NSA: no cross-border ops.",keyWatch:"Production collapse. Storage crisis."},
  {cat:"reg",name:"Pakistan",flag:"🇵🇰",threat:"ELEVATED",role:"Spillover risk",summary:"KSE -9.57% record decline. US Consulate Karachi CLOSED. Balochistan border instability.",military:"Army deployed for protests.",economic:"KSE -9.57% record.",diplomatic:"US Consulate Karachi closed.",keyWatch:"Protests. Balochistan."},
  {cat:"reg",name:"Yemen / Houthis",flag:"🇾🇪",threat:"ELEVATED",role:"Axis proxy — not yet joined",summary:"Have NOT formally joined war. Stimson: will almost certainly join soon. Maersk rerouting via Cape.",military:"Not yet active. Retain long-range missiles.",economic:"Maersk via Cape. Red Sea risk.",diplomatic:"Internal debate.",keyWatch:"When Houthis activate. Red Sea resumption."},
  {cat:"nrg",name:"Strait of Hormuz",flag:"⚓",threat:"CRITICAL",role:"Closed",summary:"Closed. 150+ tankers anchored. Iraq cut 1.5M b/d. QatarEnergy force majeure. Brent $85.12.",military:"Cheap drone closure. 150+ tankers anchored.",economic:"Brent $85.12. TTF peaked EUR 60+. Iraq -1.5M b/d.",diplomatic:"Trump: escorts, no timeline.",keyWatch:"Iraq storage crisis. Dual chokepoints."},
  {cat:"nrg",name:"Global Markets",flag:"📊",threat:"CRITICAL",role:"Crisis deepening",summary:"Brent $85.12. Dow -1,000 (2.2%). Kospi -11%. KSE -9.57%. First 100hrs: $3.7B.",military:"N/A",economic:"Brent $85.12. Dow -1,000. Kospi -11%. $3.7B first 100hrs.",diplomatic:"N/A",keyWatch:"$100 oil barrier. Munitions budget. EM currency crises."},
];

const SEARCH_TERMS = {
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
  "Strait of Hormuz": "hormuz strait oil tanker",
  "Global Markets": "oil price war iran markets",
};

// ✅ VERCEL PROXY — calls /api/feed which handles CORS server-side
async function fetchLiveUpdate(name) {
  const q = encodeURIComponent(SEARCH_TERMS[name] || SEARCH_TERMS.default);
  const res = await fetch(`/api/feed?q=${q}`);
  if (!res.ok) throw new Error(`Feed error ${res.status}`);
  const data = await res.json();
  if (!data.items || data.items.length === 0) throw new Error("No articles found");
  return data;
}

function Sec({ title, content, icon }) {
  if (!content || content === "N/A") return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b", marginBottom: 5 }}>{icon} {title}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.65, color: "#1e293b" }}>{content}</div>
    </div>
  );
}

function CopyButton({ c }) {
  const [copied, setCopied] = useState(false);
  function doCopy() {
    const parts = [
      `${c.flag} ${c.name} — ${c.threat}`,
      `Role: ${c.role}`,
      `SUMMARY\n${c.summary}`,
      c.military && c.military !== "N/A" ? `MILITARY\n${c.military}` : null,
      c.economic && c.economic !== "N/A" ? `ECONOMIC\n${c.economic}` : null,
      c.diplomatic && c.diplomatic !== "N/A" ? `DIPLOMATIC\n${c.diplomatic}` : null,
      `KEY WATCH\n${c.keyWatch}`,
      `— Iran Conflict Tracker · MandAI · ${new Date().toLocaleDateString()}`,
    ].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(parts).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={doCopy}
      style={{ marginTop: 8, fontSize: 12, padding: "6px 14px", background: copied ? "#f0fdf4" : "#f1f5f9", color: copied ? "#16a34a" : "#475569", border: `1px solid ${copied ? "#86efac" : "#e2e8f0"}`, borderRadius: 6, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}
    >
      {copied ? "✅ Copied!" : "📋 Copy briefing"}
    </button>
  );
}

function LiveBox({ name }) {
  const [state, setState] = useState("idle");
  const [liveData, setLiveData] = useState(null);
  const [err, setErr] = useState(null);
  async function doFetch() {
    setState("loading");
    setErr(null);
    try {
      const d = await fetchLiveUpdate(name);
      setLiveData(d);
      setState("done");
    } catch(e) {
      setErr(e.message);
      setState("error");
    }
  }
  return (
    <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: state === "done" ? 10 : 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#0369a1", letterSpacing: "0.08em" }}>🌐 LIVE NEWS FEED</span>
        {state === "idle" && (
          <button onClick={doFetch} style={{ fontSize: 12, padding: "5px 12px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
            🔄 Fetch latest news
          </button>
        )}
        {state === "loading" && (
          <span style={{ fontSize: 12, color: "#0369a1", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid #bae6fd", borderTop: "2px solid #0369a1", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
            Fetching RSS feeds...
          </span>
        )}
        {(state === "done" || state === "error") && (
          <button onClick={doFetch} style={{ fontSize: 11, padding: "4px 10px", background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd", borderRadius: 6, cursor: "pointer" }}>
            🔄 Refresh
          </button>
        )}
      </div>
      {state === "error" && <div style={{ fontSize: 12, color: "#dc2626", marginTop: 6 }}>⚠️ {err} — please retry</div>}
      {state === "done" && liveData && (
        <div>
          <div style={{ fontSize: 10, color: "#64748b", marginBottom: 8 }}>Reuters · Al Jazeera · BBC · updated {new Date().toLocaleTimeString()}</div>
          {liveData.items.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noreferrer" style={{ display: "block", textDecoration: "none", padding: "8px 0", borderBottom: i < liveData.items.length - 1 ? "1px solid #e0f2fe" : "none" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0c4a6e", lineHeight: 1.4, marginBottom: 3 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4, marginBottom: 3 }}>{item.snippet}</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>{item.source} · {item.date}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function SD({ d, isE, onT }) {
  const t = TL[d.t];
  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", marginBottom: 8, overflow: "hidden" }}>
      <div onClick={onT} style={{ padding: "12px 16px", display: "flex", alignItems: "center", cursor: "pointer", gap: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", fontFamily: "monospace", minWidth: 48 }}>{d.date}</div>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{d.title}</div>
        <span style={{ fontSize: 9, fontWeight: 800, color: t.color, background: t.bg, padding: "3px 8px", borderRadius: 4, fontFamily: "monospace" }}>{t.label}</span>
        <span style={{ color: "#94a3b8", fontSize: 16, transform: isE ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
      </div>
      {isE && (
        <div style={{ padding: "0 16px 14px", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 10, color: "#64748b", padding: "8px 0 6px", fontFamily: "monospace" }}>🛡️ {d.def}</div>
          {d.items.map((it, i) => (
            <div key={i} style={{ fontSize: 12.5, lineHeight: 1.6, color: "#1e293b", padding: "4px 0 4px 12px", borderLeft: "2px solid #e2e8f0" }}>{it}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function SB({ stats }) {
  return (
    <div style={{ background: "#1e293b", borderRadius: 10, padding: "14px 16px", marginBottom: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 10 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>{s.v}</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.l}</div>
          {s.s && <div style={{ fontSize: 9, color: "#64748b", marginTop: 1 }}>{s.s}</div>}
        </div>
      ))}
    </div>
  );
}

function CCard({ c, isE, onT }) {
  const t = TL[c.threat];
  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", marginBottom: 10, overflow: "hidden" }}>
      <div onClick={onT} style={{ padding: "14px 18px", display: "flex", alignItems: "center", cursor: "pointer", gap: 12 }}>
        <span style={{ fontSize: 22 }}>{c.flag}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{c.name}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>{c.role}</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 800, color: t.color, background: t.bg, padding: "4px 10px", borderRadius: 4, fontFamily: "monospace" }}>{t.label}</span>
        <span style={{ color: "#94a3b8", fontSize: 18, transform: isE ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
      </div>
      {isE && (
        <div style={{ padding: "4px 18px 18px", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 13.5, lineHeight: 1.65, color: "#334155", marginBottom: 16, fontWeight: 500 }}>{c.summary}</div>
          <LiveBox name={c.name} />
          <Sec title="Military" content={c.military} icon="⚔️" />
          <Sec title="Economic" content={c.economic} icon="📈" />
          <Sec title="Diplomatic" content={c.diplomatic} icon="🏛️" />
          <Sec title="Watch" content={c.keyWatch} icon="🔍" />
          <CopyButton c={c} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("strikes");
  const [exp, setExp] = useState({});
  const [sc, setSc] = useState("Iran (incoming)");
  const tog = k => setExp(p => ({ ...p, [k]: !p[k] }));
  const sl = SL[sc];
  const filtered = CC.filter(c => c.cat === tab);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      <div style={{ background: "#0f172a", color: "#fff", padding: "20px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em" }}>Mand<span style={{ color: "#818cf8" }}>AI</span></span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", fontFamily: "monospace", letterSpacing: "0.1em" }}>ACTIVE CONFLICT — DAY {DAY}</span>
            </div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>Iran Conflict Geopolitical Tracker</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>Strike logs · Geopolitical · Military · Economic · Diplomatic</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, fontFamily: "monospace" }}>Base data: {UPD} · Live updates: on demand via RSS proxy</div>
        </div>
      </div>

      <div style={{ background: "#7f1d1d", color: "#fecaca", padding: "12px 20px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", fontSize: 12.5, lineHeight: 1.7 }}>
          <strong style={{ color: "#fbbf24" }}>⚡ DAY {DAY}:</strong> House rejected war powers 212-219. First UAE missile landing. Bahrain refinery hit. Iran: 1,332+ dead. Araghchi rejected ceasefire. Kospi -11%. Hormuz closed.{" "}
          <strong style={{ color: "#fbbf24" }}>→ Open a card and click "Fetch latest news" for live updates.</strong>
        </div>
      </div>

      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 20px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", overflowX: "auto" }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setTab(c.id)} style={{ padding: "11px 14px", fontSize: 12, fontWeight: tab === c.id ? 700 : 500, color: tab === c.id ? "#0f172a" : "#64748b", background: "transparent", border: "none", borderBottom: tab === c.id ? "2px solid #0f172a" : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap" }}>
              {c.label}
              <span style={{ marginLeft: 5, fontSize: 9, background: tab === c.id ? "#0f172a" : "#e2e8f0", color: tab === c.id ? "#fff" : "#64748b", padding: "2px 5px", borderRadius: 6, fontFamily: "monospace" }}>
                {c.id === "strikes" ? Object.keys(SL).length : CC.filter(x => x.cat === c.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "14px 20px 40px" }}>
        {tab === "strikes" ? (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {Object.entries(SL).map(([k, v]) => (
                <button key={k} onClick={() => setSc(k)} style={{ padding: "8px 14px", fontSize: 12, fontWeight: sc === k ? 700 : 500, background: sc === k ? "#0f172a" : "#fff", color: sc === k ? "#fff" : "#334155", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{v.flag}</span>
                  <span>{k}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: TL[v.threat].color, background: TL[v.threat].bg, padding: "2px 5px", borderRadius: 3, fontFamily: "monospace" }}>{TL[v.threat].label}</span>
                </button>
              ))}
            </div>
            <div style={{ fontSize: 13, color: "#475569", marginBottom: 12, lineHeight: 1.6 }}>{sl.summary}</div>
            <SB stats={sl.stats} />
            {sl.days.map(d => (
              <SD key={`${sc}-${d.date}`} d={d} isE={!!exp[`${sc}-${d.date}`]} onT={() => tog(`${sc}-${d.date}`)} />
            ))}
          </>
        ) : (
          filtered.map(c => <CCard key={c.name} c={c} isE={!!exp[c.name]} onT={() => tog(c.name)} />)
        )}
      </div>

      <div style={{ background: "#0f172a", padding: "18px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>MandAI · INTELLIGENCE BRIEF · BASE DATA: 6 MAR 2026 · LIVE UPDATE: RSS PROXY ON DEMAND</div>
      </div>
    </div>
  );
}
