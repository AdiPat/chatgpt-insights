import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { processZipFile } from "../processor.js";
import { join } from "path";
import { writeFile, readFile, mkdir, rm } from "node:fs/promises";
import extract from "extract-zip";

const MOCK_API_KEY = "sk-mock-key-123";

vi.mock("extract-zip");
vi.mock("node:fs/promises", async () => {
  const actual = await vi.importActual("node:fs/promises");
  return {
    ...actual,
    readFile: vi.fn(),
    rm: vi.fn(),
    mkdir: vi.fn(),
  };
});

describe("processZipFile", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("throws error for non-existent file", async () => {
    const nonExistentPath = "non-existent-file.zip";
    await expect(processZipFile(nonExistentPath, MOCK_API_KEY)).rejects.toThrow(
      "File not found"
    );
  });

  test("throws error for non-zip file", async () => {
    const testFilePath = join(process.cwd(), "test.txt");
    await expect(processZipFile(testFilePath, MOCK_API_KEY)).rejects.toThrow(
      "File must be a zip file"
    );
  });

  test("processes zip file and loads conversations", async () => {
    const testZipPath = join(process.cwd(), "test_data.zip");
    const mockConversations = [{ id: 1, messages: [] }];

    vi.mocked(extract).mockResolvedValueOnce(undefined);
    vi.mocked(readFile).mockResolvedValueOnce(
      JSON.stringify(mockConversations)
    );

    await processZipFile(testZipPath, MOCK_API_KEY);

    expect(extract).toHaveBeenCalled();
    expect(readFile).toHaveBeenCalled();
    expect(rm).toHaveBeenCalledWith(expect.any(String), {
      recursive: true,
      force: true,
    });
    expect(console.log).toHaveBeenCalledWith("Cleaned up temporary files");
  });
});
