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
  private readonly _encoder: TextEncoder = new TextEncoder();
  private _position: number = 0;

  public constructor(stream: Uint8Array) {
    this._stream = stream;
  }

  public write(value: string): void {
    const bytes = this._encoder.encode(value);
    this.ensureCapacity(bytes.length);
    this._stream.set(bytes, this._position);
    this._position += bytes.length;
  }

  public flush(): void {}

  public close(): void {}

  private ensureCapacity(length: number): void {
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
    this.ensureCapacity(value.length);
    this._stream.set(value, this._position);
    this._position += value.length;
  }

  public flush(): void {}

  public close(): void {}

  private ensureCapacity(length: number): void {
    if (this._position + length > this._stream.length) {
      throw new Error('DXF output buffer is too small.');
    }
  }
}

export class DxfWriter extends CadWriterBase<DxfWriterConfiguration, DxfWriteTarget> {
  public IsBinary: boolean;

  private _writer!: IDxfStreamWriter;
  private _objectHolder: CadObjectHolder = new CadObjectHolder();

  public constructor(stream: DxfWriteTarget, document: CadDocument, binary: boolean = false) {
    super(stream, document);
    this.IsBinary = binary;
    this.Configuration = new DxfWriterConfiguration();
  }

  public override Write(): void {
    super.Write();

    this.createStreamWriter();

    this._objectHolder.Objects.push(this._document.rootDictionary);

    this.writeHeader();

    this.writeDxfClasses();

    this.writeTables();

    this.writeBlocks();

    this.writeEntities();

    this.writeObjects();

    this.writeACDSData();

    this._writer.Write(DxfCode.Start, DxfFileToken.EndOfFile);

    this._writer.Flush();

    if (this.Configuration.CloseStream) {
      this._writer.Close();
    }
  }

  public override Dispose(): void {
    this._writer.Dispose();
  }

  public static WriteToStream(
    stream: DxfWriteTarget,
    document: CadDocument,
    binary: boolean = false,
    configuration?: DxfWriterConfiguration,
    notification?: NotificationEventHandler
  ): void {
    const writer = new DxfWriter(stream, document, binary);

    if (configuration) {
      writer.Configuration = configuration;
    }

    writer.OnNotification = notification ?? null;
    writer.Write();
    writer.Dispose();
  }

  private createStreamWriter(): void {
    if (this.IsBinary) {
      this._writer = new DxfBinaryWriter(this.createBinaryTarget());
    } else {
      this._writer = new DxfAsciiWriter(this.createTextTarget());
    }

    this._writer.WriteOptional = this.Configuration.WriteOptionalValues;
  }

  private createTextTarget(): DxfTextOutput {
    if (this._stream instanceof Uint8Array) {
      return new Uint8ArrayTextOutput(this._stream);
    }

    return this._stream as DxfTextOutput;
  }

  private createBinaryTarget(): DxfBinaryOutput {
    if (this._stream instanceof Uint8Array) {
      return new Uint8ArrayBinaryOutput(this._stream);
    }

    return this._stream as DxfBinaryOutput;
  }

  private writeHeader(): void {
    const writer = new DxfHeaderSectionWriter(this._writer, this._document, this._objectHolder, this.Configuration);
    writer.OnNotification = this.triggerNotification.bind(this);

    writer.Write();
  }

  private writeDxfClasses(): void {
    const writer = new DxfClassesSectionWriter(this._writer, this._document, this._objectHolder, this.Configuration);
    writer.OnNotification = this.triggerNotification.bind(this);

    writer.Write();
  }

  private writeTables(): void {
    const writer = new DxfTablesSectionWriter(this._writer, this._document, this._objectHolder, this.Configuration);
    writer.OnNotification = this.triggerNotification.bind(this);

    writer.Write();
  }

  private writeBlocks(): void {
    const writer = new DxfBlocksSectionWriter(this._writer, this._document, this._objectHolder, this.Configuration);
    writer.OnNotification = this.triggerNotification.bind(this);

    writer.Write();
  }

  private writeEntities(): void {
    const writer = new DxfEntitiesSectionWriter(this._writer, this._document, this._objectHolder, this.Configuration);
    writer.OnNotification = this.triggerNotification.bind(this);

    writer.Write();
  }

  private writeObjects(): void {
    const writer = new DxfObjectsSectionWriter(this._writer, this._document, this._objectHolder, this.Configuration);
    writer.OnNotification = this.triggerNotification.bind(this);

    writer.Write();
  }

  private writeACDSData(): void {
    // not implemented
  }

  protected createDefaultConfiguration(): DxfWriterConfiguration {
    return new DxfWriterConfiguration();
  }
}
