"use client"

import React, {useState} from 'react';
import {useGitHubPatAuth} from "@/hooks/useGitHubPatAuth";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {EyeIcon, EyeOffIcon} from "lucide-react";
import SmartLink from "@/components/ui/SmartLink";


function GitHubLoginDialog(
  {show, hide}: {
    show: boolean,
    hide: () => void
  }
) {
  const {
    gitHubSession,
    setGitHubPat,
    clearGitHubPat,
    updatingPat
  } = useGitHubPatAuth();

  const [showPat, setShowPat] = useState(false);
  const [pat, setPat] = useState("");
  const [repoName, setRepoName] = useState(() => {
    return typeof window !== "undefined" && process.env.NEXT_PUBLIC_GITHUB_REPO
      ? process.env.NEXT_PUBLIC_GITHUB_REPO
      : "";
  });

  const savePat = async () => {
    if(!pat || !repoName){
      return;
    }

    try {
      await setGitHubPat(pat, repoName);
      hide();
    } catch (ex){
      if (ex instanceof Error) {
        toast.error(ex.message);
      } else if (typeof ex === "string") {
        toast.error(ex);
      } else {
        toast.error("Failed to save GitHub PAT");
      }
    }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => {
      if (!open) {
        hide();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle><b>Login to GitHub</b></DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          savePat();
        }}>
          <div className="flex flex-col gap-4">
            {gitHubSession && <>
              <p>You are already logged in with a PAT to access {gitHubSession.repository?.full_name}.</p>

              <Button
                className="px-4 py-2 cursor-pointer hover:-translate-y-px"
                type="button"
                onClick={() => clearGitHubPat()}
              >
                Logout
              </Button>
            </>}
            {!gitHubSession && <>
              <p>To use this application, you need to provide a GitHub Personal Access Token (PAT) with the necessary permissions.</p>
              <p>Please <SmartLink className={"underline!"} href={"https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"} target="_blank">generate a token on GitHub</SmartLink> and enter it below.</p>
              <Input
                type="text"
                placeholder="Enter your repository name (e.g., owner/repo or repo)"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
              />
              <InputGroup>
                <InputGroupInput
                  type={showPat ? "text" : "password"}
                  placeholder="Enter your GitHub Personal Access Token"
                  value={pat}
                  onChange={(e) => setPat(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  {showPat
                    ? <EyeOffIcon size={14} className={"mr-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"} onClick={() => setShowPat(false)}/>
                    : <EyeIcon size={14} className={"mr-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"} onClick={() => setShowPat(true)}/>
                  }
                </InputGroupAddon>
              </InputGroup>
              <Button
                type="submit"
                className="px-4 py-2 cursor-pointer hover:-translate-y-px"
                disabled={!pat || !repoName}
              >
                {updatingPat ? <Spinner/> : "Login"}
              </Button>
            </>}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default GitHubLoginDialog;
