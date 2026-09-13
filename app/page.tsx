import { redirect } from "next/navigation";

/**
 * The cross-domain platform Overview (spanning WMS + future TMS) isn't built yet — only WMS
 * exists today. Until then, the most useful thing to show on open is the one working
 * operational screen: the Exception Center.
 */
export default function RootPage() {
  redirect("/wms/exceptions");
}
