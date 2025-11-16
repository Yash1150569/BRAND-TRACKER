'use client';

import { ReportDialog } from './ReportDialog';

export function Header() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Here's your brand's real-time pulse.
        </p>
      </div>
      <ReportDialog />
    </header>
  );
}
