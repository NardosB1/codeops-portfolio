import "./globals.css";

export const metadata = {
  title: "Addis Eats",
  description: "Addis Eats dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}