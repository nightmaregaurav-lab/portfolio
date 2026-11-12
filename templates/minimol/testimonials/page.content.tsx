"use client"

import {ArrowUpRight} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import SmartLink from "@/components/ui/SmartLink";
import type {PageContentProps} from "@/app/(app)/testimonials/page.types";
import styles from "./page.module.css";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

export default function PageContent({testimonialsConfig}: PageContentProps) {
  const testimonials = testimonialsConfig.testimonials || [];

  return (
    <article className={styles.page} aria-label="Testimonials">
      <header className={styles.intro}>
        <h1>Testimonials.</h1>
        {testimonialsConfig.summary && <HtmlRenderer className={styles.summary}>{testimonialsConfig.summary}</HtmlRenderer>}
      </header>

      {testimonials.length > 0 ? <section className={styles.grid} aria-label="Recommendations">
        {testimonials.map((testimonial, index) => (
          <figure data-slot="card" className={styles.card} key={testimonial.by + "-" + testimonial.date + "-" + index}>
            <div className={styles.cardHeader}>
              <time dateTime={testimonial.date}>{testimonial.date}</time>
            </div>
            {testimonial.title && <h2 className={styles.title}>{testimonial.title}</h2>}
            <blockquote className={styles.quote}>
              <HtmlRenderer>{testimonial.text}</HtmlRenderer>
            </blockquote>
            <figcaption className={styles.author}>
              {testimonial.image && <Avatar className={styles.avatar} aria-hidden="true">
                <AvatarImage src={testimonial.image} alt=""/>
                <AvatarFallback>{initials(testimonial.by)}</AvatarFallback>
              </Avatar>}
              <div className={styles.authorDetails}>
                <p className={styles.authorName}>{testimonial.by}</p>
                {testimonial.company && <p className={styles.authorMeta}>
                  {testimonial.companyWebsite
                    ? <SmartLink href={testimonial.companyWebsite}>{testimonial.company}<ArrowUpRight size={12} aria-hidden="true"/></SmartLink>
                    : testimonial.company}
                </p>}
                {testimonial.department && <p className={styles.authorMeta}>
                  {testimonial.departmentWebsite
                    ? <SmartLink href={testimonial.departmentWebsite}>{testimonial.department}<ArrowUpRight size={12} aria-hidden="true"/></SmartLink>
                    : testimonial.department}
                </p>}
              </div>
            </figcaption>
          </figure>
        ))}
      </section> : <section className={styles.empty} aria-label="Recommendations">
        <h2>A little space for kind words.</h2>
        <p>Recommendations will appear here once they are added.</p>
      </section>}
    </article>
  );
}
