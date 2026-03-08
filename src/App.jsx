import { useState, useEffect } from "react";

// ─── Conflict day counter ─────────────────────────────────────────────────────
const CONFLICT_START = new Date("2026-02-28T00:00:00Z");
const DAY = Math.max(1, Math.floor((Date.now() - CONFLICT_START.getTime()) / 86400000) + 1);

// ─── Threat level styles ──────────────────────────────────────────────────────
const TL = {
  CRITICAL:  { color: "#dc2626", bg: "#fef2f2",  label: "CRITICAL"  },
  HIGH:      { color: "#ea580c", bg: "#fff7ed",  label: "HIGH"      },
  ELEVATED:  { color: "#ca8a04", bg: "#fefce8",  label: "ELEVATED"  },
  MODERATE:  { color: "#2563eb", bg: "#eff6ff",  label: "MODERATE"  },
  LOW:       { color: "#16a34a", bg: "#f0fdf4",  label: "LOW"       },
};

// ─── Tab definitions ──────────────────────────────────────────────────────────
const cats = [
  { id: "strikes", label: "📋 Intel Brief"    },
  { id: "bell",    label: "Belligerents"      },
  { id: "gulf",    label: "Gulf States"       },
  { id: "pow",     label: "Great Powers"      },
  { id: "reg",     label: "Regional"          },
  { id: "nrg",     label: "Energy & Markets"  },
];

