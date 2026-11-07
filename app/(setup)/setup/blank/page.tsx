"use client"

import React from 'react';
import styles from "./page.module.css";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import {Identifier} from "@/hooks/useConfig";
import {defaultValues, TOutput, schema} from "@/configuration/core"; // Change this
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
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
    Identifier.Core,  // Change this
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
    <ConfigurationFormWrapper className={styles.page} title={"Blank Configuration"} config={formValues} form={form}>
      <form onSubmit={handleSubmit(save)} className={cn(styles.form, "grid gap-6 max-w-3xl")}>
        Nothing here.

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
