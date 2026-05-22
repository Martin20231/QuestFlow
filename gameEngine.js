// gameEngine.js - VOLLSTÄNDIGER CODE

export function createCharacter(name) {
  return {
    name: name,
    level: 1,
    xp: 0,
    xpNeeded: 100,
    gold: 50,
    alu: 100, 
    stats: {
      staerke: 10,   
      ausdauer: 10,  
      glueck: 5      
    }
  };
}

export function getMaxHp(character) {
  return character.stats.ausdauer * 10;
}

export function buyStat(character, statName) {
  const cost = Math.floor(character.stats[statName] * 1.5);
  if (character.gold >= cost) {
    character.gold -= cost;
    character.stats[statName]++;
    return { success: true, message: `${statName} erhöht!` };
  }
  return { success: false, message: "Nicht genug Gold!" };
}

export function generateQuests(character) {
  const questTypes = [
    { name: "Verprügle den fiesen Straßenräuber", aluCost: 5, xpReward: 20, goldReward: 15, enemyStrength: 8 },
    { name: "Suche nach der verlorenen Socke des Magiers", aluCost: 10, xpReward: 35, goldReward: 25, enemyStrength: 12 },
    { name: "Säubere die Kanalisation von Riesenratten", aluCost: 15, xpReward: 50, goldReward: 40, enemyStrength: 15 }
  ];

  return questTypes.map(quest => ({
    ...quest,
    xpReward: quest.xpReward * character.level,
    goldReward: quest.goldReward * character.level,
    enemyStrength: quest.enemyStrength * character.level
  }));
}

export function completeQuest(character, quest, won) {
  if (!won) {
    return { message: "Quest fehlgeschlagen! Du hast den Kampf verloren.", leveledUp: false };
  }

  character.xp += quest.xpReward;
  character.gold += quest.goldReward;

  let leveledUp = false;
  if (character.xp >= character.xpNeeded) {
    character.xp -= character.xpNeeded;
    character.level++;
    character.xpNeeded = Math.floor(character.xpNeeded * 1.5);
    character.stats.staerke += 2;
    character.stats.ausdauer += 2;
    leveledUp = true;
  }

  return {
    message: `Erfolg! +${quest.goldReward} Gold, +${quest.xpReward} XP erhalten.`,
    leveledUp
  };
}