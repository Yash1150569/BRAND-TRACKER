import { BotMessageSquare, LayoutDashboard } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { mentions as mockMentions } from '@/lib/mock-data';
import type { Mention } from '@/lib/types';
import { Header } from '@/components/dashboard/Header';
import { StatCards } from '@/components/dashboard/StatCards';
import { getSentimentForMentions, getTopicsForMentions } from './actions';
import { SentimentChart } from '@/components/dashboard/SentimentChart';
import { TopicClusters } from '@/components/dashboard/TopicClusters';
import { RecentMentions } from '@/components/dashboard/RecentMentions';

export default async function Home() {
  const mentions: Mention[] = mockMentions;

  // We are limiting the initial analysis to avoid long loading times and API costs on demo.
  const [analyzedMentions, topics] = await Promise.all([
    getSentimentForMentions(mentions.slice(0, 10)),
    getTopicsForMentions(mentions),
  ]);

  const totalMentions = mentions.length;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <BotMessageSquare className="size-8 text-primary" />
            <h1 className="text-xl font-semibold transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
              BrandPulse
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Dashboard" isActive>
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          <Header />
          <StatCards
            analyzedMentions={analyzedMentions}
            totalMentions={totalMentions}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SentimentChart
              mentions={analyzedMentions}
              className="lg:col-span-2"
            />
            <TopicClusters
              initialTopics={topics}
              allMentions={mentions}
            />
          </div>
          <RecentMentions initialMentions={mentions} analyzedMentions={analyzedMentions} />
          <footer className="text-center text-muted-foreground text-sm mt-8">
            © 2024 BrandPulse. All Rights Reserved. This is a unique and confidential project.
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
