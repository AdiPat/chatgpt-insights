export type MessageContentType = "text" | "multimodal_text";
export type ImageAssetPointerContentType = "image_asset_pointer";

export interface MessageContent {
  content_type: MessageContentType;
  parts: (string | ImageAssetPointer)[];
}

interface ImageAssetPointerMetadata {
  dalle: null;
  gizmo: null;
  emu_omit_glimpse_image: null;
  emu_patches_override: null;
  sanitized: boolean;
}

export interface ImageAssetPointer {
  content_type: ImageAssetPointerContentType;
  asset_pointer: string;
  size_bytes: number;
  width: number;
  height: number;
  fovea: null;
  metadata: ImageAssetPointerMetadata;
}
