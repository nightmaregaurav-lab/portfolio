import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteGitHubFiles,
  GitHubContent,
  GitHubCreateFileRequest,
  listGitHubFiles,
  uploadGitHubFiles
} from "@/lib/gitHub";
import {useGitHubPatAuth} from "@/hooks/useGitHubPatAuth";
import {toast} from "sonner";
import {
  addRecentUploads,
  removeRecentUploads,
  useRecentUploads,
  recentUploadToGitHubContent,
} from "@/lib/recentUploads";
import {confirm} from "@/components/ui/Confirm";

const EMPTY_FILES: GitHubContent[] = [];
export function useGitHubFolder(
  folderPath?: string,
){
  const queryClient = useQueryClient();
  const normalizedFolderPath = folderPath?.replace(/^\/+|\/+$/g, "") ?? "";

  const {
    gitHubPat,
    gitHubSession,
  } = useGitHubPatAuth();

  const recentUploadsRaw = useRecentUploads();

  const {
    data: serverFiles,
    isLoading: loadingFiles,
  } = useQuery<GitHubContent[]>({
    queryKey: ["gitHub-folder", normalizedFolderPath],
    queryFn: async (): Promise<GitHubContent[]> => {
      try {
        const result = await listGitHubFiles(
          gitHubPat ?? "",
          gitHubSession!.repository!.full_name ?? "",
          normalizedFolderPath
        );
        removeRecentUploads(result.map((f: GitHubContent) => f.name));
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : `Something went wrong!`;
        toast.error(errorMessage);
        return EMPTY_FILES;
      }
    },
    enabled: !!gitHubPat && !!gitHubSession && gitHubSession!.user && !!gitHubSession!.repository,
  });

  const {
    mutateAsync: deleteFiles,
    isPending: deletingFiles
  } = useMutation({
    mutationFn: async (fileNames: string[]) => await deleteGitHubFiles(
      gitHubPat ?? "",
      gitHubSession!.repository!.full_name ?? "",
      normalizedFolderPath,
      fileNames
    ),
    onSuccess: async (_, fileNames) => {
      removeRecentUploads(fileNames);
      await queryClient.invalidateQueries({queryKey: ["gitHub-folder", normalizedFolderPath]});
      toast.success("File(s) deleted successfully!");
    },
    onError: async (error) => {
      const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : `Something went wrong!`;
      toast.error(errorMessage);
    }
  });

  const {
    mutateAsync: uploadFiles,
    isPending: uploadingFiles
  } = useMutation({
    mutationFn: async (files: GitHubCreateFileRequest[]) => {
      const blobContents = new Map<string, Blob>();
      for (const file of files) {
        if (file.content instanceof File) {
          blobContents.set(file.name, file.content);
        }
      }

      const totalUploads = await uploadGitHubFiles(
        gitHubPat ?? "",
        gitHubSession!.repository!.full_name,
        normalizedFolderPath,
        files,
        {
          beforeOverwrite: async (file) => await confirm({
            title: "File Already Exists",
            message: `${file.name} already exist and will be overwritten. Update may take a few seconds to reflect everywhere.\n\nDo you want to continue?`,
            actions: [
              {
                label: "Cancel",
                onClick: async () => false,
                buttonProps: {
                  variant: "outline",
                  className: "cursor-pointer",
                },
              },
              {
                label: "Overwrite",
                onClick: async () => true,
                buttonProps: {
                  className: "cursor-pointer",
                },
              },
            ],
          }),
          onOverwriteCancelled: async (file) => toast.info(`Skipping ${file.name}.`),
        }
      );

      if (gitHubSession?.repository) {
        addRecentUploads(
          blobContents,
          normalizedFolderPath,
          gitHubSession.repository.full_name,
          gitHubSession.repository.default_branch,
        );
      }

      return totalUploads;
    },
    onSuccess: async (totalUploads) => {
      if(totalUploads === 0) {
        return;
      }
      await queryClient.invalidateQueries({queryKey: ["gitHub-folder", normalizedFolderPath]});
      toast.success("File(s) uploaded successfully!");
    },
    onError: async (error) => {
      const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : `Something went wrong!`;
      toast.error(errorMessage);
    }
  });

  const resolvedServerFiles = serverFiles ?? EMPTY_FILES;
  const recentUploads = recentUploadsRaw
    .filter((u) => !resolvedServerFiles.some((f) => f.name === u.name))
    .map(recentUploadToGitHubContent);

  const allFiles = [...recentUploads, ...resolvedServerFiles];

  return {
    files: allFiles,
    recentUploads,
    serverFiles: resolvedServerFiles,
    loadingFiles,
    deleteFiles,
    deletingFiles,
    uploadFiles,
    uploadingFiles
  };
}
