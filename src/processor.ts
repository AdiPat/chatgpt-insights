import { resolve } from "path";
import { access, constants } from "node:fs/promises";

export async function processZipFile(
  filepath: string,
  apiKey: string
): Promise<void> {
  const absolutePath = resolve(filepath);

  try {
    await access(absolutePath, constants.F_OK);
  } catch {
    throw new Error(`File not found: ${absolutePath}`);
  }

  if (!absolutePath.endsWith(".zip")) {
    throw new Error("File must be a zip file");
  }

  console.log(`Processing file: ${absolutePath}`);
  console.log("Using API key:", `${apiKey.slice(0, 3)}...${apiKey.slice(-4)}`);
  // TODO: Implement zip processing logic
}