// ─── Hardcoded country cards (fallback) ───────────────────────────────────────
const CC_DEFAULT = [
  { cat:"bell",name:"United States",flag:"🇺🇸",threat:"CRITICAL",
    summary:"Day 9. 3,000+ targets struck. Trump: 'go in and clean out everything' — regime change only end state. War powers rejected both chambers. USS George H.W. Bush CSG ready for deployment — 3rd CSG imminent. 6 US KIA confirmed (Dover transfer 7 Mar). Hegseth: 'America winning decisively, more forces arriving.' Supplemental expected.",
    military:"B-2s + B-52s. 2,000 targets. 30+ ships. 300 launchers. 6 KIA. CIA arming Kurds. Lockheed/RTX Friday.",
    economic:"Brent $82.76. US gas $3.19 (4yr spike). Dow -1,000. Goldman CEO: 'weeks to digest'.",
    diplomatic:"House 212-219 + Senate 53-47 rejected. Trump: pick successor. China envoy. France bases yes, Spain no.",
    keyWatch:"Munitions. Drone gap. Trump successor. China envoy. Ground troops (Wicker: not ruled out)." },
  { cat:"bell",name:"Israel",flag:"🇮🇱",threat:"CRITICAL",
    summary:"2,500 strikes / 6,000+ weapons. 80% Iran air defences destroyed. Moving to 'next phase'. F-35 downed YAK-130. 300 launchers destroyed. Ground invasion of Lebanon underway. 26 Dahiyeh strikes overnight. Smotrich: 'Dahiyeh will look like Khan Younis'. Elections June/July.",
    military:"4,000 munitions. F-35 vs YAK-130. Khamenei bunker destroyed. Lebanon ground invasion active.",
    economic:"War economy. Shekel under pressure.",
    diplomatic:"Mossad Kurdish concept. 'State collapse' scenario. Elections June/July.",
    keyWatch:"State collapse. Kurdish front. Lebanon scope. IAEA damage." },
  { cat:"bell",name:"Iran",flag:"🇮🇷",threat:"CRITICAL",
    summary:"1,332 dead (Hengaw: 2,400). 181 children (UNICEF). 6,000+ wounded. Navy eliminated. Araghchi REJECTED ceasefire. Larijani: 'will not negotiate'. Internet blocked. Hormuz closed. IRGC striking Kurdish forces.",
    military:"True Promise IV. Navy eliminated. IRGC ground + asymmetric functional. Strikes on Gulf states continuing.",
    economic:"Rial collapsed. Banks restricting. Internet blocked. Hormuz closed.",
    diplomatic:"Ceasefire REJECTED. Interim Leadership Council (Larijani). China envoy Zhai Jun dispatched.",
    keyWatch:"Trump successor intervention. Arsenal depletion. Kurdish front. China mediation." },
  { cat:"gulf",name:"UAE",flag:"🇦🇪",threat:"CRITICAL",
    summary:"Day 7: FIRST ballistic missile landing on territory. 1,270+ projectiles. 3 killed, 78 injured. Dubai Police mass SMS warnings re social media. Etihad resuming limited schedule.",
    military:"1 missile impact + 6 drones landed Day 7. ~92% interception rate declining. DXB T3, Jebel Ali, Palm Jumeirah, Al Dhafra, Fujairah all struck.",
    economic:"Etihad limited schedule from 6 Mar. Emirates reduced. Insurance 1% hull. Central Bank stable.",
    diplomatic:"Dubai Police social media crackdown. 20,000 Americans left ME. GCC may act via Peninsula Shield Force.",
    keyWatch:"First impact precedent. Declining interception rate. Fresh Iranian retaliation risk." },
  { cat:"gulf",name:"Qatar",flag:"🇶🇦",threat:"CRITICAL",
    summary:"Stay indoors order. Force majeure LNG. 2 Su-24s shot down. Al Udeid struck. 10 IRGC spies arrested.",
    military:"115+ ballistic. Al Udeid struck. 2 Su-24s downed.",
    economic:"Force majeure Ras Laffan + Mesaieed. European gas +50%.",
    diplomatic:"PM 'categorically rejected' Iran claims. Qatar Airways limited relief flights.",
    keyWatch:"LNG restart. Stay indoors duration." },
  { cat:"gulf",name:"Bahrain",flag:"🇧🇭",threat:"CRITICAL",
    summary:"Oil refinery hit Day 7. 5th Fleet HQ struck. 1 killed. Shia crackdown. AWS offline.",
    military:"75+ missiles + 123+ drones. Refinery hit. Sheikh Isa Air Base attacked.",
    economic:"Gulf Air suspended. Refinery fire extinguished — operational.",
    diplomatic:"Shia citizens arrested for treason. Social media posts prosecuted.",
    keyWatch:"Refinery. 5th Fleet escalation. Shia unrest." },
  { cat:"gulf",name:"Saudi Arabia",flag:"🇸🇦",threat:"HIGH",
    summary:"Ras Tanura (550K b/d) hit twice. US Embassy Riyadh hit. Pipeline bypass active. Anti-Iran shift.",
    military:"15+ drones intercepted. Ras Tanura struck twice. US Embassy: 2 drones.",
    economic:"Pipeline bypass active. Aramco reviewing routes.",
    diplomatic:"Condemned 'flagrant' attack. MBS emergency cabinet. Rubio call.",
    keyWatch:"Ras Tanura. Peninsula Shield Force. Geographic spread." },
  { cat:"gulf",name:"Kuwait",flag:"🇰🇼",threat:"HIGH",
    summary:"6 US KIA at Port Shuaiba. Ali al-Salem struck. Friendly fire: 3 F-15Es downed. US Embassy CLOSED.",
    military:"97 ballistic + 283 drones intercepted. Ali al-Salem struck. 3 F-15Es friendly fire.",
    economic:"Airport closed. Port Shuaiba disrupted.",
    diplomatic:"US Embassy closed. Friendly fire investigation ongoing.",
    keyWatch:"Friendly fire investigation. Embassy closure duration." },
  { cat:"gulf",name:"Oman",flag:"🇴🇲",threat:"ELEVATED",
    summary:"Largely spared. Oil storage damaged. Mediator — pre-war breakthrough brokered but ignored. Exemption eroding.",
    military:"Not directly struck. 1 storage tank damaged. Maritime strikes off coast.",
    economic:"Hub role. Oil tanker attacked off coast.",
    diplomatic:"Pre-war breakthrough (27 Feb) ignored. Muscat as mediation hub.",
    keyWatch:"Mediation resumption. Whether exemption holds." },
  { cat:"pow",name:"Russia",flag:"🇷🇺",threat:"MODERATE",
    summary:"Putin condemned Khamenei killing as 'cynical murder' but refused to name US. No military support. Major oil/gas beneficiary. Rosatom pulled from Bushehr. No BRICS statement despite Iran membership.",
    military:"No intervention. Shahed now mass-produced in Russia. Rosatom Bushehr pullout.",
    economic:"MAJOR BENEFICIARY. Oil +10-13%. European gas +50%. OPEC+ +206K b/d.",
    diplomatic:"Positioning as mediator (ignored). No BRICS statement. Ukraine FM: 'Moscow will always betray'.",
    keyWatch:"Oil/sanctions leverage. Ukraine Patriot diversion. Peace talks delay. Nuclear saber-rattling on state TV." },
  { cat:"pow",name:"China",flag:"🇨🇳",threat:"MODERATE",
    summary:"Most concrete action of non-belligerents: envoy Zhai Jun dispatched. Wang Yi called 7 counterparts. 40% oil via Hormuz. PLAN skipped pre-war exercises. Analyst (NUS): 'not impartial — far more aligned with Iran'.",
    military:"No involvement. PLAN skipped exercises. CM-302 anti-ship deal likely shelved.",
    economic:"40% oil via Hormuz. 80% of Iran crude exports. 7.6M tons LNG inventory buffer. Tourists stranded.",
    diplomatic:"Envoy Zhai Jun dispatched. Wang Yi called 7 counterparts. Xi-Trump meeting still expected.",
    keyWatch:"Zhai Jun mandate. Xi-Trump meeting. Energy diversification urgency. BRI corridor survival." },
  { cat:"pow",name:"United Kingdom",flag:"🇬🇧",threat:"ELEVATED",
    summary:"Bases authorised for US defensive use. HMS Dragon (Type 45) deploying to Cyprus — delayed by ammo loading. Akrotiri struck by Shahed drone (runway). Defence Secretary Healey in Cyprus.",
    military:"Akrotiri struck. HMS Dragon deploying. Counter-drone helicopters sent. Families evacuated from Akrotiri.",
    economic:"BA suspended. 30% Europe jet fuel via Hormuz. Energy spike.",
    diplomatic:"E3 backed 'proportionate defensive measures'. Starmer contradicted by Zelenskyy on specialist deployment.",
    keyWatch:"HMS Dragon timing. Akrotiri further strikes. Defensive-to-offensive creep." },
  { cat:"pow",name:"France",flag:"🇫🇷",threat:"ELEVATED",
    summary:"Bases authorised for US (non-offensive). Charles de Gaulle CSG to Mediterranean. Camp de la Paix (Abu Dhabi) struck — Rafales deployed. Macron: conflict could 'spill over Europe's borders'. France-Spain divergence = NATO fracture.",
    military:"Charles de Gaulle CSG to Med. Rafales at UAE. Frigate Languedoc to Cyprus. Bases authorised (non-offensive).",
    economic:"TotalEnergies +3.6%. Nuclear baseload partially insulates from gas spike.",
    diplomatic:"France yes, Spain no on bases = NATO fracture. Macron TV address. Spoke with Meloni.",
    keyWatch:"Base usage scope. CdG deployment area. France-Spain-Italy coordination." },
  { cat:"pow",name:"Italy",flag:"🇮🇹",threat:"ELEVATED",
    summary:"Meloni convened emergency meeting. Sending Samp-T air defence systems to Gulf states. Naval deployment to Cyprus planned — Caio Duilio (350km radar) or Andrea Doria being evaluated. Crosetto told parliament: US-Israel attack 'violated international law' — while simultaneously deploying AD systems. Italian soldiers at Ali al-Salem (Kuwait) in strike zone.",
    military:"Samp-T AD systems to Gulf. Naval deployment to Cyprus TBD. Caio Duilio or Andrea Doria being evaluated. Soldiers at Ali al-Salem (Kuwait).",
    economic:"Concerned about Hormuz disruption. Italian energy costs rising.",
    diplomatic:"Crosetto: attack 'violated international law'. Meloni: 'Italy is NOT at war'. Spoke with Macron + Greek PM. Coordinating Red Sea shipping with Greece.",
    keyWatch:"Which destroyer deploys. Samp-T destination. Italian troops at Ali al-Salem as potential targets." },
  { cat:"pow",name:"European Naval Coalition",flag:"🇪🇺",threat:"ELEVATED",
    summary:"6+ nation naval deployment to protect Cyprus. UK (HMS Dragon), France (CdG + Languedoc), Greece (Kimon + Psara + F-16s), Spain (Cristóbal Colón), Italy (Samp-T + destroyer TBD), Netherlands (considering). Most significant European military coordination since Ukraine.",
    military:"UK+France+Greece+Spain+Italy+Netherlands. Not under single command.",
    economic:"Defence stocks rising.",
    diplomatic:"Spain paradox: refused US bases but sending frigate. Germany hesitant. IRGC directly threatening Cyprus.",
    keyWatch:"Command structure. IRGC Cyprus escalation. Whether becomes permanent Mediterranean force. Germany." },
  { cat:"pow",name:"Ukraine",flag:"🇺🇦",threat:"MODERATE",
    summary:"Zelenskyy condemned Iran as 'Putin's accomplice'. Offered drone defence expertise to Gulf. BUT: Patriot missiles redirecting from Ukraine to Gulf (Bloomberg). Lt Gen Romanenko: 'serious deficit will only get worse'.",
    military:"Offered drone expertise. Patriot supply threatened — missiles redirecting to Gulf.",
    economic:"Russian oil windfall funds Ukraine war.",
    diplomatic:"Zelenskyy spoke with MBZ. Ukraine peace talks disrupted by Iran crisis.",
    keyWatch:"Patriot diversion. Peace talks delay. Drone expertise deployment." },
  { cat:"reg",name:"Turkey",flag:"🇹🇷",threat:"HIGH",
    summary:"Missile intercepted near Incirlik (Day 5). 'Strongly condemned' Azerbaijan drone strikes. Deeply opposed to Kurdish autonomy precedent. Denied AWACS use for Iran ops.",
    military:"Kurecik BMD radar critical. NOT opening airspace for anti-Iran ops. Army along Iraqi/Syrian borders.",
    economic:"Iraq oil pipeline via Turkey = key Hormuz bypass. Lira under pressure.",
    diplomatic:"Full solidarity with Azerbaijan. FM called Araghchi. Mourned Khamenei (only NATO leader).",
    keyWatch:"Azerbaijan solidarity. Kurdish supply line. Iraq pipeline leverage." },
  { cat:"reg",name:"Kurdish Forces",flag:"🏔️",threat:"HIGH",
    summary:"PJAK entered Iran midnight 2 Mar. Thousands near Mariwan. CIA arming (CNN). Mossad originated concept. IRGC actively striking Kurdish positions.",
    military:"PJAK around Mariwan. PAK standby Sulaymaniyah. IRGC counter-striking. IDF clearing border posts.",
    economic:"Seeking autonomous region guarantee.",
    diplomatic:"Trump called KDPI/Barzani/Talabani. Iraq NSA: no cross-border ops. Turkey deeply opposed.",
    keyWatch:"IRGC counter-offensive. US green light. Turkey blocking supply lines." },
  { cat:"reg",name:"Azerbaijan",flag:"🇦🇿",threat:"HIGH",
    summary:"4 Iranian drones struck Nakhchivan (Day 6). Airport hit. Army on FULL COMBAT READINESS. Aliyev: 'act of terror'. Connected to US-brokered 'Trump Route' corridor.",
    military:"Army on full combat readiness. Southern airspace closed 12hrs.",
    economic:"BTC/TANAP/TAP pipeline = key Hormuz alternative. Border closed to Iranian cargo.",
    diplomatic:"Aliyev: 'act of terror'. Iran denied. Turkey full solidarity. Baku + Washington 'in close contact'.",
    keyWatch:"Retaliatory measures. Turkey involvement. Pipeline protection. Caucasus front risk." },
  { cat:"reg",name:"Lebanon",flag:"🇱🇧",threat:"CRITICAL",
    summary:"120+ killed. Ground invasion underway. 500K+ evacuated. Hezbollah BANNED. See Strike Log.",
    military:"Ground invasion active (91st Division). 250+ targets. Expanding geography.",
    economic:"60,000+ displaced. WFP in 44 shelters.",
    diplomatic:"Hezbollah military BANNED. Syrian border sealed. Smotrich: 'Khan Younis' threat.",
    keyWatch:"Ground operation scope. Civilian toll. Hezbollah arsenal." },
  { cat:"reg",name:"Iraq",flag:"🇮🇶",threat:"HIGH",
    summary:"Oil production CUT 1.5M b/d — could double. Victoria base drone intercepted. IRGC striking Kurdish bases.",
    military:"Victoria base intercepted. IRGC hitting Kurds. US/Israel struck Jurf al-Nasr.",
    economic:"CATASTROPHIC: 1.5M b/d cut. Storage nearly full. Khor al-Zubair spill.",
    diplomatic:"NSA: no cross-border ops. US pressing Kurdish cooperation.",
    keyWatch:"Production collapse. Storage crisis. Kurdish staging." },
  { cat:"reg",name:"Spain",flag:"🇪🇸",threat:"MODERATE",
    summary:"PARADOX: Refused US base access but sending frigate Cristóbal Colón to Cyprus. PM Sánchez: 'No to war'. France-Spain divergence = NATO fracture. Iran commended Spain publicly.",
    military:"2 US bases denied. Cristóbal Colón (most advanced Spanish frigate) to Cyprus.",
    economic:"Trump trade threat. Spanish public opinion strongly anti-war.",
    diplomatic:"Sánchez called Oman + Qatar. Iran commended Spain — complicates unity.",
    keyWatch:"Trump trade retaliation. NATO cohesion." },
  { cat:"reg",name:"Pakistan",flag:"🇵🇰",threat:"ELEVATED",
    summary:"KSE -9.57% record decline. US Consulate Karachi CLOSED. Balochistan instability. Army deployed for protests.",
    military:"Army deployed — protests Gilgit + Skardu. Two-front fear.",
    economic:"KSE -9.57% — largest ever. Oil import dependent. Currency under pressure.",
    diplomatic:"US Consulate closed. Pakistan + Afghanistan joint concern.",
    keyWatch:"Friday protests. Balochistan. Two-front vulnerability." },
  { cat:"reg",name:"Yemen / Houthis",flag:"🇾🇪",threat:"ELEVATED",
    summary:"Have NOT formally joined war. Stimson: 'almost certainly will join'. Maersk rerouting via Cape. Leadership in hiding.",
    military:"Not yet active. Toufan (1,800km), cruise missiles, Samad UAVs.",
    economic:"Maersk via Cape again. Bab-el-Mandeb = second chokepoint.",
    diplomatic:"Internal debate. May 2025 Oman truce suspended commercial attacks.",
    keyWatch:"When (not if) Houthis activate. Dual chokepoint crisis." },
  { cat:"reg",name:"Sri Lanka",flag:"🇱🇰",threat:"MODERATE",
    summary:"IRIS Dena rescued (32 survivors, 87 bodies). IRIS Bushehr INTERNED (208 crew) — first warship internment since WWII. Strict neutrality.",
    military:"Sri Lanka Navy rescued survivors. Interned IRIS Bushehr. No military involvement.",
    economic:"Tourism/fishing disruption.",
    diplomatic:"Strict neutrality. Internment legally significant (Hague Convention XIII).",
    keyWatch:"More Iranian vessels. Legal status of crew." },
  { cat:"nrg",name:"Strait of Hormuz",flag:"⚓",threat:"CRITICAL",
    summary:"Closed. 150+ tankers anchored. Iraq cut 1.5M b/d — could double. QatarEnergy force majeure. Saudi rerouting. Bahrain refinery hit. Brent $85.12. Houthis = dual chokepoint risk.",
    military:"Cheap drone closure. 150+ tankers anchored. Houthis not yet active = dual chokepoint pending.",
    economic:"Brent $85.12. TTF peaked €60+. Iraq -1.5M b/d. QatarEnergy FM. China refineries shutting.",
    diplomatic:"Trump: escorts, no timeline. WH: Hormuz timeline 'calculated actively'.",
    keyWatch:"Iraq storage crisis. Escort execution. Mining risk. Dual chokepoints. $100 barrier." },
  { cat:"nrg",name:"Global Markets",flag:"📊",threat:"CRITICAL",
    summary:"Brent $85.12. Dow -1,000 (2.2%). Kospi -11% (circuit breaker). KSE -9.57% record. Nikkei -4.3%. US gas largest spike in 4yrs. First 100hrs: $3.7B (CSIS). Supplemental expected.",
    military:"N/A",
    economic:"Brent $85.12. Dow -1,000. Kospi -11%. KSE -9.57%. Nikkei -4.3%. $3.7B first 100hrs. Airlines -6%. Defence surging.",
    diplomatic:"N/A",
    keyWatch:"$100 oil barrier. Munitions supplemental. Central banks paralysed. EM currency crises." },
];

