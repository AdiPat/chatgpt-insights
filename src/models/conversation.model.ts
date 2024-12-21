import { ConversationNode } from "./conversation-node.model";

export interface Conversation {
  title: string;
  create_time: number;
  update_time: number;
  mapping: Record<string, ConversationNode>;
  moderation_results: unknown[];
  current_node: string;
  plugin_ids: null;
  conversation_id: string;
  conversation_template_id: null;
  gizmo_id: null;
  gizmo_type: null;
  is_archived: boolean;
  is_starred: null;
  safe_urls: string[];
  default_model_slug: string;
  conversation_origin: null;
  voice: null;
  async_status: null;
  disabled_tool_ids: string[];
  id: string;
}
