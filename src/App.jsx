import { useState } from "react";
const UPD = "6 March 2026, 22:00 CET";
const DAY = 7;
const TL = { CRITICAL: { color: "#dc2626", bg: "#fef2f2", label: "CRITICAL" }, HIGH: { color: "#ea580c", bg: "#fff7ed", label: "HIGH" }, ELEVATED: { color: "#ca8a04", bg: "#fefce8", label: "ELEVATED" }, MODERATE: { color: "#2563eb", bg: "#eff6ff", label: "MODERATE" }, LOW: { color: "#16a34a", bg: "#f0fdf4", label: "LOW" } };
const cats = [ { id: "strikes", label: "⚡ Strike Logs" }, { id: "bell", label: "Belligerents" }, { id: "gulf", label: "Gulf States" }, { id: "pow", label: "Great Powers" }, { id: "reg", label: "Regional" }, { id: "nrg", label: "Energy & Markets" } ];
const SL = {
  "Iran (incoming)": { flag: "🇮🇷", threat: "CRITICAL", summary: "US/Israeli strikes ON Iran. 1,332 killed (Hengaw: 2,400), 6,000+ wounded. ~2,000 targets. 4,000 munitions / 1,600 sorties. 30+ ships sunk inc. drone carrier IRIS Shahid Bagheri, forward base IRIS Makran (121K tons), Kilo-class submarine, IRIS Dena (torpedoed off Sri Lanka). 300 launchers destroyed. Nuclear sites hit (B-2/MOPs on Fordo/Natanz/Isfahan). Konarak + Bandar Abbas naval bases devastated. 33 civilian sites. Iran launches -90% missiles, -83% drones since Day 1.",
    stats: [{l:"Killed",v:"1,332",s:"Hengaw: 2,400"},{l:"Wounded",v:"6,000+",s:""},{l:"Targets",v:"~2,000",s:"CENTCOM"},{l:"Ships",v:"30+",s:"inc. drone carrier"},{l:"Launchers",v:"300",s:"IDF"}],
    days: [
      {date:"28 Feb",title:"Khamenei Killed — Epic Fury",t:"CRITICAL",items:["Op Epic Fury (US) + Roaring Lion (Israel) — 01:15 local","Leadership House destroyed — Khamenei killed","Shamkhani (SNSC), Asadi (intel), Shirazi (mil office), SPND chiefs killed","40+ officials killed first wave","7x B-2 bombers dropped 14 MOPs on Fordo + Natanz","Sub-launched Tomahawks on Isfahan nuclear site","Strikes: Tehran, Isfahan, Qom, Karaj, Kermanshah","Trump 8-min Truth Social: regime change"],def:"Gang of Eight pre-briefed. CENTCOM: 01:15 local start."},
      {date:"1 Mar",title:"Navy Decimated — 9 Ships",t:"CRITICAL",items:["Trump: 9 ships 'destroyed and sunk'","IRIS Jamaran sunk at Chabahar","IRIS Shahid Bagheri (drone carrier) struck Bandar Abbas","IRIS Makran (121,000t forward base) — satellite: burning","Naval HQ 'largely destroyed'","Chief of staff Mousavi killed","3 US KIA, 5 seriously wounded","550+ killed (Iran Red Crescent)"],def:"Satellite: Shahid Bagheri + Makran burning."},
      {date:"2 Mar",title:"Gulf of Oman Cleared — 11→0",t:"CRITICAL",items:["CENTCOM: 11 ships in Gulf of Oman → ZERO in 48hrs","Air superiority established along southern coast","Kilo submarine appears sunk (scorch mark at pier)","Interim Leadership Council formed (Larijani)"],def:"CENTCOM: 11→0 in 48hrs."},
      {date:"3 Mar",title:"Nuclear + Govt Deep Strikes",t:"CRITICAL",items:["SNSC HQ destroyed","Expediency Council building levelled","Bushehr Airport struck — Iran Air A319 destroyed","Assembly of Experts bombed during succession meeting","Rosatom suspended Bushehr — evacuating","CENTCOM: 17 ships inc. 'most operational submarine'"],def:"17 ships. Nuclear/govt/media campaign."},
      {date:"4 Mar",title:"IRIS Dena Torpedoed + F-35 Kill",t:"CRITICAL",items:["IRIS Dena torpedoed by US sub 40NM off Sri Lanka — 87 bodies, 32 rescued","First US submarine torpedo attack on warship since WWII","CENTCOM: 20+ ships","IDF: 300 launchers, 4,000 munitions, 1,600 sorties","F-35 shot down YAK-130 — first air-to-air since 1985"],def:"20+ ships. IRIS Dena torpedoed. F-35 air-to-air."},
      {date:"5 Mar",title:"Congress: 'Overwhelming' Wave Coming",t:"CRITICAL",items:["Graham: 'firepower in next 1-2 days will be overwhelming'","Senate rejected war powers 53-47","Trump: wants to pick successor, Mojtaba 'unacceptable'","Hegseth: 'they are toast'"],def:"Classified briefing."},
      {date:"6 Mar",title:"⚡ 30+ Ships — Drone Carrier Burning",t:"CRITICAL",items:["Iran dead: 1,332 (Red Crescent). Hengaw: 2,400 inc 310 civilians","UNICEF: at least 181 children killed","Trump: 'UNCONDITIONAL SURRENDER' — 'no time limits'","IDF: 50 jets destroyed Khamenei's underground bunker","B-2s: penetrator bombs on deeply buried missile launchers","IDF: 2,500 strikes, 6,000+ weapons, 80% air defences destroyed","Cooper: 30+ ships. Drone carrier burning. Missiles -90%, drones -83%","House 212-219 + Senate 53-47: both rejected war powers"],def:"Iran dead 1,332. 181 children. Khamenei bunker destroyed. UNCONDITIONAL SURRENDER."},
    ]
  },
  UAE: { flag: "🇦🇪", threat: "CRITICAL", summary: "Iranian strikes ON UAE. 1,270+ projectiles. 3 killed, 78 injured. Day 7: FIRST ballistic missile landing. Interception declining. DXB T3, Jebel Ali, Palm Jumeirah, Al Dhafra, Fujairah all struck.",
    stats: [{l:"Ballistic",v:"196+",s:"181 intercepted"},{l:"Drones",v:"1,072+",s:"1,001 intercepted"},{l:"Cruise",v:"3",s:"100%"},{l:"Killed",v:"3",s:""},{l:"Injured",v:"78",s:""}],
    days: [
      {date:"28 Feb",title:"Opening Barrage",t:"CRITICAL",items:["Palm Jumeirah: Shahed near Fairmont","DXB T3: 1 killed, 4 injured. Evacuated","Jebel Ali Port: fire","Al Dhafra: US forces targeted","AWS DC: mec1-az2 fire"],def:"137 missiles, 209 drones."},
      {date:"1 Mar",title:"Airspace Closed",t:"CRITICAL",items:["Full airspace closure","Abu Dhabi: 1 killed (Nepali)","Exchanges closed"],def:"Cumulative: 165 ballistic, 541 drones."},
      {date:"2-4 Mar",title:"US Consulate + Fujairah",t:"CRITICAL",items:["US Consulate: drone fire, contained","Fujairah storage (Vopak/VTTI) struck","Israeli diplomats extracted","AWS Bahrain also offline"],def:"Total: 189 ballistic, 941 drones."},
      {date:"5 Mar",title:"Flights Partially Resume",t:"ELEVATED",items:["Emirates: reduced schedule","Overstay fines waived","Schools: spring break 9-22 Mar","Zelenskyy offered drone defence to MBZ"],def:"EASA advisory extended."},
      {date:"6 Mar",title:"⚡ First Missile Landing + Police Warnings",t:"CRITICAL",items:["1 ballistic missile LANDED — first confirmed impact on territory","6 drones landed. 131 drones: 125 intercepted","Dubai Police: mass SMS warning re photographing strike sites","Etihad resuming LIMITED commercial schedule from 6 Mar","20,000 Americans have left Middle East (State Dept)"],def:"First ballistic impact. Social media crackdown."},
    ]
  },
  Qatar: { flag: "🇶🇦", threat: "CRITICAL", summary: "Iranian strikes ON Qatar. 115+ ballistic, 43+ drones. 2 Su-24s shot down. QatarEnergy force majeure LNG. 10 IRGC spies arrested. Stay indoors order. Al Udeid struck.",
    stats: [{l:"Ballistic",v:"115+",s:"111 intercepted"},{l:"Drones",v:"43+",s:"28 intercepted"},{l:"Su-24s",v:"2",s:"shot down"},{l:"Injured",v:"16+",s:""},{l:"LNG",v:"HALTED",s:"force majeure"}],
    days: [
      {date:"28 Feb",title:"Al Udeid Struck",t:"CRITICAL",items:["65 missiles + 12 drones","16 injured","Al Udeid hit","Airspace closed"],def:"Pre-approved security plan."},
      {date:"1 Mar",title:"LNG Halted",t:"CRITICAL",items:["Force majeure — Ras Laffan + Mesaieed","European gas +50%","Schools remote"],def:"Prevent storage overfill."},
      {date:"2 Mar",title:"Su-24s Shot Down",t:"CRITICAL",items:["2 Iranian Su-24 bombers downed","Al Udeid again — no casualties"],def:"First air-to-air of conflict."},
      {date:"3-4 Mar",title:"IRGC Cells Arrested",t:"HIGH",items:["10 IRGC suspects (7 spies + 3 saboteurs)","Facility coordinates found","Evacuating near US Embassy"],def:"101 ballistic, 39 drones, 3 cruise."},
      {date:"5-6 Mar",title:"⚡ Stay Indoors Order",t:"CRITICAL",items:["Security HIGH — everyone indoors","Multiple booms Doha","14 ballistic + 4 drones","Qatar Airways: limited relief flights","PM 'categorically rejected' Iran claims"],def:"Stay indoors."},
    ]
  },
  Bahrain: { flag: "🇧🇭", threat: "CRITICAL", summary: "Iranian strikes ON Bahrain. 5th Fleet HQ hit. 75+ missiles + 123+ drones. 1 killed. OIL REFINERY hit Day 7. Shia crackdown. AWS offline.",
    stats: [{l:"Missiles",v:"75+",s:""},{l:"Drones",v:"123+",s:""},{l:"Killed",v:"1",s:"shipyard worker"},{l:"5th Fleet",v:"HIT",s:""},{l:"Refinery",v:"HIT",s:"Day 7"}],
    days: [
      {date:"28 Feb",title:"5th Fleet HQ Struck",t:"CRITICAL",items:["5th Fleet Juffair: smoke","Era View Tower: direct drone hit","Air-raid sirens. Armoured vehicles"],def:"45 missiles + 9 drones."},
      {date:"1 Mar",title:"Hotel + Residential",t:"CRITICAL",items:["Crowne Plaza: damage","1 killed: shipyard worker (debris)","Airport: drone damage"],def:""},
      {date:"2-5 Mar",title:"Sheikh Isa + Crackdown",t:"HIGH",items:["Sheikh Isa Air Base attacked","AWS Bahrain damaged — offline","Shia citizens arrested for treason"],def:"75 missiles + 123 drones total."},
      {date:"6 Mar",title:"⚡ Oil Refinery Hit",t:"CRITICAL",items:["Missile hit state-run refinery","Fire extinguished — operational","New explosions across country"],def:"Energy infrastructure escalation."},
    ]
  },
  "Saudi Arabia": { flag: "🇸🇦", threat: "HIGH", summary: "Iranian strikes ON Saudi Arabia. Ras Tanura (550K b/d) hit twice. US Embassy Riyadh hit. Pipeline bypass active.",
    stats: [{l:"Ras Tanura",v:"2x",s:"550K b/d"},{l:"Embassy",v:"Hit",s:"2 drones"},{l:"Drones",v:"15+",s:"intercepted"},{l:"Killed",v:"0",s:""},{l:"Pipeline",v:"Active",s:"bypass"}],
    days: [
      {date:"28 Feb",title:"Riyadh + East",t:"HIGH",items:["Explosions eastern Riyadh","Prince Sultan + airport intercepted"],def:"Did NOT allow airspace for Iran strikes."},
      {date:"1-3 Mar",title:"Ras Tanura + Embassy",t:"HIGH",items:["Ras Tanura hit (Day 2)","US Embassy: 2 drones, fire","Ras Tanura AGAIN (Day 3)"],def:"Condemned 'flagrant' attack."},
      {date:"4-6 Mar",title:"Cabinet + Northern Intercept",t:"ELEVATED",items:["MBS emergency cabinet","Drone near al-Jawf (north)","Rubio call"],def:"Geographic spread."},
    ]
  },
  Kuwait: { flag: "🇰🇼", threat: "HIGH", summary: "Iranian strikes ON Kuwait. 6 US KIA. Ali al-Salem struck. Friendly fire: 3 F-15Es downed. US Embassy CLOSED.",
    stats: [{l:"Ballistic",v:"97",s:"intercepted"},{l:"Drones",v:"283",s:"intercepted"},{l:"US KIA",v:"6",s:"Port Shuaiba"},{l:"Civilian",v:"1",s:"girl killed"},{l:"Embassy",v:"CLOSED",s:""}],
    days: [
      {date:"28 Feb",title:"Ali al-Salem + Airport",t:"CRITICAL",items:["Ali al-Salem struck","Airport: drone damage","Ambassador summoned"],def:"Satellite: 4+ impacts."},
      {date:"1 Mar",title:"6 US KIA",t:"CRITICAL",items:["Port Shuaiba: 6 soldiers killed","1 girl killed (shrapnel)"],def:"First US deaths."},
      {date:"2 Mar",title:"Friendly Fire",t:"HIGH",items:["Kuwaiti F/A-18s: 3 US F-15Es down","Crews survived"],def:"Investigation."},
      {date:"5-6 Mar",title:"⚡ Embassy Closed",t:"HIGH",items:["US Embassy closed","Tanker explosion 30NM offshore"],def:""},
    ]
  },
  Oman: { flag: "🇴🇲", threat: "ELEVATED", summary: "Largely spared. Oil storage damaged. Mediator — pre-war breakthrough brokered but ignored.",
    stats: [{l:"Territory",v:"Spared",s:""},{l:"Storage",v:"1 tank",s:"minor"},{l:"Maritime",v:"2 vessels",s:"off coast"},{l:"Role",v:"Mediator",s:""}],
    days: [
      {date:"28 Feb-4 Mar",title:"Spared — Mediator",t:"MODERATE",items:["Not struck directly","Muscat as hub","Brokered 27 Feb breakthrough (ignored)"],def:"Iran agreed IAEA + no stockpiling."},
      {date:"5-6 Mar",title:"Storage + Maritime",t:"ELEVATED",items:["1 storage tank damaged","Oil tanker attacked off coast","Maltese container ship struck in Strait"],def:"Exemption eroding."},
    ]
  },
  Israel: { flag: "🇮🇱", threat: "HIGH", summary: "Iranian strikes ON Israel (True Promise IV). 11 killed, 160+ injured. Beit Shemesh synagogue: 9 killed. Strike rate declining: 90→20/day. Cluster munitions confirmed. 70K reservists called. Day 7: hybrid drone + missile attack on Tel Aviv.",
    stats: [{l:"Killed",v:"11",s:""},{l:"Injured",v:"160+",s:""},{l:"Strikes D1",v:"90",s:"declining"},{l:"Beit Shemesh",v:"9 dead",s:""},{l:"Reservists",v:"70K",s:""}],
    days: [
      {date:"28 Feb",title:"Opening Retaliation — Tel Aviv Hit",t:"HIGH",items:["~90 missiles/drones at Israel","1 woman killed, 22 injured Tel Aviv","40 buildings damaged","Arrow, David's Sling, Iron Dome intercepting"],def:"90 strikes Day 1."},
      {date:"1 Mar",title:"Beit Shemesh Synagogue — 9 Dead",t:"CRITICAL",items:["65 strikes on Israel","Missile hit bomb shelter below synagogue","9 killed, 49 injured, 11 missing","20,000 reservists called up"],def:"Deadliest single incident in Israel."},
      {date:"2-4 Mar",title:"Rate Declining + Cluster Munitions",t:"HIGH",items:["Rate: 25→20 strikes/day","IDF: Iran using cluster sub-munitions in warheads","2 coordinated waves simultaneously from Iran + Lebanon"],def:"Arsenal depletion visible."},
      {date:"5-6 Mar",title:"⚡ Hybrid Attack on Tel Aviv",t:"HIGH",items:["Hybrid drone + missile attack on Tel Aviv","Projectile hit building outskirts — injuries","Iran-Hezbollah coordinated launches continue"],def:"Hybrid tactics. Rate lower but lethal."},
    ]
  },
  Cyprus: { flag: "🇨🇾", threat: "ELEVATED", summary: "RAF Akrotiri runway struck by Iranian drone. Paphos Airport evacuated. IRGC Gen Jabbari threatened mass missile strikes. 6-nation European naval coalition forming. Families evacuated from Akrotiri.",
    stats: [{l:"Akrotiri",v:"HIT",s:"runway drone"},{l:"Paphos",v:"Evacuated",s:"2 drones"},{l:"Casualties",v:"0",s:""},{l:"Coalition",v:"6+ nations",s:""},{l:"IRGC",v:"Threatened",s:"mass strikes"}],
    days: [
      {date:"1 Mar",title:"Akrotiri Struck",t:"HIGH",items:["22:03 UTC: Shahed drone struck RAF Akrotiri runway","Paphos Airport evacuated — 2 drones","Minor damage, no casualties","Families moved from Akrotiri as precaution"],def:"First strike on European territory since WWII."},
      {date:"2-3 Mar",title:"IRGC Threatens Mass Strikes",t:"ELEVATED",items:["IRGC Gen Jabbari: threatened missiles 'with such intensity Americans forced to leave'","NATO Rutte: 'defend every inch of NATO territory'","UK FM: Akrotiri NOT used by US bombers"],def:"IRGC escalation threat."},
      {date:"4-6 Mar",title:"European Naval Coalition Forming",t:"ELEVATED",items:["UK: HMS Dragon deploying (delayed — loading ammo)","France: frigate Languedoc + Charles de Gaulle CSG","Greece: frigates Kimon + Psara + 4x F-16s","Spain: Cristóbal Colón committed","Italy: Samp-T AD systems + destroyer TBD","Netherlands: considering contribution"],def:"6+ nation European coalition."},
    ]
  },
  Lebanon: { flag: "🇱🇧", threat: "CRITICAL", summary: "Israeli strikes ON Lebanon. 120+ killed, 437+ wounded, 60,000+ displaced. Ground invasion underway (91st Division). 26 Dahiyeh strikes overnight Day 6. 500K+ evacuated. Hezbollah BANNED by Lebanese govt.",
    stats: [{l:"Killed",v:"120+",s:""},{l:"Wounded",v:"437+",s:""},{l:"Displaced",v:"60K+",s:""},{l:"IDF Strikes",v:"250+",s:""},{l:"Ground",v:"ACTIVE",s:"91st Division"}],
    days: [
      {date:"1 Mar",title:"Hezbollah Enters War",t:"CRITICAL",items:["Hezbollah fired missiles + drones at Israel","50+ killed first 24 hours","Coordinated Iranian-Hezbollah launches"],def:"Second front opened."},
      {date:"2-4 Mar",title:"Ground Invasion + 250 Targets",t:"CRITICAL",items:["91st Division entered southern Lebanon","Lebanese govt BANNED Hezbollah military activities — historic first","IDF struck 250+ targets","65,000+ displaced"],def:"Ground invasion begins."},
      {date:"5-6 Mar",title:"⚡ Dahiyeh Mass Evacuation",t:"CRITICAL",items:["26 Israeli strikes on Dahiyeh overnight","500K+ evacuating — mass panic, roads gridlocked","Smotrich: 'Dahiyeh will look like Khan Younis'","Tripoli struck for FIRST TIME","IDF: 'next phase'"],def:"500K+ evacuation. Khan Younis comparison."},
    ]
  },
  Azerbaijan: { flag: "🇦🇿", threat: "HIGH", summary: "4 Iranian drones struck Nakhchivan exclave (Day 6). Airport terminal hit. Army on FULL COMBAT READINESS. Aliyev: 'act of terror'. Iran DENIED — blamed Israel. Turkey 'strongly condemned'.",
    stats: [{l:"Drones",v:"4",s:"from Iran"},{l:"Airport",v:"HIT",s:"terminal"},{l:"Injured",v:"4",s:""},{l:"Army",v:"COMBAT",s:"full readiness"},{l:"Iran",v:"DENIED",s:"blamed Israel"}],
    days: [
      {date:"5 Mar",title:"⚡ Nakhchivan Airport Struck",t:"HIGH",items:["4 Iranian drones entered Nakhchivan airspace","1 struck airport terminal (10km from Iran border)","1 near school in Shakarabad village","1 shot down by Azerbaijani forces","Aliyev: 'act of terror — ordered retaliatory measures'","Army on FULL COMBAT READINESS","Iran DENIED — blamed Israel","Turkey 'strongly condemned' — pledged solidarity","Border closed to all Iranian cargo"],def:"First strike on non-Gulf, non-belligerent sovereign state."},
    ]
  },
  Jordan: { flag: "🇯🇴", threat: "ELEVATED", summary: "49 drones + ballistic missiles intercepted by Jordanian forces. No casualties. Quiet participant — no public escalation.",
    stats: [{l:"Intercepted",v:"49",s:""},{l:"Casualties",v:"0",s:""},{l:"Role",v:"Defence",s:"quiet"}],
    days: [
      {date:"28 Feb-6 Mar",title:"Silent Interceptions",t:"ELEVATED",items:["49 drones + ballistic intercepted","No casualties","Jordan maintaining low profile","IRGC targeted 27+ US bases across region inc. Jordan"],def:"49 interceptions. No public escalation."},
    ]
  },
  Iraq: { flag: "🇮🇶", threat: "HIGH", summary: "Oil production CUT 1.5M b/d — could double. Victoria base drone intercepted. IRGC striking Kurdish bases. Khor al-Zubair oil spill. US-Israel struck Kataib Hezbollah (2 KIA).",
    stats: [{l:"Oil Cut",v:"1.5M b/d",s:"could double"},{l:"KH Dead",v:"2",s:"Jurf al-Nasr"},{l:"Victoria",v:"Intercepted",s:""},{l:"Erbil",v:"Struck",s:""},{l:"Oil Spill",v:"Active",s:"Khor al-Zubair"}],
    days: [
      {date:"28 Feb-1 Mar",title:"Erbil + US Bases Targeted",t:"HIGH",items:["Explosions near US consulate + airport in Erbil","US/Israel struck Jurf al-Nasr (PMF) — 2 KH killed","Kataib Hezbollah threatened retaliation"],def:"Multi-directional strikes."},
      {date:"2-4 Mar",title:"Kurdish Strikes + Oil Spill",t:"HIGH",items:["IRGC striking Kurdish positions near border","Khor al-Zubair: boat struck tanker — oil spill","Oil production cut 1.5M b/d — storage nearly full"],def:"Iraq oil cut 1.5M b/d."},
      {date:"5-6 Mar",title:"⚡ Victoria Base + Production Collapse",t:"HIGH",items:["Iraqi forces shot down drone targeting Victoria base","IRGC continues striking Kurdish bases","Oil storage nearly full — cuts accelerating"],def:"Victoria intercept. Production collapse."},
    ]
  },
  Pakistan: { flag: "🇵🇰", threat: "ELEVATED", summary: "KSE -9.57% — largest single-day decline in history. US Consulate Karachi CLOSED. Balochistan border instability. Army deployed for protests.",
    stats: [{l:"KSE",v:"-9.57%",s:"record"},{l:"Consulate",v:"CLOSED",s:"Karachi"},{l:"Army",v:"Deployed",s:"protests"},{l:"Border",v:"Unstable",s:"Balochistan"}],
    days: [
      {date:"1-6 Mar",title:"Market Crash + Protests",t:"ELEVATED",items:["KSE -9.57% — largest ever single day","US Consulate Karachi closed","Army deployed in Gilgit + Skardu","Shia demonstrators attacked UN Observer offices","Pakistan + Afghanistan joint concern re regional spillover"],def:"Largest ever KSE decline."},
    ]
  },
  "Yemen / Houthis": { flag: "🇾🇪", threat: "ELEVATED", summary: "Have NOT formally joined war. Stimson: 'will almost certainly join soon'. Maersk rerouting via Cape. Leadership in hiding. Retain long-range strike capability.",
    stats: [{l:"Status",v:"NOT YET",s:"active"},{l:"Missiles",v:"1,800km",s:"Toufan"},{l:"Maersk",v:"Via Cape",s:"rerouting"},{l:"Leaders",v:"Hidden",s:""},{l:"Hospitals",v:"Alert",s:""}],
    days: [
      {date:"28 Feb-6 Mar",title:"Watching — Internal Debate",t:"ELEVATED",items:["Have NOT formally joined war","Threatened Red Sea resumption (28 Feb) — not yet executed","Stimson: 'will almost certainly join soon'","Maersk rerouting via Cape of Good Hope again","Leadership went into hiding. Hospitals on alert","Retain: Toufan (1,800km), cruise missiles, Samad UAVs"],def:"Most resilient Iranian proxy remaining."},
    ]
  },
  "Sri Lanka": { flag: "🇱🇰", threat: "MODERATE", summary: "IRIS Dena torpedoed 40NM off Galle — 32 rescued, 87 bodies. IRIS Bushehr INTERNED (208 crew) — first warship internment since WWII. Strict neutrality.",
    stats: [{l:"IRIS Dena",v:"Torpedoed",s:"40NM off Galle"},{l:"Rescued",v:"32",s:""},{l:"Bodies",v:"87",s:""},{l:"IRIS Bushehr",v:"Interned",s:"208 crew"},{l:"Status",v:"Neutral",s:""}],
    days: [
      {date:"4-5 Mar",title:"IRIS Dena + IRIS Bushehr Interned",t:"MODERATE",items:["IRIS Dena torpedoed by US sub 40NM off Galle","Sri Lanka Navy rescued 32, recovered 87 bodies","IRIS Bushehr (tanker/warship) INTERNED — 208 crew","First warship internment in neutral country since WWII","Sri Lanka maintaining strict neutrality"],def:"Legally significant: Hague Convention XIII."},
    ]
  },
};

