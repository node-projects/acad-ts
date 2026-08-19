# CadReader

Both `DwgReader` and `DxfReader` follow the same pattern: construct with a binary buffer and an optional notification handler, then call `read()` to get a `CadDocument`.

## DwgReader

Reads DWG binary files. Supports versions AC1014 through AC1032.

### Static methods

```ts
import fs from 'fs';
import { DwgReader } from '@node-projects/acad-ts';

const buffer = fs.readFileSync('drawing.dwg');
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

// Simple read
const doc = DwgReader.readFromStream(arrayBuffer);

// With notification handler
const doc2 = DwgReader.readFromStream(arrayBuffer, (sender, e) => {
  console.log(`[${e.notificationType}] ${e.message}`);
});

// With configuration
const config = new DwgReaderConfiguration();
config.failsafe = false;
const doc3 = DwgReader.readFromStreamWithConfig(arrayBuffer, config, notification);
```

### Instance usage

```ts
const reader = new DwgReader(arrayBuffer, notification);
reader.configuration.failsafe = false;
const doc = reader.read();
```

## DxfReader

Reads DXF files in both ASCII and binary format. Supports versions AC1009 through AC1032.

DXF string decoding follows `$DWGCODEPAGE` for both ASCII and binary DXF once the reader sees the raw bytes. Keep the source as `Uint8Array`; if you decode the file to a JavaScript string before calling `DxfReader`, any legacy-codepage bytes have already been normalized by the host runtime.

### Static methods

```ts
import fs from 'fs';
import { DxfReader } from '@node-projects/acad-ts';

const buffer = fs.readFileSync('drawing.dxf');
const data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);

// Simple read
const doc = DxfReader.readFromStream(data);

// Check if file is binary DXF
const isBinary = DxfReader.isBinaryStream(data);
```

### Instance usage

```ts
const reader = new DxfReader(data, notification);
const doc = reader.read();
```

## Reader configuration

Both readers inherit from `CadReaderBase<T>` and expose a `configuration` property.

| Property | Type | Default | Description |
|---|---|---|---|
| `failsafe` | `boolean` | `true` | When `true`, catches exceptions during reading and continues. When `false`, throws on first error. |
| `keepUnknownEntities` | `boolean` | `false` | Keep entity types that the reader does not recognize |
| `keepUnknownNonGraphicalObjects` | `boolean` | `false` | Keep non-graphical object types that the reader does not recognize |

## Notification handler

The notification handler is called during reading to report warnings, errors, or informational messages:

```ts
function onNotification(sender: object | null, e: NotificationEventArgs): void {
  console.log(`[${e.notificationType}] ${e.message}`);
  if (e.exception) {
    console.error(e.exception);
  }
}
```
