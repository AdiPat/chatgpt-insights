import { join } from "path";
import { homedir } from "os";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import inquirer from "inquirer";

export const CONFIG_DIR = join(homedir(), ".shincytmp");
export const KEY_FILE = join(CONFIG_DIR, "openai_key.txt");

async function getExistingKey(
  regenerate: boolean
): Promise<string | null | undefined> {
  try {
    if (!regenerate) {
      const key = await readFile(KEY_FILE, "utf-8");
      if (key.trim()) return key.trim();
      return null;
    }
  } catch {
    console.info("No OpenAI API key found.");
    return null;
  }
}

async function createConfigDir(): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true });
}

async function promptForKey(): Promise<string> {
  const { apiKey } = await inquirer.prompt([
    {
      type: "password",
      name: "apiKey",
      message: "Please enter your OpenAI API key:",
      validate: (input: string) =>
        input.length > 0 ? true : "API key cannot be empty",
    },
  ]);
  return apiKey.trim();
}

async function writeKey(apiKey: string): Promise<void> {
  try {
    await writeFile(KEY_FILE, apiKey.trim());
  } catch (error) {
    console.error("Failed to write API key to file:", error);
    throw error;
  }
}

export async function getOpenAIKey(regenerate = false): Promise<string> {
  await createConfigDir();

  const existingKey = await getExistingKey(regenerate);

  if (existingKey) {
    return existingKey;
  }

  const apiKey = await promptForKey();

  await writeKey(apiKey);
  return apiKey;
}
