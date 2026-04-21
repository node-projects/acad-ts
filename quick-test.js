import { DwgReader } from './dist/IO/DWG/DwgReader.js';
import fs from 'fs';

const buffer = fs.readFileSync('./samples/sample_AC1018.dwg');
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

console.log('Testing optimized DwgReader with AC1018 file...');
const start = performance.now();

try {
  const doc = DwgReader.readFromStream(arrayBuffer);
  const end = performance.now();

  const entityCount = doc.entities?.length || Array.from(doc.entities || []).length;

  console.log('✓ Successfully parsed document');
  console.log('  Entities:', entityCount);
  console.log('  Layers:', doc.layers?.count || 0);
  console.log('  Blocks:', doc.blockRecords?.count || 0);
  console.log('  Parse time:', (end - start).toFixed(2), 'ms');
  if (entityCount > 0) {
    console.log('  Time per entity:', (((end - start) / entityCount)).toFixed(3), 'ms');
  }
} catch (err) {
  console.log('✗ Error:', err.message);
  console.log(err.stack);
}
