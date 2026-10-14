import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="mx-auto max-w-6xl scroll-mt-16 px-6 py-28 md:py-36"
    >
      <Reveal>
        <div className="mb-14 flex items-end justify-between gap-6 border-b border-border pb-6">
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
            {title}
          </h2>
          {index && (
            <span className="font-display text-xl text-accent md:text-2xl">
              {index}
            </span>
          )}
        </div>
      </Reveal>
      <Reveal delay={0.1}>{children}</Reveal>
    </section>
  );
}
