# acad-ts

![License](https://img.shields.io/github/license/node-projects/acad-ts)

TypeScript library to read and write AutoCAD DWG and DXF files. Ported from the C# [ACadSharp](https://github.com/DomCR/ACadSharp) library.

Based on commit: https://github.com/DomCR/ACadSharp/commit/3010994939c1bc21df0c9e2931e9baee4564815a

Last compared upstream commit: https://github.com/DomCR/ACadSharp/commit/c6710a43ed693c36876ef0a381a132df2ca306ab (see [commit-by-commit audit](docs/acadsharp-upstream-sync.md)).

## Features

- Read/Write DXF files (ASCII and binary)
- Read/Write DWG files
- Honor `$DWGCODEPAGE` when reading DXF ASCII/binary strings and when writing legacy-codepage text
- Extract and modify geometric entities (lines, arcs, circles, polylines, dimensions, etc.)
- Manage table entries (blocks, layers, line types, text styles, dimension styles)
- Convert CAD documents to SVG
- Full TypeScript type definitions

### Supported DWG/DXF versions

|        | DxfReader | DxfWriter | DwgReader | DwgWriter |
| ------ | :-------: | :-------: | :-------: | :-------: |
| AC1009 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| AC1012 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| AC1014 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| AC1015 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| AC1018 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| AC1021 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| AC1024 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| AC1027 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| AC1032 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |

R2007 (AC1021) DWG writing uses its native page container, CRC64 checksums and
Reed–Solomon protection. Pages are currently stored without LZ compression, so
files can be larger than AutoCAD output. See [DWG interoperability validation](docs/dwg-interoperability.md).

R11/R12 (AC1009) DXF writing supports ASCII and binary output, including legacy
polylines, meshes, blocks and extended data. Lightweight polylines are exported
as `POLYLINE`/`VERTEX` records and true colors are approximated with indexed
colors. Entities introduced after R12 (such as MTEXT, HATCH and 3DSOLID) are
omitted with a `NotImplemented` notification; they are not automatically exploded.
R13 (AC1012) DWG reading and writing use the R13 container. Newer custom classes
stored in old drawings still have the usual entity-specific limitations.
These additions are checked with strict reader tests and an optional independent
[ODA interoperability check](samples/legacy/README.md).

R11/R12 DWG uses a separate pre-R13 codec for lines, points, circles, arcs,
text, solids/traces, faces, blocks, attributes, polylines and meshes. It preserves
layer, simple linetype, text-style and application tables and common header
settings. Other header bytes are retained when rewriting a loaded document;
unsupported entity types are reported (or rejected with `failsafe = false`).
Dimension/view/UCS table customization, extended entity data and overflow
records are not fully supported. The version table describes file-format
availability, not complete coverage of every AutoCAD object or property.

## Installation

```bash
npm install @node-projects/acad-ts
```

## Publishing a release

The [release workflow](.github/workflows/release.yml) runs when a GitHub release
is published. Use a SemVer release tag such as `v3.6.0` or `3.6.0` (without build
metadata). The tag determines the npm package version; the release title is for
display only. The workflow updates the version in its checkout without committing
it back, runs tests, builds the library and minified bundle, and uploads the same
`.tgz` package to the GitHub release and npm.

Before the first release, configure an npm
[trusted publisher](https://docs.npmjs.com/trusted-publishers/) for
`@node-projects/acad-ts` in its npm package settings: choose GitHub Actions,
owner `node-projects`, repository `acad-ts`, and workflow filename `release.yml`.
Leave the environment name empty and allow publishing. No npm token secret is
needed. If the package does not exist on npm yet, publish it once manually before
configuring its trusted publisher.

Alternatively, a maintainer with npm write access can configure it using the CLI:

```bash
npm trust github @node-projects/acad-ts --file release.yml --repository node-projects/acad-ts --allow-publish --yes
```

Publish a release from a commit containing the workflow. Stable versions use
npm's `latest` dist-tag; GitHub prereleases and versions such as `v3.7.0-beta.1`
use `next`. Draft releases do not trigger publishing. Each release must use a new
npm version.

## Metadata-backed DXF mapping

The original C# ACadSharp implementation relies on reflection and attributes such as `DxfCodeValue`, `DxfCollectionCodeValue`, `CadSystemVariable`, `DxfName`, and `DxfSubClass` to build DXF maps and header-variable tables at runtime. TypeScript does not have the same runtime reflection model, so acad-ts now uses a checked-in metadata lookup table instead.

This metadata is what powers the rebuilt `CadHeader.GetHeaderMap()` / `SetValue()` path, `DxfMap` / `DxfClassMap` creation, DXF subclass lookup, and property conversions for dates, time spans, vectors, colors, reference types, and collection-coded values.

The metadata system has four parts:

- `src/Metadata/MetadataLookupTable.ts`: a small aggregator that preserves a stable runtime import path.
- `src/Metadata/LookupTables/*.ts`: the hand-maintained domain lookup tables for DXF names, subclass markers, property codes, collection codes, system variables, and reference semantics.
- `src/Metadata/MetadataStore.ts`: runtime lookup helpers that expose cloned metadata for maps, properties, and system variables.
- Runtime consumers such as `src/DxfMap.ts`, `src/DxfClassMap.ts`, `src/DxfPropertyBase.ts`, and `src/Header/CadHeader.ts`.

Why this exists:

- It restores the C# mapping behavior with an explicit TypeScript source of truth that lives in this repo.
- It avoids a build-time or maintenance dependency on the upstream C# source tree.
- It avoids shipping a decorator or reflection dependency just to emulate ACadSharp's attribute model.

How the lookup table is maintained:

1. The current lookup table was bootstrapped from the earlier generated metadata so the repo keeps the same runtime behavior without reintroducing the C# fetch step.
2. Ongoing changes should be made directly in the matching file under `src/Metadata/LookupTables/` when a newly ported type, DXF code, collection code, subclass marker, or system variable needs to be added or corrected.
3. `src/Metadata/MetadataLookupTable.ts` aggregates those domain files into one array so the runtime import path stays stable.
4. `src/Metadata/MetadataStore.ts` clones that table before exposing entries so runtime consumers do not mutate the source data.

The lookup table is committed. Normal builds and tests consume the checked-in metadata and do not require network access or any external source tree.

## Usage

### Reading a DWG file

```ts
import fs from 'fs';
import { DwgReader } from '@node-projects/acad-ts';

const buffer = fs.readFileSync('drawing.dwg');
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

const doc = DwgReader.readFromStream(arrayBuffer, (sender, e) => {
  console.log(e.message);
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

const doc = DxfReader.readFromStream(data, (sender, e) => {
  console.log(e.message);
});
```

DXF string decoding follows `$DWGCODEPAGE` for both ASCII and binary DXF. Pass the raw file bytes as `Uint8Array`; if you decode the file to a JavaScript string before handing it to the reader, the original code page information is already lost.

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

const output = DwgWriter.writeToBuffer(doc);
fs.writeFileSync('drawing.dwg', output);
```

### Writing a DXF file

```ts
import { CadDocument, DxfWriter } from '@node-projects/acad-ts';

const doc = new CadDocument();
doc.header.codePage = 'ANSI_1252';
// ... add entities ...

const output = new Uint8Array(1024 * 1024);
const writer = new DxfWriter(output, doc);
writer.write();
```

`doc.header.codePage` controls the legacy encoding used for DWG/DXF text data. For exact non-UTF-8 ASCII DXF bytes, prefer a `Uint8Array` target. If you send ASCII DXF to a string-based text sink, that sink's own encoding policy still determines the final bytes.

### Exporting to SVG

```ts
import { SvgWriter } from '@node-projects/acad-ts';

const output = new Uint8Array(1024 * 1024);
const svgWriter = new SvgWriter(output, doc);
svgWriter.write();
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

The focused metadata regression coverage lives in `tests/MetadataMappings.test.ts`. It verifies lookup-table collection codes, reference-type handling, `CadHeader` variable application, and metadata-backed `DxfMap` / `DxfClassMap` creation.

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
