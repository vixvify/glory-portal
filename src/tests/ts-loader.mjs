import { access } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../src");

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function resolve(specifier, context, nextResolve) {
  let resolvedSpecifier = specifier;

  if (specifier.startsWith("@/")) {
    resolvedSpecifier = pathToFileURL(
      path.join(sourceRoot, specifier.slice(2)),
    ).href;
  } else if (specifier.startsWith(".")) {
    resolvedSpecifier = new URL(specifier, context.parentURL).href;
  }

  try {
    return await nextResolve(resolvedSpecifier, context, nextResolve);
  } catch (error) {
    if (error?.code !== "ERR_MODULE_NOT_FOUND") {
      throw error;
    }
  }

  if (!resolvedSpecifier.startsWith("file:")) {
    throw error;
  }

  const candidate = fileURLToPath(resolvedSpecifier);
  for (const extension of [".ts", ".tsx", ".js", ".jsx"]) {
    const filePath = `${candidate}${extension}`;
    if (await fileExists(filePath)) {
      return nextResolve(pathToFileURL(filePath).href, context, nextResolve);
    }
  }

  throw new Error(`ไม่พบโมดูลสำหรับ ${specifier}`);
}
