"use client"

import React from "react";
import styles from "./page.module.css";
import {Identifier} from "@/hooks/useConfig";
import {Controller} from "react-hook-form";
import {defaultValues, TOutput, schema} from "@/configuration/core";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {ArrayInput} from "@/components/ui/ArrayInput";
import {Textarea} from "@/components/ui/textarea";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import {Spinner} from "@/components/ui/spinner";
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
    Identifier.Core,
    schema,
    defaultValues
  );

  async function save(values: TOutput) {
    await saveConfig(values);
  }

  if(isLoadingConfig){
    return <FullScreenMessage><Spinner className={"size-10"}/></FullScreenMessage>;
  }

  return (
    <ConfigurationFormWrapper className={styles.page} title={"Core Configuration"} config={formValues} form={form}>
      <form onSubmit={handleSubmit(save)} className={cn(styles.form, "grid gap-6 max-w-3xl")}>
        <Controller
          control={control}
          name={"favicon"}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"favicon"}>Favicon</Label>
              <Input {...field} id={"favicon"} placeholder={"https://example.com/favicon.ico"} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={"websiteName"}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"websiteName"}>Website Name</Label>
              <Input {...field} id={"websiteName"} placeholder={"My Website"} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={"fullName"}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"fullName"}>Full Name</Label>
              <Input {...field} id={"fullName"} placeholder={"John Doe"} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={"seoDescription"}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"seoDescription"}>SEO Description</Label>
              <Textarea {...field} id={"seoDescription"} placeholder={"A brief description of your website"} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={"seoKeywords"}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"seoKeywords"}>SEO Keywords</Label>
              <ArrayInput {...field} id={"seoKeywords"} placeholder={"Type a keyword and press Enter"} className={cn("w-full", error && "border-destructive")}/>
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