// ─── Hardcoded Intel Brief (fallback) ─────────────────────────────────────────
const INTEL_BRIEF_DEFAULT = {
  updated: "8 March 2026",
  day: "Day 9",
  classification: "UNCLASSIFIED // OPEN SOURCE",
  source: "CTP-ISW · GlobalSecurity · ACLED · CENTCOM · IDF · open sources",
  sections: [
    {
      id: "executive",
      title: "🔴 EXECUTIVE SUMMARY",
      content: `Operation Epic Fury (US) and Operation Roaring Lion (Israel) entered Day 9. The combined force expanded strikes on Day 8 to include Iranian oil production and storage facilities for the first time — a significant escalation in campaign scope. Iran's retaliatory capacity has degraded by approximately 90% since Day 1 (CENTCOM, 5 Mar). Approximately 120 missile launchers remain operational (IDF, 7 Mar).

The regime faces an acute political crisis: Supreme Leader Khamenei was killed on Day 1 alongside the SNSC Secretary and multiple IRGC chiefs. A Leadership Council has assumed his duties. President Pezeshkian publicly apologised to Gulf states on 7 March — hardline IRGC commanders condemned the statement as weak and unprofessional, exposing deep factional divisions over succession and ceasefire posture.

The Strait of Hormuz remains closed. 150+ tankers anchored. Global markets under severe stress.`
    },
    {
      id: "military_campaign",
      title: "⚔️ COMBINED FORCE — AIR CAMPAIGN",
      content: `CUMULATIVE STRIKES: CENTCOM reports 3,000+ targets struck since 28 February. IDF struck 300+ targets in Iran in the 48 hours ending 7 March. 2,500 total IDF strikes, 6,000+ weapons expended. 80% of Iranian air defences assessed destroyed.

OIL INFRASTRUCTURE (Day 8 — first time): IDF struck Tondgouyan Oil Refinery (Tehran Province, one of Iran's largest) and Shahran Oil Refinery (Tehran City, capacity for 3 days of Tehran fuel across 11 storage tanks). Additional oil storage facilities struck in Karaj (Alborz Province) and Tehran City — first recorded strikes on these sites.

NAVAL: 30+ vessels sunk including drone carrier IRIS Shahid Bagheri, forward base IRIS Makran (121,000 tons), Kilo-class submarine, IRIS Dena (torpedoed off Sri Lanka). Konarak and Bandar Abbas naval bases devastated.

NUCLEAR: B-2 Spirit bombers dropped MOPs on Fordo, Natanz, and Isfahan nuclear sites.`
    },
    {
      id: "iran_response",
      title: "🇮🇷 IRAN — RETALIATORY POSTURE",
      content: `LAUNCH CAPACITY: ~120 missile launchers remaining (IDF estimate, 7 Mar). Ballistic missile attacks down ~90% since Day 1. Drone attacks down ~83%.

CASUALTIES: 1,332 killed (Iranian Red Crescent). Hengaw NGO: 2,400 including 310 civilians. UNICEF: at least 181 children killed. 6,000+ wounded.

REGIME CRISIS: Khamenei killed Day 1. Assembly of Experts convened under IRGC pressure to select Mojtaba Khamenei as successor. IRGC control over succession process near-total.

BACK-CHANNEL: CNN reported Iranian intelligence sent back-channel to US signalling possible openness to talks. FM Araghchi simultaneously stated "no reason to negotiate." Factional split now public.`
    },
    {
      id: "gulf_regional",
      title: "🌍 GULF STATES & REGIONAL",
      content: `UAE: 1,270+ projectiles total — Day 7 saw first ballistic missile land on UAE territory. DXB T3, Jebel Ali, Palm Jumeirah, Al Dhafra, Fujairah all struck.

BAHRAIN: Oil refinery hit Day 7. 5th Fleet HQ struck. 75+ missiles + 123+ drones. AWS offline.

SAUDI ARABIA: Ras Tanura (550,000 b/d) hit twice — Saudi Arabia's largest domestic oil refinery forced to close. US Embassy Riyadh struck.

QATAR: Stay indoors order. Force majeure declared. 2 Iranian Su-24 bombers shot down. 10 IRGC spies arrested.

AZERBAIJAN: 4 Iranian drones struck Nakhchivan exclave — first Iranian attack on Azerbaijan. Army on full combat readiness.

LEBANON: 250+ IDF strikes. 120+ killed. Ground invasion underway (91st Division). Hezbollah banned.`
    },
    {
      id: "energy_markets",
      title: "⚡ ENERGY & MARKETS",
      content: `STRAIT OF HORMUZ: CLOSED. 150+ tankers anchored. Dual chokepoint risk pending Houthi activation.

OIL: Brent $85.12. Iraq -1.5M b/d (could double). QatarEnergy force majeure. Saudi Aramco rerouting via East-West pipeline.

MARKETS: Dow Jones -1,000 pts (-2.2%). Kospi -11% (circuit breaker triggered). KSE-100 -9.57% (record low). Nikkei -4.3%. US gasoline: largest price spike in 4 years.`
    },
    {
      id: "political_us",
      title: "🇺🇸 US POLITICAL & WAR POWERS",
      content: `Trump: "UNCONDITIONAL SURRENDER" — "no time limits." Gang of Eight pre-briefed before strikes. Both chambers rejected War Powers Resolution: House 212-219, Senate 53-47.

National Intelligence Council classified report (Washington Post, 7 Mar): even a large-scale assault on Iran is unlikely to oust the Islamic Republic's entrenched military and clerical establishment.

CENTCOM Admiral Cooper (5 Mar): ballistic missile attacks from Iran down roughly 90% since strikes began. 3,000+ targets struck.`
    },
    {
      id: "watchlist",
      title: "🔍 CRITICAL WATCH",
      content: `1. SUCCESSION: Assembly of Experts selection of Mojtaba Khamenei — IRGC vs pragmatist faction.
2. PEZESHKIAN vs HARDLINERS: IRGC effectively running foreign policy. Watch for leadership council purge.
3. USS GEORGE H.W. BUSH: Third CSG deployment = major escalation signal.
4. HORMUZ ESCORT OPERATION: Trump admin timeline. Mining risk. Dual chokepoint activation if Houthis re-engage.
5. $100 OIL BARRIER: Psychological and economic threshold. Central bank paralysis.
6. UAE ESCALATION: First ballistic missile landing — declining interception rate. Iranian retaliation cycle.
7. UKRAINE-GULF DRONE DEAL: If executed, shifts air defence dynamics across Gulf.
8. IRAN OIL INFRASTRUCTURE: First strikes on refineries 7 Mar — energy crisis acceleration.
9. CONGRESSIONAL MUNITIONS SUPPLEMENTAL: Without it, logistics ceiling limits campaign duration.
10. NIC REPORT FALLOUT: Intel assessment contradicts Trump objectives.`
    }
  ]
};

