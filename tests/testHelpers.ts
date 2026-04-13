import * as path from 'path';
import * as fs from 'fs';
import { TestVariables } from './TestVariables.js';
import { FileModel } from './TestModels/FileModel.js';

export function loadSamples(folder: string, ext: string, prefix: string = ''): FileModel[] {
  let dir = TestVariables.samplesFolder;
  if (folder) {
    dir = path.join(TestVariables.samplesFolder, folder);
  }

  if (!fs.existsSync(dir)) {
    return [];
  }

  const pattern = prefix ? new RegExp(`${prefix}\\.${ext}$`, 'i') : new RegExp(`\\.${ext}$`, 'i');
  const files = fs.readdirSync(dir)
    .filter(f => pattern.test(f))
    .map(f => new FileModel(path.join(dir, f)));

  return files;
}

export function getDwgFiles(): FileModel[] {
  return loadSamples('', 'dwg');
}

export function getDxfAsciiFiles(): FileModel[] {
  return loadSamples('', 'dxf', '_ascii');
}

export function getDxfBinaryFiles(): FileModel[] {
  return loadSamples('', 'dxf', '_binary');
}

export function readFileAsUint8Array(filePath: string): Uint8Array {
  const buf = fs.readFileSync(filePath);
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

export function readFileAsArrayBuffer(filePath: string): ArrayBuffer {
  const buf = fs.readFileSync(filePath);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

// Ensure output folders exist before tests run
TestVariables.createOutputFolders();
