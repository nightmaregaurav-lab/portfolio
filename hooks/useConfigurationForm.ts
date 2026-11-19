import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { type Identifier, useConfig } from "@/hooks/useConfig";

export function useConfigurationForm<
  TSchema extends z.ZodObject<any> | z.ZodArray<any>,
  TIdentifier extends Identifier,
>(
  identifier: TIdentifier,
  schema: TSchema,
  defaultValues: z.input<TSchema>,
  query?: Record<string, string | number | null>,
) {
  type TInput = z.input<TSchema>;
  type TOutput = z.output<TSchema>;

  const { config, isLoadingConfig, saveConfig, isSavingConfig } = useConfig(
    identifier,
    query,
  );

  const form = useForm<TInput, any, TOutput>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as any,
  });

  const { control, reset, handleSubmit, watch } = form;

  useEffect(() => {
    if (config) {
      reset(config as any);
    }
  }, [config, reset]);

  const formValues = watch();

  // Detect whether the current form values differ from the originally loaded config
  const hasChanges = useMemo(() => {
    if (!config) {
      return false;
    }
    return JSON.stringify(formValues) !== JSON.stringify(config);
  }, [formValues, config]);

  return {
    isLoadingConfig,
    saveConfig,
    isSavingConfig,
    form,
    control,
    handleSubmit,
    formValues,
    hasChanges,
    originalConfig: config,
  };
}
