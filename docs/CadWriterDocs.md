# CadWriter

Both `DwgWriter` and `DxfWriter` take a document and an output stream, then call `write()` to serialize the document.

## DwgWriter

Writes DWG binary files.

### Static method

```ts
import { DwgWriter } from '@node-projects/acad-ts';

const output = DwgWriter.writeToBuffer(doc);
fs.writeFileSync('drawing.dwg', output);
```

### Instance usage

```ts
const writer = new DwgWriter(buffer, doc);
writer.configuration.writeXData = true;
writer.write();
```

### Writing with a preview/thumbnail

```ts
import { DwgWriter, DwgPreview, PreviewType } from '@node-projects/acad-ts';

const imageBytes = fs.readFileSync('thumbnail.png');
const preview = new DwgPreview(PreviewType.Png, new Uint8Array(80), new Uint8Array(imageBytes));

const writer = new DwgWriter(buffer, doc);
writer.preview = preview;
writer.write();
```

## DxfWriter

Writes DXF files in ASCII or binary format.

```ts
import { DxfWriter } from '@node-projects/acad-ts';

doc.header.codePage = 'ANSI_1252';
const output = new Uint8Array(1024 * 1024);
const writer = new DxfWriter(output, doc);
writer.write();
```

`doc.header.codePage` controls the legacy code page used for DWG/DXF text bytes. For ASCII DXF, prefer a `Uint8Array` output target when you need exact non-UTF-8 bytes. If you route ASCII DXF through a string-based sink, the sink's own encoding step still decides which bytes end up on disk or on the wire.

## SvgWriter

Exports a document or block to SVG format.

```ts
import { SvgWriter } from '@node-projects/acad-ts';

const output = new Uint8Array(1024 * 1024);
const svgWriter = new SvgWriter(output, doc);
svgWriter.write(); // Writes model space

// Write a specific block
svgWriter.writeBlock(doc.blockRecords.get('MyBlock'));
```

## Writer configuration

| Property | Type | Default | Description |
|---|---|---|---|
| `closeStream` | `boolean` | `true` | Close the output stream after writing |
| `resetDxfClasses` | `boolean` | `false` | Reset DXF class definitions before writing |
| `updateDimensionsInBlocks` | `boolean` | `false` | Recalculate dimensions in block records |
| `updateDimensionsInModel` | `boolean` | `false` | Recalculate dimensions in model space |
| `writeXData` | `boolean` | `true` | Include extended data in output |
| `writeXRecords` | `boolean` | `true` | Include XRecord objects in output |
| `writeShapes` | `boolean` | `true` | Include shape entities in output |
