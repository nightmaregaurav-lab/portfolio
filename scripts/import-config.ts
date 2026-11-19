import fs from "node:fs/promises";
import path from "node:path";

const API = "https://api.github.com";
const DESTINATION = path.resolve(process.cwd(), "local-config");
const SOURCE_DIR = "public/config";
const CONCURRENCY = 6;

interface GitHubTreeEntry {
  path: string;
  mode: string;
  type: "blob" | "tree" | "commit";
  sha: string;
}

interface GitHubTree {
  tree: GitHubTreeEntry[];
  truncated: boolean;
}

interface GitHubBlob {
  content: string;
  encoding: string;
}

interface GitHubCommit {
  commit: {
    tree: {
      sha: string;
    };
  };
}

interface GitHubRepository {
  default_branch: string;
}

interface FileToDownload {
  sha: string;
  path: string;
}

async function github<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API}${endpoint}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${await response.text()}`);
  }

  return (await response.json()) as Promise<T>;
}

async function importFrom(repoUrl: string, ref?: string): Promise<void> {
  const url = new URL(repoUrl);

  if (url.hostname !== "github.com") {
    throw new Error("Only public GitHub repositories are supported.");
  }

  const [owner, rawRepo] = url.pathname.split("/").filter(Boolean);

  const repo = rawRepo?.replace(/\.git$/, "");

  if (!owner || !repo) {
    throw new Error("Invalid GitHub repository URL.");
  }

  if (!ref) {
    const metadata = await github<GitHubRepository>(`/repos/${owner}/${repo}`);

    ref = metadata.default_branch;
  }

  console.log(`Repository: ${owner}/${repo}`);
  console.log(`Reference: ${ref}`);

  const commit = await github<GitHubCommit>(
    `/repos/${owner}/${repo}/commits/${encodeURIComponent(ref)}`,
  );

  const rootTreeSha = commit.commit.tree.sha;

  async function getTree(sha: string): Promise<GitHubTree> {
    return github<GitHubTree>(`/repos/${owner}/${repo}/git/trees/${sha}`);
  }

  let currentSha = rootTreeSha;

  for (const directory of SOURCE_DIR.split("/")) {
    const tree = await getTree(currentSha);

    const entry = tree.tree.find(
      (item) => item.type === "tree" && item.path === directory,
    );

    if (!entry) {
      throw new Error(`Directory not found: ${SOURCE_DIR}`);
    }

    currentSha = entry.sha;
  }

  const files: FileToDownload[] = [];

  async function collectFiles(treeSha: string, relative = ""): Promise<void> {
    const tree = await getTree(treeSha);

    if (tree.truncated) {
      throw new Error("GitHub returned an incomplete tree.");
    }

    for (const item of tree.tree) {
      const filePath = path.posix.join(relative, item.path);

      if (item.type === "tree") {
        await collectFiles(item.sha, filePath);
      } else if (item.type === "blob") {
        if (item.mode === "120000") {
          throw new Error(`Symlinks are not supported: ${filePath}`);
        }

        files.push({
          sha: item.sha,
          path: filePath,
        });
      } else if (item.type === "commit") {
        throw new Error(`Submodules are not supported: ${filePath}`);
      }
    }
  }

  await collectFiles(currentSha);

  if (!files.length) {
    console.log("No files found.");
    return;
  }

  await fs.mkdir(DESTINATION, { recursive: true });

  console.log(`Downloading ${files.length} files...`);

  let next = 0;

  async function worker(): Promise<void> {
    while (next < files.length) {
      const index = next++;
      const file = files[index];

      const blob = await github<GitHubBlob>(
        `/repos/${owner}/${repo}/git/blobs/${file.sha}`,
      );

      if (blob.encoding !== "base64") {
        throw new Error(`Unexpected encoding: ${file.path}`);
      }

      const output = path.resolve(DESTINATION, ...file.path.split("/"));

      if (!output.startsWith(DESTINATION + path.sep)) {
        throw new Error(`Invalid path: ${file.path}`);
      }

      await fs.mkdir(path.dirname(output), {
        recursive: true,
      });

      await fs.writeFile(
        output,
        Buffer.from(blob.content.replace(/\s/g, ""), "base64"),
      );

      console.log(`✓ ${file.path}`);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, files.length) }, () => worker()),
  );

  console.log(
    `\nSuccessfully imported ${files.length} files into local-config/`,
  );
}

const [repoUrl, ref] = process.argv.slice(2);
if (!repoUrl) {
  console.error(
    "Usage: npm run import-from -- <github-repo-url> [branch-or-tag]",
  );
  process.exitCode = 1;
} else {
  importFrom(repoUrl, ref).catch((error: unknown) => {
    console.error(
      "\nImport failed:",
      error instanceof Error ? error.message : error,
    );
    process.exitCode = 1;
  });
}
