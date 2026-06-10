import { DwgReader } from './dist/IO/DWG/DwgReader.js';
import fs from 'fs';
import path from 'path';

// Find sample DWG files
const testSamplesDir = './samples';
const files = fs.readdirSync(testSamplesDir)
  .filter(f => f.endsWith('.dwg'))
  .slice(0, 2); // Test first 2 files only

console.log('Testing DWG Reader Performance Optimizations\n');
console.log('Found DWG files:', files.length);

let totalTime = 0;
let totalEntities = 0;

for (const file of files) {
  const filePath = path.join(testSamplesDir, file);
  const stats = fs.statSync(filePath);

  console.log(`\nTesting: ${file} (${(stats.size / 1024).toFixed(2)} KB)`);

  try {
    const buffer = fs.readFileSync(filePath);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

    const startTime = performance.now();
    const doc = DwgReader.readFromStream(arrayBuffer, (sender, e) => {
      // Silent notification handler
    });
    const endTime = performance.now();

    const duration = (endTime - startTime).toFixed(2);
    const entityCount = doc.entities.length;

    totalTime += (endTime - startTime);
    totalEntities += entityCount;

    console.log(`  ✓ Parsed in ${duration}ms`);
    console.log(`  ✓ Entities: ${entityCount}`);
    console.log(`  ✓ Layers: ${doc.layers?.count || 0}`);
    console.log(`  ✓ Blocks: ${doc.blockRecords?.count || 0}`);

  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
  }
}

console.log('\n' + '='.repeat(50));
console.log('Performance Summary:');
console.log(`  Total time: ${totalTime.toFixed(2)}ms`);
console.log(`  Total entities: ${totalEntities}`);
console.log(`  Avg time per entity: ${(totalTime / totalEntities).toFixed(3)}ms`);
console.log('='.repeat(50));
console.log('\n✓ All tests completed!');