// ─── Cache → state helpers ────────────────────────────────────────────────────

/**
 * Merge AI-generated card updates into the default CC array.
 * Preserves cat, flag, and any fields not returned by the AI.
 */
function mergeCards(defaults, aiCards) {
  if (!Array.isArray(aiCards) || aiCards.length === 0) return defaults;
  const aiMap = {};
  aiCards.forEach(c => { if (c.name) aiMap[c.name] = c; });
  return defaults.map(def => {
    const ai = aiMap[def.name];
    if (!ai) return def;
    return {
      ...def,
      threat:     ai.threat     || def.threat,
      summary:    ai.summary    || def.summary,
      military:   ai.military   || def.military,
      economic:   ai.economic   || def.economic,
      diplomatic: ai.diplomatic || def.diplomatic,
      keyWatch:   ai.keyWatch   || def.keyWatch,
    };
  });
}

/**
 * Map AI intelBrief object to the sections array format.
 * Only updates content — keeps original id/title/icon.
 */
function mergeIntelBrief(defaults, aiBrief) {
  if (!aiBrief) return defaults;

  // AI key → section id
  const keyToId = {
    executiveSummary: "executive",
    militaryCampaign: "military_campaign",
    iranResponse:     "iran_response",
    gulfRegional:     "gulf_regional",
    energyMarkets:    "energy_markets",
    usPolitical:      "political_us",
    watchlist:        "watchlist",
  };

  return {
    ...defaults,
    updated: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    sections: defaults.sections.map(section => {
      const aiKey = Object.keys(keyToId).find(k => keyToId[k] === section.id);
      if (!aiKey || !aiBrief[aiKey]) return section;

      let content = aiBrief[aiKey];
      // watchlist arrives as array → format as numbered list
      if (section.id === "watchlist" && Array.isArray(content)) {
        content = content.map((item, i) => `${i + 1}. ${item}`).join("\n");
      }
      return { ...section, content: content || section.content };
    }),
  };
}

