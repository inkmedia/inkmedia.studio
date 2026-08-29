import { SiteHeader } from "./SiteChrome";

export default function TitlePage({
  title,
  tone = "default",
}: {
  title: string;
  tone?: "default" | "pastel-green";
}) {
  return (
    <main className={`title-page title-page--${tone}`} id="top">
      <SiteHeader />
      <section className="title-page-hero">
        <h1>{title}</h1>
      </section>
    </main>
  );
}
