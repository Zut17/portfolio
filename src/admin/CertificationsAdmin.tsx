import SimpleCrud from "./SimpleCrud";

export default function CertificationsAdmin() {
  return (
    <SimpleCrud
      table="certifications"
      title="Certifications"
      subtitle="Formations certifiantes affichées dans la section Certifications et dans les repères clés."
      newLabel="Nouvelle certification"
      fields={[
        { key: "title", label: "Intitulé", type: "text", required: true },
        { key: "issuer", label: "Organisme", type: "text", hint: "Ex. : Anthropic Academy" },
        { key: "issued_on", label: "Date d'obtention", type: "text", hint: "Texte libre, ex. : Octobre 2026" },
        { key: "verify_url", label: "Lien de vérification", type: "url" },
        { key: "description_fr", label: "Description (français)", type: "textarea" },
        { key: "description_en", label: "Description (anglais)", type: "textarea" },
        {
          key: "image_url",
          label: "Badge ou certificat (image)",
          type: "image",
          folder: "certifications",
          cropAspect: 4 / 3,
        },
      ]}
      primary={(row) => String(row.title || "Sans titre")}
      secondary={(row) =>
        [row.issuer, row.issued_on].filter(Boolean).join(" · ")
      }
    />
  );
}
