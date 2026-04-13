# acad-ts Documentation

acad-ts is a TypeScript library to read and write AutoCAD DWG and DXF files. It provides full access to the CAD document model including entities, tables, dictionaries, and headers.

## Quick Start

### Reading a file

Pick the reader that matches your file format: `DwgReader` for `.dwg` files or `DxfReader` for `.dxf` files.

```ts
import fs from 'fs';
import { DwgReader } from '@node-projects/acad-ts';

const buffer = fs.readFileSync('drawing.dwg');
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

const doc = DwgReader.ReadFromStream(arrayBuffer, (sender, e) => {
  console.log(e.Message);
});
```

Both readers accept an optional configuration and a notification handler for logging issues during reading. For more information see [CadReader](./CadReaderDocs.md).

### Document operations

Once you have a `CadDocument` (from reading or creating a new one), you can:

- Access and modify entities and extract geometry, color, layer, line type, etc.
- Create new entities in model space
- Create new table entries (layers, line types, blocks, text styles)
- Add, read, or remove extended data (`XData`) on any object

For more information about document structure see [CadDocument](./CadDocumentDocs.md).

Object documentation by type:
- [CadObject](./CadObjectDocs.md) - Base class for all CAD objects
  - [Entity](./EntityDocs.md) - Graphical entities
  - [NonGraphicalObject](./NonGraphicalObjectDocs.md) - Non-graphical objects (layouts, dictionaries, etc.)
  - [TableEntry](./TableEntryDocs.md) - Table entries (layers, line types, styles)

### Writing a file

Save your document using `DwgWriter` or `DxfWriter`:

```ts
import { DwgWriter } from '@node-projects/acad-ts';

const buffer = new ArrayBuffer(0);
DwgWriter.WriteToStream(buffer, doc);
```

For writer configuration details see [CadWriter](./CadWriterDocs.md).

### Special topics

- [BlockRecord](./BlockRecordDocs.md) - Working with blocks
- [Insert](./InsertDocs.md) - Block insertions
- [Dimensions](./Dimensions.md) - Dimension entities and their points
# ACadSharp

ACadSharp is a pure C# library to read/write cad files like dxf/dwg.

## Quick Start

### Read

If you want to read a cad file you just need to pick the reader that matches the format, for dwg files you can use [`ACadSharp.IO.DwgReader`](https://github.com/DomCR/ACadSharp/wiki/ACadSharp.IO.DwgReader) or [`ACadSharp.IO.DxfReader`](https://github.com/DomCR/ACadSharp/wiki/ACadSharp.IO.DxfReader) for a dxf file.

The following example shows how to use the `DwgReader` using the static `Read()` method, the `DxfReader` has the equivalent method as well.

```C#
CadDocument doc = DwgReader.Read(file);
```

Both readers have a parameter to configure the reader behaviour and a notification system to log information about possible issues that may occur during the read operation, for more information check [CadReader](./CadReaderDocs.md).

### Document operations

Once you have read the [``CadDocument``](https://github.com/DomCR/ACadSharp/wiki/ACadSharp.CadDocument) or created a new one, you can perform any operation that you may need:

- Check or modify the existing entities and extract any information like geometry, color, layer, lineType...  
- Create new entities in the model.
- Create new table entries like Layers, LineTypes, Blocks...
- Add, read or remove ``XData`` in any object in the document. 

For more information about how the CadDocument is structured check [CadDocument](./CadDocumentDocs.md).

To understand the common properties of the different elements in the document check the documentation for the different types of objects:
- [CadObject](./CadObjectDocs.md)
  - [Entity](./EntityDocs.md)
  - [NonGraphicalObject](./NonGraphicalObjectDocs.md)
  - [TableEntry](./TableEntryDocs.md)
  
### Write

Save your file using the [``DwgWriter``](https://github.com/DomCR/ACadSharp/wiki/ACadSharp.IO.DwgWriter) or [``DxfWriter``](https://github.com/DomCR/ACadSharp/wiki/ACadSharp.IO.DxfWriter) depending on the format that you want to use.

```C#
string file = "your file path";
DwgWriter.Write(file, doc);
```

Similar as with the `CadReader` the `CadWriter` have a configuration and a notification system, for more information check [CadWriter](./CadWriterDocs.md).

To save the file in other formats.