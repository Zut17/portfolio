import SimpleCrud from "./SimpleCrud";

const horizons: Record<string, string> = {
  past: "Étape franchie",
  now: "Aujourd'hui",
  next: "Prochaine étape",
};

export default function GoalsAdmin() {
  return (
    <SimpleCrud
      table="goals"
      title="Objectifs"
      subtitle="Étapes passé → aujourd'hui → demain de la section Objectifs. L'ambition générale se modifie dans Profil."
      newLabel="Nouvelle étape"
      defaults={{ horizon: "next" }}
      fields={[
        {
          key: "horizon",
          label: "Moment",
          type: "select",
          options: Object.entries(horizons).map(([value, label]) => ({ value, label })),
        },
        { key: "label_fr", label: "Repère (français)", type: "text", hint: "Ex. : 2026, Aujourd'hui, Demain" },
        { key: "label_en", label: "Repère (anglais)", type: "text", hint: "Ex. : 2026, Today, Next" },
        { key: "title_fr", label: "Titre (français)", type: "text", required: true },
        { key: "title_en", label: "Titre (anglais)", type: "text" },
        { key: "description_fr", label: "Description (français)", type: "textarea" },
        { key: "description_en", label: "Description (anglais)", type: "textarea" },
      ]}
      primary={(row) => String(row.title_fr || row.title_en || "Sans titre")}
      secondary={(row) =>
        [horizons[String(row.horizon)], row.label_fr].filter(Boolean).join(" · ")
      }
    />
  );
}
