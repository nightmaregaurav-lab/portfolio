"use client"

import React, {useEffect, useState} from "react";
import styles from "./page.module.css";
import {Identifier} from "@/hooks/useConfig";
import {defaultValues, TInput, TOutput, schema} from "@/configuration/journey";
import {Input} from "@/components/ui/input";
import {DatePicker} from "@/components/ui/DatePicker";
import {Textarea} from "@/components/ui/textarea";
import {ArrayInput} from "@/components/ui/ArrayInput";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import {Pencil, Plus, Trash2} from "lucide-react";
import {cn} from "@/lib/utils";
import {Control, Controller, useFieldArray, useWatch} from "react-hook-form";
import {RichTextEditor} from "@/components/ui/RichTextEditor";
import {useConfigurationForm} from "@/hooks/useConfigurationForm";
import {withConfigurationId} from "@/lib/configurationUtils";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from "@/components/ui/select";

const emptyMilestone: NonNullable<TInput["milestones"]>[number] = {
  id: "",
  type: "Professional",
  title: "",
  description: "",
  start: "",
  end: "",
  organisation: "",
  organizationWebsite: "",
  department: "",
  departmentWebsite: "",
  points: [],
  partingNote: "",
  achievements: [],
};

function AchievementFields({control, index}: {control: Control<TInput>; index: number}) {
  const {fields, append, remove} = useFieldArray({
    control,
    name: `milestones.${index}.achievements`,
  });

  return (
    <div className={"grid gap-3"}>
      <div className={"flex items-center justify-between"}>
        <Label>Achievements</Label>
        <Button type={"button"} size={"sm"} variant={"outline"} onClick={() => append({title: "", description: "", on: ""})} className="cursor-pointer hover:-translate-y-px">
          <Plus /> Add achievement
        </Button>
      </div>

      {fields.map((field, achievementIndex) => (<>
        <Controller
          control={control}
          name={`milestones.${index}.achievements.${achievementIndex}.on`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`milestones.${index}.achievements.${achievementIndex}.on`}>End date</Label>
              <DatePicker {...field} id={`milestones.${index}.achievements.${achievementIndex}.on`} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <div key={field.id} className={"grid gap-2 md:grid-cols-[1fr_1fr_auto]"}>
          <Controller
            control={control}
            name={`milestones.${index}.achievements.${achievementIndex}.title`}
            render={({field, fieldState: {error}}) =>
              <div className={"grid gap-2"}>
                <Input {...field} placeholder={"Achievement title"} className={cn("w-full", error && "border-destructive")}/>
                {error && <small className={"text-destructive"}>{error.message}</small>}
              </div>
            }
          />

          <Controller
            control={control}
            name={`milestones.${index}.achievements.${achievementIndex}.description`}
            render={({field, fieldState: {error}}) =>
              <div className={"grid gap-2"}>
                <Input {...field} placeholder={"Short description"} className={cn("w-full", error && "border-destructive")}/>
                {error && <small className={"text-destructive"}>{error.message}</small>}
              </div>
            }
          />

          <Button type={"button"} size={"icon-sm"} variant={"ghost"} className={"text-destructive cursor-pointer hover:-translate-y-px"} onClick={() => remove(achievementIndex)} aria-label={"Delete achievement"}>
            <Trash2 />
          </Button>
        </div>
      </>))}
    </div>
  );
}

function MilestoneFields({control, index}: {control: Control<TInput>; index: number}) {
  const types = [
    {
      value: "Academic",
      label: "Academic",
    },
    {
      value: "Professional",
      label: "Professional",
    },
    {
      value: "Personal",
      label: "Personal",
    }
  ];
  return (
    <>
      <div className={"grid gap-3 md:grid-cols-2"}>
        <Controller
          control={control}
          name={`milestones.${index}.type`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`milestones.${index}.type`}>Type</Label>
              <Select id={`milestones.${index}.type`} items={types} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger type="button" className={cn("w-full", error && "border-destructive")}>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {types.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`milestones.${index}.title`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`milestones.${index}.title`}>Title</Label>
              <Input {...field} id={`milestones.${index}.title`} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`milestones.${index}.start`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`milestones.${index}.start`}>Start date</Label>
              <DatePicker {...field} id={`milestones.${index}.start`} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`milestones.${index}.end`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`milestones.${index}.end`}>End date</Label>
              <DatePicker {...field} id={`milestones.${index}.end`} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`milestones.${index}.organisation`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`milestones.${index}.organisation`}>Organization</Label>
              <Input {...field} id={`milestones.${index}.organisation`} value={field.value || ""} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`milestones.${index}.organizationWebsite`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`milestones.${index}.organizationWebsite`}>Organization website</Label>
              <Input {...field} id={`milestones.${index}.organizationWebsite`} value={field.value || ""} placeholder={"https://..."} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`milestones.${index}.department`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`milestones.${index}.department`}>Department</Label>
              <Input {...field} id={`milestones.${index}.department`} value={field.value || ""} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`milestones.${index}.departmentWebsite`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`milestones.${index}.departmentWebsite`}>Department website</Label>
              <Input {...field} id={`milestones.${index}.departmentWebsite`} value={field.value || ""} placeholder={"https://..."} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />
      </div>

      <Controller
        control={control}
        name={`milestones.${index}.description`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`milestones.${index}.description`}>Description</Label>
            <Textarea {...field} id={`milestones.${index}.description`} placeholder={"Describe what happened and what you learned."} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <Controller
        control={control}
        name={`milestones.${index}.points`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`milestones.${index}.points`}>Highlights</Label>
            <ArrayInput value={field.value || []} onChange={field.onChange} id={`milestones.${index}.points`} placeholder={"Type a highlight and press Enter"} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <Controller
        control={control}
        name={`milestones.${index}.partingNote`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`milestones.${index}.partingNote`}>Parting note</Label>
            <Textarea {...field} id={`milestones.${index}.partingNote`} value={field.value || ""} placeholder={"Optional closing note"} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <AchievementFields control={control} index={index} />
    </>
  );
}

