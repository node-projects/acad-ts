# NonGraphicalObject

`NonGraphicalObject` is the base class for objects that are not directly rendered in the drawing but provide supporting data, configuration, and organization. They are typically stored in the document's root dictionary or its subdictionaries.

## Properties

| Property | Type | Description |
|---|---|---|
| `name` | `string` | Name identifier for this object |

Inherited from [CadObject](./CadObjectDocs.md): `handle`, `owner`, `document`, `objectName`, `objectType`, `extendedData`, `xDictionary`.

## Events

- **`onNameChanged`** - Fires when the `name` property changes, providing old and new names.

## Common non-graphical object types

### Layouts and plotting

| Class | Description |
|---|---|
| `Layout` | Defines a model/paper space layout with plot settings |
| `PlotSettings` | Print/plot configuration |

### Dictionaries and collections

| Class | Description |
|---|---|
| `CadDictionary` | Named object dictionary, key-value container for CAD objects |
| `CadDictionaryWithDefault` | Dictionary with a default value |
| `Group` | Named group of entities |
| `Scale` | Annotation scale definition |

### Definitions

| Class | Description |
|---|---|
| `ImageDefinition` | Definition for raster image entities |
| `PdfUnderlayDefinition` | Definition for PDF underlay entities |
| `Material` | Material definition |

### Styles

| Class | Description |
|---|---|
| `MLineStyle` | Multi-line style definition |
| `MultiLeaderStyle` | Multi-leader style definition |
| `TableStyle` | Table entity style |
| `VisualStyle` | 3D visual style |

### Data and evaluation

| Class | Description |
|---|---|
| `GeoData` | Geolocation data |
| `Field` | Dynamic field for automatic text |
| `RasterVariables` | Global raster image settings |
| `ObjectContextData` | Annotation context data |

## Example

```ts
import { CadDocument, Layout } from '@node-projects/acad-ts';

const doc = new CadDocument();

// Access layouts
if (doc.layouts) {
  for (const layout of doc.layouts) {
    console.log(layout.name);
  }
}
```
