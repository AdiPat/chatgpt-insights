import { expect, test, describe } from "vitest";
import { processZipFile } from "../processor.js";
import { join } from "path";

const MOCK_API_KEY = "sk-mock-key-123";

describe("processZipFile", () => {
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
});
