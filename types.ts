export interface StandStats {
  power: string; // A-E
  speed: string;
  range: string;
  durability: string;
  precision: string;
  potential: string;
}

export interface StandProfile {
  name: string;
  user: string;
  appearanceDescription: string;
  abilityName: string;
  abilityDescription: string;
  battleCry: string; // e.g., ORA ORA
  stats: StandStats;
}

export interface GeneratedStand extends StandProfile {
  imageUrl?: string;
}
