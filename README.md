# acad-ts

![License](https://img.shields.io/github/license/node-projects/acad-ts)

TypeScript library to read and write AutoCAD DWG and DXF files. Ported from the C# [ACadSharp](https://github.com/DomCR/ACadSharp) library.

Based on commit: https://github.com/DomCR/ACadSharp/commit/3010994939c1bc21df0c9e2931e9baee4564815a

## Features

- Read/Write DXF files (ASCII and binary)
- Read/Write DWG files
- Extract and modify geometric entities (lines, arcs, circles, polylines, dimensions, etc.)
- Manage table entries (blocks, layers, line types, text styles, dimension styles)
- Convert CAD documents to SVG
- Full TypeScript type definitions

### Supported DWG/DXF versions

|        | DxfReader | DxfWriter | DwgReader | DwgWriter |
| ------ | :-------: | :-------: | :-------: | :-------: |
| AC1009 | :heavy_check_mark: | :x: | :x: | :x: |
| AC1012 | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: |
| AC1014 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| AC1015 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| AC1018 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| AC1021 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: |
| AC1024 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| AC1027 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| AC1032 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |

## Installation

```bash
npm install @node-projects/acad-ts
```

## Usage

### Reading a DWG file

```ts
import fs from 'fs';
import { DwgReader } from '@node-projects/acad-ts';

const buffer = fs.readFileSync('drawing.dwg');
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

const doc = DwgReader.ReadFromStream(arrayBuffer, (sender, e) => {
  console.log(e.Message);
});

// Access entities in model space
for (const entity of doc.modelSpace.entities) {
  console.log(entity.constructor.name, entity.handle);
}
```

### Reading a DXF file

```ts
import fs from 'fs';
import { DxfReader } from '@node-projects/acad-ts';

const buffer = fs.readFileSync('drawing.dxf');
const data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);

const doc = DxfReader.ReadFromStream(data, (sender, e) => {
  console.log(e.Message);
});
```

### Writing a DWG file

```ts
import fs from 'fs';
import { CadDocument, DwgWriter, ACadVersion, Line, XYZ } from '@node-projects/acad-ts';

const doc = new CadDocument();
doc.header.version = ACadVersion.AC1032;

const line = new Line();
line.startPoint = new XYZ(0, 0, 0);
line.endPoint = new XYZ(100, 100, 0);
doc.modelSpace.addEntity(line);

const buffer = new ArrayBuffer(0);
DwgWriter.WriteToStream(buffer, doc);
```

### Writing a DXF file

```ts
import { CadDocument, DxfWriter } from '@node-projects/acad-ts';

const doc = new CadDocument();
// ... add entities ...

const output = new Uint8Array(1024 * 1024);
const writer = new DxfWriter(output, doc);
writer.Write();
```

### Exporting to SVG

```ts
import { SvgWriter } from '@node-projects/acad-ts';

const output = new Uint8Array(1024 * 1024);
const svgWriter = new SvgWriter(output, doc);
svgWriter.Write();
```

### Working with entities

```ts
import { CadDocument, Layer, Line, Circle, XYZ, Color } from '@node-projects/acad-ts';

const doc = new CadDocument();

// Create a layer
const layer = new Layer();
layer.name = 'MyLayer';
layer.color = Color.fromColorIndex(1); // Red
doc.layers.add(layer);

// Add a line
const line = new Line();
line.startPoint = new XYZ(0, 0, 0);
line.endPoint = new XYZ(10, 5, 0);
line.layer = layer;
doc.modelSpace.addEntity(line);

// Add a circle
const circle = new Circle();
circle.center = new XYZ(5, 5, 0);
circle.radius = 3;
doc.modelSpace.addEntity(circle);
```

## Building from source

```bash
npm install
npm run build
```

The compiled output will be in the `dist/` directory.

## Running tests

```bash
npm test
```

## Documentation

See the [docs](./docs/) folder for detailed documentation on specific topics:

- [CadDocument](./docs/CadDocumentDocs.md) - Document structure and collections
- [CadObject](./docs/CadObjectDocs.md) - Base object properties
- [Entities](./docs/EntityDocs.md) - Working with geometric entities
- [Tables](./docs/TableEntryDocs.md) - Table entries (layers, line types, styles)
- [Block Records](./docs/BlockRecordDocs.md) - Blocks and block records
- [Inserts](./docs/InsertDocs.md) - Block insertions
- [Dimensions](./docs/Dimensions.md) - Dimension entities
- [Non-Graphical Objects](./docs/NonGraphicalObjectDocs.md) - Layouts, dictionaries, etc.
- [Reading files](./docs/CadReaderDocs.md) - Reader configuration and usage
- [Writing files](./docs/CadWriterDocs.md) - Writer configuration and usage

## License

[MIT](LICENSE)