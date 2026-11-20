"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import useScrollPosition from "@/hooks/useScrollPosition";

function GoToTopButton() {
  const bodyRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    bodyRef.current = document.documentElement;
  }, []);

  const { isAtTop } = useScrollPosition(bodyRef);

  if (isAtTop) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      style={{
        position: "fixed",
        bottom: "0.5rem",
        right: "0.5rem",
        cursor: "pointer",
      }}
      onClick={() => {
        bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="cursor-pointer hover:-translate-y-px"
      aria-label="Back to top"
    >
      <ArrowUp aria-hidden="true" />
    </Button>
  );
}

export default GoToTopButton;
