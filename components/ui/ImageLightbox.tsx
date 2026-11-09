"use client"

import React, {useEffect, useState} from "react";
import {Download, RotateCcw, ZoomIn, ZoomOut} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {Slider} from "@/components/ui/slider";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const ZOOM_STEP = 0.01;

type ImageLightboxProps = {
  src: string;
  name: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

function ImageLightbox({src, name, trigger, open: controlledOpen, onOpenChange, children}: ImageLightboxProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [fitScale, setFitScale] = useState(1);
  const [zoom, setZoom] = useState(1);

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;

  useEffect(() => {
    if (!open) setZoom(1);
  }, [open]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !imageSize.width || !imageSize.height) return;

    const updateFitScale = () => {
      const availableWidth = container.clientWidth - 32;
      const availableHeight = container.clientHeight - 32;

      setFitScale(
        Math.min(
          1,
          availableWidth / imageSize.width,
          availableHeight / imageSize.height
        )
      );
    };

    const observer = new ResizeObserver(updateFitScale);
    observer.observe(container);
    updateFitScale();

    return () => observer.disconnect();
  }, [imageSize]);

  function downloadImage() {
    const link = document.createElement("a");
    link.href = src;
    link.download = name || "image";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => {
      setUncontrolledOpen(nextOpen);
      onOpenChange?.(nextOpen);
    }}>
      {children ? (
        children
      ) : trigger && <span
        className={"cursor-pointer"}
        onClick={(event) => {
          event.stopPropagation();
          setUncontrolledOpen(true);
          onOpenChange?.(true);
        }}
        aria-label={`View ${name}`}
      >
        {trigger}
      </span>}
      <SheetContent className={"top-0 left-0 h-dvh! max-h-dvh! w-dvw! max-w-dvw! translate-x-0 translate-y-0 gap-3 rounded-none p-4 sm:p-6"} showCloseButton>
        <SheetHeader>
          <SheetTitle>{name || "Image preview"}</SheetTitle>
          <SheetDescription>Use the controls to zoom or download the image.</SheetDescription>
        </SheetHeader>
        <div ref={containerRef} className={"flex min-h-0 flex-1 items-start justify-center overflow-auto rounded-lg bg-muted/40 p-4"}>
          <img
            src={src}
            alt={name}
            className={"max-h-full max-w-full origin-center object-contain transition-transform duration-150"}
            onLoad={(event) => {
              const img = event.currentTarget;
              setImageSize({
                width: img.naturalWidth,
                height: img.naturalHeight,
              });
            }}
            style={{
              width: imageSize.width * fitScale * zoom,
              height: imageSize.height * fitScale * zoom,
              maxWidth: "none",
              maxHeight: "none",
            }}
          />
        </div>
        <SheetFooter className={"flex-row flex-wrap justify-between sm:justify-between"}>
          <div className={"flex items-center gap-1"}>
            <Button type={"button"} size={"icon-sm"} variant={"outline"} onClick={() => setZoom((value) => Math.max(MIN_ZOOM, value - ZOOM_STEP))} aria-label={"Zoom out"} className="cursor-pointer hover:-translate-y-px">
              <ZoomOut aria-hidden="true" />
            </Button>
            <Button type={"button"} size={"icon-sm"} variant={"outline"} onClick={() => setZoom(1)} aria-label={"Reset zoom"} className="cursor-pointer hover:-translate-y-px">
              <RotateCcw aria-hidden="true" />
            </Button>
            <Button type={"button"} size={"icon-sm"} variant={"outline"} onClick={() => setZoom((value) => Math.min(MAX_ZOOM, value + ZOOM_STEP))} aria-label={"Zoom in"} className="cursor-pointer hover:-translate-y-px">
              <ZoomIn aria-hidden="true" />
            </Button>
            <label className={"ml-2 flex min-w-40 items-center gap-2 text-xs text-muted-foreground"}>
              <span>Zoom</span>
              <Slider
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={ZOOM_STEP}
                value={zoom}
                onValueChange={setZoom}
                aria-label={"Zoom level"}
                className={"w-28"}
              />
              <span className={"w-10 text-right"}>{Math.round(zoom * 100)}%</span>
            </label>
          </div>
          <div className={"flex items-center gap-2"}>
            <Button type={"button"} variant={"outline"} onClick={downloadImage} className="cursor-pointer hover:-translate-y-px">
              <Download />
              Download
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ImageLightbox;
