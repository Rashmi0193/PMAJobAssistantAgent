"use client";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Badge } from "@/components/ui/Badge";

export default function ExtensionPage() {
  return (
    <main className="container">
      <Card>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <h1 className="m-0 text-[22px] tracking-[-0.2px]">Copilot extension</h1>
            <p className="m-0 text-[14px] leading-6 text-[color:var(--muted)]">
              Frontend-only Chrome extension scaffold (Manifest V3). It previews autofill and requires your approval before filling.
            </p>
          </div>
          <Badge>Demo</Badge>
        </div>
        <Divider />
        <ol className="m-0 pl-[18px] text-[14px] leading-7 text-[color:var(--muted)]">
          <li>Open <code>chrome://extensions</code></li>
          <li>Enable <b>Developer mode</b></li>
          <li>Click <b>Load unpacked</b></li>
          <li>Select the folder <code>frontend/extension</code></li>
        </ol>
        <Divider />
        <p className="m-0 text-[14px] leading-7 text-[color:var(--muted)]">
          After installing, click the extension icon → save your profile → open the Copilot side panel → Refresh → Approve &amp; fill.
        </p>
      </Card>
    </main>
  );
}

