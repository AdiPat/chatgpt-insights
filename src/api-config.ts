import { join } from "path";
import { homedir } from "os";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import inquirer from "inquirer";

export const CONFIG_DIR = join(homedir(), ".shincytmp");
export const KEY_FILE = join(CONFIG_DIR, "openai_key.txt");

export async function getOpenAIKey(regenerate = false): Promise<string> {
  await mkdir(CONFIG_DIR, { recursive: true });

  try {
    if (!regenerate) {
      const key = await readFile(KEY_FILE, "utf-8");
      if (key.trim()) return key.trim();
    }
  } catch {
    // File doesn't exist or is empty, continue to prompt
  }

  const { apiKey } = await inquirer.prompt([
    {
      type: "password",
      name: "apiKey",
      message: "Please enter your OpenAI API key:",
      validate: (input: string) =>
        input.length > 0 ? true : "API key cannot be empty",
    },
  ]);

  await writeFile(KEY_FILE, apiKey.trim());
  return apiKey.trim();
}
