export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—"
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
