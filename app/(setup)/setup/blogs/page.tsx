"use client"

import React, {useEffect, useState} from "react";
import styles from "./page.module.css";
import {Identifier, useConfig} from "@/hooks/useConfig";
import {defaultValues, TInput, TOutput, schema} from "@/configuration/blogs";
import {Input} from "@/components/ui/input";
import {DatePicker} from "@/components/ui/DatePicker";
import {ArrayInput} from "@/components/ui/ArrayInput";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import {Pencil, Plus, Trash2} from "lucide-react";
import {cn} from "@/lib/utils";
import {Control, Controller, useFieldArray, useFormContext, useWatch} from "react-hook-form";
import {RichTextEditor} from "@/components/ui/RichTextEditor";
import {Textarea} from "@/components/ui/textarea";
import {ColorPicker} from "@/components/ui/ColorPicker";
import {createConfigurationId, withConfigurationId} from "@/lib/configurationUtils";
import {useConfigurationForm} from "@/hooks/useConfigurationForm";
import {confirm} from "@/components/ui/Confirm";
import {isNullOrWhitespace} from "@/lib/string";
import {slugify} from "@/lib/slugs";

const emptyPost: NonNullable<TInput["posts"]>[number] = {
  id: "",
  slugs: [],
  title: "",
  summary: "",
  date: "",
  categories: [],
  tags: [],
  accentColor: "#FFFFFF",
};


function BlogMetadataFields({control, index}: {control: Control<TInput>; index: number}) {
  return (
    <>
      <div className={"grid gap-3 md:grid-cols-2"}>
        <Controller
          control={control}
          name={`posts.${index}.title`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`posts.${index}.title`}>Title</Label>
              <Input {...field} id={`posts.${index}.title`} placeholder={"Post title"} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`posts.${index}.date`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`posts.${index}.date`}>Date</Label>
              <DatePicker {...field} id={`posts.${index}.date`} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />
      </div>

      <Controller
        control={control}
        name={`posts.${index}.summary`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`posts.${index}.summary`}>Summary (optional)</Label>
            <Textarea {...field} id={`posts.${index}.summary`} placeholder={"A concise description of this post"} className={cn("w-full", error && "border-destructive")}/>
            <p className={"text-xs text-muted-foreground"}>Shown on the blog page and used in search and social previews.</p>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />

      <div className={"grid gap-3 md:grid-cols-2"}>
        <Controller
          control={control}
          name={`posts.${index}.categories`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`posts.${index}.categories`}>Categories</Label>
              <ArrayInput value={field.value || []} onChange={field.onChange} id={`posts.${index}.categories`} placeholder={"Type a category and press Enter"} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <Controller
          control={control}
          name={`posts.${index}.tags`}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={`posts.${index}.tags`}>Tags</Label>
              <ArrayInput value={field.value || []} onChange={field.onChange} id={`posts.${index}.tags`} placeholder={"Type a tag and press Enter"} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />
      </div>

      <Controller
        control={control}
        name={`posts.${index}.accentColor`}
        render={({field, fieldState: {error}}) =>
          <div className={"grid gap-2"}>
            <Label htmlFor={`posts.${index}.accentColor`}>Accent Color</Label>
            <ColorPicker value={field.value || "#FFFFFF"} onChange={field.onChange} id={`posts.${index}.accentColor`} className={cn(error && "border-destructive")}/>
            <p className={"text-xs text-muted-foreground"}>Used as the top border color on the blog card.</p>
            {error && <small className={"text-destructive"}>{error.message}</small>}
          </div>
        }
      />
    </>
  );
}

