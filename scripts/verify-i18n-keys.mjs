#!/usr/bin/env node
/**
 * i18n Key Parity Verification Script
 *
 * This script compares the Hebrew and English translation files
 * to ensure both locales have exactly the same keys.
 *
 * Usage: node scripts/verify-i18n-keys.mjs
 * Exit code: 0 if all keys match, 1 if there are mismatches
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

/**
 * Recursively flatten a nested object into dot-notation keys
 * @param {object} obj - The object to flatten
 * @param {string} prefix - Current key prefix
 * @returns {object} Flattened object with dot-notation keys
 */
function flatten(obj, prefix = "") {
  const result = {};

  for (const [key, value] of Object.entries(obj || {})) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flatten(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }

  return result;
}

/**
 * Load and parse a JSON file
 * @param {string} path - Path to the JSON file
 * @returns {object} Parsed JSON object
 */
function loadJson(path) {
  try {
    const content = readFileSync(path, "utf8");
    return JSON.parse(content);
  } catch (_error) {
    process.exit(1);
  }
}

const hePath = join(projectRoot, "locales", "he", "common.json");
const enPath = join(projectRoot, "locales", "en", "common.json");

const heJson = loadJson(hePath);
const enJson = loadJson(enPath);

const heFlat = flatten(heJson);
const enFlat = flatten(enJson);

const heKeys = new Set(Object.keys(heFlat));
const enKeys = new Set(Object.keys(enFlat));

const missingInEn = [...heKeys].filter((k) => !enKeys.has(k)).sort();
const missingInHe = [...enKeys].filter((k) => !heKeys.has(k)).sort();

let hasErrors = false;

if (missingInEn.length > 0) {
  hasErrors = true;
  for (const _key of missingInEn) {
  }
}

if (missingInHe.length > 0) {
  hasErrors = true;
  for (const _key of missingInHe) {
  }
}

if (hasErrors) {
  process.exit(1);
} else {
  process.exit(0);
}
