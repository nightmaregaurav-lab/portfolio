"use client";

import React, {useMemo} from "react";
import {ArrowUpRight} from "lucide-react";
import SmartLink from "@/components/ui/SmartLink";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import type {TModel as JourneyModel} from "@/configuration/journey";
import type {PageContentProps} from "@/app/(app)/journey/page.types";
import styles from "./page.module.css";

type Milestone = JourneyModel["milestones"][number];
type EventKind = "complete" | "start" | "end";

type TimelineEvent = {
  id: string;
  milestone: Milestone;
  kind: EventKind;
  date: string;
};

const typeLabels = {Academic: "Academic", Professional: "Professional", Personal: "Personal"} as const;

const dateFormatter = new Intl.DateTimeFormat("en", {month: "short", year: "numeric", timeZone: "UTC"});

function formatDate(value: string) {
  if (!value) return "Ongoing";
  return dateFormatter.format(new Date(value));
}

function overlaps(milestone: Milestone, milestones: Milestone[]) {
  const start = new Date(milestone.start).getTime();
  const end = milestone.end ? new Date(milestone.end).getTime() : Number.POSITIVE_INFINITY;

  return milestones.some((other) => {
    if (other.id === milestone.id) return false;
    const otherStart = new Date(other.start).getTime();
    const otherEnd = other.end ? new Date(other.end).getTime() : Number.POSITIVE_INFINITY;
    return start <= otherEnd && otherStart <= end;
  });
}

function getTimelineEvents(milestones: Milestone[]) {
  const events: TimelineEvent[] = [];

  milestones.forEach((milestone) => {
    if (overlaps(milestone, milestones) && milestone.end) {
      events.push({id: milestone.id, milestone, kind: "start", date: milestone.start});
      events.push({id: milestone.id + "-end", milestone, kind: "end", date: milestone.end});
      return;
    }

    events.push({id: milestone.id, milestone, kind: "complete", date: milestone.end || milestone.start});
  });

  return events.sort((a, b) => {
    const dateDifference = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDifference !== 0) return dateDifference;
    if (a.kind === b.kind) return 0;
    return a.kind === "end" ? -1 : 1;
  });
}

function EventDetails({milestone, kind}: {milestone: Milestone; kind: EventKind}) {
  const showDetails = kind !== "end";

  return (
    <>
      {showDetails && <>
        <HtmlRenderer className={styles.description}>{milestone.description}</HtmlRenderer>
        {!!milestone.points?.length && <ul className={styles.points}>
          {milestone.points.map((point) => <li key={point}>{point}</li>)}
        </ul>}
        {!!milestone.achievements?.length && <section className={styles.achievements} aria-label={`Highlights for ${milestone.title}`}>
          <h3>Highlights</h3>
          <ul>
            {milestone.achievements.map((achievement) => <li key={achievement.title + achievement.on}>
              <strong>{achievement.title}</strong>
              <span>{achievement.description}</span>
              {achievement.on && <time dateTime={achievement.on}>{formatDate(achievement.on)}</time>}
            </li>)}
          </ul>
        </section>}
      </>}
      {kind !== "start" && milestone.partingNote && <div className={styles.partingNote}>
        <span>Parting note</span>
        <p>{milestone.partingNote}</p>
      </div>}
    </>
  );
}

function TimelineEntry({event}: {event: TimelineEvent}) {
  const {milestone, kind} = event;
  const organisation = milestone.organisation || milestone.department;
  const organisationUrl = milestone.organisation ? milestone.organizationWebsite : milestone.departmentWebsite;
  const organisationLabel = milestone.organisation || milestone.department;

  return (
    <article className={styles.entry} id={event.id} data-kind={kind}>
      <div className={styles.marker} aria-hidden="true"/>
      <div className={styles.context}>
        <p className={styles.type}>{typeLabels[milestone.type]}</p>
        <time className={styles.date} dateTime={event.date}>{kind === "start" ? "Started · " : kind === "end" ? "Ended · " : ""}{formatDate(event.date)}</time>
        <h2>{milestone.title}</h2>
        {organisation && <p className={styles.organisation}>
          {organisationUrl
            ? <SmartLink href={organisationUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${organisationLabel}`}>{organisation}<ArrowUpRight size={13} aria-hidden="true"/></SmartLink>
            : organisation}
        </p>}
        {milestone.department && milestone.organisation && <p className={styles.department}>
          {milestone.departmentWebsite
            ? <SmartLink href={milestone.departmentWebsite} target="_blank" rel="noreferrer" aria-label={`Visit ${milestone.department}`}>
              {milestone.department}<ArrowUpRight size={13} aria-hidden="true"/>
            </SmartLink>
            : milestone.department}
        </p>}
        {kind === "complete" && <p className={styles.dateRange}>
          <time dateTime={milestone.start}>Started {formatDate(milestone.start)}</time>
          {milestone.end ? <time dateTime={milestone.end}>Ended {formatDate(milestone.end)}</time> : <span>Present</span>}
        </p>}
      </div>
      <div className={styles.story}><EventDetails milestone={milestone} kind={kind}/></div>
    </article>
  );
}

export default function PageContent({journeyConfig}: PageContentProps) {
  const events = useMemo(() => getTimelineEvents(journeyConfig.milestones || []), [journeyConfig.milestones]);

  return (
    <article className={styles.page} aria-label="My journey">
      <header className={styles.intro}>
        <h1>My journey.</h1>
        {journeyConfig.summary && <HtmlRenderer className={styles.summary}>{journeyConfig.summary}</HtmlRenderer>}
      </header>
      {events.length > 0 ? <section className={styles.timeline} aria-label="Journey milestones">
        {events.map((event) => <TimelineEntry event={event} key={event.id}/>) }
      </section> : <section className={styles.empty} aria-label="Journey milestones">
        <p>No milestones added yet.</p>
      </section>}
    </article>
  );
}
