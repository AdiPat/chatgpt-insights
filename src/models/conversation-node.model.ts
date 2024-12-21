import { Message } from "./message.model";

export interface ConversationNode {
  id: string;
  message: Message | null;
  parent: string | null;
  children: string[];
}
