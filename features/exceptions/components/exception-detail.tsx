"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useException } from "@/features/exceptions/hooks";
import { HttpError } from "@/lib/api/http-error";
import { DetailHeader } from "./detail/detail-header";
import { WhatHappenedSection } from "./detail/what-happened-section";
import { RootCauseSection } from "./detail/root-cause-section";
import { PredictionSection } from "./detail/prediction-section";
import { RecommendationSection } from "./detail/recommendation-section";
import { ActionSection } from "./detail/action-section";

function DetailSkeleton() {
  return (
    <div className="space-y-4 p-4 md:p-6">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

export function ExceptionDetail({ id }: { id: number }) {
  const { data: exception, isLoading, isError, error } = useException(id);

  if (isLoading) return <DetailSkeleton />;

  if (isError || !exception) {
    const notFound = error instanceof HttpError && error.status === 404;
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex max-w-md flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground" aria-hidden />
          <p className="text-sm font-medium">{notFound ? "Exception not found" : "Unable to load this exception"}</p>
          <p className="text-sm text-muted-foreground">
            {notFound
              ? `No exception exists with id ${id}.`
              : error instanceof Error
                ? error.message
                : "An unexpected error occurred."}
          </p>
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/wms/exceptions" />}>
            Back to Exception Center
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DetailHeader exception={exception} />
      <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4 md:p-6">
        <WhatHappenedSection exceptionId={exception.id} />
        <RootCauseSection exceptionId={exception.id} />
        <PredictionSection entityId={exception.entityId} />
        <RecommendationSection exceptionId={exception.id} />
        <ActionSection exceptionDbId={exception.id} />
      </div>
    </>
  );
}
