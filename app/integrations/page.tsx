import { Plug } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function IntegrationsPage() {
  return (
    <PlaceholderPage
      title="Integrations"
      description="Connected logistics systems feeding this intelligence layer."
      icon={Plug}
      note="Reserved for future source-system management (a second WMS, a TMS, etc.) — the backend's adapter architecture already supports multiple sources, but there's no API yet to manage them from the UI."
    />
  );
}
