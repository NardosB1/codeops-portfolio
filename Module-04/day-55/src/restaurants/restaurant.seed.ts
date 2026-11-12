// Stand-in for your class's restaurants resource: four restaurants, ids 1-4.
// If you already have a real one, keep yours and point DishesService at it.
export interface Restaurant {
  readonly id: number;
  name: string;
  area: string;
}

export const RESTAURANT_SEED: Restaurant[] = [
  { id: 1, name: "Habesha Table", area: "Bole" },
  { id: 2, name: "Kazanchis Grill", area: "Kazanchis" },
  { id: 3, name: "Piassa Corner Cafe", area: "Piassa" },
  { id: 4, name: "Megenagna Buna House", area: "Megenagna" },
];