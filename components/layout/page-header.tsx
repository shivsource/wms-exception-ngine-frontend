import type { ReactNode } from "react";
import { MobileNav } from "./mobile-nav";
import { ConnectionStatus } from "./connection-status";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6 md:py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MobileNav />
          <div>
            <h1 className="text-lg font-semibold tracking-tight md:text-xl">{title}</h1>
            {description ? (
              <p className="hidden text-sm text-muted-foreground md:block">{description}</p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <ConnectionStatus />
        </div>
      </div>
    </header>
  );
}
