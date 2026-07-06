import HeroPoc from "@/components/poc/HeroPoc";
import TeamStackPoc from "@/components/poc/TeamStackPoc";
import "./poc.css";

export const metadata = {
  title: "Design Motion POC | Suzana Ali & Partners",
  description: "Scroll-driven motion and interaction proof-of-concept."
};

export default function PocPage() {
  return (
    <main className="poc-page">
      <HeroPoc />
      <TeamStackPoc />
      <footer className="poc-footer">
        <p>Motion POC - not final design. Assets, palette and copy are placeholders for review.</p>
        <a href="/">← Back to current site</a>
      </footer>
    </main>
  );
}
