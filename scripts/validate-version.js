#!/usr/bin/env node

/**
 * Validates that the package.json version matches the git tag
 * Used by the publish workflow to ensure version consistency
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the git tag from environment variable (passed by GitHub Actions)
const gitTag = process.env.GITHUB_REF_NAME;

if (!gitTag) {
  console.error('Error: GITHUB_REF_NAME environment variable not set');
  process.exit(1);
}

// Remove 'v' prefix if present
const tagVersion = gitTag.startsWith('v') ? gitTag.substring(1) : gitTag;

// Read package.json
const packageJsonPath = join(__dirname, '..', 'package.json');
let packageJson;

try {
  const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
  packageJson = JSON.parse(packageJsonContent);
} catch (error) {
  console.error(`Error reading package.json: ${error.message}`);
  process.exit(1);
}

const packageVersion = packageJson.version;

// Validate versions match
if (tagVersion !== packageVersion) {
  console.error('❌ Version mismatch!');
  console.error(`   Git tag version:      v${tagVersion}`);
  console.error(`   package.json version: ${packageVersion}`);
  console.error('');
  console.error('The git tag must match the version in package.json');
  process.exit(1);
}

console.log('✅ Version validation passed!');
console.log(`   Version: ${packageVersion}`);
console.log(`   Tag:     ${gitTag}`);
process.exit(0);
