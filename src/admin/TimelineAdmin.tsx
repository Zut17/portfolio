import SimpleCrud from "./SimpleCrud";

export default function TimelineAdmin() {
  return (
    <SimpleCrud
      table="timeline"
      title="Parcours"
      subtitle="Formations et expériences affichées dans la section À propos."
      newLabel="Nouvel élément"
      defaults={{ kind: "education" }}
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
        { key: "organization", label: "Organisation", type: "text" },
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
      secondary={(row) => String(row.organization ?? "")}
    />
  );
}
