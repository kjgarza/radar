import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Technology Radar",
  description: "About this Technology Radar and why it exists",
};

export default function AboutPage() {
  return (
    <div className="min-h-[80vh] flex items-start justify-center px-6 py-16 md:py-24">
      <article className="prose prose-lg prose-zinc dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-pretty prose-hr:my-12 prose-hr:border-border/50 max-w-2xl">
        <header className="mb-12 not-prose">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            About This Radar
          </h1>
          <p className="text-lg text-muted-foreground">
            A personal inventory of technologies, frameworks, and practices.
          </p>
        </header>

        <p className="lead text-xl leading-relaxed">
          In 2012, ThoughtWorks published what has become the canonical format for technology assessment: the Technology Radar, a visualization that organizes tools, frameworks, techniques, and platforms into concentric rings (Adopt, Trial, Assess, Hold) across four quadrants, creating not quite a prediction and not quite a prescription but something closer to honest inventory, the kind of stocktaking that forces you to articulate what you&apos;re actually using versus what you&apos;re merely enthusiastic about.
        </p>

        <p>
          Since then, hundreds of organizations and thousands of individuals have created their own radars, each one a snapshot of technical opinion at a particular moment, each one claiming comprehensiveness while inevitably revealing gaps.
        </p>

        <p>
          This is mine, published at the end of 2025, which feels both arbitrary and somehow necessary, the way certain acts of reflection feel necessary not because they&apos;re urgent but because postponing them further would constitute a kind of dishonesty. The motivation is partially professional (it is useful, I think, to have documented positions on FastAPI versus other frameworks, on why the Model Context Protocol matters despite its limitations) but mostly personal—about taking stock of what I have learned recently, not in the distant past but in these months when new tools appear weekly and old assumptions dissolve daily.
        </p>

        <p>
          I didn&apos;t encounter my first Technology Radar until 2018, and at the time it struck me as both presumptuous (who decides what belongs in Hold versus Assess, who claims that authority) and oddly comforting, the way any act of organization provides comfort even when we know the categories are provisional, the boundaries permeable, the whole structure subject to revision.
        </p>

        <p>
          This radar is incomplete—I am already noticing omissions, tools I use daily but forgot to document, techniques I&apos;m still figuring out how to name—and I am publishing it anyway because waiting for comprehensiveness would mean never publishing at all. The rings suggest a progression, a linear movement from assessment toward adoption or abandonment, but the reality is messier: I have technologies in Hold that I used to love, tools in Trial that should probably be in Adopt but I&apos;m not yet ready to commit fully.
        </p>

        <p>
          I hope to maintain this, to update it as things shift and evolve, which they will, which is perhaps the only certainty in technical work: that what we adopt today we might abandon tomorrow, that the map is never the territory and the radar is never the practice itself but only one way of making sense of what we&apos;re learning and what we&apos;re leaving behind.
        </p>

        <p>
          If you&apos;re reading this, I would value your thoughts—your disagreements especially, your notice of what I&apos;ve missed, your alternative categorizations. This is published not as definitive statement but as invitation, as one practitioner&apos;s attempt to reflect honestly on what he&apos;s actually doing versus what he thinks he should be doing.
        </p>

        <hr />

        <footer className="not-prose pt-2">
          <p className="font-semibold text-foreground">Kristian Garza</p>
          <p className="text-sm text-muted-foreground">Berlin, January 2026</p>
        </footer>
      </article>
    </div>
  );
}
