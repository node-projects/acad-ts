import * as path from 'path';

export class FileModel {
  path: string;
  fileName: string;

  get extension(): string {
    return path.extname(this.path);
  }

  get noExtensionName(): string {
    return path.basename(this.path, this.extension);
  }

  get folder(): string {
    return path.dirname(this.path);
  }

  get isDxf(): boolean {
    return path.extname(this.path) === '.dxf';
  }

  constructor(filePath: string = '') {
    this.path = filePath;
    this.fileName = filePath ? path.basename(filePath) : '';
  }

  toString(): string {
    return this.fileName;
  }
}
