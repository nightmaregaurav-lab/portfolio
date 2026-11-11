import {encodeBase64} from "@/lib/encodings";
import {isNullOrWhitespace} from "@/lib/string";

export type GitHubUser = {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  default_branch: string;
  owner: {
    login: string;
    id: number;
  };
};

export type GitHubPatValidation = {
  valid: boolean;
  repository?: GitHubRepo;
  user?: GitHubUser;
  error?: string;
};

export interface GitHubContent {
  _links: {
    git: string;
    html: string;
    self: string;
  };
  download_url: string;
  git_url: string;
  html_url: string;
  name: string;
  path: string;
  sha: string;
  size: number;
  type: "file" | "dir";
  url: string;
}

export async function getGitHubFileContent(
  pat: string,
  repository: string,
  filePath: string,
): Promise<string> {
  if (!pat || !repository || isNullOrWhitespace(pat) || isNullOrWhitespace(repository)) {
    throw new Error("You have not logged in yet. Please log in to use this feature.");
  }

  const url = createGitHubContentsUrl(repository, filePath);
  const response = await fetch(
    url,
    {
      method: "GET",
      headers: createGitHubHeaders(pat),
    }
  );

  if (response.status === 404) return "";
  if (!response.ok) {
    throw new Error(`Failed to read "${filePath}": ${response.status} ${response.statusText}`);
  }

  const file = await response.json() as GitHubContent & {content?: string; encoding?: string};
  if (!file.content || file.encoding !== "base64") return "";

  const binary = atob(file.content.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

export interface GitHubCreateFileRequest {
  name: string;
  content: string | File;
}

export interface GitHubUploadOptions {
  beforeOverwrite?: (file: GitHubCreateFileRequest) => Promise<boolean>;
  onOverwriteCancelled?: (file: GitHubCreateFileRequest) => void;
}

function createGitHubHeaders(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2026-03-10",
  };
}

function createGitHubContentsUrl(
  repo: string,
  path: string,
): string {
  const normalizedPath = path.replace(/^\/+|\/+$/g, "");
  const ownerRepo = repo.trim().split("/").filter(Boolean);
  if (ownerRepo.length !== 2) {
    throw new Error("Repository must be in the form 'owner/repository'.");
  }
  const [owner, repository] = ownerRepo;
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/${normalizedPath}`;
}

export async function listGitHubFiles(
  pat: string,
  repository: string,
  folderPath: string,
): Promise<GitHubContent[]> {
  if (!pat || !repository || isNullOrWhitespace(pat) || isNullOrWhitespace(repository)) {
    throw new Error("You have not logged in yet. Please log in to use this feature.");
  }

  const url = createGitHubContentsUrl(repository, folderPath);
  const response = await fetch(
    url,
    {
      method: "GET",
      headers: createGitHubHeaders(pat),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to list files in the folder "${folderPath}": ${response.status} ${response.statusText}`);
  }

  const items = (await response.json()) as GitHubContent[];
  if (!Array.isArray(items)) {
    return [];
  }

  return items.filter((item) => item.type === "file" && item.name !== ".gitkeep");
}

export async function deleteGitHubFiles(
  pat: string,
  repository: string,
  folderPath: string,
  fileNames: string[],
): Promise<void> {
  if (!pat || !repository || isNullOrWhitespace(pat) || isNullOrWhitespace(repository)) {
    throw new Error("You have not logged in yet. Please log in to use this feature.");
  }

  if (fileNames.length === 0) {
    return;
  }

  const uniqueFileNames = [...new Set(fileNames)];

  for (const fileName of uniqueFileNames) {
    const filePath = `${folderPath.replace(/\/+$/, "")}/${fileName.replace(/^\/+/, "")}`;
    const url = createGitHubContentsUrl(repository, filePath);
    const fileResponse = await fetch(
      url,
      {
        method: "GET",
        headers: createGitHubHeaders(pat),
      },
    );

    if (fileResponse.status === 404) {
      continue;
    }

    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch info for "${fileName}": ${fileResponse.status} ${fileResponse.statusText}`);
    }

    const file = (await fileResponse.json()) as GitHubContent;

    const deleteResponse = await fetch(
      url,
      {
        method: "DELETE",
        headers: {
          ...createGitHubHeaders(pat),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Delete ${filePath}`,
          sha: file.sha,
        }),
      },
    );

    if (!deleteResponse.ok) {
      throw new Error(`Failed to delete "${fileName}": ${deleteResponse.status} ${deleteResponse.statusText}`);
    }
  }
}

