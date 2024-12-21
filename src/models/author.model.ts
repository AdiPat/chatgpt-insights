export interface Author {
  role: "system" | "user" | "assistant";
  name: string | null;
  metadata: Record<string, unknown>;
}
