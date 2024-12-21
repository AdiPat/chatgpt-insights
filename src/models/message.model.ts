import { Author } from "./author.model";
import { MessageContent } from "./message-content.model";

type MessageStatus = "finished_successfully";

export interface Message {
  id: string;
  author: Author;
  create_time: number | null;
  update_time: number | null;
  content: MessageContent;
  status: MessageStatus;
  end_turn: boolean | null;
  weight: number;
  metadata: MessageMetadata;
  recipient: "all";
  channel: null;
}

export interface MessageMetadataAttachment {
  name: string;
  id: string;
  size: number;
  mime_type: string;
}

export interface MessageMetadataFinishDetails {
  type: string;
  stop_tokens: number[];
}

export interface MessageMetadata {
  citations: unknown[];
  content_references: unknown[];
  message_type: null;
  model_slug?: string;
  default_model_slug?: string;
  parent_id?: string;
  request_id?: string;
  timestamp_?: string;
  finish_details?: MessageMetadataFinishDetails;
  is_complete?: boolean;
  search_result_groups?: unknown[];
  image_results?: unknown[];
  real_time_audio_has_video?: boolean;
  message_source?: null;
  attachments?: MessageMetadataAttachment[];
}
