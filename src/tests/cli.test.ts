import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { ChatgptInsightsCli } from "../cli.js";
import { processZipFile } from "../processor.js";
import { getOpenAIKey } from "../api-config.js";
import { ChatGTPConversations } from "../models/conversation.model.js";

// Mock dependencies
vi.mock("../processor.js");
vi.mock("../api-config.js");

describe("ChatgptInsightsCli", () => {
  let cli: ChatgptInsightsCli;
  const originalArgv = process.argv;
  let exitSpy: any;
  let consoleSpy: any;

  beforeEach(() => {
    cli = new ChatgptInsightsCli();
    vi.clearAllMocks();
    exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.argv = originalArgv;
    vi.restoreAllMocks();
  });

  test("should set correct name", () => {
    cli.setName();
    expect(cli.getProgram().name()).toBe("chatgpt-insights");
  });

  test("should set correct description", () => {
    cli.setDescription();
    expect(cli.getProgram().description()).toBe(
      "Analyze ChatGPT conversation exports"
    );
  });

  test("should set filepath argument", () => {
    cli.setArguments();
    const program = cli.getProgram();
    const [arg] = (program as any)._args;

    expect(arg.description).toBe("path to the ChatGPT export zip file");
    expect(arg.required).toBe(true);
  });

  test("should set regenerate key option", () => {
    cli.setOptions();
    const program = cli.getProgram();

    // Mock process.argv
    const originalArgv = process.argv;
    process.argv = ["node", "chatgpt-insights", "-r", "test.zip"];

    program.parse(process.argv);
    const options = program.opts();

    expect(options.regenerateKey).toBe(true);

    process.argv = originalArgv;
  });

  test("should process file with API key", async () => {
    const mockApiKey = "sk-test-key-123";
    const testFilePath = "test.zip";
    const options = { regenerateKey: undefined };

    vi.mocked(getOpenAIKey).mockResolvedValueOnce(mockApiKey);
    vi.mocked(processZipFile).mockResolvedValueOnce({} as ChatGTPConversations);

    await cli.processFile(testFilePath, options);

    expect(getOpenAIKey).toHaveBeenCalledWith(undefined);
    expect(processZipFile).toHaveBeenCalledWith(testFilePath, mockApiKey);
  });

  test("should process file with regenerate key option", async () => {
    const mockApiKey = "sk-test-key-123";
    const testFilePath = "test.zip";
    const options = { regenerateKey: true };

    vi.mocked(getOpenAIKey).mockResolvedValueOnce(mockApiKey);
    vi.mocked(processZipFile).mockResolvedValueOnce({} as ChatGTPConversations);

    await cli.processFile(testFilePath, options);

    expect(getOpenAIKey).toHaveBeenCalledWith(true);
    expect(processZipFile).toHaveBeenCalledWith(testFilePath, mockApiKey);
  });

  test("should handle file processing errors", async () => {
    const mockApiKey = "sk-test-key-123";
    const testFilePath = "test.zip";
    const mockError = new Error("Processing failed");
    const options = { regenerateKey: undefined };

    vi.mocked(getOpenAIKey).mockResolvedValueOnce(mockApiKey);
    vi.mocked(processZipFile).mockRejectedValueOnce(mockError);

    await expect(cli.processFile(testFilePath, options)).rejects.toThrow(
      mockError
    );
  });

  test("should handle API key errors", async () => {
    const testFilePath = "test.zip";
    const mockError = new Error("API key error");
    const options = { regenerateKey: undefined };

    vi.mocked(getOpenAIKey).mockRejectedValueOnce(mockError);

    await expect(cli.processFile(testFilePath, options)).rejects.toThrow(
      mockError
    );
  });
});
