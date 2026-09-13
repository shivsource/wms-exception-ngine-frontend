"use client";

import { FileText } from "lucide-react";
import { SectionCard } from "@/components/intelligence/section-card";
import { SectionError, SectionSkeleton } from "@/components/intelligence/section-states";
import { useExceptionEvidence } from "@/features/exceptions/hooks";
import { flattenEvidence } from "@/lib/wms/flatten-evidence";

export function WhatHappenedSection({ exceptionId }: { exceptionId: number }) {
  const { data, isLoading, isError, refetch } = useExceptionEvidence(exceptionId);
  const facts = data ? flattenEvidence(data.structuredEvidence) : [];

  return (
    <SectionCard icon={FileText} eyebrow="What Happened" title="Plain-language summary">
      {isLoading ? (
        <SectionSkeleton />
      ) : isError ? (
        <SectionError message="Could not load the explanation for this exception." onRetry={() => refetch()} />
      ) : (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-foreground">{data?.explanation}</p>
          {facts.length > 0 ? (
            <dl className="grid grid-cols-1 gap-x-6 gap-y-2 border-t pt-4 sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-3 text-sm">
                  <dt className="text-muted-foreground">{fact.label}</dt>
                  <dd className="text-right font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}
