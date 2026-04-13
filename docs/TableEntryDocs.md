# TableEntry

`TableEntry` is the base class for all table entries in a CAD document. Table entries are named objects that provide the fundamental resources referenced by entities: layers, line types, text styles, dimension styles, and more.

## Properties

| Property | Type | Description |
|---|---|---|
| `name` | `string` | Unique name of the table entry within its table |
| `flags` | `StandardFlags` | Standard flags (frozen, dependent, etc.) |

Inherited from [CadObject](./CadObjectDocs.md): `handle`, `owner`, `document`, `objectName`, `objectType`, `extendedData`, `xDictionary`.

## Events

- **`onNameChanged`** - Fires when the `name` property changes.

## Table entry types

### Layer

Layers organize entities and control their visibility, color, and line type.

```ts
import { Layer, Color, LineWeightType } from '@node-projects/acad-ts';

const layer = new Layer();
layer.name = 'Walls';
layer.color = Color.fromColorIndex(5);   // Blue
layer.lineWeight = LineWeightType.W025;
layer.isOn = true;

doc.layers.add(layer);
```

| Property | Type | Description |
|---|---|---|
| `color` | `Color` | Default color for entities on this layer |
| `isOn` | `boolean` | Whether the layer is visible |
| `lineType` | `LineType` | Default line type |
| `lineWeight` | `LineWeightType` | Default line weight |
| `plotFlag` | `boolean` | Whether the layer is plotted |

### LineType

Line types define dash/dot patterns for lines.

```ts
import { LineType } from '@node-projects/acad-ts';

const lt = new LineType();
lt.name = 'DASHED';
doc.lineTypes.add(lt);
```

### TextStyle

Text styles define font and formatting defaults for text entities.

```ts
import { TextStyle } from '@node-projects/acad-ts';

const style = new TextStyle();
style.name = 'MyStyle';
style.filename = 'arial.ttf';
doc.textStyles.add(style);
```

### DimensionStyle

Dimension styles control the appearance of dimension entities (arrow size, text placement, tolerances, etc.).

### BlockRecord

Block records define reusable collections of entities. See [BlockRecord](./BlockRecordDocs.md).

### Other table entry types

| Class | Description |
|---|---|
| `AppId` | Registered application ID for XData |
| `UCS` | User coordinate system |
| `View` | Named view |
| `VPort` | Viewport configuration |

## Working with tables

All tables are accessible from the `CadDocument`:

```ts
// Add an entry
doc.layers.add(layer);

// Get by name
const layer = doc.layers.get('Walls');

// Iterate
for (const entry of doc.layers) {
  console.log(entry.name);
}
```
