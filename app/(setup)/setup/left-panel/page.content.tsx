"use client"

import React from "react";
import styles from "./page.module.css";
import {Identifier} from "@/hooks/useConfig";
import { Controller, useFieldArray } from "react-hook-form";
import { TOutput, schema, defaultValues } from "@/configuration/leftPanel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, Plus } from "lucide-react";
import CheckboxList from "@/components/ui/CheckboxList";
import { FileUrl } from "@/components/ui/FileUrl";
import {useConfigurationForm} from "@/hooks/useConfigurationForm";

const availableMenus = [
  { value: "home", label: "Home" },
  { value: "about", label: "About" },
  { value: "journey", label: "Journey" },
  { value: "projects", label: "Projects" },
  { value: "skills", label: "Skills" },
  { value: "services", label: "services" },
  { value: "testimonials", label: "Testimonials" },
  { value: "gallery", label: "Gallery" },
  { value: "blogs", label: "Blogs" },
  { value: "quickLinks", label: "Quick Links" },
];

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
    Identifier.LeftPanel,
    schema,
    defaultValues
  );

  async function save(values: TOutput) {
    await saveConfig(values);
  }

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial
  } = useFieldArray({
    control,
    name: "socials"
  });

  if(isLoadingConfig){
    return <FullScreenMessage><Spinner className={"size-10"}/></FullScreenMessage>;
  }

  return (
    <ConfigurationFormWrapper className={styles.page} title={"Left Panel Configuration"} config={formValues} form={form}>
      <form onSubmit={handleSubmit(save)} className={cn(styles.form, "grid gap-6 max-w-3xl")}>
        <Controller
          control={control}
          name={"profilePicture"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"profilePicture"}>Profile Photo</Label>
              <FileUrl {...field} id={"profilePicture"} placeholder={"https://example.com/profile.jpg"} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          )}
        />

        {/* Socials */}
        <div className={"grid gap-3"}>
          <div className={"flex gap-2 items-center justify-between"}>
            <div>
              <Label>Social Media</Label>
              <p className={"text-sm text-muted-foreground"}>Add links to your social media profiles.</p>
            </div>

            <Button
              type={"button"}
              size={"sm"}
              variant={"outline"}
              onClick={() =>
                appendSocial({
                  name: "",
                  url: "",
                })
              }
              className="cursor-pointer hover:-translate-y-px"
            >
              <Plus className={"size-4"} />
              Add Social
            </Button>
          </div>

          <div className={"grid gap-3 grid-cols-1 md:grid-cols-2"}>
            {socialFields.map((item, index) => (
              <div key={item.id} className={"flex gap-2 items-start rounded-md border p-3"}
              >
                <div className={"grid gap-2 flex-1"}>
                  <Controller
                    control={control}
                    name={`socials.${index}.name`}
                    render={({ field, fieldState: { error } }) => (
                      <div className={"grid gap-1"}>
                        <Label htmlFor={`socials.${index}.name`}>Platform</Label>
                        <Input {...field} id={`socials.${index}.name`} placeholder={"GitHub"} className={cn(error && "border-destructive")}/>
                        {error && <small className={"text-destructive"}>{error.message}</small>}
                      </div>
                    )}
                  />

                  <Controller
                    control={control}
                    name={`socials.${index}.url`}
                    render={({ field, fieldState: { error } }) => (
                      <div className={"grid gap-1"}>
                        <Label htmlFor={`socials.${index}.url`}>URL</Label>
                        <Input {...field} id={`socials.${index}.url`} placeholder={"https://github.com/username"} className={cn(error && "border-destructive")}/>
                        {error && <small className={"text-destructive"}>{error.message}</small>}
                      </div>
                    )}
                  />
                </div>

                <Button
                  type={"button"}
                  size={"icon"}
                  variant={"ghost"}
                  className={"text-destructive hover:text-destructive cursor-pointer hover:-translate-y-px"}
                  onClick={() => removeSocial(index)}
                >
                  <Trash2 className={"size-4"} />
                </Button>
              </div>
            ))}

            {socialFields.length === 0 && (
              <div className={"rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground"}>
                No social media profiles added.
              </div>
            )}
          </div>
        </div>

        <Controller
          control={control}
          name={"enabledMenus"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-3"}>
              <div>
                <Label htmlFor={"enabledMenus"}>Enabled Menus</Label>
                <p className={"text-sm text-muted-foreground"}>
                  Select the navigation paths that should be enabled on your website. The template you select still controls which paths are actually navigable, but this setting allows you to hide or show certain paths from SEO.
                </p>
              </div>
              <CheckboxList id={"enabledMenus"} options={availableMenus} value={field.value || []} onValueChange={field.onChange}/>
              {error && (
                <small className={"text-destructive"}>
                  {error.message}
                </small>
              )}
            </div>
          )}
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

export default PageContent;
