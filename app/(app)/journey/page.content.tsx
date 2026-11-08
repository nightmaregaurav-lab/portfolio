"use client";

import React, {useMemo} from "react";
import {ArrowUpRight, Award, BriefcaseBusiness, CalendarDays, GraduationCap, Heart, Milestone as MilestoneIcon} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import SmartLink from "@/components/ui/SmartLink";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import type {TModel as JourneyModel} from "@/configuration/journey";
import styles from "./page.module.css";

type Milestone = JourneyModel["milestones"][number];
type EventKind = "complete" | "start" | "end";

type TimelineEvent = {
  id: string;
  milestone: Milestone;
  kind: EventKind;
  date: string;
};

const typeMeta = {
  Academic: {icon: GraduationCap, label: "Academic"},
  Professional: {icon: BriefcaseBusiness, label: "Professional"},
  Personal: {icon: Heart, label: "Personal"},
} as const;

function formatDate(value: string) {
  if (!value) return "Ongoing";
  return new Intl.DateTimeFormat("en", {month: "short", year: "numeric"}).format(new Date(value + "T00:00:00"));
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
      events.push({id: milestone.id + "-start", milestone, kind: "start", date: milestone.start});
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

function EventIcon({type}: {type: Milestone["type"]}) {
  const Icon = typeMeta[type].icon;
  return <Icon size={18} aria-hidden="true"/>;
}

function EventDetails({milestone, kind}: {milestone: Milestone; kind: EventKind}) {
  const showDetails = kind !== "end";

  return (
    <>
      {showDetails && (
        <>
          <HtmlRenderer className={styles.description}>{milestone.description}</HtmlRenderer>

          {!!milestone.points?.length && (
            <ul className={styles.points}>
              {milestone.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          )}

          {!!milestone.achievements?.length && (
            <div className={styles.achievements}>
              <h3><Award size={15} aria-hidden="true"/> Highlights</h3>
              <ul>
                {milestone.achievements.map((achievement) => (
                  <li key={achievement.title + achievement.on}>
                    <strong>{achievement.title}</strong>
                    <span>{achievement.description}</span>
                    {achievement.on && <time dateTime={achievement.on}>{formatDate(achievement.on)}</time>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {kind !== "start" && milestone.partingNote && (
        <div className={styles.partingNote}>
          <span>Parting note</span>
          <p>{milestone.partingNote}</p>
        </div>
      )}
    </>
  );
}

function TimelineCard({event}: {event: TimelineEvent}) {
  const {milestone, kind} = event;
  const organisation = milestone.organisation || milestone.department;

  return (
    <Card className={styles.timelineCard} data-type={milestone.type} data-kind={kind}>
      <CardHeader className={styles.cardHeader}>
        <div className={styles.cardTopline}>
          <span className={styles.typeLabel}><EventIcon type={milestone.type}/>{typeMeta[milestone.type].label}</span>
          {kind !== "complete" && (
            <time className={styles.date} dateTime={event.date}>
              <CalendarDays size={16} aria-hidden="true"/>
              {kind === "start" ? "Started: " : kind === "end" ? "Ended: " : "Started: "}
              {formatDate(event.date)}
            </time>
          )}
        </div>
        <CardTitle className={styles.cardTitle}>{milestone.title}</CardTitle>
        {kind === "complete" && (
          <div className={styles.dateRange}>
            <CalendarDays className={styles.dateRangeIcon} size={22} aria-hidden="true"/>
            <div>
              <time dateTime={milestone.start}>Started: {formatDate(milestone.start)}</time>
              {milestone.end ? (
                <time dateTime={milestone.end}>Ended: {formatDate(milestone.end)}</time>
              ) : (
                <span>PRESENT</span>
              )}
            </div>
          </div>
        )}
        {organisation && (
          <div className={styles.organisation}>
            <span>{organisation}</span>
            {milestone.organizationWebsite && (
              <SmartLink
                href={milestone.organizationWebsite}
                target="_blank"
                rel="noreferrer"
                aria-label={"Visit " + milestone.organisation}
              >
                <ArrowUpRight size={14} aria-hidden="true"/>
              </SmartLink>
            )}
          </div>
        )}
        {milestone.department && milestone.organisation && (
          <div className={styles.department}>
            <span>{milestone.department}</span>
            {milestone.departmentWebsite && (
              <SmartLink
                href={milestone.departmentWebsite}
                target="_blank"
                rel="noreferrer"
                aria-label={"Visit " + milestone.department}
              >
                <ArrowUpRight size={14} aria-hidden="true"/>
              </SmartLink>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <EventDetails milestone={milestone} kind={kind}/>
      </CardContent>
    </Card>
  );
}

function PageContent({journeyConfig}: {journeyConfig: JourneyModel}) {
  const events = useMemo(() => getTimelineEvents(journeyConfig.milestones || []), [journeyConfig.milestones]);
  const summary = journeyConfig.summary || "Every chapter has a beginning, a lesson, and a direction. Here are the moments that shaped the way I work and what I care about.";

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1 className={styles.pageHeader}>My Journey</h1>
        <HtmlRenderer className={styles.summary}>{summary}</HtmlRenderer>
      </header>

      {events.length > 0 ? (
        <section className={styles.timelineSection} aria-label="Journey milestones">
          <div className={styles.timeline} aria-live="polite">
            {events.map((event, index) => (
              <article className={styles.timelineItem} data-side={index % 2 === 0 ? "left" : "right"} key={event.id}>
                <div className={styles.marker} data-type={event.milestone.type}>
                  <EventIcon type={event.milestone.type}/>
                </div>
                <TimelineCard event={event}/>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className={styles.emptyState} aria-label="Journey milestones">
          <MilestoneIcon size={28} aria-hidden="true"/>
          <h2>The next chapter is taking shape.</h2>
          <p>Milestones will appear here once they are added from the journey settings.</p>
        </section>
      )}
    </main>
  );
}

export default PageContent;
