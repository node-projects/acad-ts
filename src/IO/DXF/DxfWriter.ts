import { CadWriterBase } from '../CadWriterBase.js';
import { DxfWriterConfiguration } from './DxfWriterConfiguration.js';
import { IDxfStreamWriter } from './DxfStreamWriter/IDxfStreamWriter.js';
import { DxfAsciiWriter } from './DxfStreamWriter/DxfAsciiWriter.js';
import { DxfBinaryWriter } from './DxfStreamWriter/DxfBinaryWriter.js';
import { DxfHeaderSectionWriter } from './DxfStreamWriter/DxfHeaderSectionWriter.js';
import { DxfClassesSectionWriter } from './DxfStreamWriter/DxfClassesSectionWriter.js';
import { DxfTablesSectionWriter } from './DxfStreamWriter/DxfTablesSectionWriter.js';
import { DxfBlocksSectionWriter } from './DxfStreamWriter/DxfBlocksSectionWriter.js';
import { DxfEntitiesSectionWriter } from './DxfStreamWriter/DxfEntitiesSectionWriter.js';
import { DxfObjectsSectionWriter } from './DxfStreamWriter/DxfObjectsSectionWriter.js';
import { CadObjectHolder } from './CadObjectHolder.js';
import { CadDocument } from '../../CadDocument.js';
import { DxfCode } from '../../DxfCode.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { NotificationEventHandler } from '../NotificationEventHandler.js';
import { encodeCadString } from '../TextEncoding.js';
import { ACadVersion } from '../../ACadVersion.js';
import { ModelerGeometry } from '../../Entities/ModelerGeometry.js';

type DxfTextOutput = {
  write(value: string): void;
  flush?(): void;
  close?(): void;
};

type DxfBinaryOutput = {
  write(value: Uint8Array): void;
  flush?(): void;
  close?(): void;
};

export type DxfWriteTarget = Uint8Array | DxfTextOutput | DxfBinaryOutput;

class Uint8ArrayTextOutput implements DxfTextOutput {
  private readonly _stream: Uint8Array;
  private readonly _encoding: string;
  private _position: number = 0;

  public constructor(stream: Uint8Array, encoding: string) {
    this._stream = stream;
    this._encoding = encoding;
  }

  public write(value: string): void {
    const bytes = encodeCadString(value, this._encoding);
    this._ensureCapacity(bytes.length);
    this._stream.set(bytes, this._position);
    this._position += bytes.length;
  }

  public flush(): void {}

  public close(): void {}

  private _ensureCapacity(length: number): void {
    if (this._position + length > this._stream.length) {
      throw new Error('DXF output buffer is too small.');
    }
  }
}

class Uint8ArrayBinaryOutput implements DxfBinaryOutput {
  private readonly _stream: Uint8Array;
  private _position: number = 0;

  public constructor(stream: Uint8Array) {
    this._stream = stream;
  }

  public write(value: Uint8Array): void {
    this._ensureCapacity(value.length);
    this._stream.set(value, this._position);
    this._position += value.length;
  }

  public flush(): void {}

  public close(): void {}

  private _ensureCapacity(length: number): void {
    if (this._position + length > this._stream.length) {
      throw new Error('DXF output buffer is too small.');
    }
  }
}

export class DxfWriter extends CadWriterBase<DxfWriterConfiguration, DxfWriteTarget> {
  public isBinary: boolean;

  private _writer!: IDxfStreamWriter;
  private _objectHolder: CadObjectHolder = new CadObjectHolder();

  public constructor(stream: DxfWriteTarget, document: CadDocument, binary: boolean = false) {
    super(stream, document);
    this.isBinary = binary;
    this.configuration = new DxfWriterConfiguration();
  }

  public override write(): void {
    super.write();

    this._createStreamWriter();

    this._objectHolder.objects.push(this._document.rootDictionary);

    this._writeHeader();

    this._writeDxfClasses();

    this._writeTables();

    this._writeBlocks();

    this._writeEntities();

    this._writeObjects();

    this._writeACDSData();

    this._writer.write(DxfCode.Start, DxfFileToken.endOfFile);

    this._writer.flush();

    if (this.configuration.closeStream) {
      this._writer.close();
    }
  }

  public override dispose(): void {
    this._writer.dispose();
  }

  public static writeToStream(
    stream: DxfWriteTarget,
    document: CadDocument,
    binary: boolean = false,
    configuration?: DxfWriterConfiguration,
    notification?: NotificationEventHandler
  ): void {
    const writer = new DxfWriter(stream, document, binary);

    if (configuration) {
      writer.configuration = configuration;
    }

    writer.onNotification = notification ?? null;
    writer.write();
    writer.dispose();
  }

  private _createStreamWriter(): void {
    if (this.isBinary) {
      this._writer = new DxfBinaryWriter(this._createBinaryTarget(), this._encoding);
    } else {
      const writer = new DxfAsciiWriter(this._createTextTarget());
      writer.decimalPrecision = this.configuration.decimalPrecision;
      this._writer = writer;
    }

    this._writer.writeOptional = this.configuration.writeOptionalValues;
  }

  private _createTextTarget(): DxfTextOutput {
    if (this._stream instanceof Uint8Array) {
      return new Uint8ArrayTextOutput(this._stream, this._encoding);
    }

    return this._stream as DxfTextOutput;
  }

  private _createBinaryTarget(): DxfBinaryOutput {
    if (this._stream instanceof Uint8Array) {
      return new Uint8ArrayBinaryOutput(this._stream);
    }

    return this._stream as DxfBinaryOutput;
  }

