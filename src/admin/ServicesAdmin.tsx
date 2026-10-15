import SimpleCrud from "./SimpleCrud";

export default function ServicesAdmin() {
  return (
    <SimpleCrud
      table="services"
      title="Services"
      subtitle="Les prestations que tu proposes en freelance."
      newLabel="Nouveau service"
      defaults={{ icon: "web" }}
      fields={[
        {
          key: "icon",
          label: "Icône",
          type: "select",
          options: [
            { value: "web", label: "Web (globe)" },
            { value: "odoo", label: "Odoo (tableau de bord)" },
            { value: "desktop", label: "Bureau (écran)" },
          ],
        },
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
      primary={(row) => String(row.title_fr || row.title_en || "Sans titre")}
      secondary={(row) => String(row.description_fr ?? "")}
    />
  );
}