function BlogForm(
  {
    postIndex, onClose, onSave, onDelete, saving, deleting
  }: {
    postIndex: number;
    onClose: () => void;
    onSave: () => Promise<void>;
    onDelete: (index: number) => Promise<void>;
    saving: boolean;
    deleting: boolean;
  }
) {
  const {
    control,
    trigger
  } = useFormContext<TInput>();
  const selectedPost = useWatch({control, name: `posts.${postIndex}`});
  const selectedPostId = selectedPost?.id || "NA";

  const {
    config,
    isLoadingConfig: isLoadingChildContent,
    isSavingConfig: isSavingChildContent,
    saveConfig: saveChildContent
  } = useConfig(
    Identifier.Blog,
    {id: selectedPostId}
  );

  const [content, setContent] = useState<string>(config?.content || "");
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    if (config !== undefined) {
      setContent(config.content || "");
    }
  }, [config]);

  useEffect(() => {
    if (contentError && !isNullOrWhitespace(content)) {
      setContentError(null);
    }
  }, [content, contentError]);

  async function save() {
    if (!selectedPost) {
      return;
    }

    if(isNullOrWhitespace(content)) {
      setContentError("Content cannot be empty.");
      return;
    }

    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    await saveChildContent({ content });
    await onSave();
    onClose();
  }

  if (!selectedPost){
    return null;
  }

  return (<>
    <div className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}>
      <div className={"flex items-center justify-between gap-4 border-b pb-4"}>
        <div>
          <h2 className={"font-medium"}>{selectedPost.title || "Untitled post"}</h2>
          <p className={"mt-1 text-sm text-muted-foreground"}>Post metadata</p>
        </div>

        <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          className={"text-destructive cursor-pointer hover:-translate-y-px"}
          onClick={() => onDelete(postIndex)}
          aria-label={"Delete blog post"}
          disabled={deleting}
        >
          {deleting ? <Spinner /> : <Trash2 />}
        </Button>
      </div>
      <BlogMetadataFields control={control} index={postIndex}/>
    </div>

    <div className={"grid gap-2"}>
      <Label>Rich-text content</Label>
      {isLoadingChildContent
        ? <div className={"flex min-h-40 items-center justify-center rounded-lg border"}><Spinner /></div>
        : <RichTextEditor key={selectedPost.id} value={content} onChange={setContent} className={cn("min-h-40", contentError && "border-destructive")}/>
      }
      {contentError && <small className={"text-destructive"}>{contentError}</small>}
    </div>

    <div className={"flex justify-end"}>
      <Button
        type={"button"}
        size={"sm"}
        variant={"outline"}
        onClick={async() => await save()}
        className={"cursor-pointer hover:-translate-y-px mt-2 bg-primary text-secondary"}
        disabled={saving || deleting || isSavingChildContent || isLoadingChildContent}
      >
        {saving || isSavingChildContent ? <Spinner /> : "Save"}
      </Button>
    </div>
  </>);
}

function BlogPreview({post}: {post: NonNullable<TInput["posts"]>[number]}) {
  return (<>
    <p className={"truncate font-medium text-muted-foreground"}>
      {post.title || "Untitled post"}
    </p>

    <p className={"truncate text-sm text-muted-foreground"}>
      {post.date || "No publication date"}{post.categories && post.categories.length > 0 ? ` · ${post.categories.join(", ")}` : ""}
    </p>
  </>);
}

