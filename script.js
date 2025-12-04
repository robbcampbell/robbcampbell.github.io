// --- XP table for OSRS levels 1-99 ---
const xpTable = (() => {
  const table = [];
  // Official OSRS formula for XP curve
  table[1] = 0;
  let xp = 0;
  for (let lvl = 1; lvl < 99; lvl++) {
    xp += Math.floor(lvl + 300 * Math.pow(2, lvl / 7));
    table[lvl + 1] = Math.floor(xp / 4);
  }
  return table;
})();

function levelToXp(level) {
  level = Math.max(1, Math.min(99, Math.floor(level || 1)));
  return xpTable[level] ?? 0;
}

// --- Skill data: XP/hr + example methods & guides ---
const skills = [
  {
    id: "attack",
    name: "Attack",
    category: "Combat",
    xpPerHour: 45000,
    xpPerAction: 110,
    description:
      "Train Attack to unlock stronger melee weapons and increase your accuracy. Common methods involve AFK crabs or Slayer tasks.",
    methods: [
      "Levels 1–40: Cows / chickens / early Slayer tasks with an iron or steel scimitar.",
      "Levels 40–70: Sand Crabs or Ammonite Crabs with a rune scimitar.",
      "Levels 70–99: Slayer, Nightmare Zone, or high-level crabs with strong gear and potions."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Attack_training"
  },
  {
    id: "strength",
    name: "Strength",
    category: "Combat",
    xpPerHour: 55000,
    xpPerAction: 115,
    description:
      "Strength boosts your max melee hit and is the core stat for most melee accounts. Many players prioritize it early for DPS.",
    methods: [
      "Levels 1–40: Low-level Slayer or gap-filling combat training on cows, hill giants, or similar.",
      "Levels 40–70: Sand Crabs / Ammonite Crabs using a strength training style.",
      "Levels 70–99: Chin NPCs at Nightmare Zone, Slayer training, or high-level AFK spots."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Strength_training"
  },
  {
    id: "defence",
    name: "Defence",
    category: "Combat",
    xpPerHour: 42000,
    xpPerAction: 110,
    description:
      "Defence reduces the damage you take and unlocks tank armour like Barrows, Dragon, and Bandos.",
    methods: [
      "Levels 1–40: Shared XP early game or dedicated Defence training on basic monsters.",
      "Levels 40–70: Sand Crabs or Ammonite Crabs using a Defensive combat style.",
      "Levels 70–99: Slayer tasks or AFK zones such as Nightmare Zone and high-level dungeons."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Defence_training"
  },
  {
    id: "ranged",
    name: "Ranged",
    category: "Combat",
    xpPerHour: 65000,
    xpPerAction: 120,
    description:
      "Ranged is powerful for both PvM and PvP. It offers safe-spotting, cheap training, and strong late-game gear.",
    methods: [
      "Levels 1–40: Chickens, cows, and early quest training (e.g. Fire Giants after quests).",
      "Levels 40–75: Sand Crabs, Slayer tasks, or safe-spotted monsters with broad/steel darts.",
      "Levels 75–99: Chinning in the Monkey Madness II caves, strong Slayer, or high-level bossing."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Ranged_training"
  },
  {
    id: "magic",
    name: "Magic",
    category: "Combat",
    xpPerHour: 90000,
    xpPerAction: 65,
    description:
      "Magic offers teleports, utility spells, and powerful bossing DPS. It is also key to many quests and diaries.",
    methods: [
      "Levels 1–55: Low-level combat spells, quest rewards, and teleports.",
      "Levels 55–75: High Alchemy, stun/alch, or burst/barrage training in multi-combat zones.",
      "Levels 75–99: Ice burst/barrage at dense mobs, or magic-based bossing and raids."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Magic_training"
  },
  {
    id: "hitpoints",
    name: "Hitpoints",
    category: "Combat",
    xpPerHour: 20000,
    xpPerAction: 50,
    description:
      "Hitpoints level automatically as you train other combat stats. Dedicated HP training is rare outside of niche builds.",
    methods: [
      "Train naturally while focusing on your Attack/Strength/Defence/Ranged/Magic goals.",
      "High-intensity burst/barrage and chinning give very fast Hitpoints XP incidentally.",
      "Pure or special builds may use controlled methods to keep Hitpoints low."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Hitpoints"
  },
  {
    id: "prayer",
    name: "Prayer",
    category: "Support",
    xpPerHour: 220000,
    xpPerAction: 250,
    description:
      "Prayer unlocks overheads, protection prayers, and Piety-style buffs. Training is mostly bone-based and gp-intensive.",
    methods: [
      "Levels 1–43: Burying or using basic bones at an altar or Ectofuntus.",
      "Levels 43–70: Dragon bones on a gilded altar with burners lit.",
      "Levels 70–99: Dragon / Superior dragon bones at a gilded altar or chaos altar for high risk/reward."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Prayer_training"
  },
  {
    id: "runecraft",
    name: "Runecraft",
    category: "Gathering",
    xpPerHour: 35000,
    xpPerAction: 220,
    description:
      "Runecraft is slow but profitable. Newer methods like Guardians of the Rift make it much more manageable.",
    methods: [
      "Levels 1–44: Quest XP and basic altar runs.",
      "Levels 44–77: ZMI or Guardians of the Rift for balanced XP and profit.",
      "Levels 77–99: Blood/Death runes or highly optimized Guardians of the Rift runs."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Runecraft_training"
  },
  {
    id: "construction",
    name: "Construction",
    category: "Artisan",
    xpPerHour: 350000,
    xpPerAction: 300,
    description:
      "Construction is very fast but expensive. You train inside your Player-Owned House using planks and butlers.",
    methods: [
      "Levels 1–33: Basic chairs, bookcases, and larders.",
      "Levels 33–70: Oak larders and oak dungeon doors with a butler.",
      "Levels 70–99: Mahogany tables, dungeon doors, or gilded altars in a tick-efficient fashion."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Construction_training"
  },
  {
    id: "agility",
    name: "Agility",
    category: "Support",
    xpPerHour: 55000,
    xpPerAction: 300,
    description:
      "Agility increases run energy and unlocks useful shortcuts. Training is click-intensive but pays off across the entire game.",
    methods: [
      "Levels 1–30: Gnome and Draynor rooftop courses.",
      "Levels 30–60: Varrock, Canifis, and other rooftop courses with marks of grace.",
      "Levels 60–99: Seers', Pollnivneach, Ardougne rooftops or Hallowed Sepulchre for big XP."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Agility_training"
  },
  {
    id: "herblore",
    name: "Herblore",
    category: "Artisan",
    xpPerHour: 220000,
    xpPerAction: 180,
    description:
      "Herblore lets you create potions used in PvM and skilling. It's typically trained with grimy herbs and secondary ingredients.",
    methods: [
      "Levels 1–38: Low level attack, strength, and energy potions from early herbs.",
      "Levels 38–72: Prayer, super attack/strength, and mix of mid-tier potions.",
      "Levels 72–99: Ranging, magic, antifire, and high-level combination potions depending on budget."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Herblore_training"
  },
  {
    id: "thieving",
    name: "Thieving",
    category: "Support",
    xpPerHour: 190000,
    xpPerAction: 150,
    description:
      "Thieving provides cash and supplies from pickpocketing and stalls. High-level methods are intense but extremely fast.",
    methods: [
      "Levels 1–38: Men, women, baker's stalls, and early quests.",
      "Levels 38–65: Master farmers and blackjacking for seeds and decent XP.",
      "Levels 65–99: Ardy knights, pyramid plunder, or advanced blackjacking methods."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Thieving_training"
  },
  {
    id: "crafting",
    name: "Crafting",
    category: "Artisan",
    xpPerHour: 200000,
    xpPerAction: 150,
    description:
      "Crafting is flexible and can be both expensive or profitable depending on method. It unlocks jewellery, armour, and diaries.",
    methods: [
      "Levels 1–46: Leather, jewellery, and early quests.",
      "Levels 46–70: Battlestaves, glassblowing, or dragonhide crafting.",
      "Levels 70–99: High-level dragonhide bodies or effective battlestaff methods."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Crafting_training"
  },
  {
    id: "fletching",
    name: "Fletching",
    category: "Artisan",
    xpPerHour: 260000,
    xpPerAction: 100,
    description:
      "Fletching is fast and often semi-AFK. It creates bows, bolts, and ammunition for Ranged.",
    methods: [
      "Levels 1–35: Early arrow shafts, shortbows, and longbows.",
      "Levels 35–70: Maple and yew longs, or darts if unlocked.",
      "Levels 70–99: High-level bows, darts, or broad arrows depending on bank and goals."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Fletching_training"
  },
  {
    id: "slayer",
    name: "Slayer",
    category: "Combat",
    xpPerHour: 25000,
    xpPerAction: 120,
    description:
      "Slayer assigns specific monsters to kill, unlocking powerful drops and boss access. XP/hr is modest but highly valuable.",
    methods: [
      "Do tasks from appropriate Slayer masters as your combat stats rise.",
      "Use Slayer helm, cannon, and prayer when possible for better XP/hr.",
      "Focus on efficient tasks; consider blocking/smashing slow ones."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Slayer_training"
  },
  {
    id: "hunter",
    name: "Hunter",
    category: "Gathering",
    xpPerHour: 85000,
    xpPerAction: 160,
    description:
      "Hunter is a versatile skill used for chinchompas, implings, and herbiboars. XP rates climb quickly with levels.",
    methods: [
      "Levels 1–29: Birds, junk critters, and early quests.",
      "Levels 29–60: Swamp lizards, salamanders, and early chin spots.",
      "Levels 60–99: Red/black chinchompas, herbiboar on Fossil Island, or high-level birdhouse runs."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Hunter_training"
  },
  {
    id: "mining",
    name: "Mining",
    category: "Gathering",
    xpPerHour: 50000,
    xpPerAction: 80,
    description:
      "Mining provides ores for Smithing and profit. It can be fairly AFK or very click-intensive based on method.",
    methods: [
      "Levels 1–30: Copper and tin for bronze, early iron at 15.",
      "Levels 30–70: Iron power-mining, motherlode mine, or 3-tick granite.",
      "Levels 70–99: High-level granite, amethyst, or very efficient 3-tick methods."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Mining_training"
  },
  {
    id: "smithing",
    name: "Smithing",
    category: "Artisan",
    xpPerHour: 220000,
    xpPerAction: 170,
    description:
      "Smithing turns bars into useful or profitable items. Blast furnace and giants' foundry greatly improve XP and profit.",
    methods: [
      "Levels 1–40: Bronze and iron items, quest XP, and early steel.",
      "Levels 40–70: Steel/iron items, blast furnace bars, or giants' foundry.",
      "Levels 70–99: Gold/steel at blast furnace or very efficient giants' foundry metas."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Smithing_training"
  },
  {
    id: "fishing",
    name: "Fishing",
    category: "Gathering",
    xpPerHour: 38000,
    xpPerAction: 100,
    description:
      "Fishing is a classic AFK money-maker. Higher tiers unlock strong food and great XP/hr spots.",
    methods: [
      "Levels 1–40: Small net and bait fishing, quests like Sea Slug.",
      "Levels 40–70: Lobsters, tuna/swordfish, and barbarian fishing.",
      "Levels 70–99: Barbarian fly-fishing, harpooning at high-tier spots, or afk fish like anglerfish."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Fishing_training"
  },
  {
    id: "cooking",
    name: "Cooking",
    category: "Artisan",
    xpPerHour: 250000,
    xpPerAction: 120,
    description:
      "Cooking is fast, cheap, and chill. Most players hit 99 here early with minimal effort.",
    methods: [
      "Levels 1–40: Low-level fish from quests or early fishing.",
      "Levels 40–70: Cheap mid-tier fish or wines for fast XP.",
      "Levels 70–99: High-tier fish or jugs of wine for extremely fast XP/hr."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Cooking_training"
  },
  {
    id: "firemaking",
    name: "Firemaking",
    category: "Gathering",
    xpPerHour: 260000,
    xpPerAction: 150,
    description:
      "Firemaking used to be a meme skill, but Wintertodt turned it into a profitable, quick 99 with good loot.",
    methods: [
      "Levels 1–50: Normal, oak, and willow logs in a straight line.",
      "Levels 50–99: Wintertodt for loot, crates, and very fast Firemaking XP.",
      "High levels: Alternative log burning for AFK training if you dislike Wintertodt."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Firemaking_training"
  },
  {
    id: "woodcutting",
    name: "Woodcutting",
    category: "Gathering",
    xpPerHour: 50000,
    xpPerAction: 100,
    description:
      "Woodcutting is fairly AFK and can be combined with skilling on a second monitor. Good money at high levels.",
    methods: [
      "Levels 1–45: Normal, oak, and willow trees.",
      "Levels 45–75: Teaks, maples, and willows at great AFK spots.",
      "Levels 75–99: Teaks, redwoods, or other meta training trees for XP and logs."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Woodcutting_training"
  },
  {
    id: "farming",
    name: "Farming",
    category: "Gathering",
    xpPerHour: 20000,
    xpPerAction: 1000,
    description:
      "Farming is trained in cycles via patches. Short, consistent farm runs add up to 99 over time with strong profit.",
    methods: [
      "Levels 1–40: Allotments and herbs with compost and teleports.",
      "Levels 40–70: Fruit trees, herbs, and mid-tier tree runs.",
      "Levels 70–99: Magic trees, high-level fruit trees, and consistent herb patches."
    ],
    guideUrl: "https://oldschool.runescape.wiki/w/Farming_training"
  }
];

function populateSkillSelect() {
  const select = document.getElementById("skillSelect");
  skills.forEach(skill => {
    const opt = document.createElement("option");
    opt.value = skill.id;
    opt.textContent = skill.name;
    select.appendChild(opt);
  });
}

function populateSkillCards() {
  const container = document.getElementById("skillDetails");
  container.innerHTML = "";

  skills.forEach(skill => {
    const card = document.createElement("article");
    card.className = "skill-card";

    const headerRow = document.createElement("div");
    headerRow.className = "skill-header-row";

    const name = document.createElement("div");
    name.className = "skill-name";
    name.textContent = skill.name;

    const tag = document.createElement("span");
    tag.className = "skill-tag";
    tag.textContent = skill.category;

    headerRow.appendChild(name);
    headerRow.appendChild(tag);

    const body = document.createElement("div");
    body.className = "skill-body";

    const desc = document.createElement("p");
    desc.textContent = skill.description;
    body.appendChild(desc);

    const methodsList = document.createElement("ul");
    methodsList.className = "skill-methods";
    skill.methods.forEach(m => {
      const li = document.createElement("li");
      li.textContent = m;
      methodsList.appendChild(li);
    });
    body.appendChild(methodsList);

    const meta = document.createElement("div");
    meta.className = "skill-meta";

    const xpTag = document.createElement("span");
    xpTag.className = "xp-rate";
    xpTag.textContent = `~${formatNumber(skill.xpPerHour)} XP/hr`;

    const guideLink = document.createElement("a");
    guideLink.href = skill.guideUrl;
    guideLink.target = "_blank";
    guideLink.rel = "noopener noreferrer";
    guideLink.textContent = "Open training guide ↗";

    meta.appendChild(xpTag);
    meta.appendChild(guideLink);

    card.appendChild(headerRow);
    card.appendChild(body);
    card.appendChild(meta);

    container.appendChild(card);
  });
}

function calculateXp() {
  const skillId = document.getElementById("skillSelect").value;
  const currentLevel = parseInt(document.getElementById("currentLevel").value, 10);
  const targetLevel = parseInt(document.getElementById("targetLevel").value, 10);
  const results = document.getElementById("results");
  const skill = skills.find(s => s.id === skillId);

  if (!skill) {
    results.innerHTML = "<p>Pick a skill to see XP, actions, and hours.</p>";
    return;
  }

  if (isNaN(currentLevel) || isNaN(targetLevel) || currentLevel < 1 || targetLevel > 99 || targetLevel <= currentLevel) {
    results.innerHTML = "<p>Please enter a valid level range (current &lt; target, 1–99).</p>";
    return;
  }

  const xpCurrent = levelToXp(currentLevel);
  const xpTarget = levelToXp(targetLevel);
  const xpNeeded = xpTarget - xpCurrent;

  const hours = xpNeeded / skill.xpPerHour;
  const actions = xpNeeded / skill.xpPerAction;
  const actionsPerHour = skill.xpPerHour / skill.xpPerAction;

  const html = `
    <h3>${skill.name} XP plan (${currentLevel} ➜ ${targetLevel})</h3>
    <div class="results-figures">
      <div class="pill">
        <strong>${formatNumber(xpNeeded)} XP</strong>
        total experience needed
      </div>
      <div class="pill">
        <strong>${hours.toFixed(1)} hours</strong>
        at ~${formatNumber(skill.xpPerHour)} XP/hr
      </div>
      <div class="pill">
        <strong>${Math.ceil(actions).toLocaleString()} actions</strong>
        (~${Math.round(actionsPerHour).toLocaleString()} per hour)
      </div>
      <div class="pill">
        <strong>${skill.category}</strong>
        training type
      </div>
    </div>
    <p>
      Example ${skill.name} training could include:
    </p>
    <ul>
      ${skill.methods.map(m => `<li>${escapeHtml(m)}</li>`).join("")}
    </ul>
    <p class="skill-results-note">
      These XP/hr and action numbers are rough estimates based on mid-game, members training methods.
      Your real rates will change with level, gear, quests, and click-intensity. For optimal methods,
      check the linked ${skill.name} guide in the sidebar.
    </p>
  `;

  results.innerHTML = html;
}

function formatNumber(num) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return Math.round(num / 1_000) + "k";
  }
  return num.toLocaleString();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  populateSkillSelect();
  populateSkillCards();
});