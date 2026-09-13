import { NAV_SECTIONS } from "./nav-config";

const ALL_HREFS = NAV_SECTIONS.flatMap((section) => section.items.map((item) => item.href));

/**
 * Picks the single most-specific matching nav item for the current path, rather than every
 * item whose href happens to be a prefix — otherwise "/wms" (WMS Overview) and
 * "/wms/exceptions" (Exceptions) both light up on /wms/exceptions, since the naive
 * `pathname.startsWith(href)` check matches both.
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/") return false;

  const matching = ALL_HREFS.filter((candidate) => pathname === candidate || pathname.startsWith(`${candidate}/`));
  if (matching.length === 0) return false;

  const mostSpecific = matching.reduce((best, candidate) => (candidate.length > best.length ? candidate : best));
  return mostSpecific === href;
}
