export default function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-muted">Cet écran arrive à la prochaine étape.</p>
    </div>
  );
}
