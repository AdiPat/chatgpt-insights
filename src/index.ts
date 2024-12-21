#!/usr/bin/env node

async function main() {
  console.log("Hello from ChatGPT Insights!");
}

if (import.meta.url === new URL(import.meta.url).href) {
  main().catch(console.error);
}
