#!/usr/bin/env node

import { ChatgptInsightsCli } from "./cli.js";

export async function main(): Promise<void> {
  const cli = new ChatgptInsightsCli();
  await cli.execute();
}

// Only run CLI when executed directly (not imported)
const isDirectExecution = () => {
  try {
    return (
      typeof import.meta === "object" &&
      import.meta.url === new URL(import.meta.url).href
    );
  } catch {
    return false;
  }
};

if (isDirectExecution()) {
  main().catch(console.error);
}

export { processZipFile } from "./processor.js";
export { InsightEngine } from "./insight-engine/insight-engine.js";
export * from "./models/index.js";
