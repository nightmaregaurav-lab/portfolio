"use client"

import React from 'react';
import {Dialog, DialogContent} from "@/components/ui/dialog";
import GitHubFileManager from "@/components/ui/GitHubFileManager";
import {useGitHubPatAuth} from "@/hooks/useGitHubPatAuth";
import {UPLOADS_PATH} from "@/lib/pathConfig";

function AssetManagerDialog(
  {show, setShow}: {
    show: boolean,
    setShow: (show: boolean) => void
  }
) {
  const {gitHubSession} = useGitHubPatAuth();
  return (
    <Dialog
      open={show}
      onOpenChange={(nextOpen, eventDetails) => {
        if (!nextOpen) {
          const reason = eventDetails.reason

          if (
            reason === "escape-key" ||
            reason === "focus-out" ||
            reason === "outside-press" ||
            reason === "trigger-press"
          ) {
            return
          }
        }

        setShow(nextOpen)
      }}
    >
      <DialogContent
        style={{
          width: 'auto', maxWidth: '100%',
          height: 'auto', maxHeight: '100%'
        }}
      >
        {gitHubSession ? <GitHubFileManager
          className={"max-w-2xl h-full"}
          path={UPLOADS_PATH}
        /> : <span className={"text-gray-500"}>You have not logged in yet. Please log in to use this feature.</span>}
      </DialogContent>
    </Dialog>
  );
}

export default AssetManagerDialog;