// ─── News feed helper (single global feed) ───────────────────────────────────
async function fetchLiveNews() {
  const q = encodeURIComponent("iran conflict war strikes");
  const res = await fetch(`/api/feed?q=${q}`);
  if (!res.ok) throw new Error(`Feed error ${res.status}`);
  const data = await res.json();
  if (!data.items || data.items.length === 0) throw new Error("No articles found");
  return data;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const Sec = ({ title, content, icon }) => {
  if (!content || content === "N/A") return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b", marginBottom: 5 }}>
        {icon} {title}
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.65, color: "#1e293b" }}>{content}</div>
    </div>
  );
};

function CopyButton({ c }) {
  const [copied, setCopied] = useState(false);
  function doCopy() {
    const parts = [
      `${c.flag} ${c.name} — ${c.threat}`,
      `SUMMARY\n${c.summary}`,
      c.military && c.military !== "N/A" ? `MILITARY\n${c.military}` : null,
      c.economic && c.economic !== "N/A" ? `ECONOMIC\n${c.economic}` : null,
      c.diplomatic && c.diplomatic !== "N/A" ? `DIPLOMATIC\n${c.diplomatic}` : null,
      `KEY WATCH\n${c.keyWatch}`,
      `— Iran Conflict Tracker · MandAI · ${new Date().toLocaleDateString()}`,
    ].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(parts).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  return (
    <button onClick={doCopy} style={{ marginTop: 8, fontSize: 12, padding: "6px 14px", background: copied ? "#f0fdf4" : "#f1f5f9", color: copied ? "#16a34a" : "#475569", border: `1px solid ${copied ? "#86efac" : "#e2e8f0"}`, borderRadius: 6, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}>
      {copied ? "✅ Copied!" : "📋 Copy briefing"}
    </button>
  );
}

function IntelBrief({ brief }) {
  const [copied, setCopied] = useState(false);
  const fullText = [
    `MANDAI TECH — INTELLIGENCE BRIEF`,
    `${brief.day} — Updated: ${brief.updated}`,
    `Classification: ${brief.classification}`,
    ``,
    ...brief.sections.map(s => `${s.title}\n\n${s.content}\n`)
  ].join("\n");

  function handleCopy() {
    navigator.clipboard.writeText(fullText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  function handleDownload() {
    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MandAI_Intel_Brief_${brief.updated.replace(/ /g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div style={{ background: "#0f172a", borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#f59e0b", letterSpacing: "0.15em", fontFamily: "'DM Mono',monospace" }}>{brief.classification}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "6px 0 4px" }}>Intelligence Brief — {brief.day}</div>
            <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'DM Mono',monospace" }}>Updated: {brief.updated} · MandAI Tech</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleCopy} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 700, background: copied ? "#16a34a" : "#1e293b", color: "#fff", border: "1px solid #334155", borderRadius: 8, cursor: "pointer" }}>
              {copied ? "✓ Copied" : "📋 Copy"}
            </button>
            <button onClick={handleDownload} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 700, background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
              ⬇️ Download
            </button>
          </div>
        </div>
      </div>
      <GlobalNewsFeed />
      {brief.sections.map(s => (
        <div key={s.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", marginBottom: 10, overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{s.title}</span>
          </div>
          <div style={{ padding: "14px 18px" }}>
            {s.content.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: 13, lineHeight: 1.7, color: "#1e293b", marginBottom: i < s.content.split("\n\n").length - 1 ? 10 : 0, whiteSpace: "pre-line" }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function GlobalNewsFeed() {
  const [state, setState]     = useState("idle");
  const [liveData, setLiveData] = useState(null);
  const [err, setErr]         = useState(null);

  async function doFetch() {
    setState("loading"); setErr(null);
    try { const d = await fetchLiveNews(); setLiveData(d); setState("done"); }
    catch (e) { setErr(e.message); setState("error"); }
  }

  return (
    <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: state === "done" ? 12 : 0 }}>
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", letterSpacing: "0.08em" }}>🌐 LIVE NEWS FEED</span>
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
            Latest headlines on the conflict — Reuters · Al Jazeera · BBC
          </div>
        </div>
        {state === "idle" && (
          <button onClick={doFetch} style={{ fontSize: 12, padding: "6px 14px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
            🔄 Fetch latest news
          </button>
        )}
        {state === "loading" && (
          <span style={{ fontSize: 12, color: "#0369a1", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid #bae6fd", borderTop: "2px solid #0369a1", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
            Fetching…
          </span>
        )}
        {(state === "done" || state === "error") && (
          <button onClick={doFetch} style={{ fontSize: 11, padding: "4px 10px", background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd", borderRadius: 6, cursor: "pointer" }}>
            🔄 Refresh
          </button>
        )}
      </div>
      {state === "error" && (
        <div style={{ fontSize: 12, color: "#dc2626", marginTop: 6 }}>⚠️ {err} — please retry</div>
      )}
      {state === "done" && liveData && (
        <div>
          <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 8 }}>
            Updated {new Date().toLocaleTimeString()}
          </div>
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

function CCard({ c, isE, onT }) {
  const t = TL[c.threat];
  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", marginBottom: 10, overflow: "hidden", boxShadow: isE ? "0 4px 24px rgba(0,0,0,0.08)" : "none" }}>
      <div onClick={onT} style={{ padding: "14px 18px", display: "flex", alignItems: "center", cursor: "pointer", gap: 12, userSelect: "none" }}>
        <span style={{ fontSize: 22 }}>{c.flag}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{c.name}</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: t.color, background: t.bg, padding: "4px 10px", borderRadius: 4, fontFamily: "'DM Mono',monospace" }}>{t.label}</span>
        <span style={{ color: "#94a3b8", fontSize: 18, transform: isE ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▾</span>
      </div>
      {isE && (
        <div style={{ padding: "4px 18px 18px", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 13.5, lineHeight: 1.65, color: "#334155", marginBottom: 16, fontWeight: 500 }}>{c.summary}</div>
          <Sec title="Military"   content={c.military}   icon="⚔️" />
          <Sec title="Economic"   content={c.economic}   icon="📈" />
          <Sec title="Diplomatic" content={c.diplomatic} icon="🏛️" />
          <Sec title="Watch"      content={c.keyWatch}   icon="🔍" />
          <CopyButton c={c} />
        </div>
      )}
    </div>
  );
}

// ─── AI update status badge ────────────────────────────────────────────────────
function AiBadge({ status, updatedAt }) {
  if (status === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#818cf8", fontFamily: "'DM Mono',monospace" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", border: "2px solid #312e81", borderTop: "2px solid #818cf8", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
        AI update loading…
      </div>
    );
  }
  if (status === "live") {
    const ts = updatedAt ? new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#34d399", fontFamily: "'DM Mono',monospace" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
        AI UPDATED {ts}
      </div>
    );
  }
  if (status === "fallback") {
    return (
      <div style={{ fontSize: 10, color: "#f59e0b", fontFamily: "'DM Mono',monospace" }}>
        ⚠️ CACHED DATA — hardcoded fallback
      </div>
    );
  }
  return null;
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]     = useState("strikes");
  const [exp, setExp]     = useState({});

  // Live data state — starts with hardcoded fallback
  const [cards, setCards]           = useState(CC_DEFAULT);
  const [brief, setBrief]           = useState(INTEL_BRIEF_DEFAULT);
  const [aiStatus, setAiStatus]     = useState("loading"); // loading | live | fallback
  const [aiUpdatedAt, setAiUpdatedAt] = useState(null);

  // ── Fetch cache on mount ────────────────────────────────────────────────────
  useEffect(() => {
    async function loadCache() {
      try {
        const res = await fetch("/api/get-cache");
        if (!res.ok) throw new Error(`Cache fetch failed: ${res.status}`);
        const json = await res.json();

        if (json.data) {
          // Merge AI cards into defaults (preserves cat/flag/etc.)
          const merged = mergeCards(CC_DEFAULT, json.data.cards);
          setCards(merged);

          // Merge AI Intel Brief sections
          const mergedBrief = mergeIntelBrief(INTEL_BRIEF_DEFAULT, json.data.intelBrief);
          setBrief(mergedBrief);

          setAiUpdatedAt(json.data.updatedAt || json.updatedAt || null);
          setAiStatus("live");
        } else {
          // Cache miss — stay on hardcoded fallback
          setAiStatus("fallback");
        }
      } catch (err) {
        console.warn("[App] get-cache error:", err.message);
        setAiStatus("fallback");
      }
    }
    loadCache();
  }, []);

  const tog = (k) => setExp(p => ({ ...p, [k]: !p[k] }));
  const filtered = cards.filter(c => c.cat === tab);

  const expandAll = () => {
    const a = filtered.every(c => exp[c.name]);
    const n = { ...exp };
    filtered.forEach(c => { n[c.name] = !a; });
    setExp(n);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ background: "#0f172a", color: "#fff", padding: "24px 20px 18px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em" }}>
              Mand<span style={{ color: "#818cf8" }}>AI</span>
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <AiBadge status={aiStatus} updatedAt={aiUpdatedAt} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em" }}>
                  ⚡ ACTIVE CONFLICT — DAY {DAY}
                </span>
              </div>
            </div>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 2px", letterSpacing: "-0.02em" }}>
            Iran Conflict Geopolitical Tracker
          </h1>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            Strike logs · Geopolitical · Military · Economic · Diplomatic
          </div>
        </div>
      </div>

      {/* ── Breaking banner ─────────────────────────────────────────────────── */}
      <div style={{ background: "#7f1d1d", color: "#fecaca", padding: "12px 20px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", fontSize: 12.5, lineHeight: 1.7 }}>
          <strong style={{ color: "#fbbf24" }}>⚡ DAY {DAY}:</strong>{" "}
          Israel hits Iran oil refineries — first time. Assembly of Experts: consensus on new Supreme Leader. UAE: 1,184 drones, 205 missiles total. Gulf allies low on interceptors. Kuwait: drone attack ongoing. Trump: 'clean out' Iran regime. Hormuz closed. Brent $85.
        </div>
      </div>

      {/* ── Nav tabs ─────────────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 20px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", overflowX: "auto" }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setTab(c.id)} style={{ padding: "11px 14px", fontSize: 12, fontWeight: tab === c.id ? 700 : 500, color: tab === c.id ? "#0f172a" : "#64748b", background: "transparent", border: "none", borderBottom: tab === c.id ? "2px solid #0f172a" : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap" }}>
              {c.label}
              <span style={{ marginLeft: 5, fontSize: 9, background: tab === c.id ? "#0f172a" : "#e2e8f0", color: tab === c.id ? "#fff" : "#64748b", padding: "2px 5px", borderRadius: 6, fontFamily: "'DM Mono',monospace" }}>
                {c.id === "strikes" ? "" : cards.filter(x => x.cat === c.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "14px 20px 40px" }}>
        {tab === "strikes" ? (
          <IntelBrief brief={brief} />
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <button onClick={expandAll} style={{ fontSize: 11, color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontWeight: 600 }}>
                {filtered.every(c => exp[c.name]) ? "Collapse" : "Expand All"}
              </button>
            </div>
            {filtered.map(c => <CCard key={c.name} c={c} isE={!!exp[c.name]} onT={() => tog(c.name)} />)}
          </>
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <div style={{ background: "#0f172a", padding: "18px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono',monospace" }}>
          MANDAI TECH — INTELLIGENCE BRIEF — CONFIDENTIAL
        </div>
        <div style={{ fontSize: 9, color: "#334155", marginTop: 3 }}>
          Al Jazeera · CNN · Bloomberg · Reuters · CNBC · NBC · NPR · PBS · Wikipedia · Axios · Breaking Defense · Stars&Stripes · Oxford Economics · Alma · BFMTV · State Dept
        </div>
      </div>
    </div>
  );
}
