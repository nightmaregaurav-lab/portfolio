"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import {
  type FieldValues,
  FormProvider,
  type UseFormReturn,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import ConfigFormTools from "@/components/ui/ConfigFormTools";
import { Card, CardContent } from "@/components/ui/card";

function ConfigurationFormWrapper<T extends FieldValues>({
  title,
  config,
  children,
  className,
  form,
}: {
  title: string;
  config: T;
  children: React.ReactNode;
  className?: string;
  form: UseFormReturn<T, unknown, T>;
}) {
  const router = useRouter();

  return (
    <div className={className}>
      <FormProvider {...form}>
        <Card
          className={
            "mx-auto w-full max-w-6xl border-border/70 shadow-lg shadow-black/5"
          }
        >
          <CardContent
            className={"max-h-[calc(100dvh-8rem)] overflow-y-auto p-4 sm:p-6"}
          >
            <div
              className={
                "mb-6 flex items-start justify-between gap-4 border-b pb-4"
              }
            >
              <div className={"flex min-w-0 items-start gap-3"}>
                <Button
                  type={"button"}
                  variant={"ghost"}
                  size={"icon-sm"}
                  className={
                    "mt-0.5 shrink-0 cursor-pointer hover:-translate-y-px"
                  }
                  onClick={() => router.push("/setup")}
                  aria-label={"Cancel and return to setup"}
                >
                  <ChevronLeft />
                </Button>
                <div>
                  <h1 className={"text-xl font-semibold tracking-tight"}>
                    {title}
                  </h1>
                  <p className={"mt-1 text-sm text-muted-foreground"}>
                    Update the values below, then save your changes.
                  </p>
                </div>
              </div>
              <ConfigFormTools config={config} />
            </div>
            <div
              className={
                "[&>div]:mx-auto [&>div]:w-full [&>form]:mx-auto [&>form]:w-full"
              }
            >
              {children}
            </div>
          </CardContent>
        </Card>
      </FormProvider>
    </div>
  );
}

export default ConfigurationFormWrapper;
