"use client"

import React, {useMemo, useState} from "react";
import styles from "./page.module.css";
import {Identifier, useConfig} from "@/hooks/useConfig";
import {defaultValues, TInput, TOutput, schema} from "@/configuration/skills";
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
import {useConfigurationForm} from "@/hooks/useConfigurationForm";
import {withConfigurationId} from "@/lib/configurationUtils";
import {generateMilestoneLabel} from "@/lib/configurationUtils";
import CheckboxList from "@/components/ui/CheckboxList";

const emptySkill: NonNullable<TInput["skills"]>[number] = {
  id: "",
  title: "",
  image: "",
  description: "",
  associatedMilestoneIds: [],
  associatedProjectIds: [],
};

function SkillFields(
  {
    control, index, milestoneOptions, projectOptions
  }: {
    control: Control<TInput>;
    index: number;
    milestoneOptions: {value: string, label: string}[];
    projectOptions: {value: string, label: string}[];
  }
) {
  return (
    <>
      <div className={"grid gap-3 md:grid-cols-2"}>
        <Controller
          control={control}
          name={`skills.${index}.title`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`skills.${index}.title`}>Title</Label>
              <Input {...field} id={`skills.${index}.title`} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`skills.${index}.image`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`skills.${index}.image`}>Image URL</Label>
              <Input {...field} id={`skills.${index}.image`} placeholder={"https://..."} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />
      </div>

      <Controller
        control={control}
        name={`skills.${index}.description`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`skills.${index}.description`}>Description</Label>
            <RichTextEditor id={`skills.${index}.description`} placeholder={"How do you use this skill?"} value={field.value || ""} onChange={field.onChange} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <Controller
        control={control}
        name={`skills.${index}.associatedMilestoneIds`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`skills.${index}.associatedMilestoneIds`}>Associated Milestones</Label>
            <CheckboxList id={`skills.${index}.associatedMilestoneIds`} options={milestoneOptions} value={field.value || []} onValueChange={field.onChange}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <Controller
        control={control}
        name={`skills.${index}.associatedProjectIds`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`skills.${index}.associatedProjectIds`}>Associated Projects</Label>
            <CheckboxList id={`skills.${index}.associatedProjectIds`} options={projectOptions} value={field.value || []} onValueChange={field.onChange}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />
    </>
  );
}

function SkillPreview({skill}: {skill: NonNullable<TInput["skills"]>[number]}) {
  return (<>
    <p className={"truncate font-medium text-muted-foreground"}>
      {skill.title || "Untitled skill"}
    </p>

    <p className={"truncate text-sm text-muted-foreground"}>
      {skill.description || "No description yet"}
    </p>
  </>);
}

function SkillCardHeader(
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
          aria-label={"Edit skill"}
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
          aria-label={"Delete skill"}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

function Page() {
  const {config: journey} = useConfig(Identifier.Journey);
  const {config: projectsConfig} = useConfig(Identifier.Projects);
  const {
    isLoadingConfig,
    saveConfig,
    isSavingConfig,
    form,
    control,
    handleSubmit,
    formValues
  } = useConfigurationForm(
    Identifier.Skills,
    schema,
    defaultValues
  );
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const {fields: skills, append, remove} = useFieldArray({control, name: "skills", keyName: "fieldArrayId"});
  const skillsWatch = useWatch({control, name: "skills"}) || [];

  const milestoneOptions = useMemo(() => (
    (journey?.milestones || []).map((milestone) => ({
      value: milestone.id,
      label: generateMilestoneLabel(milestone)
    }))
  ), [journey]);

  const projectOptions = useMemo(() => (
    (projectsConfig?.projects || []).map((project) => ({
      value: project.id,
      label: project.title || ("Untitled project" + (project.id ? ` (#${project.id})` : "")),
    }))
  ), [projectsConfig]);

  async function save(values: TOutput) {
    await saveConfig(values);
  }

  if (isLoadingConfig) {
    return <FullScreenMessage><Spinner className={"size-10"} /></FullScreenMessage>;
  }

  return (
    <ConfigurationFormWrapper className={styles.page} title={"Skills Configuration"} config={formValues} form={form}>
      <form onSubmit={handleSubmit(save)} className={cn(styles.form, "grid max-w-3xl gap-6")}>
        <Controller
          control={control}
          name={"summary"}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"skillsSummary"}>Summary</Label>
              <RichTextEditor id={"skillsSummary"} placeholder={"Introduce your skills"} value={field.value} onChange={field.onChange} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <div className={"flex flex-col justify-between gap-3 sm:flex-row sm:items-center"}>
          <div>
            <Label>Skills</Label>
            <p className={"mt-1 text-sm text-muted-foreground"}>Entries stay compact until you edit them.</p>
          </div>

          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              const skill = withConfigurationId(emptySkill, "skill");
              append(skill);
              setEditingSkillId(skill.id);
            }}
            className="cursor-pointer hover:-translate-y-px"
          >
            <Plus /> Add skill
          </Button>
        </div>

        {skillsWatch.map((skill, index) => (
          <div key={skill.id} className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}>
            <SkillCardHeader
              id={skill.id}
              isCurrentlyEditing={editingSkillId === skill.id}
              onEdit={() => setEditingSkillId(skill.id)}
              onDelete={() => {
                if (editingSkillId === skill.id) {
                  setEditingSkillId(null);
                }
                remove(index);
              }}
            />
            {editingSkillId === skill.id && (
              <div className={"grid gap-4 border-t pt-4"}>
                <SkillFields control={control} index={index} milestoneOptions={milestoneOptions} projectOptions={projectOptions}/>
                <div className={"flex justify-end"}>
                  <Button type={"button"} size={"sm"} variant={"outline"} onClick={() => setEditingSkillId(null)} className="cursor-pointer hover:-translate-y-px">Done</Button>
                </div>
              </div>
            )}
            {editingSkillId !== skill.id && (
              <div className={"grid gap-1 border-t pt-4"}>
                <SkillPreview skill={skill}/>
              </div>
            )}
            {editingSkillId !== skill.id && form.formState.errors.skills?.[index] && (
              <div className={"text-sm text-destructive"}>
                Please fix the errors in this skill.
              </div>
            )}
          </div>
        ))}

        {skills.length === 0 &&
          <div className={"rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"}>
            No skills yet. Add your first skill.
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
