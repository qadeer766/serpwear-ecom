import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ButtonLoading = ({
  type = "button",
  text,
  loading = false,
  onClick,
  className,
  disabled,
  children,
  loaderPosition = "left", // left | right
  ...props
}) => {
  const content = text || children;

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={cn("flex items-center justify-center gap-2", className)}
      aria-busy={loading}
      aria-disabled={loading || disabled}
      {...props}
    >
      {loading && loaderPosition === "left" && (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      )}

      {content && <span>{content}</span>}

      {loading && loaderPosition === "right" && (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      )}
    </Button>
  );
};

export default ButtonLoading;