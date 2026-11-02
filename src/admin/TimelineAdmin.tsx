import SimpleCrud from "./SimpleCrud";

export default function TimelineAdmin() {
  return (
    <SimpleCrud
      table="timeline"
      title="Parcours"
      subtitle="Formations et expériences affichées dans la section Parcours."
      newLabel="Nouvel élément"
      defaults={{ kind: "education", status: "done" }}
      fields={[
        {
          key: "kind",
          label: "Type",
          type: "select",
          options: [
            { value: "education", label: "Formation" },
            { value: "work", label: "Expérience" },
          ],
        },
        {
          key: "status",
          label: "Statut",
          type: "select",
          options: [
            { value: "done", label: "Obtenu / terminé" },
            { value: "in_progress", label: "En cours" },
          ],
        },
        { key: "organization", label: "Organisation", type: "text", required: true },
        { key: "period", label: "Période (ex. 2023 – 2026)", type: "text" },
        { key: "title_fr", label: "Titre (français)", type: "text" },
        { key: "title_en", label: "Titre (anglais)", type: "text" },
        {
          key: "description_fr",
          label: "Description (français)",
          type: "textarea",
        },
        {
          key: "description_en",
          label: "Description (anglais)",
          type: "textarea",
        },
      ]}
      primary={(row) =>
        String(row.title_fr || row.title_en || "Sans titre")
      }
      secondary={(row) =>
        [
          row.organization,
          row.period,
          row.status === "in_progress" ? "En cours" : "Obtenu",
        ]
          .filter(Boolean)
          .join(" · ")
      }
    />
  );
}
