import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">Addis Eats — built for the mini-project brief.</footer>
    </div>
  );
}
