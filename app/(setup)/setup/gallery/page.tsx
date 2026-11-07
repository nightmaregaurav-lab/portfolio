"use client"

import React, {useEffect, useMemo, useRef, useState} from "react";
import styles from "./page.module.css";
import {Identifier} from "@/hooks/useConfig";
import {defaultValues, TInput, TOutput, schema} from "@/configuration/gallery";
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
import {withConfigurationId} from "@/lib/configurationUtils";
import ImageLightbox from "@/components/ui/ImageLightbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";
import {RichTextEditor} from "@/components/ui/RichTextEditor";
import {stripHtmlTags} from "@/lib/html";
import {slugify} from "@/lib/slugs";

const emptyPhoto: NonNullable<TInput["photos"]>[number] = {
  id: "",
  url: "",
  title: "",
  caption: "",
  categories: [],
};

const emptyCategory: NonNullable<TInput["categories"]>[number] = {
  name: "",
  slugs: [],
  coverImage: "",
  description: "",
};

function PhotoFields(
  {control, index, categorySuggestions, onCategoryAdded}: {
    control: Control<TInput>;
    index: number
    categorySuggestions: string[];
    onCategoryAdded: (name: string) => void;
  }
) {
  return (
    <>
      <Controller
        control={control}
        name={`photos.${index}.url`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`photos.${index}.url`}>Photo URL</Label>
            <Input {...field} id={`photos.${index}.url`} placeholder={"https://example.com/photo.jpg"} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <Controller
        control={control}
        name={`photos.${index}.title`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`photos.${index}.title`}>Title (optional)</Label>
            <Input {...field} id={`photos.${index}.title`} value={field.value || ""} placeholder={"A title for this image"} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <Controller
        control={control}
        name={`photos.${index}.caption`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`photos.${index}.caption`}>Caption</Label>
            <Textarea id={`photos.${index}.caption`} placeholder={"A short caption"} value={field.value} onChange={field.onChange} className={cn("w-full", error && "border-destructive")}/>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <Controller
        control={control}
        name={`photos.${index}.categories`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`photos.${index}.categories`}>Categories</Label>
            <ArrayInput
              value={field.value || []}
              onChange={field.onChange}
              id={`photos.${index}.categories`}
              placeholder={"Type a category and press Enter"}
              suggestions={categorySuggestions}
              onValueAdded={onCategoryAdded}
              className={cn("w-full", error && "border-destructive")}
            />
            <p className={"text-xs text-muted-foreground"}>Categories act like folders on your website. A photo can appear in more than one folder without being copied.</p>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />
    </>
  );
}

