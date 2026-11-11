"use client"

import {
  createExternalHook,
} from "@/lib/externalHook";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";
import { useState } from "react";
import {toast} from "sonner";
import {Spinner} from "@/components/ui/spinner";

type ButtonProps = Omit<ComponentProps<typeof Button>, "onClick" | "children">;

export type ConfirmAction<TValue> = {
  label: string
  onClick: () => Promise<TValue>
  buttonProps?: ButtonProps
}

export type ConfirmOptions<TValue> = {
  title: string
  message: string
  actions: ConfirmAction<TValue>[]
}

type InternalConfirmAction = ConfirmAction<unknown>;

type ConfirmRequest = {
  title: string
  message: string
  actions: InternalConfirmAction[]
  resolve: (value: unknown) => void
}

const confirmStore = createExternalHook<ConfirmRequest | null>(null);

/**
 * Shows a global alert dialog and waits for one of its
 * actions to successfully complete.
 *
 * Only one dialog can exist at a time.
 *
 * The promise remains pending while the selected action
 * is running. If the action throws, the dialog remains open.
 */
export function confirm<TValue>(options: ConfirmOptions<TValue>): Promise<TValue> {
  if (confirmStore.get() !== null) {
    return Promise.reject(new Error("A confirmation dialog is already active."));
  }

  return new Promise<TValue>((resolve) => {
    confirmStore.update({
      title: options.title,
      message: options.message,
      actions: options.actions as InternalConfirmAction[],
      resolve: (value) => {
        resolve(value as TValue)
      }
    })
  });
}

/**
 * Mount this component once, preferably near the root
 * of your application.
 */
export function ConfirmDialog() {
  const request = confirmStore.useState();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const open = request !== null;
  const loading = loadingIndex !== null;

  async function handleAction(index: number) {
    if (!request || loading) {
      return;
    }

    const action = request.actions[index];
    setLoadingIndex(index);

    try {
      const value = await action.onClick();
      request.resolve(value);
      confirmStore.update(null);
    } catch (error) {
      // The dialog stays open.
      // The promise returned by confirm() stays pending.
      toast.error("Error: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoadingIndex(null);
    }
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        {request && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {request.title}
              </AlertDialogTitle>

              <AlertDialogDescription>
                {request.message}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              {request.actions.map((action, index) => {
                const isLoading = loadingIndex === index;
                return (
                  <Button
                    key={index}
                    {...action.buttonProps}
                    type="button"
                    disabled={loading || action.buttonProps?.disabled}
                    onClick={() => handleAction(index)}
                    className={[action.buttonProps?.className, "cursor-pointer", "hover:-translate-y-px"].filter(Boolean).join(" ")}
                  >
                    {isLoading && <Spinner className="mr-2 size-4" />}
                    {action.label}
                  </Button>
                );
              })}
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
