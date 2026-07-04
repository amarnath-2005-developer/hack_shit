import { AlertTriangle, RotateCw } from "lucide-react";

export function ErrorState({
  title = "Couldn't load this",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="glass rounded-2xl p-10 text-center flex flex-col items-center border border-destructive/20">
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-destructive" strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 text-lg font-medium tracking-tight">{title}</h3>
      {message && (
        <p className="mt-2 text-sm text-muted-foreground max-w-md break-words">{message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm hover:bg-white/10 transition"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}
