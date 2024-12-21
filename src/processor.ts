import { resolve } from "path";
import { access, constants } from "node:fs/promises";

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

async function validateFile(filepath: string): Promise<string> {
  const absolutePath = resolve(filepath);
  await assertFileExists(absolutePath);
  await assertZipFile(absolutePath);

  return absolutePath;
}

function informUser(filepath: string, apiKey: string): void {
  console.log(`Processing file: ${filepath}`);
  console.log("Using API key:", `${apiKey.slice(0, 3)}...${apiKey.slice(-4)}`);
}

export async function processZipFile(
  filepath: string,
  apiKey: string
): Promise<void> {
  const absolutePath = await validateFile(filepath);
  informUser(absolutePath, apiKey);
}
