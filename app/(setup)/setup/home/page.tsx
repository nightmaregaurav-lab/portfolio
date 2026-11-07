"use client"

import React from "react";
import styles from "./page.module.css";
import {Identifier} from "@/hooks/useConfig";
import {Controller} from "react-hook-form";
import {defaultValues, TOutput, schema} from "@/configuration/home";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import {cn} from "@/lib/utils";
import {useConfigurationForm} from "@/hooks/useConfigurationForm";

function Page() {
  const {
    isLoadingConfig,
    saveConfig,
    isSavingConfig,
    form,
    control,
    handleSubmit,
    formValues
  } = useConfigurationForm(
    Identifier.Home,
    schema,
    defaultValues
  );

  async function save(values: TOutput) {
    await saveConfig(values);
  }

  if (isLoadingConfig) {
    return <FullScreenMessage><Spinner className={"size-10"}/></FullScreenMessage>;
  }

  return (
    <ConfigurationFormWrapper className={styles.page} title={"Home Configuration"} config={formValues} form={form}>
      <form onSubmit={handleSubmit(save)} className={cn(styles.form, "grid gap-6 max-w-3xl")}>
        <Controller
          control={control}
          name={"coverPicture"}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"coverPicture"}>Cover Picture</Label>
              <Input {...field} id={"coverPicture"} placeholder={"https://example.com/cover.jpg"} className={cn(error && "border-destructive")} />
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={"bio"}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"bio"}>Short Bio</Label>
              <Input {...field} id={"bio"} placeholder={"A short introduction about you"} className={cn(error && "border-destructive")} />
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <div className={"flex justify-end"}>
          <Button
            type={"submit"}
            size={"sm"}
            variant={"outline"}
            className={"cursor-pointer mt-2 bg-primary text-secondary hover:-translate-y-px"}
            disabled={isSavingConfig}
          >
            {isSavingConfig ? <Spinner /> : "Save"}
          </Button>
        </div>
      </form>
    </ConfigurationFormWrapper>
  );
}

export default Page;
