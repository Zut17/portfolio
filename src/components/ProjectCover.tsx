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
      className={`relative overflow-hidden rounded-2xl border border-border bg-background ${className}`}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={title}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-muted">
          {title.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
}
