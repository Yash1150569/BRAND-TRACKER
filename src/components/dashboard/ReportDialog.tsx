'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateBrandReport } from '@/app/actions';
import { FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ReportDialog() {
  const [open, setOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState('last-week');
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReport('');
    try {
      const result = await generateBrandReport(timePeriod);
      setReport(result.report);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description: 'There was a problem generating the brand report. Please try again.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FileText />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Generate Brand Report</DialogTitle>
          <DialogDescription>
            Create a summary of brand mentions, sentiment, and topics for a
            specified time period.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="time-period" className="text-right">
              Time Period
            </label>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger id="time-period" className="col-span-3">
                <SelectValue placeholder="Select a time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-24-hours">Last 24 hours</SelectItem>
                <SelectItem value="last-week">Last week</SelectItem>
                <SelectItem value="last-month">Last month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="ml-4 text-muted-foreground">
                Generating your report...
              </p>
            </div>
          )}

          {report && (
            <ScrollArea className="h-64 w-full rounded-md border p-4">
              <pre className="text-sm whitespace-pre-wrap font-body">
                {report}
              </pre>
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleGenerateReport} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