function BlogCardHeader(
  {
    post, isCurrentlyEditing, onEdit, onDelete
  }: {
    post: NonNullable<TInput["posts"]>[number];
    isCurrentlyEditing: boolean;
    onEdit: () => void;
    onDelete: () => void;
  }
) {
  return (
    <div className={"flex items-center justify-between gap-4"}>
      <div className={"min-w-0"}>
        <p className={"truncate font-medium text-muted-foreground"}>#{post.id}</p>
      </div>

      <div className={"flex shrink-0 gap-2"}>
        {!isCurrentlyEditing && <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          onClick={onEdit}
          className="cursor-pointer hover:-translate-y-px"
          aria-label={"Edit blog post"}
        >
          <Pencil/>
        </Button>}

        <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          className={"text-destructive cursor-pointer hover:-translate-y-px"}
          onClick={onDelete}
          aria-label={"Delete blog post"}
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
    Identifier.Blogs,
    schema,
    defaultValues
  );
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const {fields: posts, append, remove} = useFieldArray({control, name: "posts", keyName: "fieldArrayId"});
  const postsWatch = useWatch({control, name: "posts"}) || [];

  const [deletingPost, setDeletingPost] = useState<boolean>(false);

  async function deletePost(index: number) {
    setDeletingPost(true);
    const approved = await confirm({
      title: "Delete blog post?",
      message: "Are you sure you want to delete this blog post? This action cannot be undone.",
      actions: [
        {label: "Cancel", buttonProps: {variant: "outline"}, onClick: async () => false},
        {label: "Delete", buttonProps: {variant: "destructive"}, onClick: async () => true}
      ]
    });

    if (!approved) {
      setDeletingPost(false);
      return;
    }

    const post = posts[index];
    if (!post) {
      setDeletingPost(false);
      return;
    }

    const deletedPostId = post.id;
    remove(index);
    await save(schema.parse(form.getValues()));
    if(editingBlogId === deletedPostId) {
      setEditingBlogId(null);
    }
    setDeletingPost(false);
  }

  async function save(values: TOutput) {
    for (const post of values.posts) {
      if (isNullOrWhitespace(post.id)) {
        post.id = createConfigurationId("blog");
      }

      const exhaustedSlugsExceptThisPost = new Set(values
        .posts
        .filter(x => x.id !== post.id)
        .flatMap(x => x.slugs)
        .map(x => x.slug)
      );
      const activeSlugCandidate = slugify(post.title, exhaustedSlugsExceptThisPost);
      let foundActiveSlug = false;
      for (const slugEntry of post.slugs) {
        if (slugEntry.slug === activeSlugCandidate) {
          slugEntry.isActive = true;
          foundActiveSlug = true;
          continue;
        }
        slugEntry.isActive = false;
      }
      if(!foundActiveSlug){
        post.slugs.push({
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
    <ConfigurationFormWrapper className={styles.page} title={"Blog Configuration"} config={formValues} form={form}>
      <form onSubmit={handleSubmit(save)} className={cn(styles.form, "grid max-w-3xl gap-6")}>
        <Controller
          control={control}
          name={"summary"}
          render={({field, fieldState: {error}}) =>
            <div className={"grid gap-2"}>
              <Label htmlFor={"blogsSummary"}>Summary</Label>
              <RichTextEditor id={"blogsSummary"} placeholder={"Introduce the articles on your blog"} value={field.value || ""} onChange={field.onChange} className={cn("w-full", error && "border-destructive")}/>
              {error && <small className={"text-destructive"}>{error.message}</small>}
            </div>
          }
        />

        <div className={"flex flex-col justify-between gap-3 sm:flex-row sm:items-center"}>
          <div>
            <Label>Blogs</Label>
            <p className={"mt-1 text-sm text-muted-foreground"}>Manage your blog posts and their content.</p>
          </div>

          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              const blog = withConfigurationId(emptyPost, "blog");
              append(blog);
              setEditingBlogId(blog.id);
            }}
            className="cursor-pointer hover:-translate-y-px"
          >
            <Plus /> Add blog
          </Button>
        </div>

        {editingBlogId === null ? (
          <>
            {postsWatch.map((post, index) => (
              <div key={index} className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}>
                <BlogCardHeader
                  post={post}
                  isCurrentlyEditing={false}
                  onEdit={() => setEditingBlogId(post.id)}
                  onDelete={() => deletePost(index)}
                />

                <div className={"grid gap-1 border-t pt-4"}>
                  <BlogPreview post={post}/>
                </div>
              </div>
            ))}

            {posts.length === 0 &&
              <div className={"rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"}>
                No blog posts yet. Add your first post.
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
          </>
        ) : (
          <BlogForm
            postIndex={posts.findIndex((post) => post.id === editingBlogId)}
            onClose={() => setEditingBlogId(null)}
            onSave={async () => await save(schema.parse(formValues))}
            onDelete={async (index) => await deletePost(index)}
            saving={isSavingConfig}
            deleting={deletingPost}
          />
        )}
      </form>
    </ConfigurationFormWrapper>
  );
}

export default Page;
