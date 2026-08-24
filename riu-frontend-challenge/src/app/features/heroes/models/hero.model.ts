export interface Hero {
  id: number;
  name: string;
  superpower: string;
  weakness: string;
  enemy: string;
}

export type HeroCreateRequest = Omit<Hero, 'id'>;
