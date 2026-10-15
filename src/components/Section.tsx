import type { ReactNode } from "react";
import Reveal from "./Reveal";

type Tone = "plain" | "blue" | "orange" | "mix";

const tones: Record<Tone, string> = {
  plain: "",
  blue: "bg-primary/[0.07]",
  orange: "bg-accent/[0.07]",
  mix: "bg-linear-to-br from-primary/15 via-transparent to-accent/15",
};

export default function Section({
  id,
  index,
  title,
  tone = "plain",
  children,
}: {
  id: string;
  index?: string;
  title: string;
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-16 overflow-hidden ${tones[tone]}`}
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <div className="mb-14">
            {index && (
              <p className="mb-3 font-mono text-sm text-primary">{`// ${index}`}</p>
            )}
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
              {title}
              <span className="text-accent">.</span>
            </h2>
            <div className="mt-6 h-px w-full bg-linear-to-r from-primary via-primary/20 to-transparent" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>{children}</Reveal>
      </div>
    </section>
  );
}
