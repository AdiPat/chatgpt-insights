import { copy } from "fs-extra";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function copyPublicFolder() {
  const srcDir = join(__dirname, "../public");
  const destDir = join(__dirname, "../dist/desktop-insights-client/public");

  await copy(srcDir, destDir);
  console.log("Public folder copied to dist/desktop-insights-client/public");
}

async function transformImports() {
  await execAsync("ts-node scripts/transform-imports.ts");
}

async function build() {
  await copyPublicFolder();
  await transformImports();
}

build().catch(console.error);
