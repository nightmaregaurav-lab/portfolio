"use client"

import React, {useState} from "react";
import styles from "./page.module.css";
import {Identifier} from "@/hooks/useConfig";
import {defaultValues, TInput, TOutput, schema} from "@/configuration/services";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import {Pencil, Plus, Trash2} from "lucide-react";
import {cn} from "@/lib/utils";
import {Control, Controller, useFieldArray, useWatch} from "react-hook-form";
import {RichTextEditor} from "@/components/ui/RichTextEditor";
import {withConfigurationId} from "@/lib/configurationUtils";
import {useConfigurationForm} from "@/hooks/useConfigurationForm";
import {LucideReactIconPicker} from "@/components/ui/LucideReactIconPicker";
import DynamicLucideReactIcon, {LucideReactIconName} from "@/components/ui/DynamicLucideReactIcon";
import {stripHtmlTags} from "@/lib/html";

const emptyService: NonNullable<TInput["services"]>[number] = {
  id: "",
  title: "",
  description: "",
  icon: "",
  link: "",
};

function ServiceFields({control, index}: {control: Control<TInput>; index: number}) {
  return (
    <>
      <div className={"grid gap-3 md:grid-cols-2"}>
        <Controller
          control={control}
          name={`services.${index}.title`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`services.${index}.title`}>Title</Label>
              <Input {...field} id={`services.${index}.title`} placeholder={"Service title"} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`services.${index}.icon`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`services.${index}.icon`}>Icon name</Label>
              <LucideReactIconPicker {...field} id={`services.${index}.icon`} className={cn("w-full", error && "border-destructive")} aria-invalid={!!error}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />
      </div>

      <Controller
        control={control}
        name={`services.${index}.description`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`services.${index}.description`}>Description</Label>
            <RichTextEditor id={`services.${index}.description`} placeholder={"What does this service include?"} value={field.value || ""} onChange={field.onChange} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <Controller
        control={control}
        name={`services.${index}.link`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`services.${index}.link`}>Related URL</Label>
            <Input {...field} id={`services.${index}.link`} placeholder={"https://..."} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />
    </>
  );
}

function ServicePreview({service}: {service: NonNullable<TInput["services"]>[number]}) {
  return (<>
    <p className={"truncate font-medium text-muted-foreground"}>
      <DynamicLucideReactIcon name={service.icon as LucideReactIconName} className={"mr-2 inline"} size={16}/>{service.title || "Untitled service"}
    </p>

    <p className={"truncate text-sm text-muted-foreground"}>
      {stripHtmlTags(service.description) || "No description yet"}
    </p>
  </>);
}

function ServiceCardHeader(
  {
    id, isCurrentlyEditing, onEdit, onDelete
  }: {
    id: string;
    isCurrentlyEditing: boolean;
    onEdit: () => void;
    onDelete: () => void;
  }
) {
  return (
    <div className={"flex items-center justify-between gap-4"}>
      <div className={"min-w-0"}>
        <p className={"truncate font-medium text-muted-foreground"}>#{id}</p>
      </div>

      <div className={"flex shrink-0 gap-2"}>
        {!isCurrentlyEditing && <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          onClick={onEdit}
          aria-label={"Edit service"}
          className="cursor-pointer hover:-translate-y-px"
        >
          <Pencil/>
        </Button>}

        <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          className={"text-destructive cursor-pointer hover:-translate-y-px"}
          onClick={onDelete}
          aria-label={"Delete service"}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

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
    Identifier.Services,
    schema,
    defaultValues
  );
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const {fields: services, append, remove} = useFieldArray({control, name: "services", keyName: "fieldArrayId"});
  const servicesWatch = useWatch({control, name: "services"}) || [];

  async function save(values: TOutput) {
    await saveConfig(values);
  }

  if (isLoadingConfig) {
    return <FullScreenMessage><Spinner className={"size-10"} /></FullScreenMessage>;
  }

  return (
    <ConfigurationFormWrapper className={styles.page} title={"Services Configuration"} config={formValues} form={form}>
      <form onSubmit={handleSubmit(save)} className={cn(styles.form, "grid max-w-3xl gap-6")}>
        <div className={"flex flex-col justify-between gap-3 sm:flex-row sm:items-center"}>
          <div>
            <Label>Services</Label>
            <p className={"mt-1 text-sm text-muted-foreground"}>Entries stay compact until you edit them.</p>
          </div>

          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              const service = withConfigurationId(emptyService, "service");
              append(service);
              setEditingServiceId(service.id);
            }}
            className="cursor-pointer hover:-translate-y-px"
          >
            <Plus /> Add service
          </Button>
        </div>

        {servicesWatch.map((service, index) => (
          <div key={service.id} className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}>
            <ServiceCardHeader
              id={service.id}
              isCurrentlyEditing={editingServiceId === service.id}
              onEdit={() => setEditingServiceId(service.id)}
              onDelete={() => {
                if (editingServiceId === service.id) {
                  setEditingServiceId(null);
                }
                remove(index);
              }}
            />

            {editingServiceId === service.id && (
              <div className={"grid gap-4 border-t pt-4"}>
                <ServiceFields control={control} index={index} />
                <div className={"flex justify-end"}>
                  <Button type={"button"} size={"sm"} variant={"outline"} onClick={() => setEditingServiceId(null)} className="cursor-pointer hover:-translate-y-px">Done</Button>
                </div>
              </div>
            )}

            {editingServiceId !== service.id && (
              <div className={"grid gap-1 border-t pt-4"}>
                <ServicePreview service={service}/>
              </div>
            )}

            {editingServiceId !== service.id && form.formState.errors.services?.[index] && (
              <div className={"text-sm text-destructive"}>
                Please fix the errors in this service.
              </div>
            )}
          </div>
        ))}

        {services.length === 0 &&
          <div className={"rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"}>
            No services yet. Add your first service.
          </div>
        }

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
