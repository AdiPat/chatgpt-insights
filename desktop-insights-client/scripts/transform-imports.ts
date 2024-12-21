import { readFile, writeFile } from "fs/promises";
import { glob } from "glob";
import { join } from "path";
import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";

const DIST_DIR = join(__dirname, "../dist");

interface CodeTransformer {
  parser: Parser;

  // Initialize tree-sitter
  init(): void;

  // Transform require to dynamic import
  transformRequire(code: string): string;

  // Make enclosing function async if needed
  transformAsync(code: string): string;
}

class TreeSitterTransformer implements CodeTransformer {
  parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  init(): void {
    this.parser.setLanguage(JavaScript);
  }

  transformRequire(code: string): string {
    const tree = this.parser.parse(code);
    let result = code;

    // Find all require calls
    const requireNodes = this.findNodes(
      tree.rootNode,
      "call_expression",
      (node) => node.childForFieldName("function")?.text === "require"
    );

    // Transform each require from bottom up to preserve positions
    for (const node of requireNodes.reverse()) {
      const moduleArg = node.childForFieldName("arguments")?.text;
      if (!moduleArg) continue;

      // Extract module name without quotes and brackets
      const moduleName = moduleArg.replace(/['"()]/g, "");

      // Handle destructuring requires
      const parent = node.parent;
      if (
        parent?.type === "variable_declarator" &&
        parent.childForFieldName("value")
      ) {
        const leftSide = parent.childForFieldName("name")?.text;
        if (!leftSide) continue;

        result = this.replaceCode(
          result,
          parent.startIndex,
          parent.endIndex,
          `${leftSide} = await import("${moduleName}")`
        );
      } else {
        // Handle direct requires
        result = this.replaceCode(
          result,
          node.startIndex,
          node.endIndex,
          `await import("${moduleName}")`
        );
      }
    }

    return result;
  }

  transformAsync(code: string): string {
    const tree = this.parser.parse(code);
    let result = code;

    // Find all await expressions
    const awaitNodes = this.findNodes(tree.rootNode, "await_expression");
    if (awaitNodes.length === 0) return result;

    // Check if we have top-level awaits
    const topLevelAwaits = awaitNodes.filter(
      (node) => !this.findParentFunction(node)
    );

    if (topLevelAwaits.length > 0) {
      // Wrap entire code in async IIFE
      result = `(async () => {
${result}
})().catch(console.error);`;
      return result;
    }

    // Handle regular function-level awaits
    for (const awaitNode of awaitNodes) {
      const funcNode = this.findParentFunction(awaitNode);
      if (!funcNode || this.isAsyncFunction(funcNode)) continue;

      if (funcNode.type === "function_declaration") {
        result = this.replaceCode(
          result,
          funcNode.startIndex,
          funcNode.startIndex + "function".length,
          "async function"
        );
      } else if (funcNode.type === "arrow_function") {
        const arrowStart = funcNode.startIndex;
        result = this.replaceCode(result, arrowStart, arrowStart, "async ");
      }
    }

    return result;
  }

  private findNodes(
    root: Parser.SyntaxNode,
    type: string,
    predicate?: (node: Parser.SyntaxNode) => boolean
  ): Parser.SyntaxNode[] {
    const nodes: Parser.SyntaxNode[] = [];

    const traverse = (node: Parser.SyntaxNode) => {
      if (node.type === type && (!predicate || predicate(node))) {
        nodes.push(node);
      }
      for (let i = 0; i < node.childCount; i++) {
        traverse(node.child(i)!);
      }
    };

    traverse(root);
    return nodes;
  }

  private findParentFunction(
    node: Parser.SyntaxNode
  ): Parser.SyntaxNode | null {
    let current = node.parent;
    while (current) {
      if (
        current.type === "function_declaration" ||
        current.type === "arrow_function" ||
        current.type === "method_definition"
      ) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }

  private isAsyncFunction(node: Parser.SyntaxNode): boolean {
    return node.text.includes("async");
  }

  private replaceCode(
    code: string,
    start: number,
    end: number,
    replacement: string
  ): string {
    return code.slice(0, start) + replacement + code.slice(end);
  }

  private gotoNextBranch(cursor: Parser.TreeCursor): boolean {
    while (!cursor.gotoNextSibling()) {
      if (!cursor.gotoParent()) {
        return false;
      }
    }
    return true;
  }
}

async function transformFile(
  filepath: string,
  transformer: CodeTransformer
): Promise<void> {
  let content = await readFile(filepath, "utf-8");

  // Transform requires first
  content = transformer.transformRequire(content);

  // Then make functions async where needed
  content = transformer.transformAsync(content);

  await writeFile(filepath, content);
}

async function transformDirectory(): Promise<void> {
  const transformer = new TreeSitterTransformer();
  transformer.init();

  const files = await glob(`${DIST_DIR}/**/*.js`);
  console.log("Transforming files to ESM:", files.length);

  await Promise.all(files.map((file) => transformFile(file, transformer)));
  console.log("Transformation complete");
}

transformDirectory().catch(console.error);
