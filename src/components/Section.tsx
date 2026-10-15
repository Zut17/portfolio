import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function Section({
  id,
  index,
  kicker,
  title,
  children,
}: {
  id: string;
  index?: string;
  tone?: string;
  kicker?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <Reveal>
          <div className="mb-10 flex flex-col gap-2 md:mb-14">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="eyebrow">
                {index ? `${index} / ` : ""}
                {id}
              </span>
            </div>
            {kicker && (
              <span className="script text-2xl md:text-3xl">{kicker}</span>
            )}
            <h2 className="display text-6xl md:text-9xl">
              {title}
              <span className="text-accent">.</span>
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>{children}</Reveal>
      </div>
    </section>
  );
}
