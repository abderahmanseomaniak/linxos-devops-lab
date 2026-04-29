import { SponsorshipTrackingPage } from "@/components/screens/sponsorship-tracking/sponsorship-tracking-page";
import type { SponsorshipTrackingData } from "@/types/sponsorship-tracking";
import sponsorshipTrackingData from "@/data/sponsorship-tracking.json";

export default function TrackingPage() {
  return <SponsorshipTrackingPage data={sponsorshipTrackingData as SponsorshipTrackingData} />;
}