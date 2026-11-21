"use client";

import { FolderOpen, LockIcon, UnlockIcon } from "lucide-react";
import { useState } from "react";
import AssetManagerDialog from "@/components/ui/AssetManagerDialog";
import { Button } from "@/components/ui/button";
import GitHubLoginDialog from "@/components/ui/GitHubLoginDialog";
import { useGitHubPatAuth } from "@/hooks/useGitHubPatAuth";

function Layout({ children }: LayoutProps<"/">) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showAssetManager, setShowAssetManager] = useState(false);
  const { gitHubSession } = useGitHubPatAuth();
  return (
    <>
      <div
        className={
          "absolute left-4 right-4 top-4 z-10 flex items-center justify-end gap-4 sm:left-6 sm:right-6"
        }
      >
        {gitHubSession ? (
          <span
            className={
              "max-w-[calc(100%-3rem)] truncate text-sm text-muted-foreground"
            }
          >
            Hi{" "}
            <strong className={"font-medium text-foreground"}>
              {gitHubSession.user?.name ?? `@${gitHubSession.user?.login}`}
            </strong>
            , We're saving your changes to{" "}
            <strong className={"font-medium text-foreground"}>
              {gitHubSession.repository?.full_name}
            </strong>
          </span>
        ) : (
          <span className={"text-sm text-muted-foreground"}>
            Connect GitHub to save changes.
          </span>
        )}
        {gitHubSession && (
          <Button
            type="button"
            variant={"outline"}
            size={"icon"}
            aria-label="Open asset manager"
            className={"shrink-0 cursor-pointer hover:-translate-y-px"}
            onClick={() => setShowAssetManager(true)}
          >
            <FolderOpen aria-hidden="true" />
          </Button>
        )}
        <Button
          type="button"
          variant={"outline"}
          size={"icon"}
          aria-label={
            gitHubSession ? "Change GitHub repository" : "Connect GitHub"
          }
          className={"shrink-0 cursor-pointer hover:-translate-y-px"}
          onClick={() => setShowLoginDialog(true)}
        >
          {gitHubSession ? (
            <UnlockIcon aria-hidden="true" />
          ) : (
            <LockIcon aria-hidden="true" />
          )}
        </Button>
      </div>
      {children}
      <GitHubLoginDialog
        show={showLoginDialog}
        hide={() => setShowLoginDialog(false)}
      />
      <AssetManagerDialog
        show={showAssetManager}
        setShow={setShowAssetManager}
      />
    </>
  );
}

export default Layout;