function GalleryPhotoCard(
  {
    photo, index, onEdit, onDelete
  }: {
    photo: NonNullable<TInput["photos"]>[number];
    index: number;
    onEdit: () => void;
    onDelete: () => void;
  }
) {
  const imageName = photo.title || photo.caption || `Gallery photo ${index + 1}`;
  const image = photo.url ? (
    <img src={photo.url} alt={imageName} className={"size-full object-cover"}/>
  ) : (
    <div className={"flex size-full items-center justify-center bg-muted text-sm text-muted-foreground"}>No image</div>
  );

  return (
    <div className={"group relative aspect-square overflow-hidden rounded-xl border bg-card shadow-sm"}>
      {photo.url ?
        <ImageLightbox
          src={photo.url}
          name={imageName}
          trigger={image}
        /> : image
      }

      <div className={"pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/30 to-transparent p-3 pt-10"}>
        {photo.title && <p className={"truncate text-sm font-semibold text-white"}>{photo.title}</p>}
        <p className={"truncate text-sm font-medium text-white"}>{photo.caption || `Photo ${index + 1}`}</p>
        {photo.categories && photo.categories.length > 0 && <p className={"truncate text-xs text-white/75"}>{photo.categories.join(" · ")}</p>}
      </div>

      <div className={"absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"}>
        <Button
          type={"button"}
          size={"icon-sm"}
          variant={"secondary"}
          className="cursor-pointer hover:-translate-y-px shadow-sm"
          onClick={onEdit}
          aria-label={`Edit ${imageName}`}
        >
          <Pencil />
        </Button>

        <Button
          type={"button"}
          size={"icon-sm"}
          variant={"destructive"}
          className="cursor-pointer hover:-translate-y-px shadow-sm"
          onClick={onDelete}
          aria-label={`Delete ${imageName}`}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

function CategoryPreview({category}: {category: NonNullable<TInput["categories"]>[number]}) {
  return (<>
    <p className={"truncate text-sm text-muted-foreground"}>
      {stripHtmlTags(category.description) || "No introduction yet"}
    </p>
  </>);
}

function CategoryCardHeader(
  {
    name, isCurrentlyEditing, onEdit, onDelete
  }: {
    name: string;
    isCurrentlyEditing: boolean;
    onEdit: () => void;
    onDelete: () => void;
  }
) {
  return (
    <div className={"flex items-center justify-between gap-4"}>
      <div className={"min-w-0"}>
        <p className={"truncate font-medium text-muted-foreground"}>{name || "New folder"}</p>
      </div>

      <div className={"flex shrink-0 gap-2"}>
        {!isCurrentlyEditing && <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          onClick={onEdit}
          aria-label={`Edit ${name || "category"}`}
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
          aria-label={`Delete ${name || "category"}`}
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
    Identifier.Gallery,
    schema,
    defaultValues
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const editingCategoryName = useRef("");
  const {fields: photos, append, remove} = useFieldArray({control, name: "photos", keyName: "fieldArrayId"});
  const {fields: categoryFields, append: appendCategory, remove: removeCategoryField} = useFieldArray({control, name: "categories", keyName: "categoryFieldId"});
  const photosWatch = useWatch({control, name: "photos"}) || [];
  const categoriesWatch = useWatch({control, name: "categories"}) || [];
  const categorySuggestions = useMemo(() => {
    const names = [
      ...categoriesWatch.map((category) => category.name),
      ...photosWatch.flatMap((photo) => photo.categories || []),
    ];
    return names.filter((name, index) =>
      name.trim() && names.findIndex((candidate) => candidate.trim().toLocaleLowerCase() === name.trim().toLocaleLowerCase()) === index
    );
  }, [categoriesWatch, photosWatch]);

  function ensureCategory(name: string) {
    const existingCategories = form.getValues("categories") || [];
    const normalizedName = name.trim().toLocaleLowerCase();
    if (!normalizedName || existingCategories.some((category) => category.name.trim().toLocaleLowerCase() === normalizedName)) return;
    appendCategory({
      name: name.trim(),
      slugs: [],
      coverImage: "",
      description: ""
    }, {
      shouldFocus: false
    });
  }

  function updatePhotoCategoryName(previousName: string, nextName: string) {
    if (!previousName || !nextName.trim()) return;

    const photosValues = form.getValues("photos") || [];
    const updatedPhotos = photosValues.map((photo) => ({
      ...photo,
      categories: (photo.categories || []).map((categoryName) =>
        categoryName.trim().toLocaleLowerCase() === previousName.trim().toLocaleLowerCase()
          ? nextName
          : categoryName
      ),
    }));

    form.setValue("photos", updatedPhotos, {shouldDirty: true});
  }

  function openCategoryEditor(index: number) {
    editingCategoryName.current = form.getValues(`categories.${index}.name`) || "";
    setEditingCategoryIndex(index);
  }

  function addCategory() {
    const categoriesLength = form.getValues("categories")?.length || 0;
    appendCategory({...emptyCategory});
    editingCategoryName.current = "";
    setEditingCategoryIndex(categoriesLength);
  }

  function removeCategory(index: number) {
    const categoryName = form.getValues(`categories.${index}.name`) || "";
    if (categoryName.trim()) {
      const photosValues = form.getValues("photos") || [];
      const updatedPhotos = photosValues.map((photo) => ({
        ...photo,
        categories: (photo.categories || []).filter((name) =>
          name.trim().toLocaleLowerCase() !== categoryName.trim().toLocaleLowerCase()
        ),
      }));

      form.setValue("photos", updatedPhotos, {shouldDirty: true});
    }

    removeCategoryField(index);

    if (editingCategoryIndex === index) {
      setEditingCategoryIndex(null);
      editingCategoryName.current = "";
    } else if (editingCategoryIndex !== null && editingCategoryIndex > index) {
      setEditingCategoryIndex(editingCategoryIndex - 1);
    }
  }

  function finishCategoryEdit(index: number) {
    const categoryName = (form.getValues(`categories.${index}.name`) || "").trim();
    if (!categoryName) {
      void form.trigger(`categories.${index}.name`);
      return;
    }

    const duplicateCategory = (form.getValues("categories") || []).some((category, categoryIndex) =>
      categoryIndex !== index && category.name.trim().toLocaleLowerCase() === categoryName.toLocaleLowerCase()
    );
    if (duplicateCategory) {
      form.setError(`categories.${index}.name`, {type: "manual", message: "A folder with this name already exists."});
      return;
    }

    const currentName = form.getValues(`categories.${index}.name`) || "";
    if (currentName !== categoryName) {
      updatePhotoCategoryName(currentName, categoryName);
      form.setValue(`categories.${index}.name`, categoryName, {shouldDirty: true});
    }

    setEditingCategoryIndex(null);
    editingCategoryName.current = "";
  }

  useEffect(() => {
    if (isLoadingConfig) return;

    const configuredCategories = form.getValues("categories") || [];
    const knownNames = new Set(configuredCategories.map((category) => category.name.trim().toLocaleLowerCase()));
    if (!form.getValues("categories")) {
      form.setValue("categories", [], {shouldDirty: false});
    }

    for (const photo of photosWatch) {
      for (const categoryName of photo.categories || []) {
        const name = categoryName.trim();
        const normalizedName = name.toLocaleLowerCase();
        if (name && !knownNames.has(normalizedName)) {
          appendCategory({
            name,
            slugs: [],
            coverImage: "",
            description: ""
          }, {
            shouldFocus: false
          });
          knownNames.add(normalizedName);
        }
      }
    }
  }, [appendCategory, form, isLoadingConfig, photosWatch]);

  function openEditor(index: number) {
    setEditingIndex(index);
    setDialogOpen(true);
  }

  function addPhoto() {
    const photo = withConfigurationId(emptyPhoto, "photo");
    append(photo);
    setEditingIndex(photosWatch.length);
    setDialogOpen(true);
  }

  async function save(values: TOutput) {
    const categoryNames = new Set<string>();
    for (const [index, category] of values.categories.entries()) {
      const name = category.name.trim();
      const normalizedName = name.toLocaleLowerCase();
      if (categoryNames.has(normalizedName)) {
        openCategoryEditor(index);
        form.setError(`categories.${index}.name`, {type: "manual", message: "A folder with this name already exists."});
        return;
      }

      categoryNames.add(normalizedName);
    }

    for (const photo of values.photos) {
      for (const categoryName of photo.categories) {
        const name = categoryName.trim();
        const normalizedName = name.toLocaleLowerCase();
        if (name && !categoryNames.has(normalizedName)) {
          values.categories.push({
            name,
            slugs: [],
            coverImage: "",
            description: ""
          });
          categoryNames.add(normalizedName);
        }
      }
    }

    for (const category of values.categories){
      const exhaustedSlugsExceptThisCategory = new Set(values
        .categories
        .filter(x => x.name != category.name)
        .flatMap(x => x.slugs)
        .map(x => x.slug)
      );
      const activeSlugCandidate = slugify(category.name, exhaustedSlugsExceptThisCategory);
      let foundActiveSlug = false;
      for (const slugEntry of category.slugs){
        if (slugEntry.slug === activeSlugCandidate) {
          slugEntry.isActive = true;
          foundActiveSlug = true;
          continue;
        }
        slugEntry.isActive = false;
      }
      if(!foundActiveSlug){
        category.slugs.push({
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
    <ConfigurationFormWrapper className={styles.page} title={"Gallery Configuration"} config={formValues} form={form}>
      <form onSubmit={handleSubmit(save)} className={cn(styles.form, "grid max-w-3xl gap-6")}>
        <Controller
          control={control}
          name={"summary"}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"gallerySummary"}>Summary</Label>
              <RichTextEditor id={"gallerySummary"} placeholder={"Introduce the photos and collections in your gallery"} value={field.value || ""} onChange={field.onChange} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <div className={"grid gap-3"}>
          <div className={"flex flex-col justify-between gap-3 sm:flex-row sm:items-center"}>
            <div>
              <Label>Gallery folders</Label>
              <p className={"mt-1 text-sm text-muted-foreground"}>Add categories to photos or create folders manually. Each folder can have its own cover image and introduction.</p>
            </div>

            <Button
              type={"button"}
              size={"sm"}
              variant={"outline"}
              onClick={addCategory}
              className="cursor-pointer hover:-translate-y-px"
            >
              <Plus /> Add category
            </Button>
          </div>

          {categoryFields.length === 0 ? (
            <div className={"rounded-xl border border-dashed p-5 text-sm text-muted-foreground"}>
              No folders yet. Add a category or add one while editing a photo.
            </div>
          ) : (
            <div className={"grid gap-3"}>
              {categoryFields.map((category, index) => (
                <div key={category.categoryFieldId} className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}>
                  <CategoryCardHeader
                    name={categoriesWatch[index]?.name || ""}
                    isCurrentlyEditing={editingCategoryIndex === index}
                    onEdit={() => openCategoryEditor(index)}
                    onDelete={() => removeCategory(index)}
                  />

                  {editingCategoryIndex === index && (
                    <div className={"grid gap-4 border-t pt-4"}>
                      <Controller
                        control={control}
                        name={`categories.${index}.name`}
                        render={({field, fieldState: {error}}) =>
                          <div className={"grid gap-2"}>
                            <Label htmlFor={`categories.${index}.name`}>Folder name</Label>
                            <Input
                              {...field}
                              id={`categories.${index}.name`}
                              className={cn("w-full", error && "border-destructive")}
                              onChange={(event) => {
                                const nextName = event.target.value;
                                updatePhotoCategoryName(editingCategoryName.current, nextName);
                                if (nextName.trim()) {
                                  editingCategoryName.current = nextName;
                                }
                                form.clearErrors(`categories.${index}.name`);
                                field.onChange(nextName);
                              }}
                            />
                            {error && <small className={"text-destructive"}>{error.message}</small>}
                          </div>
                        }
                      />
                      <Controller
                        control={control}
                        name={`categories.${index}.coverImage`}
                        render={({field, fieldState: {error}}) =>
                          <div className={"grid gap-2"}>
                            <Label htmlFor={`categories.${index}.coverImage`}>Folder cover image URL (optional)</Label>
                            <Input
                              {...field}
                              id={`categories.${index}.coverImage`}
                              value={field.value || ""}
                              placeholder={"https://example.com/cover.jpg"}
                              className={cn("w-full", error && "border-destructive")}
                            />
                            <p className={"text-xs text-muted-foreground"}>When empty, the first photo in this folder is used as its cover.</p>
                            {error && <small className={"text-destructive"}>{error.message}</small>}
                          </div>
                        }
                      />
                      <Controller
                        control={control}
                        name={`categories.${index}.description`}
                        render={({field, fieldState: {error}}) =>
                          <div className={"grid gap-2"}>
                            <Label htmlFor={`categories.${index}.description`}>Folder introduction (optional)</Label>
                            <RichTextEditor id={`categories.${index}.description`} placeholder={"Introduce this collection"} value={field.value || ""} onChange={field.onChange} className={cn("w-full", error && "border-destructive")}/>
                            {error && <small className={"text-destructive"}>{error.message}</small>}
                          </div>
                        }
                      />
                      <div className={"flex justify-end"}>
                        <Button type={"button"} size={"sm"} variant={"outline"} onClick={() => finishCategoryEdit(index)} className="cursor-pointer hover:-translate-y-px">Done</Button>
                      </div>
                    </div>
                  )}

                  {editingCategoryIndex !== index && (
                    <div className={"grid gap-1 border-t pt-4"}>
                      <CategoryPreview category={categoriesWatch[index] || category}/>
                    </div>
                  )}

                  {editingCategoryIndex !== index && form.formState.errors.categories?.[index] && (
                    <div className={"text-sm text-destructive"}>
                      Please fix the errors in this folder.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={"flex flex-col justify-between gap-3 sm:flex-row sm:items-center"}>
          <div>
            <Label>Gallery photos</Label>
            <p className={"mt-1 text-sm text-muted-foreground"}>Browse your photos. Hover a photo to edit it.</p>
          </div>

          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={addPhoto}
            className="cursor-pointer hover:-translate-y-px"
          >
            <Plus /> Add photo
          </Button>
        </div>

        {photosWatch.length > 0 && (
          <div className={"grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"}>
            {photosWatch.map((photo, index) => (
              <GalleryPhotoCard
                key={index}
                photo={photo}
                index={index}
                onEdit={() => openEditor(index)}
                onDelete={() => remove(index)}
              />
            ))}
          </div>
        )}

        {photos.length === 0 &&
          <div className={"rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"}>
            No photos yet. Add your first photo.
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={"max-h-[90vh] overflow-y-auto sm:max-w-lg"}>
          <DialogHeader>
            <DialogTitle>
              {editingIndex === null ? "Edit photo" : photosWatch[editingIndex]?.caption ? "Edit photo" : "Add photo"}
            </DialogTitle>
            <DialogDescription>
              {editingIndex === null ? "Add" : "Update"} the image, caption, and categories for this gallery photo.
            </DialogDescription>
          </DialogHeader>
          {editingIndex !== null && <div className={"grid gap-4"}>
            <PhotoFields control={control} index={editingIndex} categorySuggestions={categorySuggestions} onCategoryAdded={ensureCategory}/>
          </div>}
          <DialogFooter>
            <Button
              type={"button"}
              variant={"outline"}
              className={"cursor-pointer hover:-translate-y-px"}
              onClick={() => setDialogOpen(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfigurationFormWrapper>
  );
}

export default Page;
