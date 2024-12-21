import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { getOpenAIKey, CONFIG_DIR, KEY_FILE } from "../api-config.js";
import {
  rm,
  writeFile,
  mkdir,
  access,
  constants,
  readFile,
} from "node:fs/promises";
import inquirer from "inquirer";

vi.mock("inquirer");

vi.mock("node:fs/promises", async () => {
  const actual = await vi.importActual("node:fs/promises");
  return {
    ...actual,
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    readFile: vi.fn(),
    rm: vi.fn(),
    access: vi.fn().mockImplementation(() => Promise.resolve()),
  };
});

describe("getOpenAIKey", () => {
  const mockKey = "sk-test-key-123";

  beforeEach(async () => {
    vi.clearAllMocks();
    try {
      await rm(CONFIG_DIR, { recursive: true, force: true });
    } catch {
      // Ignore errors if directory doesn't exist
    }
  });

  afterEach(async () => {
    try {
      await rm(CONFIG_DIR, { recursive: true, force: true });
    } catch {
      // Ignore errors if directory doesn't exist
    }
  });

  test("should prompt for key when no file exists", async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ apiKey: mockKey });
    vi.mocked(readFile).mockRejectedValueOnce(new Error("File not found"));

    const key = await getOpenAIKey();

    expect(key).toBe(mockKey);
    expect(writeFile).toHaveBeenCalledWith(KEY_FILE, mockKey);
    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
  });

  test("should read existing key from file", async () => {
    vi.mocked(readFile).mockResolvedValueOnce(mockKey);

    const key = await getOpenAIKey();

    expect(key).toBe(mockKey);
    expect(inquirer.prompt).not.toHaveBeenCalled();
  });

  test("should regenerate key when regenerate flag is true", async () => {
    const newKey = "sk-new-key-456";
    await mkdir(CONFIG_DIR, { recursive: true });
    await writeFile(KEY_FILE, mockKey);

    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ apiKey: newKey });

    const key = await getOpenAIKey(true);

    expect(key).toBe(newKey);
    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
  });

  test("should handle empty file by prompting for new key", async () => {
    await mkdir(CONFIG_DIR, { recursive: true });
    await writeFile(KEY_FILE, "");

    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ apiKey: mockKey });

    const key = await getOpenAIKey();

    expect(key).toBe(mockKey);
    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
  });

  test("should validate empty input", async () => {
    const prompt = vi
      .mocked(inquirer.prompt)
      .mockResolvedValueOnce({ apiKey: mockKey });

    await getOpenAIKey();

    const [promptOptions] = prompt.mock.calls[0];
    const validator = promptOptions[0].validate;

    expect(validator("")).toBe("API key cannot be empty");
    expect(validator("valid-key")).toBe(true);
  });

  test("should handle write errors", async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ apiKey: mockKey });
    vi.mocked(writeFile).mockRejectedValueOnce(new Error("Write failed"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(getOpenAIKey()).rejects.toThrow("Write failed");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to write API key to file:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
