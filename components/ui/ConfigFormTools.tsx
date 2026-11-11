"use client"

import React, {useMemo, useState} from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Copy, Eye, Settings} from "lucide-react";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import ConfigPreviewDialog from "@/components/ui/ConfigPreviewDialog";

function stringify<T>(obj: T){
  return JSON.stringify(obj, null, "  ");
}

function ConfigFormTools<T>(
  {config}: { config: T }
) {
  const [showCode, setShowCode] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Config copied to clipboard.");
  }

  const configString = useMemo(() => stringify(config), [config]);

  return (<>
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button type="button" variant="link" className="cursor-pointer hover:-translate-y-px"><Settings size={16} className="cursor-pointer" /></Button>} />
      <DropdownMenuContent className="w-auto border rounded-md bg-white shadow-lg">
        <DropdownMenuItem className="hover:bg-gray-100 py-1 px-4 pt-2 cursor-pointer flex flex-no gap-2" onClick={async () => {
          await copyToClipboard(configString);
        }}>
          <Copy size={14} />
          Copy config
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-100 py-1 px-4 pb-2 cursor-pointer flex flex-no gap-2" onClick={() => setShowCode(true)}>
          <Eye size={14} />
          View config
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <ConfigPreviewDialog show={showCode} setShow={setShowCode} configString={configString} />
  </>);
}

export default ConfigFormTools;
