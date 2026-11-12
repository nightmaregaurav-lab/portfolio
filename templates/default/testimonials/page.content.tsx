"use client";

import React from "react";
import {Quote} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import styles from "./page.module.css";
import SmartLink from "@/components/ui/SmartLink";
import type {PageContentProps} from "@/app/(app)/testimonials/page.types";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

function PageContent({testimonialsConfig}: PageContentProps) {
  return (
    <main className={styles.page} aria-label="Testimonials">
      <header className={styles.intro}>
        <div>
          <h1 className={styles.pageHeader}>Testimonials</h1>
          <HtmlRenderer className={styles.summary}>{testimonialsConfig.summary}</HtmlRenderer>
        </div>
        <Quote className={styles.quoteMark} size={72} strokeWidth={1} aria-hidden="true"/>
      </header>

      {testimonialsConfig.testimonials && testimonialsConfig.testimonials.length > 0 ? (
        <section className={styles.quoteGrid} aria-label="Testimonials">
          {testimonialsConfig.testimonials.map((testimonial, index) => (
            <Card
              className={index === 0 ? styles.featuredQuote : styles.quoteCard}
              data-tone={String(index % 3)}
              key={testimonial.by + "-" + index}
            >
              <CardHeader className={styles.quoteHeader}>
                <div className={styles.author}>
                  <Avatar size="lg">
                    {testimonial.image && <AvatarImage src={testimonial.image} alt={`${testimonial.by} avatar`}/>}
                    <AvatarFallback aria-hidden="true">{initials(testimonial.by)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className={styles.authorName}>{testimonial.by}</CardTitle>
                    <p className={styles.authorMeta}>
                      <SmartLink href={testimonial.companyWebsite || ""} aria-label={`Visit ${testimonial.company}`}>
                        {testimonial.company}
                      </SmartLink>
                      {testimonial.company && testimonial.department && " • "}
                      <SmartLink href={testimonial.departmentWebsite || ""} aria-label={`Visit ${testimonial.department}`}>
                        {testimonial.department}
                      </SmartLink>
                    </p>
                  </div>
                </div>
                <time dateTime={testimonial.date}>{testimonial.date}</time>
              </CardHeader>
              <CardContent className={styles.quoteContent}>
                {testimonial.title && <h2 className={styles.quoteTitle}>{testimonial.title}</h2>}
                <HtmlRenderer className={styles.quoteText}>{testimonial.text}</HtmlRenderer>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        <section className={styles.emptyState} aria-label="Testimonials">
          <Quote size={26} aria-hidden="true"/>
          <h2>The kind words will go here.</h2>
          <p>This page is still being worked on.</p>
        </section>
      )}
    </main>
  );
}

export default PageContent;
