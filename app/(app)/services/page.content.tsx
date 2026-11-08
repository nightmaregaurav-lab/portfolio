"use client";

import React from "react";
import {ArrowUpRight, BriefcaseBusiness, CheckCircle2} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import SmartLink from "@/components/ui/SmartLink";
import DynamicLucideReactIcon, {LucideReactIconName} from "@/components/ui/DynamicLucideReactIcon";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import type {TModel as ServicesModel} from "@/configuration/services";
import styles from "./page.module.css";

function PageContent(
  {servicesConfig}: {
    servicesConfig: ServicesModel
  }
) {
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1 className={styles.pageHeader}>Services</h1>
      </header>

      {servicesConfig.services && servicesConfig.services.length > 0 ? (
        <section className={styles.serviceGrid} aria-label="Services offered">
          {servicesConfig.services.map((service, index) => (
            <Card
              className={styles.serviceCard}
              data-tone={String(index % 3)}
              key={service.id}
            >
              <CardHeader className={styles.cardHeader}>
                <div className={styles.iconFrame} aria-hidden="true">
                  {service.icon ? (
                    <DynamicLucideReactIcon name={service.icon as LucideReactIconName} size={22} aria-hidden="true"/>
                  ) : (
                    <BriefcaseBusiness size={22} aria-hidden="true"/>
                  )}
                </div>
                <span className={styles.indexBadge}>0{index + 1}</span>
              </CardHeader>
              <CardContent className={styles.cardContent}>
                <CardTitle className={styles.serviceTitle}>{service.title}</CardTitle>
                <HtmlRenderer className={styles.serviceDescription}>{service.description}</HtmlRenderer>
                {service.link && (
                  <SmartLink className={styles.serviceLink} href={service.link}>
                    Explore this service <ArrowUpRight size={16} aria-hidden="true"/>
                  </SmartLink>
                )}
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        <section className={styles.emptyState} aria-label="Services">
          <CheckCircle2 size={26} aria-hidden="true"/>
          <h2>This page is taking shape.</h2>
          <p>Once it's finalized, services offered will appear here.</p>
        </section>
      )}
    </main>
  );
}

export default PageContent;
