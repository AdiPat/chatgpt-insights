import { Command } from "commander";
import { processZipFile } from "./processor.js";
import { getOpenAIKey } from "./api-config.js";

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
    await processZipFile(filepath, apiKey);
  }

  async execute(): Promise<void> {
    this.setName().setDescription().setArguments().setOptions();

    this.program.action(
      async (filepath: string, options: { regenerateKey?: boolean }) => {
        try {
          await this.processFile(filepath, options);
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
  getProgram(): Command {
    return this.program;
  }
}
