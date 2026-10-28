import MenuShell from "./MenuShell";
import { getCategories } from "@/lib/dishes";

export default async function MenuLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  return <MenuShell categories={categories}>{children}</MenuShell>;
}