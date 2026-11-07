"use client"

import React, {useMemo, useState} from "react";
import styles from "./page.module.css";
import {Identifier, useConfig} from "@/hooks/useConfig";
import {defaultValues, TInput, TOutput, schema} from "@/configuration/projects";
import {Input} from "@/components/ui/input";
import {ArrayInput} from "@/components/ui/ArrayInput";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import {Pencil, Plus, Trash2} from "lucide-react";
import {cn} from "@/lib/utils";
import {Control, Controller, useFieldArray, useWatch} from "react-hook-form";
import {useConfigurationForm} from "@/hooks/useConfigurationForm";
import {createConfigurationId, withConfigurationId} from "@/lib/configurationUtils";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {RichTextEditor} from "@/components/ui/RichTextEditor";
import {generateMilestoneLabel} from "@/lib/configurationUtils";
import {isNullOrWhitespace} from "@/lib/string";
import {slugify} from "@/lib/slugs";

const emptyProject: NonNullable<TInput["projects"]>[number] = {
  id: "",
  slugs: [],
  title: "",
  links: [{name: "", url: ""}],
  description: "",
  previewImage: "",
  images: [],
  keypoints: [],
  seoKeywords: [],
  milestoneId: "",
};

function ProjectLinksFields({control, projectIndex}: {control: Control<TInput>; projectIndex: number}) {
  const {fields, append, remove} = useFieldArray({control, name: `projects.${projectIndex}.links` as const});

  return (
    <div className={"grid gap-3"}>
      <div className={"flex items-center justify-between"}>
        <Label>Project links</Label>
        <Button type={"button"} size={"sm"} variant={"outline"} onClick={() => append({name: "", url: ""})} className="cursor-pointer hover:-translate-y-px">
          <Plus /> Add link
        </Button>
      </div>

      {fields.map((field, linkIndex) => (
        <div key={field.id} className={"grid gap-2 md:grid-cols-[1fr_1fr_auto]"}>
          <Controller
            control={control}
            name={`projects.${projectIndex}.links.${linkIndex}.name` as const}
            render={({field, fieldState: {error}}) =>
              <div className={"grid gap-2"}>
                <Input {...field} placeholder={"Link name"} className={cn("w-full", error && "border-destructive")}/>
                {error && <small className={"text-destructive"}>{error.message}</small>}
              </div>
            }
          />

          <Controller
            control={control}
            name={`projects.${projectIndex}.links.${linkIndex}.url` as const}
            render={({field, fieldState: {error}}) =>
              <div className={"grid gap-2"}>
                <Input {...field} placeholder={"https://..."} className={cn("w-full", error && "border-destructive")}/>
                {error && <small className={"text-destructive"}>{error.message}</small>}
              </div>
            }
          />

          <Button type={"button"} size={"icon-sm"} variant={"ghost"} className={"text-destructive cursor-pointer hover:-translate-y-px"} onClick={() => remove(linkIndex)} aria-label={"Delete project link"}>
            <Trash2 />
          </Button>
        </div>
      ))}
    </div>
  );
}

function KeypointFields({control, index: projectIndex}: {control: Control<TInput>; index: number}) {
  const {fields, append, remove} = useFieldArray({control, name: `projects.${projectIndex}.keypoints` as const});

  return (
    <div className={"grid gap-3"}>
      <div className={"flex items-center justify-between"}>
        <Label>Key points</Label>
        <Button type={"button"} size={"sm"} variant={"outline"} onClick={() => append({title: "", value: ""})} className="cursor-pointer hover:-translate-y-px">
          <Plus /> Add key point
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className={"grid gap-2 md:grid-cols-[1fr_1fr_auto]"}>
          <Controller
            control={control}
            name={`projects.${projectIndex}.keypoints.${index}.title` as const}
            render={({field, fieldState: {error}}) =>
              <div className={"grid gap-2"}>
                <Input {...field} placeholder={"Label"} className={cn("w-full", error && "border-destructive")}/>
                {error && <small className={"text-destructive"}>{error.message}</small>}
              </div>
            }
          />

          <Controller
            control={control}
            name={`projects.${projectIndex}.keypoints.${index}.value` as const}
            render={({field, fieldState: {error}}) =>
              <div className={"grid gap-2"}>
                <Input {...field} placeholder={"Value"} className={cn("w-full", error && "border-destructive")}/>
                {error && <small className={"text-destructive"}>{error.message}</small>}
              </div>
            }
          />

          <Button type={"button"} size={"icon-sm"} variant={"ghost"} className={"text-destructive cursor-pointer hover:-translate-y-px"} onClick={() => remove(index)} aria-label={"Delete key point"}>
            <Trash2 />
          </Button>
        </div>
      ))}
    </div>
  );
}

