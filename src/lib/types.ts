export type Sentiment = 'positive' | 'negative' | 'neutral';

export type MentionSource = 'twitter' | 'news' | 'blog' | 'forum';

export type Mention = {
  id: string;
  source: MentionSource;
  text: string;
  author: string;
  authorHandle: string;
  avatarUrl: string;
  timestamp: string;
  url: string;
  sentiment?: Sentiment;
};

export type TopicCluster = {
  topic: string;
  mentions: string[];
};

export type AnalyzedMention = Mention & {
  sentiment: Sentiment;
  confidence: number;
};
