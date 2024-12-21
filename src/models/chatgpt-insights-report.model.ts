import { Conversation } from "./conversation.model";

export interface ChatGPTInsightsReport {
  conversations: Conversation[];
  metadata: ReportMetadata;
  stats: ReportStats;
}

export interface ReportMetadata {
  generated_at: number;
  total_conversations: number;
  date_range: DateRange;
  version: string;
}

export interface DateRange {
  start: number;
  end: number;
}

export interface MessagesByRole {
  user: number;
  assistant: number;
  system: number;
}

export interface TimeActivity {
  hour: number;
  count: number;
}

export interface ConversationLengths {
  short: number; // < 5 messages
  medium: number; // 5-15 messages
  long: number; // > 15 messages
}

export interface SentimentAnalysis {
  positive: number;
  neutral: number;
  negative: number;
}

export interface ReportStats {
  total_messages: number;
  messages_by_role: MessagesByRole;
  average_messages_per_conversation: number;
  average_conversation_duration: number; // in seconds
  most_active_times: TimeActivity[];
  conversation_lengths: ConversationLengths;
  model_usage: Record<string, number>; // model -> count
  topics?: string[];
  sentiment_analysis?: SentimentAnalysis;
}
