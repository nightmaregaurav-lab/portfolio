"use client";

import {GitHubContent} from "@/lib/gitHub";
import {createExternalHook} from "@/lib/externalHook";

export interface RecentUpload {
  name: string;
  path: string;
  downloadUrl: string;
  blobUrl: string;
  size: number;
  uploadedAt: number;
}

const {update: updateRecentUploads, useState: useRecentUploads} = createExternalHook<RecentUpload[]>([]);
export { useRecentUploads }

/**
 * Add newly uploaded files to the recent uploads list.
 * Called after a successful upload so the files appear immediately.
 */
export function addRecentUploads(
  blobContents: Map<string, Blob>,
  folderPath: string,
  repository: string,
  branch: string
) {
  updateRecentUploads((existing) => {
    const ownerRepo = repository.split("/");
    const owner = ownerRepo[0];
    const repo = ownerRepo[1];

    const uploads = [...existing];
    for (const [name, blob] of blobContents.entries()) {
      if (uploads.some((u) => u.name === name)) continue;

      const path = `${folderPath.replace(/\/+$/, "")}/${name.replace(/^\/+/, "")}`;
      const downloadUrl = getGitHubRawUrl(owner, repo, branch, path);
      const blobUrl = blob ? URL.createObjectURL(blob) : "";

      uploads.unshift({
        name,
        path,
        downloadUrl,
        blobUrl,
        size: blob?.size ?? 0,
        uploadedAt: Date.now(),
      });
    }

    return uploads;
  });
}

/**
 * Remove recent uploads that have been confirmed by the server.
 * Called after listing files from GitHub so confirmed files drop out of "Recent Uploads".
 */
export function removeRecentUploads(serverFileNames: string[]) {
  updateRecentUploads((existing) => {
    const nameSet = new Set(serverFileNames);
    return existing.filter((u) => !nameSet.has(u.name));
  });
}

/**
 * Craft a GitHub raw content URL for a file.
 * This is the centralized function for generating user-facing file URLs.
 */
export function getGitHubRawUrl(
  owner: string,
  repo: string,
  branch: string,
  path: string
): string {
  const normalizedPath = path.replace(/^\/+|\/+$/g, "");
  return `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${normalizedPath}`;
}

/**
 * Build a GitHubContent-like object from a RecentUpload for use in file managers/pickers.
 */
export function recentUploadToGitHubContent(upload: RecentUpload): GitHubContent {
  return {
    _links: {
      git: "",
      html: "",
      self: "",
    },
    download_url: upload.downloadUrl,
    git_url: "",
    html_url: "",
    name: upload.name,
    path: upload.path,
    sha: "",
    size: upload.size,
    type: "file",
    url: "",
  };
}
