import { Command } from "commander";
import { processZipFile } from "./processor.js";
import { getOpenAIKey } from "./api-config.js";
import { InsightEngine } from "./insight-engine/insight-engine.js";
import fs from "fs";
import { ChatGPTInsightsReport } from "./models/index.js";
export class ChatgptInsightsCli {
  private program: Command;

  constructor() {
    this.program = new Command();
  }

  setName(): this {
    this.program.name("chatgpt-insights");
    return this;
  }

  setDescription(): this {
    this.program.description("Analyze ChatGPT conversation exports");
    return this;
  }

  setArguments(): this {
    this.program.argument("<filepath>", "path to the ChatGPT export zip file");
    return this;
  }

  setOptions(): this {
    this.program.option(
      "-r, --regenerate-key",
      "Force regenerate OpenAI API key"
    );
    return this;
  }

  async processFile(filepath: string, options: { regenerateKey?: boolean }) {
    const apiKey = await getOpenAIKey(options.regenerateKey);
    return processZipFile(filepath, apiKey);
  }

  async writeReportToFile(report: ChatGPTInsightsReport) {
    // Write JSON report
    const jsonReport = JSON.stringify(report, null, 2);
    const timestamp = Date.now();
    const jsonFilename = `insights-${timestamp}.json`;
    fs.writeFileSync(jsonFilename, jsonReport);

    // Generate and write PDF
    const insightEngine = new InsightEngine([]); // Empty array as we just need PDF generation
    const pdfBuffer = await insightEngine.generatePDF(report);
    const pdfFilename = `insights-${timestamp}.pdf`;
    fs.writeFileSync(pdfFilename, pdfBuffer);
  }

  async execute(): Promise<void> {
    this.setName().setDescription().setArguments().setOptions();

    this.program.action(
      async (filepath: string, options: { regenerateKey?: boolean }) => {
        try {
          const conversations = await this.processFile(filepath, options);
          const insightEngine = new InsightEngine(conversations);
          const insightsReport = await insightEngine.generateReport();
          await this.writeReportToFile(insightsReport);
        } catch (error) {
          console.error(
            "Error processing file:",
            error instanceof Error ? error.message : error
          );
          process.exit(1);
        }
      }
    );

    this.program.parse();
  }

  // For testing purposes
  // Note sure if this is the best way to do this
  getProgram(): Command {
    return this.program;
  }
}
