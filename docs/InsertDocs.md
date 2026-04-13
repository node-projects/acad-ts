# Insert

Represents an Insert entity in a CAD drawing. An Insert references a block definition (`BlockRecord`) and places it at a location with optional scaling, rotation, and attributes.

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `block` | `BlockRecord` | — | Block definition being referenced |
| `insertPoint` | `XYZ` | `(0,0,0)` | 3D insertion point |
| `xScale` | `number` | `1` | X scale factor (non-zero) |
| `yScale` | `number` | `1` | Y scale factor (non-zero) |
| `zScale` | `number` | `1` | Z scale factor (non-zero) |
| `rotation` | `number` | `0` | Rotation angle in radians |
| `normal` | `XYZ` | `(0,0,1)` | 3D normal vector |
| `rowCount` | `number` | `1` | Number of rows (for array insert) |
| `columnCount` | `number` | `1` | Number of columns (for array insert) |
| `rowSpacing` | `number` | `0` | Spacing between rows |
| `columnSpacing` | `number` | `0` | Spacing between columns |
| `attributes` | `SeqendCollection<AttributeEntity>` | — | Attribute values attached to this insert |
| `hasAttributes` | `boolean` | — | Whether attributes are present |
| `isMultiple` | `boolean` | — | True if `rowCount > 1` or `columnCount > 1` |
| `spatialFilter` | `SpatialFilter \| null` | — | Optional spatial clipping filter |

## Constructor

```ts
import { Insert, BlockRecord } from '@node-projects/acad-ts';

const block = doc.blockRecords.get('Door');
const insert = new Insert(block);
```

The constructor clones the block if it belongs to a document, and initializes attributes from block attribute definitions.

## Methods

### `applyTransform(transform: Transform): void`

Applies a geometric transformation to the insert and all its attributes.

### `getTransform(): Transform`

Returns the transformation matrix that will be applied to block entities.

### `explode(): Entity[]`

Explodes the insert into its constituent entities, with the insert's transformation applied.

### `getBoundingBox(): BoundingBox`

Returns the bounding box considering the block content and the insert's transformation.

### `updateAttributes(): void`

Synchronizes attributes with the block's attribute definitions (matched by tag).

### `clone(): CadObject`

Deep copy of the insert, including block and attributes.

## Usage example

```ts
import { CadDocument, BlockRecord, Insert, XYZ } from '@node-projects/acad-ts';

const doc = new CadDocument();

// Get an existing block
const block = doc.blockRecords.get('Door');

// Create an insert with scaling
const insert = new Insert(block);
insert.insertPoint = new XYZ(10, 5, 0);
insert.xScale = 2.0;
insert.rotation = Math.PI / 4; // 45 degrees

doc.modelSpace.addEntity(insert);

// Array insert (3x2 grid)
const arrayInsert = new Insert(block);
arrayInsert.insertPoint = new XYZ(0, 0, 0);
arrayInsert.rowCount = 3;
arrayInsert.columnCount = 2;
arrayInsert.rowSpacing = 10;
arrayInsert.columnSpacing = 15;
doc.modelSpace.addEntity(arrayInsert);
```

## See also

- [BlockRecord](./BlockRecordDocs.md)
- [Entity](./EntityDocs.md)
