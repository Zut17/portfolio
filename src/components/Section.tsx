import type { ReactNode } from "react";
import Reveal from "./Reveal";

/** Section du site : titre sobre, phrase d'introduction facultative. */
export default function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <span aria-hidden="true" className="mb-4 block h-px w-10 bg-accent" />
            <h2 id={headingId} className="display text-5xl md:text-6xl">
              {title}
              <span className="text-accent">.</span>
            </h2>
            {intro && <p className="mt-3 text-lg leading-relaxed text-muted">{intro}</p>}
          </div>
        </Reveal>
        <Reveal delay={0.1}>{children}</Reveal>
      </div>
    </section>
  );
}
