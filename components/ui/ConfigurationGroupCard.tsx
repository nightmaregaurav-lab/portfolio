"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { confirm } from "@/components/ui/Confirm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGitHubPatAuth } from "@/hooks/useGitHubPatAuth";

function ConfigurationGroupCard({
  icon,
  title,
  description,
  pagePath,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  pagePath: string;
}) {
  const router = useRouter();
  const { gitHubSession } = useGitHubPatAuth();

  return (
    <Card
      className={
        "flex min-h-52 w-full max-w-sm flex-col border-border/70 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
      }
    >
      <CardHeader className={"gap-3"}>
        <div
          className={
            "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
          }
        >
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={"mt-auto"}>
        <Button
          type={"button"}
          className={
            "w-full justify-between cursor-pointer hover:-translate-y-px"
          }
          variant={"outline"}
          onClick={() => {
            if (gitHubSession) {
              router.push(pagePath);
            } else {
              confirm({
                title: "Authentication Required",
                message:
                  "You need to authenticate with GitHub to perform this section.",
                actions: [
                  {
                    label: "Close",
                    onClick: async () => {
                      return;
                    },
                  },
                ],
              });
            }
          }}
        >
          Configure
          <ArrowRight />
        </Button>
      </CardContent>
    </Card>
  );
}

export default ConfigurationGroupCard;
