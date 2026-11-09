"use client"

import React, {useState} from "react";
import styles from "./page.module.css";
import {Identifier} from "@/hooks/useConfig";
import {defaultValues, TInput, TOutput, schema} from "@/configuration/testimonials";
import {Input} from "@/components/ui/input";
import {DatePicker} from "@/components/ui/DatePicker";
import {Label} from "@/components/ui/label";
import {FileUrl} from "@/components/ui/FileUrl";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import {Pencil, Plus, Trash2} from "lucide-react";
import {cn} from "@/lib/utils";
import {Control, Controller, useFieldArray, useWatch} from "react-hook-form";
import {RichTextEditor} from "@/components/ui/RichTextEditor";
import {useConfigurationForm} from "@/hooks/useConfigurationForm";

const emptyTestimonial: NonNullable<TInput["testimonials"]>[number] = {
  by: "",
  date: "",
  title: "",
  image: "",
  text: "",
  company: "",
  companyWebsite: "",
  department: "",
  departmentWebsite: "",
};

function TestimonialFields({control, index}: {control: Control<TInput>; index: number}) {
  return (
    <>
      <div className={"grid gap-3 md:grid-cols-2"}>
        <Controller
          control={control}
          name={`testimonials.${index}.by`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`testimonials.${index}.by`}>Author</Label>
              <Input {...field} id={`testimonials.${index}.by`} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />
        <Controller
          control={control}
          name={`testimonials.${index}.date`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`testimonials.${index}.date`}>Date</Label>
              <DatePicker {...field} id={`testimonials.${index}.date`} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />
        <Controller
          control={control}
          name={`testimonials.${index}.title`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`testimonials.${index}.title`}>Title</Label>
              <Input {...field} id={`testimonials.${index}.title`} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />
        <Controller
          control={control}
          name={`testimonials.${index}.image`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`testimonials.${index}.image`}>Image URL</Label>
              <FileUrl {...field} id={`testimonials.${index}.image`} placeholder={"https://..."} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />
      </div>

      <Controller
        control={control}
        name={`testimonials.${index}.text`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`testimonials.${index}.text`}>Testimonial</Label>
            <RichTextEditor id={`testimonials.${index}.text`} placeholder={"What did they say about your work?"} value={field.value || ""} onChange={field.onChange} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <div className={"grid gap-3 md:grid-cols-2"}>
        <Controller
          control={control}
          name={`testimonials.${index}.company`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`testimonials.${index}.company`}>Company</Label>
              <Input {...field} id={`testimonials.${index}.company`} placeholder={"Company Name"} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`testimonials.${index}.companyWebsite`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`testimonials.${index}.companyWebsite`}>Company Website</Label>
              <Input {...field} id={`testimonials.${index}.companyWebsite`} placeholder={"https://..."} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`testimonials.${index}.department`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`testimonials.${index}.department`}>Department</Label>
              <Input {...field} id={`testimonials.${index}.department`} placeholder={"Department Name"} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`testimonials.${index}.departmentWebsite`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`testimonials.${index}.departmentWebsite`}>Department Website</Label>
              <Input {...field} id={`testimonials.${index}.departmentWebsite`} placeholder={"https://..."} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />
      </div>
    </>
  );
}

function TestimonialPreview(
  {testimonial}: {
    testimonial: NonNullable<TInput["testimonials"]>[number]
  }
) {
  return (<>
    <p className={"truncate text-sm text-muted-foreground"}>
      {testimonial.title || "Untitled testimonial"}
    </p>

    <p className={"truncate text-sm text-muted-foreground"}>
      {testimonial.text || "No testimonial yet"}
    </p>
  </>);
}

function TestimonialCardHeader(
  {
    by, isCurrentlyEditing, onEdit, onDelete
  }: {
    by: string;
    isCurrentlyEditing: boolean;
    onEdit: () => void;
    onDelete: () => void
  }
) {
  return (
    <div className={"flex items-center justify-between gap-4"}>
      <div className={"min-w-0"}>
        <p className={"truncate font-medium text-muted-foreground"}>{by}</p>
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
    Identifier.Testimonials,
    schema,
    defaultValues
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const {fields: testimonials, append, remove} = useFieldArray({control, name: "testimonials", keyName: "fieldArrayId"});
  const testimonialsWatch = useWatch({control, name: "testimonials"}) || [];

  async function save(values: TOutput) {
    await saveConfig(values);
  }

  if (isLoadingConfig) {
    return <FullScreenMessage><Spinner className={"size-10"} /></FullScreenMessage>;
  }

  return (
    <ConfigurationFormWrapper className={styles.page} title={"Testimonials Configuration"} config={formValues} form={form}>
      <form onSubmit={handleSubmit(save)} className={cn(styles.form, "grid max-w-3xl gap-6")}>
        <Controller
          control={control}
          name={"summary"}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"testimonialsSummary"}>Summary</Label>
              <RichTextEditor id={"testimonialsSummary"} placeholder={"Introduce your testimonials"} value={field.value} onChange={field.onChange} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <div className={"flex flex-col justify-between gap-3 sm:flex-row sm:items-center"}>
          <div>
            <Label>Testimonials</Label>
            <p className={"mt-1 text-sm text-muted-foreground"}>Entries stay compact until you edit them.</p>
          </div>
          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              append(emptyTestimonial);
              setEditingIndex(testimonialsWatch.length);
            }}
            className="cursor-pointer hover:-translate-y-px"
          >
            <Plus /> Add testimonial
          </Button>
        </div>

        {testimonialsWatch.map((testimonial, index) => (
          <div key={testimonials[index]?.fieldArrayId} className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}>
            <TestimonialCardHeader
              by={testimonial.by || "Anonymous testimonial"}
              isCurrentlyEditing={editingIndex === index}
              onEdit={() => setEditingIndex(index)}
              onDelete={() => {
                if(editingIndex === index) {
                  setEditingIndex(null);
                }
                remove(index);
              }}
            />

            {editingIndex === index && (
              <div className={"grid gap-4 border-t pt-4"}>
                <TestimonialFields control={control} index={index} />
                <div className={"flex justify-end"}>
                  <Button type={"button"} size={"sm"} variant={"outline"} onClick={() => setEditingIndex(null)} className="cursor-pointer hover:-translate-y-px">Done</Button>
                </div>
              </div>
            )}

            {editingIndex !== index && (
              <div className={"grid gap-1 border-t pt-4"}>
                <TestimonialPreview testimonial={testimonial}/>
              </div>
            )}

            {editingIndex !== index && form.formState.errors.testimonials?.[index] && (
              <div className={"text-sm text-destructive"}>
                Please fix the errors in this testimonial.
              </div>
            )}
          </div>
        ))}

        {testimonials.length === 0 &&
          <div className={"rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"}>
            No testimonials yet. Add your first testimonial.
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
