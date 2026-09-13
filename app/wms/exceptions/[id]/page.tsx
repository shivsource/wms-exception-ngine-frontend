import { ExceptionDetail } from "@/features/exceptions/components/exception-detail";

export default async function ExceptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExceptionDetail id={Number(id)} />;
}
