import { ClassMetadata } from './MetadataTypes.js';
import { metadataLookupBlocks } from './LookupTables/Blocks.js';
import { metadataLookupCore } from './LookupTables/Core.js';
import { metadataLookupEntities } from './LookupTables/Entities.js';
import { metadataLookupObjects } from './LookupTables/Objects.js';
import { metadataLookupTables } from './LookupTables/Tables.js';

// Keep the runtime import surface stable while the data lives in smaller domain files.
export const metadataLookupTable: readonly ClassMetadata[] = [
  ...metadataLookupCore,
  ...metadataLookupBlocks,
  ...metadataLookupEntities,
  ...metadataLookupObjects,
  ...metadataLookupTables,
];
