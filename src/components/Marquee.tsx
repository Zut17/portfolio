const techs = [
  "React",
  "React Native",
  "TypeScript",
  "C# .NET",
  "Java",
  "Supabase",
  "Tailwind",
  "SQL",
];

export default function Marquee() {
  const row = [...techs, ...techs];

  return (
    <div
      aria-label={techs.join(", ")}
      className="overflow-hidden border-y border-border py-6"
    >
      <div className="marquee" aria-hidden="true">
        {row.map((tech, index) => (
          <span
            key={`${tech}-${index}`}
            className="display-outline mx-8 whitespace-nowrap text-5xl md:text-7xl"
          >
            {tech}
            <span className="ml-16 text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