const CC = [
  { cat:"bell",name:"United States",flag:"🇺🇸",threat:"CRITICAL",
    summary:"Day 7. ~2,000 targets. 30+ ships. B-2s + B-52s + reverse-engineered Iranian drones. First 100hrs: $3.7B. Hegseth: 'If you think you've seen something, just wait.' Both chambers rejected war powers. Trump wants to pick Iran's successor. 20,000 Americans left ME. Lockheed/RTX to WH Friday — supplemental expected.",
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
  "Italy": "italy iran war crosetto meloni",
  "Strait of Hormuz": "hormuz strait oil tanker",
  "Global Markets": "oil price war iran markets",
};

async function fetchLiveUpdate(name) {
  const q = encodeURIComponent(SEARCH_TERMS[name] || SEARCH_TERMS.default);
  const res = await fetch(`/api/feed?q=${q}`);
  if (!res.ok) throw new Error(`Feed error ${res.status}`);
  const data = await res.json();
  if (!data.items || data.items.length === 0) throw new Error("No articles found");
  return data;
}

const Sec = ({title,content,icon}) => { if(!content||content==="N/A") return null; return (<div style={{marginBottom:14}}><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#64748b",marginBottom:5}}>{icon} {title}</div><div style={{fontSize:13.5,lineHeight:1.65,color:"#1e293b"}}>{content}</div></div>); };

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
  return (<button onClick={doCopy} style={{marginTop:8,fontSize:12,padding:"6px 14px",background:copied?"#f0fdf4":"#f1f5f9",color:copied?"#16a34a":"#475569",border:`1px solid ${copied?"#86efac":"#e2e8f0"}`,borderRadius:6,cursor:"pointer",fontWeight:600,transition:"all 0.2s"}}>{copied?"✅ Copied!":"📋 Copy briefing"}</button>);
}

function LiveBox({ name }) {
  const [state, setState] = useState("idle");
  const [liveData, setLiveData] = useState(null);
  const [err, setErr] = useState(null);
  async function doFetch() {
    setState("loading"); setErr(null);
    try { const d = await fetchLiveUpdate(name); setLiveData(d); setState("done"); }
    catch(e) { setErr(e.message); setState("error"); }
  }
  return (
    <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:state==="done"?10:0}}>
        <span style={{fontSize:11,fontWeight:700,color:"#0369a1",letterSpacing:"0.08em"}}>🌐 LIVE NEWS FEED</span>
        {state==="idle"&&<button onClick={doFetch} style={{fontSize:12,padding:"5px 12px",background:"#0f172a",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:600}}>🔄 Fetch latest news</button>}
        {state==="loading"&&<span style={{fontSize:12,color:"#0369a1",display:"flex",alignItems:"center",gap:6}}><span style={{width:10,height:10,borderRadius:"50%",border:"2px solid #bae6fd",borderTop:"2px solid #0369a1",display:"inline-block",animation:"spin 0.8s linear infinite"}}/>Fetching...</span>}
        {(state==="done"||state==="error")&&<button onClick={doFetch} style={{fontSize:11,padding:"4px 10px",background:"#e0f2fe",color:"#0369a1",border:"1px solid #bae6fd",borderRadius:6,cursor:"pointer"}}>🔄 Refresh</button>}
      </div>
      {state==="error"&&<div style={{fontSize:12,color:"#dc2626",marginTop:6}}>⚠️ {err} — please retry</div>}
      {state==="done"&&liveData&&(
        <div>
          <div style={{fontSize:10,color:"#64748b",marginBottom:8}}>Reuters · Al Jazeera · BBC · updated {new Date().toLocaleTimeString()}</div>
          {liveData.items.map((item,i)=>(
            <a key={i} href={item.link} target="_blank" rel="noreferrer" style={{display:"block",textDecoration:"none",padding:"8px 0",borderBottom:i<liveData.items.length-1?"1px solid #e0f2fe":"none"}}>
              <div style={{fontSize:13,fontWeight:600,color:"#0c4a6e",lineHeight:1.4,marginBottom:3}}>{item.title}</div>
              <div style={{fontSize:11,color:"#64748b",lineHeight:1.4,marginBottom:3}}>{item.snippet}</div>
              <div style={{fontSize:10,color:"#94a3b8"}}>{item.source} · {item.date}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

const SD = ({d,isE,onT}) => { const t=TL[d.t]; return (<div style={{background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",marginBottom:8,overflow:"hidden",boxShadow:isE?"0 4px 20px rgba(0,0,0,0.07)":"none"}}><div onClick={onT} style={{padding:"12px 16px",display:"flex",alignItems:"center",cursor:"pointer",gap:10,userSelect:"none"}}><div style={{fontSize:11,fontWeight:700,color:"#64748b",fontFamily:"'DM Mono',monospace",minWidth:48}}>{d.date}</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>{d.title}</div></div><span style={{fontSize:9,fontWeight:800,letterSpacing:"0.1em",color:t.color,background:t.bg,padding:"3px 8px",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>{t.label}</span><span style={{color:"#94a3b8",fontSize:16,transform:isE?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}>▾</span></div>{isE&&(<div style={{padding:"0 16px 14px",borderTop:"1px solid #f1f5f9"}}><div style={{fontSize:10,color:"#64748b",padding:"8px 0 6px",fontFamily:"'DM Mono',monospace"}}>🛡️ {d.def}</div>{d.items.map((it,i)=>(<div key={i} style={{fontSize:12.5,lineHeight:1.6,color:"#1e293b",padding:"4px 0 4px 12px",borderLeft:"2px solid #e2e8f0"}}>{it}</div>))}</div>)}</div>); };
const SB = ({stats}) => (<div style={{background:"#1e293b",borderRadius:10,padding:"14px 16px",marginBottom:14,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:10}}>{stats.map((s,i)=>(<div key={i} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#fff",fontFamily:"'DM Mono',monospace"}}>{s.v}</div><div style={{fontSize:9,fontWeight:700,color:"#94a3b8",letterSpacing:"0.08em",textTransform:"uppercase"}}>{s.l}</div>{s.s&&<div style={{fontSize:9,color:"#64748b",marginTop:1}}>{s.s}</div>}</div>))}</div>);

function CCard({c,isE,onT}) {
  const t=TL[c.threat];
  const isBell = c.cat === "bell";
  return (
    <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",marginBottom:10,overflow:"hidden",boxShadow:isE?"0 4px 24px rgba(0,0,0,0.08)":"none"}}>
      <div onClick={onT} style={{padding:"14px 18px",display:"flex",alignItems:"center",cursor:"pointer",gap:12,userSelect:"none"}}>
        <span style={{fontSize:22}}>{c.flag}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{c.name}</div>
          {!isBell && c.role && <div style={{fontSize:12,color:"#64748b",marginTop:1}}>{c.role}</div>}
        </div>
        <span style={{fontSize:10,fontWeight:800,letterSpacing:"0.1em",color:t.color,background:t.bg,padding:"4px 10px",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>{t.label}</span>
        <span style={{color:"#94a3b8",fontSize:18,transform:isE?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}>▾</span>
      </div>
      {isE&&(
        <div style={{padding:"4px 18px 18px",borderTop:"1px solid #f1f5f9"}}>
          <div style={{fontSize:13.5,lineHeight:1.65,color:"#334155",marginBottom:16,fontWeight:500}}>{c.summary}</div>
          <LiveBox name={c.name}/>
          <Sec title="Military" content={c.military} icon="⚔️"/>
          <Sec title="Economic" content={c.economic} icon="📈"/>
          <Sec title="Diplomatic" content={c.diplomatic} icon="🏛️"/>
          <Sec title="Watch" content={c.keyWatch} icon="🔍"/>
          <CopyButton c={c}/>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab,setTab]=useState("strikes");
  const [exp,setExp]=useState({});
  const [sc,setSc]=useState("Iran (incoming)");
  const tog=(k)=>setExp(p=>({...p,[k]:!p[k]}));
  const sl=SL[sc];
  const filtered=CC.filter(c=>c.cat===tab);
  const expandAll=()=>{
    if(tab==="strikes"){const ks=sl.days.map(d=>`${sc}-${d.date}`);const a=ks.every(k=>exp[k]);const n={...exp};ks.forEach(k=>{n[k]=!a;});setExp(n);}
    else{const a=filtered.every(c=>exp[c.name]);const n={...exp};filtered.forEach(c=>{n[c.name]=!a;});setExp(n);}
  };
  return (
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={{background:"#0f172a",color:"#fff",padding:"24px 20px 18px"}}>
        <div style={{maxWidth:820,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:22,fontWeight:900,letterSpacing:"-0.02em"}}>Mand<span style={{color:"#818cf8"}}>AI</span></span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#ef4444",animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:11,fontWeight:700,color:"#ef4444",fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>⚡ ACTIVE CONFLICT — DAY {DAY}</span>
            </div>
          </div>
          <h1 style={{fontSize:20,fontWeight:700,margin:"0 0 2px",letterSpacing:"-0.02em"}}>Iran Conflict Geopolitical Tracker</h1>
          <div style={{fontSize:12,color:"#94a3b8"}}>Strike logs · Geopolitical · Military · Economic · Diplomatic</div>
         
        </div>
      </div>
      <div style={{background:"#7f1d1d",color:"#fecaca",padding:"12px 20px"}}>
        <div style={{maxWidth:820,margin:"0 auto",fontSize:12.5,lineHeight:1.7}}>
          <strong style={{color:"#fbbf24"}}>⚡ DAY {DAY}:</strong> House rejected war powers 212-219. Trump wants to pick Iran's successor. 'Overwhelming' wave coming. First UAE missile landing. Bahrain refinery hit. Iran: 1,332+ dead. Araghchi rejected ceasefire. Kospi -11%. Hormuz closed.{" "}
          <strong style={{color:"#fbbf24"}}>→ Open a card and click "Fetch latest news" for live updates.</strong>
        </div>
      </div>
      <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"0 20px",position:"sticky",top:0,zIndex:10}}>
        <div style={{maxWidth:820,margin:"0 auto",display:"flex",overflowX:"auto"}}>
          {cats.map(c=>(<button key={c.id} onClick={()=>setTab(c.id)} style={{padding:"11px 14px",fontSize:12,fontWeight:tab===c.id?700:500,color:tab===c.id?"#0f172a":"#64748b",background:"transparent",border:"none",borderBottom:tab===c.id?"2px solid #0f172a":"2px solid transparent",cursor:"pointer",whiteSpace:"nowrap"}}>
            {c.label}<span style={{marginLeft:5,fontSize:9,background:tab===c.id?"#0f172a":"#e2e8f0",color:tab===c.id?"#fff":"#64748b",padding:"2px 5px",borderRadius:6,fontFamily:"'DM Mono',monospace"}}>{c.id==="strikes"?Object.keys(SL).length:CC.filter(x=>x.cat===c.id).length}</span>
          </button>))}
        </div>
      </div>
      <div style={{maxWidth:820,margin:"0 auto",padding:"14px 20px 40px"}}>
        {tab==="strikes"?(
          <>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
              {Object.entries(SL).map(([k,v])=>(
                <button key={k} onClick={()=>setSc(k)} style={{padding:"8px 14px",fontSize:12,fontWeight:sc===k?700:500,background:sc===k?"#0f172a":"#fff",color:sc===k?"#fff":"#334155",border:"1px solid #e2e8f0",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                  <span>{v.flag}</span><span>{k}</span>
                  <span style={{fontSize:9,fontWeight:800,color:TL[v.threat].color,background:TL[v.threat].bg,padding:"2px 5px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>{TL[v.threat].label}</span>
                </button>
              ))}
            </div>
            <div style={{fontSize:13,color:"#475569",marginBottom:12,lineHeight:1.6}}>{sl.summary}</div>
            <SB stats={sl.stats}/>
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
              <button onClick={expandAll} style={{fontSize:11,color:"#64748b",background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontWeight:600}}>{sl.days.every(d=>exp[`${sc}-${d.date}`])?"Collapse":"Expand All"}</button>
            </div>
            {sl.days.map(d=><SD key={`${sc}-${d.date}`} d={d} isE={!!exp[`${sc}-${d.date}`]} onT={()=>tog(`${sc}-${d.date}`)}/>)}
          </>
        ):(
          <>
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
              <button onClick={expandAll} style={{fontSize:11,color:"#64748b",background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontWeight:600}}>{filtered.every(c=>exp[c.name])?"Collapse":"Expand All"}</button>
            </div>
            {filtered.map(c=><CCard key={c.name} c={c} isE={!!exp[c.name]} onT={()=>tog(c.name)}/>)}
          </>
        )}
      </div>
      <div style={{background:"#0f172a",padding:"18px 20px",textAlign:"center"}}>
        <div style={{fontSize:10,color:"#475569",fontFamily:"'DM Mono',monospace"}}>MandAI Tech — INTELLIGENCE BRIEF — CONFIDENTIAL</div>
        <div style={{fontSize:9,color:"#334155",marginTop:3}}>Sources: Al Jazeera · CNN · Bloomberg · Reuters · CNBC · NBC · NPR · PBS · Wikipedia · Axios · Breaking Defense · Stars&Stripes · Oxford Economics · Alma · BFMTV · State Dept</div>
      </div>
    </div>
  );
}
 
