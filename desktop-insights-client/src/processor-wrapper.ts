async function processInsightFile(filepath: string) {
  const { processZipFile, InsightEngine } = await import("chatgpt-insights");
  const conversations = await processZipFile(filepath, "dummy-key");
  const engine = new InsightEngine(conversations);
  return engine.generateReport();
}

export const processFile = processInsightFile;
