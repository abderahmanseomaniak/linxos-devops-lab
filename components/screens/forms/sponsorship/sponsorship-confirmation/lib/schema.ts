import { z } from "zod"

export const REQUIRED_UGC = 5
export const MAX_UGC_LINKS = 10

const confirmationSchema = z
  .object({
    email: z.string().trim().min(1, "Email requis").email("Email invalide"),
    eventName: z.string().trim().min(1, "Nom de l'événement requis"),
    city: z.string().trim().min(1, "Ville requise"),
    club: z.string().trim().min(1, "Club / organisation requis"),
    university: z.string().trim().min(1, "Université / école requise"),
    instagramUrl: z.string().optional(),
    reseaux: z.array(z.object({ url: z.string() })).default([{ url: "" }]),

    cansConfirmed: z.number().min(0, "Le nombre doit être positif ou nul"),

    fullName: z.string().trim().min(1, "Nom complet requis"),
    whatsappPhone: z.string().trim().min(1, "Téléphone WhatsApp requis"),

    hasUgc: z.enum(["yes", "no"]),
    ugcUrls: z
      .array(z.object({ url: z.string() }))
      .default(Array.from({ length: REQUIRED_UGC }, () => ({ url: "" }))),

    logisticsName: z.string().trim().min(1, "Nom du contact logistique requis"),
    logisticsWhatsapp: z.string().trim().min(1, "Téléphone logistique requis"),
    deliveryAddress: z.string().trim().min(1, "Adresse de livraison requise"),
    deliveryDate: z.string().min(1, "Date de livraison requise"),
    receptionTime: z.string().min(1, "Heure de réception requise"),

    confirmCorrect: z
      .boolean()
      .refine((v) => v === true, {
        message: "Vous devez confirmer que les informations sont correctes",
      }),
    commitUgc: z
      .boolean()
      .refine((v) => v === true, {
        message: "Vous devez vous engager à fournir le contenu UGC",
      }),
    driveUrl: z
      .string()
      .trim()
      .min(1, "URL Drive requis")
      .regex(/^https?:\/\/.+/i, "URL Drive invalide"),

    responsibleName: z.string().trim().min(1, "Nom du responsable requis"),
    signature: z.string().trim().min(1, "Signature requise"),
    signatureDate: z.string().min(1, "Date de signature requise"),
    comment: z.string().trim().min(1, "Commentaire requis"),
  })
  .superRefine((data, ctx) => {
    if (data.hasUgc === "yes") {
      for (let i = 0; i < REQUIRED_UGC; i++) {
        const url = data.ugcUrls[i]?.url?.trim()
        if (!url || !/^https?:\/\/.+/i.test(url)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["ugcUrls", i, "url"],
            message: "URL requise (doit commencer par http(s)://)",
          })
        }
      }
    }
  })

export type ConfirmationFormValues = z.input<typeof confirmationSchema>

export const defaultConfirmationValues: ConfirmationFormValues = {
  email: "",
  eventName: "",
  city: "",
  club: "",
  university: "",
  instagramUrl: "",
  reseaux: [{ url: "" }],
  cansConfirmed: 0,
  fullName: "",
  whatsappPhone: "",
  hasUgc: "no",
  ugcUrls: Array.from({ length: REQUIRED_UGC }, () => ({ url: "" })),
  logisticsName: "",
  logisticsWhatsapp: "",
  deliveryAddress: "",
  deliveryDate: "",
  receptionTime: "",
  confirmCorrect: false,
  commitUgc: false,
  driveUrl: "",
  responsibleName: "",
  signature: "",
  signatureDate: "",
  comment: "",
}

export const stepFields: Array<Array<keyof ConfirmationFormValues>> = [
  ["email", "eventName", "city", "club", "university", "reseaux"],
  ["cansConfirmed", "fullName", "whatsappPhone"],
  ["hasUgc", "ugcUrls"],
  ["logisticsName", "logisticsWhatsapp", "deliveryAddress", "deliveryDate", "receptionTime"],
  [],
  ["confirmCorrect", "commitUgc", "driveUrl", "responsibleName", "signature", "signatureDate", "comment"],
]

export { confirmationSchema }
