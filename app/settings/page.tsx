import { Settings as SettingsIcon } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Platform and account configuration."
      icon={SettingsIcon}
      note="The backend has no authentication or user/account model yet, so there's nothing real to configure here yet."
    />
  );
}
