import type { LucideIcon } from "lucide-react";
import { PageHeader } from "./page-header";

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
  note,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  note: string;
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex max-w-md flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <Icon className="h-8 w-8 text-muted-foreground" aria-hidden />
          <p className="text-sm font-medium">{title} is not built yet</p>
          <p className="text-sm text-muted-foreground">{note}</p>
        </div>
      </div>
    </>
  );
}