function MilestonePreview(
  {milestone}: {
    milestone: NonNullable<TInput["milestones"]>[number];
  }
){
  return (<>
    <p className={"text-sm text-muted-foreground"}>
      {milestone.title || "Untitled"} ({milestone.start || "Unknown start"} — {milestone.end || "Ongoing"})
    </p>

    <p className={"text-sm text-muted-foreground"}>
      {milestone.type} | {milestone.organisation || "No organization"} | {milestone.department || "No department"}
    </p>
  </>);
}

function MilestoneCardHeader(
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

function PageContent() {
  const {
    isLoadingConfig,
    saveConfig,
    isSavingConfig,
    form,
    control,
    handleSubmit,
    formValues
  } = useConfigurationForm(
    Identifier.Journey,
    schema,
    defaultValues
  );
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const {fields: milestones, append, remove, move} = useFieldArray({control, name: "milestones", keyName: "fieldArrayId"});
  const milestonesWatch = useWatch({control, name: "milestones"}) || [];

  useEffect(() => {
    const milestonesCopy = [...milestonesWatch];

    const order = milestonesCopy
      .sort((a, b) => {
        const aStartDate = new Date(a.start || "9999-12-31");
        const bStartDate = new Date(b.start || "9999-12-31");
        if (aStartDate < bStartDate) return -1;
        if (aStartDate > bStartDate) return 1;
        const aEndDate = new Date(a.end || "9999-12-31");
        const bEndDate = new Date(b.end || "9999-12-31");
        if (aEndDate < bEndDate) return -1;
        if (aEndDate > bEndDate) return 1;
        return 0;
      })
      .map(({id}) => id);

    const currentOrder = milestonesWatch.map(({id}) => id);

    order.forEach((id, targetIndex) => {
      const currentIndex = currentOrder.indexOf(id);
      if (currentIndex === -1 || currentIndex === targetIndex) {
        return;
      }
      move(currentIndex, targetIndex);
      currentOrder.splice(currentIndex, 1);
      currentOrder.splice(targetIndex, 0, id);
    });
  }, [milestonesWatch, move]);

  async function save(values: TOutput) {
    await saveConfig(values);
  }

  if (isLoadingConfig) {
    return <FullScreenMessage><Spinner className={"size-10"} /></FullScreenMessage>;
  }

  return (
    <ConfigurationFormWrapper className={styles.page} title={"Journey Configuration"} config={formValues} form={form}>
      <form onSubmit={handleSubmit(save)} className={cn(styles.form, "grid max-w-3xl gap-6")}>
        <Controller
          control={control}
          name={"summary"}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"summary"}>Summary</Label>
              <RichTextEditor id={"summary"} placeholder={"Tell visitors about your journey"} value={field.value} onChange={field.onChange} className={cn("w-full", error && "border-destructive")} />
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <div className={"flex flex-col justify-between gap-3 sm:flex-row sm:items-center"}>
          <div>
            <Label>Milestones</Label>
            <p className={"mt-1 text-sm text-muted-foreground"}>Entries are ordered by start date, then end date.</p>
          </div>

          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              const milestone = withConfigurationId(emptyMilestone, "milestone");
              append(milestone);
              setEditingMilestoneId(milestone.id);
            }}
            className="cursor-pointer hover:-translate-y-px"
          >
            <Plus /> Add milestone
          </Button>
        </div>

        {milestonesWatch.map((milestone, index) => (
          <div key={milestone.id} className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}>
            <MilestoneCardHeader
              id={milestone.id}
              isCurrentlyEditing={editingMilestoneId === milestone.id}
              onEdit={() => setEditingMilestoneId(milestone.id)}
              onDelete={() => {
                if (editingMilestoneId === milestone.id) {
                  setEditingMilestoneId(null);
                }
                remove(index);
              }}
            />

            {editingMilestoneId === milestone.id && (
              <div className={"grid gap-4 border-t pt-4"}>
                <MilestoneFields control={control} index={index} />
                <div className={"flex justify-end"}>
                  <Button type={"button"} size={"sm"} variant={"outline"} onClick={() => setEditingMilestoneId(null)} className="cursor-pointer hover:-translate-y-px">Done</Button>
                </div>
              </div>
            )}

            {editingMilestoneId !== milestone.id && (
              <div className={"grid gap-1 border-t pt-4"}>
                <MilestonePreview milestone={milestone}/>
              </div>
            )}

            {editingMilestoneId !== milestone.id && form.formState.errors.milestones?.[index] && (
              <div className={"text-sm text-destructive"}>
                Please fix the errors in this milestone.
              </div>
            )}
          </div>
        ))}

        {milestones.length === 0 &&
          <div className={"rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"}>
            No milestones yet. Add your first milestone.
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

export default PageContent;
