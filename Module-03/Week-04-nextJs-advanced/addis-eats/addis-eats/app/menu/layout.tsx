import { getCategories, getDishes } from "@/lib/dishes";
import MenuShell from "./MenuShell";

// Server layout: reads the data, hands it to the client shell. The dish list itself
// arrives as `children`, so it stays server-rendered HTML.
export default async function MenuLayout({ children }: { children: React.ReactNode }) {
  const [categories, dishes] = await Promise.all([getCategories(), getDishes()]);
  // Only what the client needs to count and filter: ids and categories.
  const refs = dishes.map((d) => ({ id: d.id, category: d.category }));
  return (
    <MenuShell categories={categories} dishes={refs}>
      {children}
    </MenuShell>
  );
}