export async function uploadGitHubFiles(
  pat: string,
  repository: string,
  folderPath: string,
  files: GitHubCreateFileRequest[],
  options?: GitHubUploadOptions,
): Promise<number> {
  if (!pat || !repository || isNullOrWhitespace(pat) || isNullOrWhitespace(repository)) {
    throw new Error("You have not logged in yet. Please log in to use this feature.");
  }

  if (files.length === 0) {
    return 0;
  }

  let uploadedCount = 0;
  for (const file of files) {
    const filePath = `${folderPath.replace(/\/+$/, "")}/${file.name.replace(/^\/+/, "")}`;
    const url = createGitHubContentsUrl(repository, filePath);
    const existingFileResponse = await fetch(
      url,
      {
        method: "GET",
        headers: createGitHubHeaders(pat),
      },
    );

    let sha: string | undefined;
    if (existingFileResponse.ok) {
      const existingFile = (await existingFileResponse.json()) as GitHubContent;
      sha = existingFile.sha;
    } else if (existingFileResponse.status !== 404) {
      throw new Error(`Failed to fetch info for "${file.name}": ${existingFileResponse.status} ${existingFileResponse.statusText}`);
    }

    if(sha && options?.beforeOverwrite) {
      const shouldOverwrite = await options.beforeOverwrite(file);
      if(!shouldOverwrite) {
        options?.onOverwriteCancelled?.(file);
        continue;
      }
    }

    const content = await encodeBase64(file.content);
    const body: {
      message: string;
      content: string;
      sha?: string;
    } = {
      message: `${sha ? "Update" : "Create"} ${filePath}`,
      content,
    };
    if (sha) {
      body.sha = sha;
    }

    const uploadResponse = await fetch(
      url,
      {
        method: "PUT",
        headers: {
          ...createGitHubHeaders(pat),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload "${file.name}": ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    uploadedCount++;
  }

  return uploadedCount;
}

export async function validateGitHubToken(
  token: string,
  expectedRepositoryName?: string
) {
  if(!expectedRepositoryName) {
    return {
      valid: false,
      error: 'No repository name was provided. Aborting due to security reasons.'
    };
  }

  const userResponse = await fetch(
    "https://api.github.com/user",
    {
      headers: createGitHubHeaders(token)
    },
  );

  if (userResponse.status === 401) {
    return {
      valid: false,
      error: "Invalid or expired GitHub token.",
    }
  }

  if (!userResponse.ok) {
    return {
      valid: false,
      error: `Failed to identify GitHub user: HTTP ${userResponse.status}`,
    }
  }

  const user = (await userResponse.json()) as GitHubUser;

  const repositoryParts = expectedRepositoryName
    .trim()
    .split("/")
    .filter(Boolean);

  let owner;
  let repository;

  if (repositoryParts.length === 1) {
    owner = user.login;
    repository = repositoryParts[0];
  } else if (repositoryParts.length === 2) {
    owner = repositoryParts[0];
    repository = repositoryParts[1];
  } else {
    return {
      valid: false,
      error: "Repository must be in the form 'repository' or 'owner/repository'.",
    }
  }

  const repositoryResponse = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`,
    {
      headers: createGitHubHeaders(token)
    },
  );

  if (repositoryResponse.status === 404) {
    return {
      valid: false,
      error: `Repository '${owner}/${repository}' was not found or is not accessible with this token.`,
    }
  }

  if (repositoryResponse.status === 403) {
    return {
      valid: false,
      error: `GitHub denied access to repository '${owner}/${repository}'.`,
    }
  }

  if (!repositoryResponse.ok) {
    return {
      valid: false,
      error: `Failed to access repository: HTTP ${repositoryResponse.status}`,
    }
  }

  const repositoryData = (await repositoryResponse.json()) as GitHubRepo;

  return {
    valid: true,
    repository: repositoryData,
    user: user
  };
}
