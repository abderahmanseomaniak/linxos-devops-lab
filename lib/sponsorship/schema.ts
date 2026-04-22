import { z } from "zod"

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/.+/i.test(v), { message: "Lien invalide (doit commencer par http(s)://)" })

const requiredUrl = z
  .string()
  .trim()
  .min(1, "Lien requis")
  .regex(/^https?:\/\/.+/i, "Lien invalide (doit commencer par http(s)://)")

export const REQUIRED_UGC_LINKS = 5
export const MAX_UGC_LINKS = 10

export const sponsorshipSchema = z
  .object({
    nomClub: z.string().trim().min(1, "Nom du club requis"),
    ville: z.string().trim().min(1, "Ville requise"),
    universite: z.string().trim().optional().default(""),
    reseaux: z.array(z.object({ url: optionalUrl })).default([]),

    nomResponsable: z.string().trim().min(1, "Nom du responsable requis"),
    fonction: z.string().trim().min(1, "Fonction requise"),
    telephone: z
      .string()
      .trim()
      .min(1, "Téléphone requis")
      .regex(/^[+0-9 ().-]{6,}$/, "Téléphone invalide"),
    email: z.string().trim().min(1, "Email requis").email("Email invalide"),

    nomEvenement: z.string().trim().min(1, "Nom de l'événement requis"),
    eventType: z.string().min(1, "Type requis"),
    dateDebut: z.string().min(1, "Date de début requise"),
    dateFin: z.string().min(1, "Date de fin requise"),
    lieu: z.string().trim().min(1, "Lieu requis"),
    participants: z
      .string()
      .trim()
      .min(1, "Nombre de participants requis")
      .regex(/^\d+$/, "Nombre invalide"),
    targetAudience: z.string().trim().min(1, "Public cible requis"),
    ugcAccepted: z
      .boolean()
      .refine((v) => v === true, { message: "Acceptation obligatoire" }),
    ugcLinks: z
      .array(z.object({ url: z.string() }))
      .superRefine((links, ctx) => {
        for (let i = 0; i < REQUIRED_UGC_LINKS; i++) {
          const value = links[i]?.url ?? ""
          const parsed = requiredUrl.safeParse(value)
          if (!parsed.success) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [i, "url"],
              message: parsed.error.issues[0]?.message ?? "Lien requis",
            })
          }
        }
        for (let i = REQUIRED_UGC_LINKS; i < links.length; i++) {
          const value = links[i]?.url ?? ""
          if (value !== "") {
            const parsed = optionalUrl.safeParse(value)
            if (!parsed.success) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [i, "url"],
                message: parsed.error.issues[0]?.message ?? "Lien invalide",
              })
            }
          }
        }
      }),

    selectedContentTypes: z.array(z.string()).min(1, "Sélectionnez au moins un type"),
    files: z.record(z.string(), z.any()).default({}),

    visibilite: z.string().trim().min(1, "Visibilité requise"),
    logistique: z.array(z.string()).default([]),

    imageConsent: z
      .boolean()
      .refine((v) => v === true, { message: "Consentement requis" }),
  })
  .refine((v) => !v.dateDebut || !v.dateFin || v.dateDebut <= v.dateFin, {
    path: ["dateFin"],
    message: "La date de fin doit être après la date de début",
  })

export type SponsorshipFormValues = z.input<typeof sponsorshipSchema>

export const defaultSponsorshipValues: SponsorshipFormValues = {
  nomClub: "",
  ville: "",
  universite: "",
  reseaux: [{ url: "" }],
  nomResponsable: "",
  fonction: "",
  telephone: "",
  email: "",
  nomEvenement: "",
  eventType: "",
  dateDebut: "",
  dateFin: "",
  lieu: "",
  participants: "",
  targetAudience: "",
  ugcAccepted: true,
  ugcLinks: Array.from({ length: REQUIRED_UGC_LINKS }, () => ({ url: "" })),
  selectedContentTypes: [],
  files: {},
  visibilite: "",
  logistique: [],
  imageConsent: false,
}

export const stepFields: Array<Array<keyof SponsorshipFormValues>> = [
  ["nomClub", "ville", "universite", "reseaux", "nomResponsable", "fonction", "telephone", "email"],
  [
    "nomEvenement",
    "eventType",
    "dateDebut",
    "dateFin",
    "lieu",
    "participants",
    "targetAudience",
    "ugcAccepted",
    "ugcLinks",
  ],
  ["selectedContentTypes", "files"],
  ["visibilite", "logistique"],
  [],
  ["imageConsent"],
]
