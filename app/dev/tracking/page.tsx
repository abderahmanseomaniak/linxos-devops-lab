import { SponsorshipTrackingPage } from "@/components/dev/screens/sponsorship-tracking/SponsorshipTrackingPage";
import { sponsorshipTrackingData } from "@/data/sponsorship-tracking";

export default function TrackingPage() {
  return <SponsorshipTrackingPage data={sponsorshipTrackingData} />;
}