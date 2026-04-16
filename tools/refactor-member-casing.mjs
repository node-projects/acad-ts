import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const workspaceRoot = process.cwd();
const srcRoot = path.join(workspaceRoot, 'src');
const testsRoot = path.join(workspaceRoot, 'tests');
const args = new Set(process.argv.slice(2));
const writeChanges = args.has('--write');

function exists(targetPath) {
  return fs.existsSync(targetPath);
}

function normalizePath(targetPath) {
  return path.resolve(targetPath).replace(/\\/g, '/').toLowerCase();
}

function toServicePath(targetPath) {
  return path.resolve(targetPath).replace(/\\/g, '/');
}

function isUppercaseLetter(char) {
  return char >= 'A' && char <= 'Z';
}

function lowerFirst(value) {
  return value.length === 0 ? value : value[0].toLowerCase() + value.slice(1);
}

function toCamelCase(value) {
  if (!value || !isUppercaseLetter(value[0])) {
    return value;
  }

  if (/^[A-Z0-9_]+$/.test(value)) {
    return value.toLowerCase();
  }

  let index = 0;
  while (index < value.length && isUppercaseLetter(value[index])) {
    index += 1;
  }

  if (index <= 1) {
    return lowerFirst(value);
  }

  if (index === value.length) {
    return value.toLowerCase();
  }

  return value.slice(0, index - 1).toLowerCase() + value.slice(index - 1);
}

function normalizeMemberName(currentName, isPrivate) {
  const strippedName = currentName.replace(/^_+/, '');
  const normalizedName = toCamelCase(strippedName);

  if (isPrivate) {
    return `_${normalizedName}`;
  }

  return normalizedName;
}

function isPrivateMember(node) {
  return Boolean(node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.PrivateKeyword));
}

function isParameterProperty(node) {
  return Boolean(node.modifiers?.some((modifier) => {
    return modifier.kind === ts.SyntaxKind.PrivateKeyword
      || modifier.kind === ts.SyntaxKind.ProtectedKeyword
      || modifier.kind === ts.SyntaxKind.PublicKeyword
      || modifier.kind === ts.SyntaxKind.ReadonlyKeyword;
  }));
}

function shouldRenameNode(node, currentName) {
  const privateMember = isPrivateMember(node);

  if (privateMember) {
    return !currentName.startsWith('_') || /^_[A-Z]/.test(currentName);
  }

  return isUppercaseLetter(currentName[0]);
}

function gatherTsFiles(rootPath) {
  if (!exists(rootPath)) {
    return [];
  }

  const queue = [rootPath];
  const files = [];

  while (queue.length > 0) {
    const currentPath = queue.pop();
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        queue.push(absolutePath);
        continue;
      }

      if (entry.isFile() && absolutePath.endsWith('.ts') && !absolutePath.endsWith('.d.ts')) {
        files.push(absolutePath);
      }
    }
  }

  return files.sort();
}

function createLanguageService(fileNames) {
  const configPath = ts.findConfigFile(workspaceRoot, ts.sys.fileExists, 'tsconfig.json');
  if (!configPath) {
    throw new Error('Unable to locate tsconfig.json');
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
  }

  const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, workspaceRoot);
  const serviceFileNames = fileNames.map((fileName) => toServicePath(fileName));
  const fileVersions = new Map();
  const fileTexts = new Map();

  for (const fileName of serviceFileNames) {
    fileVersions.set(fileName, 0);
    fileTexts.set(fileName, fs.readFileSync(fileName, 'utf8'));
  }

  const host = {
    getScriptFileNames: () => serviceFileNames,
    getScriptVersion: (fileName) => String(fileVersions.get(fileName) ?? 0),
    getScriptSnapshot: (fileName) => {
      if (!fileTexts.has(fileName)) {
        if (!fs.existsSync(fileName)) {
          return undefined;
        }
        fileTexts.set(fileName, fs.readFileSync(fileName, 'utf8'));
        fileVersions.set(fileName, 0);
      }
      return ts.ScriptSnapshot.fromString(fileTexts.get(fileName));
    },
    getCurrentDirectory: () => workspaceRoot,
    getCompilationSettings: () => parsedConfig.options,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  };

  const languageService = ts.createLanguageService(host, ts.createDocumentRegistry());

  function updateFileText(fileName, text) {
    fileTexts.set(fileName, text);
    fileVersions.set(fileName, (fileVersions.get(fileName) ?? 0) + 1);
  }

  function getFileText(fileName) {
    return fileTexts.get(fileName);
  }

  return { languageService, updateFileText, getFileText, fileNames: serviceFileNames };
}

