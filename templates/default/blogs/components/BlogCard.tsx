import SmartLink from "@/components/ui/SmartLink";
import {getActiveSlug} from "@/lib/slugs";
import {formatDate} from "@/lib/utils";
import styles from "../page.module.css";
import type {TModel as BlogsModel} from "@/configuration/blogs";

function BlogCard({post, index}: {post: BlogsModel["posts"][number]; index: number}) {
  const accentColor = post.accentColor || "#FFFFFF";
  const style: Record<string, string> = {};
  style["--accent-tone"] = accentColor;
  return (
    <SmartLink
      href={"/blogs/" + getActiveSlug(post.slugs) + "/"}
      className={styles.postLink}
      aria-label={`Read ${post.title}`}
    >
      <article className={styles.postCard} style={style as React.CSSProperties}>
        {post.coverImage && (
          <div className={styles.postCoverImage}>
            <img src={post.coverImage} alt="" aria-hidden="true" />
          </div>
        )}
        <time className={styles.postDate} dateTime={post.date}>{formatDate(post.date)}</time>
        <h3 className={styles.postTitle}>{post.title}</h3>
        <p className={styles.postExcerpt}>{post.summary || "Click to read this post..."}</p>
        {!!post.categories.length && (
          <div className={styles.tagList}>
            {post.categories.map((category) => (
              <span className={styles.tag} key={category}>{category}</span>
            ))}
          </div>
        )}
      </article>
    </SmartLink>
  );
}

export default BlogCard;
