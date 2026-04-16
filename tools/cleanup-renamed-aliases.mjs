import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const workspaceRoot = process.cwd();
const srcRoot = path.join(workspaceRoot, 'src');

function gatherTsFiles(rootPath) {
  if (!fs.existsSync(rootPath)) {
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

function getMemberName(node) {
  if (!node.name) {
    return null;
  }

  if (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name) || ts.isNumericLiteral(node.name)) {
    return node.name.text;
  }

  return null;
}

function isThisPropertyAccess(expression, memberName) {
  return ts.isPropertyAccessExpression(expression)
    && expression.expression.kind === ts.SyntaxKind.ThisKeyword
    && expression.name.text === memberName;
}

function isSelfReferentialGetter(member) {
  const memberName = getMemberName(member);
  if (!memberName || !member.body || member.body.statements.length !== 1) {
    return false;
  }

  const [statement] = member.body.statements;
  return ts.isReturnStatement(statement)
    && statement.expression != null
    && isThisPropertyAccess(statement.expression, memberName);
}

function isSelfReferentialSetter(member) {
  const memberName = getMemberName(member);
  if (!memberName || !member.body || member.body.statements.length !== 1 || member.parameters.length !== 1) {
    return false;
  }

  const [statement] = member.body.statements;
  if (!ts.isExpressionStatement(statement) || !ts.isBinaryExpression(statement.expression)) {
    return false;
  }

  const { left, operatorToken, right } = statement.expression;
  return operatorToken.kind === ts.SyntaxKind.EqualsToken
    && isThisPropertyAccess(left, memberName)
    && ts.isIdentifier(right)
    && right.text === member.parameters[0].name.getText();
}

function isSelfReferentialMethod(member) {
  const memberName = getMemberName(member);
  if (!memberName || !member.body || member.body.statements.length !== 1) {
    return false;
  }

  const [statement] = member.body.statements;
  const expression = ts.isExpressionStatement(statement)
    ? statement.expression
    : ts.isReturnStatement(statement)
      ? statement.expression
      : null;

  if (!expression || !ts.isCallExpression(expression) || !isThisPropertyAccess(expression.expression, memberName)) {
    return false;
  }

  if (expression.arguments.length !== member.parameters.length) {
    return false;
  }

  return expression.arguments.every((argument, index) => {
    return ts.isIdentifier(argument)
      && ts.isIdentifier(member.parameters[index].name)
      && argument.text === member.parameters[index].name.text;
  });
}

function collectDuplicateTypeMemberRemovals(node, removals) {
  if (!node.members) {
    return;
  }

  const seen = new Map();

  for (const member of node.members) {
    if (!ts.isPropertySignature(member)) {
      continue;
    }

    const memberName = getMemberName(member);
    if (!memberName) {
      continue;
    }

    const key = `${memberName}:${member.type?.getText() ?? ''}`;
    if (seen.has(key)) {
      removals.push({ start: member.getFullStart(), end: member.getEnd() });
      continue;
    }

    seen.set(key, member);
  }
}

function cleanupTemplateBuildNames(filePath, text) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  if (!normalizedPath.includes('/src/IO/Templates/')) {
    return text;
  }

  let nextText = text.replace(/\bsuper\.build\(/g, 'super._build(');
  nextText = nextText.replace(/\bprotected(\s+override)?\s+build\(/g, 'protected$1 _build(');

  if (normalizedPath.endsWith('/src/IO/Templates/CadTemplate.ts')) {
    nextText = nextText.replace(/this\.build\(builder\);/g, 'this._build(builder);');
  }

  return nextText;
}

function cleanupFile(filePath) {
  const originalText = fs.readFileSync(filePath, 'utf8');
  let text = cleanupTemplateBuildNames(filePath, originalText);

  const sourceFile = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const removals = [];

  function visit(node) {
    if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
      for (const member of node.members) {
        if (ts.isGetAccessorDeclaration(member) && isSelfReferentialGetter(member)) {
          removals.push({ start: member.getFullStart(), end: member.getEnd() });
        } else if (ts.isSetAccessorDeclaration(member) && isSelfReferentialSetter(member)) {
          removals.push({ start: member.getFullStart(), end: member.getEnd() });
        } else if (ts.isMethodDeclaration(member) && isSelfReferentialMethod(member)) {
          removals.push({ start: member.getFullStart(), end: member.getEnd() });
        }
      }
    } else if (ts.isTypeLiteralNode(node) || ts.isInterfaceDeclaration(node)) {
      collectDuplicateTypeMemberRemovals(node, removals);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (removals.length === 0 && text === originalText) {
    return false;
  }

  removals.sort((left, right) => right.start - left.start);
  for (const removal of removals) {
    text = text.slice(0, removal.start) + text.slice(removal.end);
  }

  fs.writeFileSync(filePath, text, 'utf8');
  return true;
}

function main() {
  const files = gatherTsFiles(srcRoot);
  let changedFiles = 0;

  for (const filePath of files) {
    if (cleanupFile(filePath)) {
      changedFiles += 1;
    }
  }

  console.log(JSON.stringify({ changedFiles }, null, 2));
}

main();