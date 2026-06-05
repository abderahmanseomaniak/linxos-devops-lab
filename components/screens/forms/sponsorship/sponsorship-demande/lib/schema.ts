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

export const REQUIRED_AMBASSADEURS = 3
export const MAX_AMBASSADEURS = 6

export const partenariatTypes = [
  { id: "sponsoring", label: "Sponsoring événement (forum, tournoi, journée club…)" },
  { id: "produit", label: "Soutien produit (canettes Linx, T-shirts, goodies)" },
  { id: "activation", label: "Activation terrain (stand, Follow & Claim, challenges)" },
  { id: "ugc", label: "Collaboration UGC / créateurs de contenu" },
  { id: "ceo", label: "Présence CEO (Imad Belak) – conférencier IA, entrepreneuriat, éthique" },
  { id: "autre", label: "Autre" },
] as const

export const eventTypeOptions = [
  { id: "sportif", label: "Sportif" },
  { id: "gaming", label: "Gaming" },
  { id: "musique", label: "Musique" },
  { id: "entrepreneurial", label: "Entrepreneurial" },
  { id: "culturel", label: "Culturel" },
  { id: "autre", label: "Autre" },
] as const

export const ugcContentOptions = [
  { id: "asmr", label: "Open, Sip, Smile – ASMR + sourire (15s)" },
  { id: "avant-apres", label: 'Avant / Après Linx – "Qbel / B3d" (fatigue → énergie)' },
  { id: "follow-claim", label: 'Follow & Claim – tuto "follow → montre écran → reçois ta Linx"' },
  { id: "micro-trottoir", label: "Micro-trottoir campus – interviews fun" },
  { id: "campus-fashion", label: "Best Look Campus – défilé photo/vidéo + vote stories" },
  { id: "dance", label: "Dance / Meme trend – move TikTok simple" },
  { id: "pov", label: 'POV "Ta première Linx" – lifestyle campus' },
  { id: "autre", label: "Autre" },
] as const

export const logistiqueOptions = [
  { id: "stand", label: "Stand disponible" },
  { id: "tournage", label: "Autorisation tournage" },
  { id: "salle", label: "Salle / espace couvert" },
  { id: "frigo", label: "Frigo ou espace froid pour boissons" },
  { id: "equipe", label: "Équipe bénévole pour gestion du stand (min. 2 pers.)" },
] as const

const influencerSchema = z.object({
  nom: z.string().optional().default(""),
  instagram: optionalUrl,
  tiktok: optionalUrl,
  nbAbonnes: z.coerce.number().optional().default(0),
  typeContenu: z.string().optional().default(""),
  disponibleTournage: z.boolean().optional().default(false),
})

