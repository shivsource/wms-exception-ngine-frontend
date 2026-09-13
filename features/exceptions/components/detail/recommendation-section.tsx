"use client";

import { Lightbulb } from "lucide-react";
import { RecommendationCard } from "@/components/intelligence/recommendation-card";
import { SectionCard } from "@/components/intelligence/section-card";
import { SectionError, SectionSkeleton } from "@/components/intelligence/section-states";
import { useExceptionRecommendation } from "@/features/exceptions/hooks";

export function RecommendationSection({ exceptionId }: { exceptionId: number }) {
  const { data, isLoading, isError, error, refetch } = useExceptionRecommendation(exceptionId);

  return (
    <SectionCard icon={Lightbulb} eyebrow="What Should I Do" title="Recommended Action">
      {isLoading ? (
        <SectionSkeleton />
      ) : isError ? (
        <SectionError
          message={error instanceof Error ? error.message : "No recommendation is available for this exception."}
          onRetry={() => refetch()}
        />
      ) : (
        <div className="space-y-3">
          <RecommendationCard action={data!.recommendation} />

          {data!.alternativeRecommendations.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Alternative Options
              </h4>
              <div className="space-y-2">
                {data!.alternativeRecommendations.map((alt, i) => (
                  <RecommendationCard key={`${alt.actionType}-${i}`} action={alt} alternative />
                ))}
              </div>
            </div>
          ) : null}

          {data!.limitations.length > 0 ? (
            <div className="space-y-0.5 border-t pt-3 text-xs text-muted-foreground">
              {data!.limitations.map((note, i) => (
                <p key={i}>⚠ {note}</p>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}
