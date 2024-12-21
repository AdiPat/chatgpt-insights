import { resolve } from "path";
import { access, constants, readFile, rm, mkdir } from "node:fs/promises";
import extract from "extract-zip";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

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

async function assertZipFile(filepath: string): Promise<void> {
  if (!isZipFile(filepath)) {
    throw new Error("File must be a zip file");
  }
}

async function createTempDir(): Promise<string> {
  const tempPath = join(tmpdir(), `chatgpt-insights-${randomUUID()}`);
  await mkdir(tempPath, { recursive: true });
  return tempPath;
}

async function loadConversations(extractPath: string): Promise<any> {
  const conversationsPath = join(extractPath, "conversations.json");
  const data = await readFile(conversationsPath, "utf-8");
  return JSON.parse(data);
}

async function validateFile(filepath: string): Promise<string> {
  const absolutePath = resolve(filepath);
  await assertFileExists(absolutePath);
  await assertZipFile(absolutePath);
  return absolutePath;
}

function informUser(
  filepath: string,
  apiKey: string,
  sizeInBytes: number
): void {
  console.log(`Processing file: ${filepath}`);
  console.log("Using API key:", `${apiKey.slice(0, 3)}...${apiKey.slice(-4)}`);
  console.log(`Loaded conversations size: ${sizeInBytes} bytes`);
}

async function cleanupTempDir(tempDir: string): Promise<void> {
  try {
    await rm(tempDir, { recursive: true, force: true });
    console.log("Cleaned up temporary files");
  } catch (error) {
    console.warn("Failed to cleanup temporary directory:", error);
  }
}

export async function processZipFile(
  filepath: string,
  apiKey: string
): Promise<void> {
  const absolutePath = await validateFile(filepath);
  const tempDir = await createTempDir();

  try {
    // Extract zip file
    await extract(absolutePath, { dir: tempDir });

    // Load conversations
    const conversations = await loadConversations(tempDir);
    const sizeInBytes = Buffer.from(JSON.stringify(conversations)).length;

    informUser(absolutePath, apiKey, sizeInBytes);
  } finally {
    await cleanupTempDir(tempDir);
  }
}