export const sponsorshipDemande1Schema = z
  .object({
    nomEtablissement: z.string().trim().min(1, "Nom de l'établissement requis"),
    ville: z.string().trim().min(1, "Ville requise"),
    universite: z.string().trim().min(1, "Université / école requise"),
    nomResponsable: z.string().trim().min(1, "Nom du responsable requis"),
    fonction: z.string().trim().min(1, "Fonction requise"),
    telephone: z
      .string()
      .trim()
      .min(1, "Téléphone requis")
      .regex(/^[+0-9 ().-]{6,}$/, "Téléphone invalide"),
    email: z.string().trim().min(1, "Email requis").email("Email invalide"),

    partenariatTypes: z.array(z.string()).min(1, "Sélectionnez au moins un type de partenariat"),

    nomEvenement: z.string().trim().min(1, "Nom de l'événement requis"),
    dateDebut: z.string().min(1, "Date de début requise"),
    dateFin: z.string().min(1, "Date de fin requise"),
    lieu: z.string().trim().min(1, "Lieu requis"),
    eventType: z.string().min(1, "Type d'événement requis"),
    participants: z.coerce.number().min(1, "Nombre de participants requis"),
    publicCible: z.string().trim().min(1, "Public cible requis"),

    visibiliteContreparties: z.string().trim().min(1, "Décrivez la visibilité et les contreparties proposées"),

    hasInfluencers: z.enum(["yes", "no"]),
    influencers: z.array(influencerSchema).default([]),
    ugcContentTypes: z.array(z.string()).min(1, "Sélectionnez au moins un type de contenu UGC"),
    confirmInfluencers: z
      .boolean()
      .refine((v) => v === true, { message: "Vous devez confirmer avoir des créateurs UGC / influenceurs" }),

    ambassadeurs: z
      .array(z.object({ url: z.string() }))
      .default(Array.from({ length: REQUIRED_AMBASSADEURS }, () => ({ url: "" })))
      .superRefine((links, ctx) => {
        for (let i = 0; i < REQUIRED_AMBASSADEURS; i++) {
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
        for (let i = REQUIRED_AMBASSADEURS; i < links.length; i++) {
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

    logistiqueOptions: z.array(z.string()).default([]),

    imageConsent: z
      .boolean()
      .refine((v) => v === true, {
        message:
          "Vous devez autoriser Linx Energy Maroc à capter et diffuser votre image",
      }),

    afficheEvenement: z.any().optional(),
    dossierSponsoring: z.any().optional(),
    photosPrecedentes: z.any().optional(),
    reseaux: z.array(z.object({ url: optionalUrl })).default([]),

    premiereCollaboration: z.enum(["yes", "no"]),
    signataireNom: z.string().trim().min(1, "Nom du signataire requis"),
    signatureDate: z.string().min(1, "Date de signature requise"),
    cachet: z.any().optional(),
    commentaire: z.string().trim().optional().default(""),

    horodateur: z.string().default(() => new Date().toISOString()),
    status: z.string().default("en_attente"),
  })
  .refine((v) => !v.dateDebut || !v.dateFin || v.dateDebut <= v.dateFin, {
    path: ["dateFin"],
    message: "La date de fin doit être après la date de début",
  })

export type SponsorshipDemande1Values = z.input<typeof sponsorshipDemande1Schema>

export const defaultSponsorshipDemande1Values: SponsorshipDemande1Values = {
  nomEtablissement: "",
  ville: "",
  universite: "",
  nomResponsable: "",
  fonction: "",
  telephone: "",
  email: "",

  partenariatTypes: [],

  nomEvenement: "",
  dateDebut: "",
  dateFin: "",
  lieu: "",
  eventType: "",
  participants: 0,
  publicCible: "",

  visibiliteContreparties: "",

  hasInfluencers: "no",
  influencers: [],
  ugcContentTypes: [],
  confirmInfluencers: false,

  ambassadeurs: Array.from({ length: REQUIRED_AMBASSADEURS }, () => ({ url: "" })),

  logistiqueOptions: [],

  imageConsent: false,

  afficheEvenement: undefined,
  dossierSponsoring: undefined,
  photosPrecedentes: undefined,
  reseaux: [{ url: "" }],

  premiereCollaboration: "no",
  signataireNom: "",
  signatureDate: "",
  cachet: undefined,
  commentaire: "",

  horodateur: "",
  status: "en_attente",
}

export const stepFields: Array<Array<keyof SponsorshipDemande1Values>> = [
  ["nomEtablissement", "ville", "universite", "nomResponsable", "fonction", "telephone", "email", "reseaux"],
  ["partenariatTypes", "nomEvenement", "dateDebut", "dateFin", "lieu", "eventType", "participants", "publicCible"],
  ["visibiliteContreparties"],
  ["hasInfluencers", "influencers", "ugcContentTypes", "confirmInfluencers", "ambassadeurs"],
  ["logistiqueOptions", "imageConsent", "afficheEvenement", "dossierSponsoring", "photosPrecedentes"],
  [],
  ["premiereCollaboration", "signataireNom", "signatureDate", "cachet", "commentaire"],
]
