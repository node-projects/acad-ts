# Entity

`Entity` is the abstract base class for all graphical objects in a CAD document. Entities are the visible objects that appear in a drawing: lines, circles, arcs, text, dimensions, hatches, block inserts, and more.

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `color` | `Color` | `Color.ByLayer` | Entity color. Can be set explicitly or inherited from layer. |
| `layer` | `Layer` | Default layer | Layer this entity belongs to |
| `lineType` | `LineType` | — | Line type pattern |
| `lineTypeScale` | `number` | `1.0` | Scale factor for the line type pattern |
| `lineWeight` | `LineWeightType` | `ByLayer` | Line weight (thickness on screen/print) |
| `isInvisible` | `boolean` | `false` | Whether the entity is hidden |
| `transparency` | `Transparency` | `ByLayer` | Transparency level |
| `material` | `Material \| null` | `null` | Assigned material |
| `bookColor` | — | `null` | Book color (named color) |

Inherited from [CadObject](./CadObjectDocs.md): `handle`, `owner`, `document`, `objectName`, `objectType`, `extendedData`, `xDictionary`.

## Methods

### Transformation

```ts
// Apply a full transformation matrix
entity.applyTransform(transform);

// Translate by a vector
entity.applyTranslation(new XYZ(10, 0, 0));

// Rotate around an axis
entity.applyRotation(new XYZ(0, 0, 1), Math.PI / 4);

// Scale from origin
entity.applyScaling(new XYZ(2, 2, 1));
```

### Resolved properties

These methods resolve the effective value, taking layer and block inheritance into account:

```ts
const effectiveColor = entity.getActiveColor();
const effectiveLineType = entity.getActiveLineType();
const effectiveLineWeight = entity.getActiveLineWeightType();
```

### Other methods

- **`getBoundingBox()`** - Returns the axis-aligned bounding box
- **`clone()`** - Deep copy of the entity
- **`matchProperties(source)`** - Copies visual properties (color, layer, line type, etc.) from another entity

## Common entity types

### Geometric primitives

| Class | Description |
|---|---|
| `Line` | Straight line between two 3D points |
| `Circle` | Circle defined by center and radius |
| `Arc` | Circular arc (center, radius, start/end angle) |
| `Ellipse` | Ellipse or elliptical arc |
| `Point` | Single point in space |
| `Ray` | Semi-infinite line from a point |
| `XLine` | Infinite line (construction line) |

### Polylines and meshes

| Class | Description |
|---|---|
| `LwPolyline` | Lightweight 2D polyline |
| `Polyline2D` | 2D polyline with vertices |
| `Polyline3D` | 3D polyline |
| `Spline` | NURBS spline curve |
| `Mesh` | Polygon mesh |
| `PolygonMesh` | Legacy polygon mesh |
| `PolyfaceMesh` | Polyface mesh |

### Surfaces and solids

| Class | Description |
|---|---|
| `Face3D` | 3D face (quadrilateral) |
| `Solid` | 2D solid (filled triangle/quad) |
| `Solid3D` | 3D solid (ACIS body) |
| `Region` | 2D region (ACIS body) |

### Text and annotations

| Class | Description |
|---|---|
| `TextEntity` | Single-line text |
| `MText` | Multi-line formatted text |
| `Dimension` | Base class for all dimension types |
| `Leader` | Leader line with annotation |
| `MultiLeader` | Multi-leader with content blocks |
| `Tolerance` | Geometric tolerance frame |

### Dimension types

| Class | Description |
|---|---|
| `DimensionAligned` | Aligned dimension |
| `DimensionLinear` | Linear (horizontal/vertical) dimension |
| `DimensionRadius` | Radius dimension |
| `DimensionDiameter` | Diameter dimension |
| `DimensionAngular2Line` | Angular dimension from 2 lines |
| `DimensionAngular3Pt` | Angular dimension from 3 points |
| `DimensionOrdinate` | Ordinate dimension |

See [Dimensions](./Dimensions.md) for point diagrams.

### Block references

| Class | Description |
|---|---|
| `Insert` | Block insertion (reference) |
| `AttributeEntity` | Attribute value on an insert |
| `AttributeDefinition` | Attribute definition in a block |

See [Insert](./InsertDocs.md) for details.

### Other

| Class | Description |
|---|---|
| `Hatch` | Hatch pattern fill |
| `Viewport` | Paper space viewport |
| `MLine` | Multi-line |
| `Shape` | Shape entity |
| `Ole2Frame` | OLE embedded object |
| `PdfUnderlay` | PDF underlay |
| `CadImage` | Raster image |
| `Wipeout` | Wipeout (masking rectangle) |
