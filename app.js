// app.js
import { createCharacter, generateQuests, buyStat, simulateBattle, completeQuest, getMaxHp } from './gameEngine.js';

// Spielstand initialisieren
let player = createCharacter("Krieger von Electron");
let availableQuests = [];

// DOM Elemente holen
const updateUI = () => {
  document.getElementById("char-name").innerText = player.name;
  document.getElementById("char-level").innerText = player.level;
  document.getElementById("char-gold").innerText = player.gold;
  document.getElementById("char-alu").innerText = player.alu;
  document.getElementById("char-xp").innerText = player.xp;
  document.getElementById("char-xp-needed").innerText = player.xpNeeded;
  document.getElementById("stat-staerke").innerText = player.stats.staerke;
  document.getElementById("stat-ausdauer").innerText = player.stats.ausdauer;
  document.getElementById("char-hp").innerText = getMaxHp(player);
  document.getElementById("stat-glueck").innerText = player.stats.glueck;

  // Stat-Kosten an den Buttons anzeigen
  document.getElementById("buy-staerke").innerText = `+ (${Math.floor(player.stats.staerke * 1.5)}g)`;
  document.getElementById("buy-ausdauer").innerText = `+ (${Math.floor(player.stats.ausdauer * 1.5)}g)`;
  document.getElementById("buy-glueck").innerText = `+ (${Math.floor(player.stats.glueck * 1.5)}g)`;
};

// Event Listener für Stat-Käufe
const setupStatButtons = () => {
  ['staerke', 'ausdauer', 'glueck'].forEach(stat => {
    document.getElementById(`buy-${stat}`).onclick = () => {
      buyStat(player, stat);
      updateUI();
    };
  });
};

// Quests auf dem Brett anzeigen
const renderQuests = () => {
  const board = document.getElementById("quest-board");
  board.innerHTML = "";

  if (player.alu <= 0) {
    board.innerHTML = "<p>Du bist zu müde! Keine Alu mehr für heute.</p>";
    return;
  }

  availableQuests = generateQuests(player);

  availableQuests.forEach((quest, index) => {
    const qDiv = document.createElement("div");
    qDiv.className = "quest-card";
    qDiv.innerHTML = `
      <h4>${quest.name}</h4>
      <p>⏱️ Alu-Kosten: ${quest.aluCost} min | 💰 Gold: ${quest.goldReward} | ⭐ XP: ${quest.xpReward}</p>
      <button class="btn" id="start-q-${index}">Quest starten</button>
    `;
    board.appendChild(qDiv);

    document.getElementById(`start-q-${index}`).onclick = () => startQuest(quest);
  });
};

// Quest-Timer starten
const startQuest = (quest) => {
  if (player.alu < quest.aluCost) {
    alert("Nicht genug Alu!");
    return;
  }

  player.alu -= quest.aluCost;
  player.currentQuest = quest;
  updateUI();

  // Verstecke das Questbrett, zeige den Timer
  document.getElementById("quest-board").style.display = "none";
  document.getElementById("timer-box").style.display = "block";

  // Wir faken die "Minuten" hier als Sekunden fürs schnelle Testen!
  let duration = quest.aluCost; 
  let current = 0;
  const progress = document.getElementById("quest-progress");
  const timerText = document.getElementById("timer-text");

  const interval = setInterval(() => {
    current++;
    let percent = (current / duration) * 100;
    progress.style.width = `${percent}%`;
    timerText.innerText = `${duration - current}s verbleibend`;

    if (current >= duration) {
      clearInterval(interval);
      finishQuest(quest);
    }
  }, 1000); // 1 Tick pro Sekunde
};

// Quest beenden, Kampf ausrechnen
const finishQuest = (quest) => {
  // 1. Kampf simulieren
  const battleResult = simulateBattle(player, quest.enemyStrength);
  
  // 2. Kampf-Log ausgeben
  const logBox = document.getElementById("combat-log");
  logBox.innerHTML = battleResult.log.join("<br>");
  logBox.scrollTop = logBox.scrollHeight; // Auto-Scroll nach unten

  // 3. Belohnungen verarbeiten
  const reward = completeQuest(player, quest, battleResult.won);
  if (reward.leveledUp) {
    alert("⚡ LEVEL UP! Du bist stärker geworden!");
  } else {
    alert(reward.message);
  }

  // UI zurücksetzen
  document.getElementById("quest-board").style.display = "block";
  document.getElementById("timer-box").style.display = "none";
  
  renderQuests();
  updateUI();
};

// Spiel starten
setupStatButtons();
updateUI();
renderQuests();