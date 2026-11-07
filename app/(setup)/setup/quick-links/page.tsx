"use client"

import React, {useState} from "react";
import styles from "./page.module.css";
import {Identifier} from "@/hooks/useConfig";
import {defaultValues, TInput, TOutput, schema} from "@/configuration/quickLinks";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import {Pencil, Plus, Trash2} from "lucide-react";
import {cn} from "@/lib/utils";
import {Control, Controller, useFieldArray, useWatch} from "react-hook-form";
import {useConfigurationForm} from "@/hooks/useConfigurationForm";
import DynamicLucideReactIcon, {LucideReactIconName} from "@/components/ui/DynamicLucideReactIcon";
import {LucideReactIconPicker} from "@/components/ui/LucideReactIconPicker";

const emptyLink: NonNullable<TInput["links"]>[number] = {
  title: "",
  icon: "",
  link: "",
};

function LinkFields({control, index}: {control: Control<TInput>; index: number}) {
  return (
    <div className={"grid gap-3 md:grid-cols-2"}>
      <Controller
        control={control}
        name={`links.${index}.title`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`links.${index}.title`}>Title</Label>
            <Input {...field} id={`links.${index}.title`} placeholder={"Link title"} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <Controller
        control={control}
        name={`links.${index}.icon`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`links.${index}.icon`}>Icon name</Label>
            <LucideReactIconPicker {...field} id={`links.${index}.icon`} className={cn("w-full", error && "border-destructive")} aria-invalid={!!error}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <Controller
        control={control}
        name={`links.${index}.link`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2 md:col-span-2"}>
            <Label htmlFor={`links.${index}.link`}>URL or file path</Label>
            <Input {...field} id={`links.${index}.link`} placeholder={"URL or file path"} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />
    </div>
  );
}

function LinkPreview(
  {link}: {
    link: NonNullable<TInput["links"]>[number]["link"];
  }
) {
  return (<>
    <p className={"truncate text-sm text-muted-foreground"}>{link || "No URL or file path yet"}</p>
  </>);
}

function LinkCardHeader(
  {
    title, icon, isCurrentlyEditing, onEdit, onDelete
  }: {
    title: string;
    icon: NonNullable<TInput["links"]>[number]["icon"];
    isCurrentlyEditing: boolean;
    onEdit: () => void;
    onDelete: () => void
  }) {
  return (
    <div className={"flex items-center justify-between gap-4"}>
      <div className={"min-w-0 flex items-center gap-2"}>
        {icon && <DynamicLucideReactIcon name={icon as LucideReactIconName} className={"inline h-4 w-4 text-muted-foreground"} />}
        <p className={"truncate font-medium text-muted-foreground"}>{title}</p>
      </div>

      <div className={"flex shrink-0 gap-2"}>
        {!isCurrentlyEditing && <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          onClick={onEdit}
          aria-label={"Edit milestone"}
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
          aria-label={"Delete milestone"}
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
    Identifier.QuickLinks,
    schema,
    defaultValues
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const {fields: links, append, remove} = useFieldArray({control, name: "links", keyName: "fieldArrayId"});
  const linksWatch = useWatch({control, name: "links"}) || [];

  async function save(values: TOutput) {
    await saveConfig(values);
  }

  if (isLoadingConfig) {
    return <FullScreenMessage><Spinner className={"size-10"} /></FullScreenMessage>;
  }

  return (
    <ConfigurationFormWrapper className={styles.page} title={"Quick Links Configuration"} config={formValues} form={form}>
      <form onSubmit={handleSubmit(save)} className={cn(styles.form, "grid max-w-3xl gap-6")}>
        <div className={"flex flex-col justify-between gap-3 sm:flex-row sm:items-center"}>
          <div>
            <Label>Quick links</Label>
            <p className={"mt-1 text-sm text-muted-foreground"}>Add downloads and external resources.</p>
          </div>

          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              append(emptyLink);
              setEditingIndex(linksWatch.length);
            }}
            className="cursor-pointer hover:-translate-y-px"
          >
            <Plus /> Add link
          </Button>
        </div>

        {linksWatch.map((link, index) => (
          <div key={links[index]?.fieldArrayId} className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}>
            <LinkCardHeader
              title={link.title || "Untitled link"}
              icon={link.icon}
              isCurrentlyEditing={editingIndex === index}
              onEdit={() => setEditingIndex(index)}
              onDelete={() => {
                if (editingIndex === index) {
                  setEditingIndex(null);
                }
                remove(index);
              }}
            />

            {editingIndex === index && (
              <div className={"grid gap-4 border-t pt-4"}>
                <LinkFields control={control} index={index} />
                <div className={"flex justify-end"}>
                  <Button type={"button"} size={"sm"} variant={"outline"} onClick={() => setEditingIndex(null)} className="cursor-pointer hover:-translate-y-px">Done</Button>
                </div>
              </div>
            )}

            {editingIndex !== index && (
              <div className={"grid gap-1 border-t pt-4"}>
                <LinkPreview link={link.link}/>
              </div>
            )}

            {editingIndex !== index && form.formState.errors.links?.[index] && (
              <div className={"text-sm text-destructive"}>Please fix the errors in this link.</div>
            )}
          </div>
        ))}

        {links.length === 0 &&
          <div className={"rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"}>
            No quick links yet. Add your first link.
          </div>
        }

        <div className={"flex justify-end"}>
          <Button type={"submit"} size={"sm"} variant={"outline"} className={"cursor-pointer mt-2 bg-primary text-secondary hover:-translate-y-px"} disabled={isSavingConfig}>
            {isSavingConfig ? <Spinner /> : "Save"}
          </Button>
        </div>
      </form>
    </ConfigurationFormWrapper>
  );
}

export default Page;
