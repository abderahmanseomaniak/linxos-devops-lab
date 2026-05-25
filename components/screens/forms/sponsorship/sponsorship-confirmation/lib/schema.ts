import { z } from "zod"

export const REQUIRED_UGC = 5
export const MAX_UGC_LINKS = 10

const confirmationSchema = z
  .object({
    email: z.string().trim().min(1, "Email requis").email("Email invalide"),
    eventName: z.string().trim().min(1, "Nom de l'événement requis"),
    city: z.string().trim().min(1, "Ville requise"),
    club: z.string().trim().min(1, "Club / organisation requis"),
    university: z.string().trim().optional().default(""),
    instagramUrl: z
      .string()
      .trim()
      .min(1, "URL Instagram requise")
      .regex(/^https?:\/\/.+/i, "URL Instagram invalide"),
    reseaux: z.array(z.object({ url: z.string() })).default([{ url: "" }]),

    cansConfirmed: z.number().min(0, "Le nombre doit être positif ou nul"),

    fullName: z.string().trim().min(1, "Nom complet requis"),
    whatsappPhone: z.string().trim().min(1, "Téléphone WhatsApp requis"),

    hasUgc: z.enum(["yes", "no"]),
    ugcUrls: z
      .array(z.object({ url: z.string() }))
      .default(Array.from({ length: REQUIRED_UGC }, () => ({ url: "" }))),

    logisticsName: z.string().trim().optional().default(""),
    logisticsWhatsapp: z.string().trim().optional().default(""),
    deliveryAddress: z.string().trim().optional().default(""),
    deliveryDate: z.string().optional().default(""),
    receptionTime: z.string().optional().default(""),

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
    comment: z.string().trim().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.hasUgc === "yes") {
      for (let i = 0; i < REQUIRED_UGC; i++) {
        const url = data.ugcUrls[i]?.url?.trim()
        if (!url || !/^https?:\/\/.+/i.test(url)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["ugcUrls", i],
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
  ["email", "eventName", "city", "club", "university", "instagramUrl", "reseaux"],
  ["cansConfirmed", "fullName", "whatsappPhone"],
  ["hasUgc", "ugcUrls"],
  ["logisticsName", "logisticsWhatsapp", "deliveryAddress", "deliveryDate", "receptionTime"],
  [],
  ["confirmCorrect", "commitUgc", "driveUrl", "responsibleName", "signature", "signatureDate", "comment"],
]

export { confirmationSchema }
