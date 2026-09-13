"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/features/auth/auth-context";

const LOGIN_PATH = "/login";
/** Matches app/page.tsx's own redirect target — the one working operational screen. */
const HOME_PATH = "/wms/exceptions";

/**
 * Client-side route gate. There's no server-readable session (auth state is plain
 * localStorage, per the prototype's no-JWT/no-cookie design), so protection can only happen
 * here, not in middleware. Renders nothing until hydrated and until any needed redirect has
 * been kicked off, so a logged-out visitor never sees a flash of dashboard chrome (or vice
 * versa for an already-logged-in visitor hitting /login).
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const needsLogin = !isAuthenticated && pathname !== LOGIN_PATH;
  const needsHome = isAuthenticated && pathname === LOGIN_PATH;

  useEffect(() => {
    if (!isHydrated) return;
    if (needsLogin) router.replace(LOGIN_PATH);
    else if (needsHome) router.replace(HOME_PATH);
  }, [isHydrated, needsLogin, needsHome, router]);

  if (!isHydrated || needsLogin || needsHome) return null;

  return <>{children}</>;
}
