#!/usr/bin/env node

import { ChatgptInsightsCli } from "./cli.js";

export async function main(): Promise<void> {
  const cli = new ChatgptInsightsCli();
  await cli.execute();
}

if (import.meta.url === new URL(import.meta.url).href) {
  main().catch(console.error);
}
