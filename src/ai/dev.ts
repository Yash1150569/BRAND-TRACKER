import { config } from 'dotenv';
config();

import '@/ai/flows/cluster-mentions-by-topic.ts';
import '@/ai/flows/analyze-mention-sentiment.ts';
import '@/ai/flows/generate-brand-report.ts';