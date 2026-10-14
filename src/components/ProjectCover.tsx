import { useState } from "react";

export default function ProjectCover({
  src,
  title,
  className = "",
}: {
  src?: string;
  title: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border bg-card ${className}`}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={title}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/25 to-accent/25 font-display text-4xl font-bold text-foreground/70">
          {title.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/50 to-transparent" />
    </div>
  );
}
