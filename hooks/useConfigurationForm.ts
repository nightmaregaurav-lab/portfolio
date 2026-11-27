import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { type DefaultValues, type Resolver, useForm } from "react-hook-form";
import type { input, output, z } from "zod";
import { type Identifier, useConfig } from "@/hooks/useConfig";

export function useConfigurationForm<
  TSchema extends z.ZodObject<z.ZodRawShape> | z.ZodArray<z.ZodType>,
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

  const form = useForm<TInput, unknown, TOutput>({
    resolver: zodResolver(schema) as Resolver<
      input<TSchema>,
      unknown,
      output<TSchema>
    >,
    defaultValues: defaultValues as DefaultValues<input<TSchema>>,
  });

  const { control, reset, handleSubmit, watch } = form;

  useEffect(() => {
    if (config) {
      reset(config as DefaultValues<input<TSchema>>);
    }
  }, [config, reset]);

  const formValues = watch();

  // Detect whether the current form values differ from the originally loaded config
  const hasChanges = useMemo(() => {
    if (!config) {
      return true;
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
