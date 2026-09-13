import { BarChart3 } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function AnalyticsPage() {
  return (
    <PlaceholderPage
      title="Analytics"
      description="Operational trends worth a warehouse manager's attention."
      icon={BarChart3}
      note="Built last, once the underlying exception and prediction data is flowing through the app end-to-end."
    />
  );
}
