/**
 * Calculate player stats from on-chain inventory
 */
export function calculateStats(inventory) {
  const swordCount = inventory[2] || 0;
  const shieldCount = inventory[3] || 0;
  const goldCount = inventory[0] || 0;
  const crownCount = inventory[4] || 0;

  const baseAttack = 15;
  const baseDefense = 5;
  const baseHP = 150;

  // Sword → +50 ATK per unit (no cap)
  const attackBonus = swordCount * 50;
  // Shield → +40 DEF per unit (no cap)
  const defenseBonus = shieldCount * 40;
  // Gold gives bonus HP
  const hpBonus = goldCount > 0 ? 50 : 0;
  // Crown gives bonus to everything
  const crownBonus = crownCount > 0 ? 25 : 0;

  return {
    attack: baseAttack + attackBonus + crownBonus,
    defense: baseDefense + defenseBonus + crownBonus,
    maxHP: baseHP + hpBonus + (crownBonus * 2),
    swordCount: swordCount,
    shieldCount: shieldCount,
    hasCrown: crownCount > 0,
    hasGold: goldCount > 0,
  };
}

/**
 * Calculate damage dealt
 */
export function calculateDamage(attackPower, defenderDefense) {
  const baseDamage = Math.max(1, attackPower - defenderDefense * 0.25);
  // Add some randomness ±15%
  const variance = 0.85 + Math.random() * 0.3;
  return Math.round(baseDamage * variance);
}

/**
 * Boss stats
 */
export const BOSS_STATS = {
  name: "Dark Dragon",
  maxHP: 400,
  attack: 20,
  defense: 8,
  attackInterval: 3000, // ms between attacks (slower)
};
