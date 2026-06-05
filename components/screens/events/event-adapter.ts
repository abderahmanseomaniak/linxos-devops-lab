import type { Event } from "@/types/events.types"
import type { EventApplication, EventStatus, DeliveryStatus } from "@/types/events"

const STATUS_MAP: Record<string, EventStatus> = {
  SUBMITTED: "Pending",
  UNDER_REVIEW: "Pending",
  APPROVED: "Accepted",
  CONFIRMED: "Accepted",
  SHIPPED: "Accepted",
  COMPLETED: "Accepted",
  REJECTED: "Rejected",
}

const DELIVERY_MAP: Record<string, DeliveryStatus> = {
  SUBMITTED: "Non livrée",
  UNDER_REVIEW: "Non livrée",
  APPROVED: "Non livrée",
  CONFIRMED: "Non livrée",
  SHIPPED: "Non livrée",
  COMPLETED: "Livrée",
  REJECTED: "Non livrée",
}

export function eventToApplication(
  event: Event,
  index = 0
): EventApplication {
  const workflowCode = event.state?.code ?? "SUBMITTED"
  const appForm = event.application_form

  const step1 = appForm
    ? {
        nomClub: event.club?.name ?? "",
        sport: event.club?.type ?? "",
        ville: event.city ?? "",
        email: event.applicant_email ?? "",
        telephone: "",
      }
    : undefined

  const step2 = appForm
    ? {
        nomResponsable: event.applicant_email ?? "",
        fonction: "",
        emailResponsable: event.applicant_email ?? "",
        telephoneResponsable: "",
      }
    : undefined

  const step3 = appForm
    ? {
        nomEvenement: event.title,
        dateDebut: event.start_date ?? "",
        dateFin: event.end_date ?? "",
        lieu: event.city ?? "",
        description: appForm.comment ?? "",
        hasUGC: appForm.has_ugc,
      }
    : undefined

  return {
    id: index + 1,
    reference: event.tracking_code,
    priority: 1,
    eventName: event.title,
    organization: event.club?.name ?? "—",
    organizationLogo: undefined,
    date: event.start_date ?? event.created_at.split("T")[0],
    product: undefined,
    quantity: appForm?.expected_attendance ?? undefined,
    status: STATUS_MAP[workflowCode] ?? "Pending",
    deliveryStatus: DELIVERY_MAP[workflowCode] ?? "Non livrée",
    isRealized: workflowCode === "COMPLETED",
    step1,
    step2,
    step3,
    step4: undefined,
    step5: undefined,
    step6: undefined,
  }
}

export function eventsToApplications(events: Event[]): EventApplication[] {
  return events.map((e, i) => eventToApplication(e, i))
}
