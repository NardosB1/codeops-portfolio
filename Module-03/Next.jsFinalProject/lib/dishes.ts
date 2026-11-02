import "server-only";

export type Category = "Mains" | "Fasting" | "Starters" | "Drinks";
export type Dish = {
  id: string; // also the URL slug
  name: string;
  category: Category;
  priceEtb: number;
  description: string;
  special?: boolean;
};

const DISHES: readonly Dish[] = [
  { id: "kitfo", name: "Kitfo", category: "Mains", priceEtb: 520, special: true,
    description: "Minced beef warmed in spiced butter and mitmita, served with ayib." },
  { id: "doro-wat", name: "Doro Wat", category: "Mains", priceEtb: 480, special: true,
    description: "Slow-cooked chicken stew in berbere with a hard-boiled egg." },
  { id: "tibs", name: "Beef Tibs", category: "Mains", priceEtb: 450,
    description: "Sautéed beef cubes with onion, rosemary and green chilli." },
  { id: "firfir", name: "Firfir", category: "Mains", priceEtb: 260,
    description: "Shredded injera tossed in spicy berbere sauce." },
  { id: "shiro", name: "Shiro", category: "Fasting", priceEtb: 220, special: true,
    description: "Chickpea stew simmered with garlic and onion. Vegan." },
  { id: "beyaynetu", name: "Beyaynetu", category: "Fasting", priceEtb: 300,
    description: "Fasting platter of lentils, greens, split peas and salad on injera." },
  { id: "misir-wat", name: "Misir Wat", category: "Fasting", priceEtb: 240,
    description: "Red lentils cooked in berbere sauce." },
  { id: "sambusa", name: "Sambusa", category: "Starters", priceEtb: 60,
    description: "Crisp pastry triangles filled with spiced lentils." },
  { id: "azifa", name: "Azifa", category: "Starters", priceEtb: 120,
    description: "Cold green lentil salad with mustard and lemon." },
  { id: "buna", name: "Ethiopian Coffee", category: "Drinks", priceEtb: 50,
    description: "Fresh-roasted coffee brewed in the traditional way." },
  { id: "tej", name: "Tej", category: "Drinks", priceEtb: 90,
    description: "Spiced honey wine." },
  { id: "spris", name: "Spris Juice", category: "Drinks", priceEtb: 70,
    description: "Layered avocado and mango juice." },
];

// Sync lookup used by lib/orders.ts. Pages use the async functions below.
export const findDish = (id: string) => DISHES.find((d) => d.id === id);

// Async on purpose: this stands in for a database call, so swapping in a real one changes nothing else.
export async function getDishes(opts: { category?: string; q?: string } = {}): Promise<Dish[]> {
  const q = opts.q?.trim().toLowerCase().slice(0, 50);
  return DISHES.filter(
    (d) =>
      (!opts.category || d.category === opts.category) &&
      (!q || d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)),
  );
}

export async function getDish(id: string): Promise<Dish | null> {
  return findDish(id) ?? null;
}

export async function getTodaysSpecials(): Promise<Dish[]> {
  return DISHES.filter((d) => d.special);
}

export async function getCategories(): Promise<Category[]> {
  return [...new Set(DISHES.map((d) => d.category))];
}