function collectRenameCandidates(program) {
  const candidates = [];
  const normalizedSrcRoot = normalizePath(srcRoot);

  for (const sourceFile of program.getSourceFiles()) {
    if (!normalizePath(sourceFile.fileName).startsWith(normalizedSrcRoot) || sourceFile.isDeclarationFile) {
      continue;
    }

    visit(sourceFile);
  }

  return candidates;

  function visit(node) {
    const nameNode = getNameNode(node);
    if (nameNode && ts.isIdentifier(nameNode)) {
      const currentName = nameNode.text;
      if (shouldRenameNode(node, currentName)) {
        const newName = normalizeMemberName(currentName, isPrivateMember(node));
        if (newName !== currentName) {
          candidates.push({
            fileName: sourceFileName(node),
            position: nameNode.getStart(),
            currentName,
            newName,
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }
}

function sourceFileName(node) {
  return node.getSourceFile().fileName;
}

function getNameNode(node) {
  if (ts.isPropertyDeclaration(node)
    || ts.isMethodDeclaration(node)
    || ts.isGetAccessorDeclaration(node)
    || ts.isSetAccessorDeclaration(node)
    || ts.isPropertySignature(node)
    || ts.isMethodSignature(node)) {
    return node.name;
  }

  if (ts.isParameter(node) && isParameterProperty(node)) {
    return node.name;
  }

  return null;
}

function applyRename(serviceState, renameLocations, newName) {
  const groupedLocations = new Map();

  for (const location of renameLocations) {
    const fileLocations = groupedLocations.get(location.fileName) ?? [];
    fileLocations.push(location);
    groupedLocations.set(location.fileName, fileLocations);
  }

  for (const [fileName, locations] of groupedLocations) {
    let text = serviceState.getFileText(fileName);
    if (text == null) {
      continue;
    }

    locations.sort((left, right) => right.textSpan.start - left.textSpan.start);
    for (const location of locations) {
      const prefixText = location.prefixText ?? '';
      const suffixText = location.suffixText ?? '';
      const replacement = `${prefixText}${newName}${suffixText}`;
      text = text.slice(0, location.textSpan.start)
        + replacement
        + text.slice(location.textSpan.start + location.textSpan.length);
    }

    serviceState.updateFileText(fileName, text);
  }
}

function main() {
  const fileNames = [
    ...gatherTsFiles(srcRoot),
    ...gatherTsFiles(testsRoot),
  ];

  const vitestConfig = path.join(workspaceRoot, 'vitest.config.ts');
  if (exists(vitestConfig)) {
    fileNames.push(vitestConfig);
  }

  const uniqueFileNames = [...new Set(fileNames)];
  const serviceState = createLanguageService(uniqueFileNames);
  const appliedRenames = [];

  for (let iteration = 0; iteration < 5000; iteration += 1) {
    const program = serviceState.languageService.getProgram();
    if (!program) {
      throw new Error('Unable to create TypeScript program');
    }

    const candidates = collectRenameCandidates(program);
    if (candidates.length === 0) {
      break;
    }

    const candidate = candidates[0];
    const renameInfo = serviceState.languageService.getRenameInfo(candidate.fileName, candidate.position, {
      allowRenameOfImportPath: false,
    });

    if (!renameInfo.canRename) {
      throw new Error(`Cannot rename ${candidate.currentName} in ${candidate.fileName}: ${renameInfo.localizedErrorMessage}`);
    }

    const renameLocations = serviceState.languageService.findRenameLocations(
      candidate.fileName,
      candidate.position,
      false,
      false,
      true,
    );

    if (!renameLocations || renameLocations.length === 0) {
      throw new Error(`No rename locations found for ${candidate.currentName} in ${candidate.fileName}`);
    }

    applyRename(serviceState, renameLocations, candidate.newName);
    appliedRenames.push(candidate);
  }

  if (!writeChanges) {
    console.log(JSON.stringify({
      renameCount: appliedRenames.length,
      sample: appliedRenames.slice(0, 25),
    }, null, 2));
    return;
  }

  for (const fileName of serviceState.fileNames) {
    const nextText = serviceState.getFileText(fileName);
    if (nextText != null && nextText !== fs.readFileSync(fileName, 'utf8')) {
      fs.writeFileSync(fileName, nextText, 'utf8');
    }
  }

  console.log(JSON.stringify({ renameCount: appliedRenames.length }, null, 2));
}

main();