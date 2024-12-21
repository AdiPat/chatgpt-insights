import { expect, test, describe, vi } from "vitest";
import { main } from "../index.js";
import { ChatgptInsightsCli } from "../cli.js";

vi.mock("../cli.js", () => ({
  ChatgptInsightsCli: vi.fn().mockImplementation(() => ({
    execute: vi.fn().mockResolvedValue(undefined),
  })),
}));

describe("main", () => {
  test("should create and execute CLI", async () => {
    // Mock process.argv to provide required filepath
    const originalArgv = process.argv;
    process.argv = ["node", "chatgpt-insights", "test.zip"];

    await main();

    expect(ChatgptInsightsCli).toHaveBeenCalled();
    expect(
      vi.mocked(ChatgptInsightsCli).mock.results[0].value.execute
    ).toHaveBeenCalled();

    process.argv = originalArgv;
  });
});
