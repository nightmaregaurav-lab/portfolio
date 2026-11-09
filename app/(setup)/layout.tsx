"use client"

import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {LockIcon, UnlockIcon} from "lucide-react";
import {useGitHubPatAuth} from "@/hooks/useGitHubPatAuth";
import GitHubLoginDialog from "@/components/ui/GitHubLoginDialog";

function Layout({ children }: LayoutProps<"/">) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const {gitHubSession} = useGitHubPatAuth();
  return (<>
    <div className={"absolute left-4 right-4 top-4 z-10 flex items-center justify-between gap-4 sm:left-6 sm:right-6"}>
      {gitHubSession ? (
        <span className={"max-w-[calc(100%-3rem)] truncate text-sm text-muted-foreground"}>
          Saving to <strong className={"font-medium text-foreground"}>{gitHubSession.repository?.full_name}</strong>
        </span>
      ) : <span className={"text-sm text-muted-foreground"}>Connect GitHub to save changes.</span>}
      <Button
        type="button"
        variant={"outline"}
        size={"icon"}
        aria-label={gitHubSession ? "Change GitHub repository" : "Connect GitHub"}
        className={"shrink-0 cursor-pointer hover:-translate-y-px"}
        onClick={() => setShowLoginDialog(true)}
      >
        {gitHubSession ? <UnlockIcon aria-hidden="true"/> : <LockIcon aria-hidden="true"/>}
      </Button>
    </div>
    {children}
    <GitHubLoginDialog
      show={showLoginDialog}
      hide={() => setShowLoginDialog(false)}
    />
  </>);
}

export default Layout;
