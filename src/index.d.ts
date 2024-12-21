import { ChatGPTInsightsReport, ChatGTPConversations } from "./models";

export function processZipFile(
  filepath: string,
  apiKey: string
): Promise<ChatGTPConversations>;
export class InsightEngine {
  constructor(conversations: ChatGTPConversations);
  generateReport(): Promise<ChatGPTInsightsReport>;
}

export * from "./models";
