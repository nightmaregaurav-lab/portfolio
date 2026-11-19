import {Skeleton} from "@/components/ui/skeleton";

function PageLoading() {
  return (
    <div className="space-y-4 p-6" role="status" aria-label="Loading page content">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export default PageLoading;
