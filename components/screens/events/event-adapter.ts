import type { Event } from "@/types/events.types"
import type { EventApplication, EventStatus, DeliveryStatus } from "@/types/events"

const STATUS_MAP: Record<string, EventStatus> = {
  SUBMITTED: "Pending",
  SCORED: "Pending",
  NEEDS_CLARIFICATION: "Pending",
  REJECTED: "Rejected",
  VALIDATED: "Accepted",
  CONFIRMATION_SENT: "Accepted",
  CONFIRMED: "Accepted",
  ALLOCATED: "Accepted",
  PREPARING_SHIPMENT: "Accepted",
  IN_DELIVERY: "Accepted",
  DELIVERED: "Accepted",
  UGC_PENDING: "Accepted",
  CONTENT_REVIEWED: "Accepted",
  REPORTED: "Pending",
  CLOSED: "Accepted",
}

const DELIVERY_MAP: Record<string, DeliveryStatus> = {
  SUBMITTED: "Non livrée",
  SCORED: "Non livrée",
  NEEDS_CLARIFICATION: "Non livrée",
  REJECTED: "Non livrée",
  VALIDATED: "Non livrée",
  CONFIRMATION_SENT: "Non livrée",
  CONFIRMED: "Non livrée",
  ALLOCATED: "Non livrée",
  PREPARING_SHIPMENT: "Non livrée",
  IN_DELIVERY: "Non livrée",
  DELIVERED: "Livrée",
  UGC_PENDING: "Non livrée",
  CONTENT_REVIEWED: "Non livrée",
  REPORTED: "Non livrée",
  CLOSED: "Livrée",
}

function isEventCompleted(code: string): boolean {
  return code === "DELIVERED" || code === "CLOSED"
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
    isRealized: isEventCompleted(workflowCode),
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
