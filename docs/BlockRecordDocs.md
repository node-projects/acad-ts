# BlockRecord

Represents a block record entry, providing access to block entities, attributes, layouts, and block-specific properties. The `BlockRecord` class is used for organizing reusable content in a CAD drawing.

## Properties

| Property | Type | Description |
|---|---|---|
| `entities` | `CadObjectCollection<Entity>` | All entities in this block |
| `attributeDefinitions` | Collection | Attribute definitions in this block |
| `blockEntity` | `Block` | Block entity for this record |
| `blockEnd` | `BlockEnd` | End block entity |
| `flags` | `BlockTypeFlags` | Block type flags (anonymous, XRef, etc.) |
| `units` | `UnitsType` | Block insertion units |
| `layout` | `Layout \| null` | Associated layout |
| `canScale` | `boolean` | Whether the block can be scaled |
| `isExplodable` | `boolean` | Whether the block can be exploded |
| `isAnonymous` | `boolean` | Whether this is an anonymous block |
| `isDynamic` | `boolean` | Whether this block has dynamic properties |
| `hasAttributes` | `boolean` | Whether the block contains attribute definitions |
| `preview` | `Uint8Array` | Binary preview/thumbnail data |
| `viewports` | Collection | Viewports in this block |
| `evaluationGraph` | — | Evaluation graph for dynamic blocks |
| `sortEntitiesTable` | — | Sort entities table |

### Special block names

| Constant | Value | Description |
|---|---|---|
| `ModelSpaceName` | `*Model_Space` | Model space block record |
| `PaperSpaceName` | `*Paper_Space` | Paper space block record |
| `AnonymousPrefix` | `*A` | Prefix for anonymous blocks |

## Constructors

```ts
// Create a named block
const block = new BlockRecord('MyBlock');

// Create an external reference (XRef)
const xref = new BlockRecord('XRefBlock', '/path/to/external.dwg');

// Create an overlay XRef
const overlay = new BlockRecord('OverlayBlock', '/path/to/overlay.dwg', true);
```

## Methods

### `addEntity(entity: Entity): void`

Adds an entity to the block record.

### `getBoundingBox(): BoundingBox`

Returns the axis-aligned bounding box for all entities in the block.

### `getBoundingBox(ignoreInfinite: boolean): BoundingBox`

Returns the bounding box, optionally ignoring infinite entities (rays, xlines).

### `getSortedEntities(): Entity[]`

Returns entities sorted by handle or the assigned sort entities table.

### `applyTransform(transform: Transform): void`

Applies a geometric transformation to all entities in the block.

### `createSortEntitiesTable(): SortEntitiesTable`

Creates and attaches a sort entities table.

### `clone(): CadObject`

Deep copy of the block record, including all entities.

## Usage example

```ts
import { CadDocument, BlockRecord, Line, Circle, Insert, XYZ } from '@node-projects/acad-ts';

const doc = new CadDocument();

// Create a block
const block = new BlockRecord('Door');
block.entities.add(new Line(new XYZ(0, 0, 0), new XYZ(10, 0, 0)));

const circle = new Circle();
circle.center = new XYZ(5, 5, 0);
circle.radius = 2;
block.entities.add(circle);

doc.blockRecords.add(block);

// Insert the block into the drawing
const insert = new Insert(block);
insert.insertPoint = new XYZ(50, 50, 0);
insert.xScale = 2.0;
doc.modelSpace.addEntity(insert);
```

## See also

- [CadDocument](./CadDocumentDocs.md)
- [Insert](./InsertDocs.md)
- [Entity](./EntityDocs.md)
