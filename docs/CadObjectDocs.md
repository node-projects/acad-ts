# CadObject

`CadObject` is the abstract base class for all objects in a CAD document. Every entity, table entry, non-graphical object, and other document element inherits from this class.

## Properties

| Property | Type | Description |
|---|---|---|
| `handle` | `number` | Unique identifier for this object within a document |
| `owner` | `IHandledCadObject \| null` | The parent object that owns this one |
| `document` | `CadDocument \| null` | The document this object belongs to |
| `objectName` | `string` | DXF name of the object type |
| `objectType` | `ObjectType` | Typed identifier for the object type |
| `subclassMarker` | `string` | DXF subclass marker string |
| `extendedData` | `ExtendedDataDictionary` | Extended data (XData) attached to this object |
| `xDictionary` | `CadDictionary \| null` | Extension dictionary for this object |
| `reactors` | `CadObject[]` | Reactor objects attached to this object |

## Methods

### `clone(): CadObject`

Creates a deep copy of this object, including reactors and extended data.

### `createExtendedDictionary(): CadDictionary`

Creates and returns an extension dictionary for this object. If one already exists, returns it.

### `addReactor(reactor: CadObject): void`

Attaches a reactor object to this object.

### `removeReactor(reactor: CadObject): boolean`

Removes a reactor object. Returns `true` if the reactor was found and removed.

### `cleanReactors(): void`

Removes all reactors from this object.

## Class hierarchy

```
CadObject
├── Entity              # Graphical entities (lines, circles, etc.)
├── TableEntry          # Table entries (layers, line types, styles)
├── NonGraphicalObject  # Non-graphical objects (layouts, dictionaries)
├── Block               # Block entity
├── BlockEnd            # Block end marker
└── Seqend              # Sequence end marker
```

## Extended data

Every `CadObject` can carry extended data (XData), which consists of application-specific key-value pairs. Access XData through the `extendedData` property:

```ts
// Read XData
for (const [appId, records] of entity.extendedData) {
  for (const record of records) {
    console.log(record.value);
  }
}
```
