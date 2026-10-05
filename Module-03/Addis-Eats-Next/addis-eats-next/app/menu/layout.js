import CategoryBar from "./CategoryBar";

export default function MenuLayout({ children }) {
return (
    <div className="flex">
        <aside className="w-64 p-4 bg-gray-100 min-h-screen">
        <CategoryBar />
        </aside>
    <div className="flex-grow">{children}</div>
    </div>
);
}