function ProjectFields({control, index, journey}: {control: Control<TInput>; index: number; journey: ReturnType<typeof useConfig<Identifier.Journey>>["config"]}) {
  const milestoneOptions = useMemo(() => {
    const milestones = journey?.milestones || [];
    return milestones.map((milestone) => ({
      value: milestone.id,
      label: generateMilestoneLabel(milestone)
    }));
  }, [journey]);

  return (
    <>
      <div className={"grid gap-3 md:grid-cols-2"}>
        <Controller
          control={control}
          name={`projects.${index}.title` as const}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"projectTitle"}>Title</Label>
              <Input {...field} id={"projectTitle"} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`projects.${index}.previewImage` as const}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"previewImage"}>Preview image URL</Label>
              <Input {...field} id={"previewImage"} placeholder={"https://..."} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />
      </div>

      <Controller
        control={control}
        name={`projects.${index}.description` as const}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={"projectDescription"}>Description</Label>
            <RichTextEditor id={"projectDescription"} placeholder={"What did you build and why does it matter?"} value={field.value || ""} onChange={field.onChange} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <Controller
        control={control}
        name={`projects.${index}.seoKeywords` as const}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={"seoKeywords"}>Search keywords</Label>
            <ArrayInput value={field.value || []} onChange={field.onChange} id={"seoKeywords"} placeholder={"Type a keyword and press Enter"} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <Controller
        control={control}
        name={`projects.${index}.images` as const}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={"images"}>Additional image URLs</Label>
            <ArrayInput value={field.value || []} onChange={field.onChange} id={"images"} placeholder={"Paste an image URL and press Enter"} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <ProjectLinksFields control={control} projectIndex={index} />

      <Controller
        control={control}
        name={`projects.${index}.milestoneId` as const}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={"milestoneId"}>Journey milestone</Label>
            <Select id={"milestoneId"} items={milestoneOptions} value={field.value || "none"} onValueChange={(value) => field.onChange(value === "none" ? "" : value)}>
              <SelectTrigger type="button" className={cn("w-full", error && "border-destructive")}>
                <SelectValue placeholder={"No milestone"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"none"}>No milestone</SelectItem>
                  {milestoneOptions.map((milestone) => (
                    <SelectItem key={milestone.value} value={milestone.value}>{milestone.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <KeypointFields control={control} index={index} />
    </>
  );
}

function ProjectPreview({project}: {project: NonNullable<TInput["projects"]>[number]}) {
  return (<>
    <p className={"truncate font-medium text-muted-foreground"}>
      {project.title || "Untitled project"}
    </p>

    <p className={"truncate text-sm text-muted-foreground"}>
      {project.description || "No description yet"}
    </p>
  </>);
}

function ProjectCardHeader(
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
          aria-label={"Edit project"}
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
          aria-label={"Delete project"}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

function Page() {
  const {config: journey} = useConfig(Identifier.Journey);
  const {
    isLoadingConfig,
    saveConfig,
    isSavingConfig,
    form,
    control,
    handleSubmit,
    formValues
  } = useConfigurationForm(
    Identifier.Projects,
    schema,
    defaultValues
  );
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const {fields: projects, append, remove} = useFieldArray({control, name: "projects", keyName: "fieldArrayId"});
  const projectsWatch = useWatch({control, name: "projects"}) || [];

  async function save(values: TOutput) {
    for (const project of values.projects) {
      if (isNullOrWhitespace(project.id)) {
        project.id = createConfigurationId("project");
      }

      const exhaustedSlugsExceptThisProject = new Set(values
        .projects
        .filter(x => x.id != project.id)
        .flatMap(x => x.slugs)
        .map(x => x.slug)
      );
      const activeSlugCandidate = slugify(project.title, exhaustedSlugsExceptThisProject);
      let foundActiveSlug = false;
      for (const slugEntry of project.slugs) {
        if (slugEntry.slug === activeSlugCandidate) {
          slugEntry.isActive = true;
          foundActiveSlug = true;
          continue;
        }
        slugEntry.isActive = false;
      }
      if(!foundActiveSlug){
        project.slugs.push({
          slug: activeSlugCandidate,
          isActive: true
        });
      }
    }

    await saveConfig(values);
  }

  if (isLoadingConfig) {
    return <FullScreenMessage><Spinner className={"size-10"} /></FullScreenMessage>;
  }

  return (
    <ConfigurationFormWrapper className={styles.page} title={"Projects Configuration"} config={formValues} form={form}>
      <form onSubmit={handleSubmit(save)} className={cn(styles.form, "grid max-w-3xl gap-6")}>
        <Controller
          control={control}
          name={"summary"}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"projectsSummary"}>Summary</Label>
              <RichTextEditor id={"projectsSummary"} placeholder={"Introduce your works"} value={field.value} onChange={field.onChange} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <div className={"flex flex-col justify-between gap-3 sm:flex-row sm:items-center"}>
          <div>
            <Label>Projects</Label>
            <p className={"mt-1 text-sm text-muted-foreground"}>Entries stay compact until you edit them.</p>
          </div>

          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              const project = withConfigurationId(emptyProject, "project");
              append(project);
              setEditingProjectId(project.id);
            }}
            className="cursor-pointer hover:-translate-y-px"
          >
            <Plus /> Add project
          </Button>
        </div>

        {projectsWatch.map((project, index) => (
          <div key={project.id} className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}>
            <ProjectCardHeader
              id={project.id}
              isCurrentlyEditing={editingProjectId === project.id}
              onEdit={() => setEditingProjectId(project.id)}
              onDelete={() => {
                if (editingProjectId === project.id) {
                  setEditingProjectId(null);
                }
                remove(index);
              }}
            />

            {editingProjectId === project.id && (
              <div className={"grid gap-4 border-t pt-4"}>
                <ProjectFields control={control} index={index} journey={journey} />
                <div className={"flex justify-end"}>
                  <Button type={"button"} size={"sm"} variant={"outline"} onClick={() => setEditingProjectId(null)} className="cursor-pointer hover:-translate-y-px">Done</Button>
                </div>
              </div>
            )}

            {editingProjectId !== project.id && (
              <div className={"grid gap-1 border-t pt-4"}>
                <ProjectPreview project={project}/>
              </div>
            )}

            {editingProjectId !== project.id && form.formState.errors.projects?.[index] && (
              <div className={"text-sm text-destructive"}>
                Please fix the errors in this project.
              </div>
            )}
          </div>
        ))}

        {projects.length === 0 &&
          <div className={"rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"}>
            No projects yet. Add your first project.
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
