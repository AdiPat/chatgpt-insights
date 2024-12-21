import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { processZipFile } from "../processor.js";
import { join } from "path";
import { writeFile, unlink } from "node:fs/promises";

const MOCK_API_KEY = "sk-mock-key-123";

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

  test("logs processing information", async () => {
    // Create a temporary zip file for testing
    const testZipPath = join(process.cwd(), "test.zip");
    await writeFile(testZipPath, "dummy content");

    try {
      await processZipFile(testZipPath, MOCK_API_KEY);

      expect(console.log).toHaveBeenCalledWith(
        `Processing file: ${testZipPath}`
      );
      expect(console.log).toHaveBeenCalledWith(
        "Using API key:",
        `${MOCK_API_KEY.slice(0, 3)}...${MOCK_API_KEY.slice(-4)}`
      );
    } finally {
      // Cleanup
      await unlink(testZipPath);
    }
  });
});
