import { resolve } from "path";
import { access, constants, readFile, rm, mkdir } from "node:fs/promises";
import extract from "extract-zip";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { ChatGTPConversations } from "./models/conversation.model";

function isZipFile(filepath: string): boolean {
  return filepath.endsWith(".zip");
}

async function assertFileExists(filepath: string): Promise<void> {
  try {
    await access(filepath, constants.F_OK);
  } catch {
    throw new Error(`File not found: ${filepath}`);
  }
}

async function validateFile(filepath: string): Promise<string> {
  const absolutePath = resolve(filepath);
  await assertFileExists(absolutePath);

  if (!isZipFile(absolutePath)) {
    throw new Error("File must be a zip file");
  }

  return absolutePath;
}

async function createTempDir(): Promise<string> {
  const tempPath = join(tmpdir(), `chatgpt-insights-${randomUUID()}`);
  await mkdir(tempPath, { recursive: true });
  return tempPath;
}

async function loadConversations(
  extractPath: string
): Promise<ChatGTPConversations> {
  const conversationsPath = join(extractPath, "conversations.json");
  const data = await readFile(conversationsPath, "utf-8");
  return JSON.parse(data);
}

async function cleanupTempDir(tempDir: string): Promise<void> {
  try {
    await rm(tempDir, { recursive: true, force: true });
    console.log("Cleaned up temporary files");
  } catch (error) {
    console.warn("Failed to cleanup temporary directory:", error);
  }
}

function informUser(
  filepath: string,
  apiKey: string,
  conversations: ChatGTPConversations
): void {
  console.log(`Processing file: ${filepath}`);
  console.log("Using API key:", `${apiKey.slice(0, 3)}...${apiKey.slice(-4)}`);
  console.log(`Loaded ${conversations.length} conversations`);
}

export async function processZipFile(
  filepath: string,
  apiKey: string
): Promise<ChatGTPConversations> {
  const absolutePath = await validateFile(filepath);
  const tempDir = await createTempDir();
  let conversations: ChatGTPConversations = [];

  try {
    // Extract zip file
    await extract(absolutePath, { dir: tempDir });

    // Load conversations
    conversations = await loadConversations(tempDir);
    informUser(absolutePath, apiKey, conversations);
  } finally {
    await cleanupTempDir(tempDir);
  }
  return conversations;
}
