import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function Error({ message = "Failed to fetch data", onRetry }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">
            Something went wrong
          </h3>
          <p className="text-sm text-muted-foreground max-w-[450px]">
            {message}
          </p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            className="mt-4"
          >
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}