  private _writeHeader(): void {
    const writer = new DxfHeaderSectionWriter(this._writer, this._document, this._objectHolder, this.configuration);
    writer.onNotification = this.triggerNotification.bind(this);

    writer.write();
  }

  private _writeDxfClasses(): void {
    const writer = new DxfClassesSectionWriter(this._writer, this._document, this._objectHolder, this.configuration);
    writer.onNotification = this.triggerNotification.bind(this);

    writer.write();
  }

  private _writeTables(): void {
    const writer = new DxfTablesSectionWriter(this._writer, this._document, this._objectHolder, this.configuration);
    writer.onNotification = this.triggerNotification.bind(this);

    writer.write();
  }

  private _writeBlocks(): void {
    const writer = new DxfBlocksSectionWriter(this._writer, this._document, this._objectHolder, this.configuration);
    writer.onNotification = this.triggerNotification.bind(this);

    writer.write();
  }

  private _writeEntities(): void {
    const writer = new DxfEntitiesSectionWriter(this._writer, this._document, this._objectHolder, this.configuration);
    writer.onNotification = this.triggerNotification.bind(this);

    writer.write();
  }

  private _writeObjects(): void {
    const writer = new DxfObjectsSectionWriter(this._writer, this._document, this._objectHolder, this.configuration);
    writer.onNotification = this.triggerNotification.bind(this);

    writer.write();
  }

  private _writeACDSData(): void {
    if (this._document.header.version < ACadVersion.AC1027) {
      return;
    }

    const records = new Map<number, ModelerGeometry>();
    for (const geometry of this._objectHolder.modelerGeometries) {
      if (geometry.acisData.length > 0) {
        records.set(geometry.handle, geometry);
      }
    }
    if (records.size === 0) {
      return;
    }

    this._writer.write(DxfCode.Start, DxfFileToken.beginSection);
    this._writer.write(DxfCode.SymbolTableName, DxfFileToken.acdsDataSection);
    this._writer.write(70, 2);
    this._writer.write(71, 8);

    this._writeModelerDataSchema();

    for (const geometry of records.values()) {
      this._writer.write(DxfCode.Start, DxfFileToken.acdsRecord);
      this._writer.write(90, 1);
      this._writer.write(2, 'AcDbDs::ID');
      this._writer.write(280, 10);
      this._writer.write(320, geometry.handle);
      this._writer.write(2, 'ASM_Data');
      this._writer.write(280, 15);
      this._writer.write(94, geometry.acisData.length);

      for (let offset = 0; offset < geometry.acisData.length; offset += 127) {
        this._writer.write(310, geometry.acisData.slice(offset, offset + 127));
      }
    }

    this._writer.write(DxfCode.Start, DxfFileToken.endSection);
  }

  private _writeModelerDataSchema(): void {
    this._writer.write(DxfCode.Start, DxfFileToken.acdsSchema);
    this._writer.write(90, 1);
    this._writer.write(1, 'AcDb3DSolid_ASM_Data');
    this._writer.write(2, 'AcDbDs::ID');
    this._writer.write(280, 10);
    this._writer.write(91, 8);
    this._writer.write(2, 'ASM_Data');
    this._writer.write(280, 15);
    this._writer.write(91, 0);

    this._writeModelerSchemaAttribute(2, 'AcDbDs::TreatedAsObjectData', 1, 291, 1);
    this._writeModelerSchemaAttribute(3, 'AcDbDs::Legacy', 1, 291, 1);
    this._writeModelerSchemaAttribute(4, 'AcDs:Indexable', 1, 291, 1, 'AcDbDs::ID');
    this._writeModelerSchemaAttribute(5, 'AcDbDs::HandleAttribute', 7, 282, 1, 'AcDbDs::ID');

    this._writeModelerAttributeSchema(2, 'AcDbDs::TreatedAsObjectDataSchema', 'AcDbDs::TreatedAsObjectData', 1);
    this._writeModelerAttributeSchema(3, 'AcDbDs::LegacySchema', 'AcDbDs::Legacy', 1);
    this._writeModelerAttributeSchema(4, 'AcDbDs::IndexedPropertySchema', 'AcDs:Indexable', 1);

    this._writer.write(DxfCode.Start, DxfFileToken.acdsSchema);
    this._writer.write(90, 5);
    this._writer.write(1, 'AcDbDs::HandleAttributeSchema');
    this._writer.write(2, 'AcDbDs::HandleAttribute');
    this._writer.write(280, 7);
    this._writer.write(91, 1);
    this._writer.write(284, 1);
  }

  private _writeModelerSchemaAttribute(
    id: number,
    name: string,
    type: number,
    valueCode: number,
    value: number,
    owner?: string
  ): void {
    this._writer.write(101, DxfFileToken.acdsRecord);
    if (owner) {
      this._writer.write(1, owner);
    } else {
      this._writer.write(95, 1);
    }
    this._writer.write(90, id);
    this._writer.write(2, name);
    this._writer.write(280, type);
    this._writer.write(valueCode, value);
  }

  private _writeModelerAttributeSchema(id: number, schema: string, name: string, type: number): void {
    this._writer.write(DxfCode.Start, DxfFileToken.acdsSchema);
    this._writer.write(90, id);
    this._writer.write(1, schema);
    this._writer.write(2, name);
    this._writer.write(280, type);
    this._writer.write(91, 0);
  }

  protected createDefaultConfiguration(): DxfWriterConfiguration {
    return new DxfWriterConfiguration();
  }
}
