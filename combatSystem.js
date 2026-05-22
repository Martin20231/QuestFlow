// combatSystem.js - VOLLSTÄNDIGER CODE

export function initActiveBattle(character, enemyStrength) {
  return {
    playerMaxHp: character.stats.ausdauer * 10,
    playerHp: character.stats.ausdauer * 10,
    playerStaerke: character.stats.staerke,
    playerGlueck: character.stats.glueck,
    
    enemyMaxHp: enemyStrength * 12,
    enemyHp: enemyStrength * 12,
    enemyStrength: enemyStrength,
    
    turn: 'player', 
    log: ['⚔️ Der Kampf beginnt! Wähle deine Aktion.']
  };
}

export function executePlayerAction(battle, actionType) {
  if (battle.turn !== 'player' || battle.playerHp <= 0 || battle.enemyHp <= 0) return battle;

  let damage = 0;
  let logMessage = "";
  const isCrit = Math.random() * 100 < Math.min(battle.playerGlueck * 2, 50);

  switch (actionType) {
    case 'normal':
      damage = Math.floor(battle.playerStaerke * (0.8 + Math.random() * 0.4));
      logMessage = `⚔️ Du führst einen normalen Angriff aus für ${damage} Schaden.`;
      break;
    case 'wucht':
      if (Math.random() > 0.3) {
        damage = Math.floor(battle.playerStaerke * 1.8);
        logMessage = `🔨 WUCHTANGRIFF! Du zerschmetterst den Gegner für ${damage} Schaden!`;
      } else {
        logMessage = `💨 Dein Wuchtangriff ging komplett daneben!`;
      }
      break;
    case 'fint':
      damage = Math.floor(battle.playerStaerke * 0.7);
      logMessage = `🗡️ Schnelle Finte! Du triffst sicher für ${damage} Schaden.`;
      break;
  }

  if (damage > 0 && isCrit) {
    damage *= 2;
    logMessage += " (KRITISCHER TREFFER! 💥)";
  }

  battle.enemyHp = Math.max(0, battle.enemyHp - damage);
  battle.log.push(logMessage);

  if (battle.enemyHp > 0) {
    battle.turn = 'enemy';
  } else {
    battle.log.push("🎉 Du hast den Gegner besiegt!");
  }

  return battle;
}

export function executeEnemyAction(battle) {
  if (battle.turn !== 'enemy' || battle.enemyHp <= 0) return battle;

  let damage = Math.floor(battle.enemyStrength * (0.7 + Math.random() * 0.5));
  battle.playerHp = Math.max(0, battle.playerHp - damage);
  battle.log.push(`👹 Der Gegner kontert und fügt dir ${damage} Schaden zu.`);

  if (battle.playerHp <= 0) {
    battle.log.push("💀 Du wurdest kampfunfähig gemacht...");
  } else {
    battle.turn = 'player';
  }

  return battle;
}