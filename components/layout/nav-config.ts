import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  Gauge,
  Lightbulb,
  Plug,
  Settings,
  TrendingUp,
  Warehouse,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string | null;
  items: NavItem[];
}

/**
 * Only WMS is implemented today. Structured as its own section (rather than a flat list) so a
 * future TMS section can be added the same way — see ARCHITECTURE guidance: do not build TMS
 * pages now, but don't make the nav hard to extend either.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    label: null,
    items: [{ label: "Overview", href: "/", icon: Gauge }],
  },
  {
    label: "WMS",
    items: [
      { label: "Overview", href: "/wms", icon: Warehouse },
      { label: "Exceptions", href: "/wms/exceptions", icon: AlertTriangle },
      { label: "Predictions", href: "/wms/predictions", icon: TrendingUp },
      { label: "Recommendations", href: "/wms/recommendations", icon: Lightbulb },
      { label: "Analytics", href: "/wms/analytics", icon: BarChart3 },
    ],
  },
  {
    label: null,
    items: [
      { label: "Integrations", href: "/integrations", icon: Plug },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
