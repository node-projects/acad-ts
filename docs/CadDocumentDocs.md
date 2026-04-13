# CadDocument

The `CadDocument` class is the central entry point for working with CAD data. It represents a complete CAD drawing and provides access to all entities, tables, dictionaries, and header information.

## Creating a document

```ts
import { CadDocument, ACadVersion } from '@node-projects/acad-ts';

// Create with defaults (AC1032)
const doc = new CadDocument();

// Create with a specific version
const doc2 = new CadDocument(ACadVersion.AC1018);
```

The constructor calls `createDefaults()` which initializes all standard tables and default entries.

## Properties

### Header

- **`header`** (`CadHeader`) - Contains all header variables for the document including version, units, dimension defaults, etc.

### Tables

Tables provide structured, named access to the fundamental resources used by entities. Each table enforces name uniqueness.

| Property | Type | Description |
|---|---|---|
| `appIds` | `AppIdsTable` | Registered application IDs |
| `blockRecords` | `BlockRecordsTable` | Block definitions |
| `dimensionStyles` | `DimensionStylesTable` | Dimension styles |
| `layers` | `LayersTable` | Layers |
| `lineTypes` | `LineTypesTable` | Line types |
| `textStyles` | `TextStylesTable` | Text styles |
| `uCSs` | `UCSTable` | User coordinate systems |
| `views` | `ViewsTable` | Named views |
| `vPorts` | `VPortsTable` | Viewport configurations |

### Collections

Collections are stored in the root dictionary and provide access to non-table resources.

| Property | Type | Description |
|---|---|---|
| `rootDictionary` | `CadDictionary` | Root dictionary of the document |
| `colors` | `ObjectDictionaryCollection` | Book colors |
| `groups` | `ObjectDictionaryCollection` | Groups |
| `imageDefinitions` | `ObjectDictionaryCollection` | Image definitions |
| `pdfDefinitions` | `ObjectDictionaryCollection` | PDF underlays |
| `layouts` | `ObjectDictionaryCollection` | Layouts |
| `mLeaderStyles` | `ObjectDictionaryCollection` | Multi-leader styles |
| `mLineStyles` | `ObjectDictionaryCollection` | Multi-line styles |
| `scales` | `ObjectDictionaryCollection` | Scales |

### Model and paper space

- **`modelSpace`** (`BlockRecord`) - Block record containing model space entities.
- **`paperSpace`** (`BlockRecord`) - Block record containing paper space entities.
- **`entities`** - Shortcut to all entities in model space.

### File information

- **`summaryInfo`** (`CadSummaryInfo`) - Drawing metadata (title, subject, author, keywords).
- **`classes`** (`DxfClassCollection`) - DXF class definitions.

## Methods

### Object management

```ts
// Get a CAD object by handle
const obj = doc.getCadObject(handle);

// Reassign all handles to prevent overflow
doc.restoreHandles();
```

### Document maintenance

```ts
// Create default entries and objects
doc.createDefaults();

// Update DXF class instance counts
doc.updateDxfClasses(true);

// Update and link collections to their dictionaries
doc.updateCollections(true);
```

## Working with entities

```ts
import { CadDocument, Line, Circle, Layer, XYZ, Color } from '@node-projects/acad-ts';

const doc = new CadDocument();

// Create a layer
const layer = new Layer();
layer.name = 'MyLayer';
layer.color = Color.fromColorIndex(1); // Red
doc.layers.add(layer);

// Add entities to model space
const line = new Line();
line.startPoint = new XYZ(0, 0, 0);
line.endPoint = new XYZ(10, 5, 0);
line.layer = layer;
doc.modelSpace.addEntity(line);

const circle = new Circle();
circle.center = new XYZ(5, 5, 0);
circle.radius = 3;
doc.modelSpace.addEntity(circle);

// Iterate entities
for (const entity of doc.modelSpace.entities) {
  console.log(entity.objectName, entity.handle);
}
```
# CadDocument Class

Represents a CAD drawing document, providing access to all major collections, tables, and objects required for managing and manipulating a CAD file. The `CadDocument` class is the central entry point for working with CAD data in the ACadSharp library.

A `CadDocument` encapsulates the structure and content of a CAD drawing, including entities, tables, dictionaries, and header information. It manages object handles, collections, and provides methods for creating, updating, and retrieving CAD objects.

## Properties

- **Classes**: Collection of Dxf classes defined in the document.
- **Handle**: The document handle (always 0).
- **Header**: Contains all header variables for the document.
- **Entities**: Collection of all entities in the drawing (from ModelSpace).
- **ModelSpace**: Block record containing the model space entities.
- **PaperSpace**: Block record containing the paper space entities.

### Tables

Tables are essential building blocks in a CAD document, providing structured, named access to the fundamental resources that define the drawing's organization and appearance. They are distinct from general collections in that they enforce uniqueness and are tightly integrated with the CAD file's structure and referencing system.

- **AppIds**: Collection of all registered application IDs.
- **BlockRecords**: Collection of all block records.
- **DimensionStyles**: Collection of all dimension styles.
- **Layers**: Collection of all layers.
- **LineTypes**: Collection of all line types.
- **TextStyles**: Collection of all text styles.
- **UCSs**: Collection of all user coordinate systems.
- **Views**: Collection of all views.
- **VPorts**: Collection of all viewports.

### Collections

The collections in the document serve as organized containers for various types of CAD data and resources within a drawing. 

These collections provide structured access to the drawing's components, ensuring that objects are uniquely identified, properly referenced, and easily managed. They help maintain the integrity and organization of the CAD document, supporting features like naming, grouping, styling, and custom data attachment.

In summary, the collections in the document are essential for grouping related CAD objects, facilitating their management, and enabling the complex relationships and referencing required in a professional CAD environment.

All collections are stored in the **RootDictionary** with each one of them with a unique name.

- **RootDictionary**: Root dictionary of the document.
- **Colors**: Collection of all book colors (may be null if not present).
- **Groups**: Collection of all groups (may be null if not present).
- **ImageDefinitions**: Collection of all image definitions (may be null if not present).
- **PdfDefinitions**: Collection of all PDF definitions (may be null if not present).
- **Layouts**: Collection of all layouts (may be null if not present).
- **MLeaderStyles**: Collection of all multi-leader styles (may be null if not present).
- **MLineStyles**: Collection of all multi-line styles (may be null if not present).
- **Scales**: Collection of all scales (may be null if not present).

### File infromation

- **SummaryInfo**: Drawing properties such as Title, Subject, Author, and Keywords.

## Constructors

- `CadDocument()`: Creates a document with default objects and version `ACadVersion.AC1032`.
- `CadDocument(ACadVersion version)`: Creates a document with default objects and a specific version.

## Public Methods

### Object Management

- `GetCadObject(ulong handle)`: Gets a CAD object by its handle.
- `GetCadObject<T>(ulong handle)`: Gets a CAD object of type `T` by its handle.
- `TryGetCadObject<T>(ulong handle, out T cadObject)`: Tries to get a CAD object of type `T` by its handle.
- `RestoreHandles()`: Reassigns all handles in the document to prevent the handle seed from exceeding its limit.

### Document Structure

- `CreateDefaults()`: Creates default entries and objects for the document.
- `UpdateDxfClasses(bool reset)`: Updates Dxf classes and their instance counts.
- `UpdateCollections(bool createDictionaries)`: Updates and links collections to their dictionaries.
