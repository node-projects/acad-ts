import { CadWriterBase } from '../CadWriterBase.js';
import { DxfWriterConfiguration } from './DxfWriterConfiguration.js';
import { IDxfStreamWriter } from './DxfStreamWriter/IDxfStreamWriter.js';
import { DxfAsciiWriter } from './DxfStreamWriter/DxfAsciiWriter.js';
import { DxfBinaryWriter } from './DxfStreamWriter/DxfBinaryWriter.js';
import { DxfStreamWriterBase } from './DxfStreamWriter/DxfStreamWriterBase.js';
import { DxfHeaderSectionWriter } from './DxfStreamWriter/DxfHeaderSectionWriter.js';
import { DxfClassesSectionWriter } from './DxfStreamWriter/DxfClassesSectionWriter.js';
import { DxfTablesSectionWriter } from './DxfStreamWriter/DxfTablesSectionWriter.js';
import { DxfBlocksSectionWriter } from './DxfStreamWriter/DxfBlocksSectionWriter.js';
import { DxfEntitiesSectionWriter } from './DxfStreamWriter/DxfEntitiesSectionWriter.js';
import { DxfObjectsSectionWriter } from './DxfStreamWriter/DxfObjectsSectionWriter.js';
import { DxfAcdsDataSectionWriter } from './DxfStreamWriter/DxfAcdsDataSectionWriter.js';
import { CadObjectHolder } from './CadObjectHolder.js';
import { CadDocument } from '../../CadDocument.js';
import { DxfCode } from '../../DxfCode.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { NotificationEventHandler } from '../NotificationEventHandler.js';
import { encodeCadString } from '../TextEncoding.js';
import { ACadVersion } from '../../ACadVersion.js';
import { Insert } from '../../Entities/Insert.js';
import { Polyline } from '../../Entities/Polyline.js';
import { PolyfaceMesh } from '../../Entities/PolyfaceMesh.js';
import { Seqend } from '../../Entities/Seqend.js';
import { CadObject } from '../../CadObject.js';
import { CadDictionary } from '../../Objects/CadDictionary.js';
import { Field } from '../../Objects/Field.js';
import { FieldList } from '../../Objects/FieldList.js';

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

    // Array-based child collections do not register newly constructed children
    // automatically. Set owners and allocate handles before writing HANDSEED.
    for (const block of this._document.blockRecords) {
      for (const entity of block.entities) {
        const children = entity instanceof Insert && entity.hasAttributes ? entity.attributes
          : entity instanceof Polyline ? entity.vertices : null;
        if (!children) continue;
        for (const child of children) child.owner = entity;
        this._document.registerCollection(children);
        children.seqend ??= new Seqend();
        children.seqend.owner = entity;
        this._document.registerCollection(children.seqend);
        if (entity instanceof PolyfaceMesh) {
          for (const face of entity.faces) face.owner = entity;
          this._document.registerCollection(entity.faces);
        }
      }
    }

    this._prepareFields();

    this._createStreamWriter();

    this._objectHolder.objects.push(this._document.rootDictionary);

    this._writeHeader();

    if (this._document.header.version > ACadVersion.AC1009) this._writeDxfClasses();

    this._writeTables();

    this._writeBlocks();

    this._writeEntities();

    if (this._document.header.version > ACadVersion.AC1009) this._writeObjects();

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

  private _prepareFields(): void {
    const objects = [...this._document.getCadObjects()];
    const visited = new Set<CadObject>();
    const fields: Field[] = [];
    const lists: FieldList[] = [];
    for (let index = 0; index < objects.length; index++) {
      const item = objects[index];
      if (visited.has(item)) continue;
      visited.add(item);
      if (item.xDictionary) objects.push(item.xDictionary);
      if (item instanceof CadDictionary) {
        for (const entry of item) objects.push(entry);
      }
      if (item instanceof FieldList) {
        lists.push(item);
        for (const field of item.fields) objects.push(field);
      } else if (item instanceof Field) {
        fields.push(item);
        for (const child of item.children) {
          child.owner ??= item;
          objects.push(child);
        }
      }
    }

    // Hard child links take precedence over the FIELDLIST's soft references.
    // Delay fallback owners until every parent has been visited.
    for (const list of lists) {
      for (const field of list.fields) field.owner ??= list;
    }
    let registeredFields = false;
    for (const field of fields) {
      if (field.document == null) registeredFields = true;
      this._document.registerCollection(field);
    }
    if (registeredFields) this._document.updateDxfClasses(this.configuration.resetDxfClasses);
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
    (this._writer as DxfStreamWriterBase).legacyR12 = this._document.header.version <= ACadVersion.AC1009;
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
    if (this._document.header.version < ACadVersion.AC1027 || !this.configuration.writeACISData) {
      return;
    }

    const storage = this._document.createDataStorage();
    if (!storage) return;
    new DxfAcdsDataSectionWriter(storage, this._writer, this._document, this._objectHolder, this.configuration).write();
  }

  protected createDefaultConfiguration(): DxfWriterConfiguration {
    return new DxfWriterConfiguration();
  }
}
