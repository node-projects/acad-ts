# CadReader

Both `DwgReader` and `DxfReader` follow the same pattern: construct with a binary buffer and an optional notification handler, then call `Read()` to get a `CadDocument`.

## DwgReader

Reads DWG binary files. Supports versions AC1014 through AC1032.

### Static methods

```ts
import fs from 'fs';
import { DwgReader } from '@node-projects/acad-ts';

const buffer = fs.readFileSync('drawing.dwg');
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

// Simple read
const doc = DwgReader.ReadFromStream(arrayBuffer);

// With notification handler
const doc2 = DwgReader.ReadFromStream(arrayBuffer, (sender, e) => {
  console.log(`[${e.NotificationType}] ${e.Message}`);
});

// With configuration
const config = new DwgReaderConfiguration();
config.Failsafe = false;
const doc3 = DwgReader.ReadFromStreamWithConfig(arrayBuffer, config, notification);
```

### Instance usage

```ts
const reader = new DwgReader(arrayBuffer, notification);
reader.Configuration.Failsafe = false;
const doc = reader.Read();
```

## DxfReader

Reads DXF files in both ASCII and binary format. Supports versions AC1009 through AC1032.

### Static methods

```ts
import fs from 'fs';
import { DxfReader } from '@node-projects/acad-ts';

const buffer = fs.readFileSync('drawing.dxf');
const data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);

// Simple read
const doc = DxfReader.ReadFromStream(data);

// Check if file is binary DXF
const isBinary = DxfReader.IsBinaryStream(data);
```

### Instance usage

```ts
const reader = new DxfReader(data, notification);
const doc = reader.Read();
```

## Reader configuration

Both readers inherit from `CadReaderBase<T>` and expose a `Configuration` property.

| Property | Type | Default | Description |
|---|---|---|---|
| `Failsafe` | `boolean` | `true` | When `true`, catches exceptions during reading and continues. When `false`, throws on first error. |
| `KeepUnknownEntities` | `boolean` | `false` | Keep entity types that the reader does not recognize |
| `KeepUnknownNonGraphicalObjects` | `boolean` | `false` | Keep non-graphical object types that the reader does not recognize |

## Notification handler

The notification handler is called during reading to report warnings, errors, or informational messages:

```ts
function onNotification(sender: object | null, e: NotificationEventArgs): void {
  console.log(`[${e.NotificationType}] ${e.Message}`);
  if (e.Exception) {
    console.error(e.Exception);
  }
}
```
