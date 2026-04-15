import { CadReaderBase } from '../CadReaderBase.js';
import { DxfReaderConfiguration } from './DxfReaderConfiguration.js';
import { DxfDocumentBuilder } from './DxfDocumentBuilder.js';
import { IDxfStreamReader } from './DxfStreamReader/IDxfStreamReader.js';
import { DxfTextReader } from './DxfStreamReader/DxfTextReader.js';
import { DxfBinaryReader } from './DxfStreamReader/DxfBinaryReader.js';
import { DxfBinaryReaderAC1009 } from './DxfStreamReader/DxfBinaryReaderAC1009.js';
import { DxfTablesSectionReader } from './DxfStreamReader/DxfTablesSectionReader.js';
import { DxfBlockSectionReader } from './DxfStreamReader/DxfBlockSectionReader.js';
import { DxfEntitiesSectionReader } from './DxfStreamReader/DxfEntitiesSectionReader.js';
import { DxfObjectsSectionReader } from './DxfStreamReader/DxfObjectsSectionReader.js';
import { CadDocument } from '../../CadDocument.js';
import { CadSummaryInfo } from '../../CadSummaryInfo.js';
import { CadHeader } from '../../Header/CadHeader.js';
import { CadSystemVariable } from '../../CadSystemVariable.js';
import { CadUtils } from '../../CadUtils.js';
import { ACadVersion } from '../../ACadVersion.js';
import { DxfCode } from '../../DxfCode.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfMap } from '../../DxfMap.js';
import { DxfClassCollection } from '../../Classes/DxfClassCollection.js';
import { DxfClass } from '../../Classes/DxfClass.js';
import { ProxyFlags } from '../../Classes/ProxyFlags.js';
import { GroupCodeValue, GroupCodeValueType } from '../../GroupCodeValue.js';
import { Entity } from '../../Entities/Entity.js';
import { NotificationEventHandler, NotificationType } from '../NotificationEventHandler.js';
import { CadNotSupportedException } from '../../Exceptions/CadNotSupportedException.js';
import { getDecoderEncodingLabel } from '../TextEncoding.js';

export class DxfReader extends CadReaderBase<DxfReaderConfiguration> {
  private _version: ACadVersion = ACadVersion.Unknown;
  private _builder!: DxfDocumentBuilder;
  private _reader!: IDxfStreamReader;

  private get fileStream(): Uint8Array {
    return this._fileStream instanceof Uint8Array
      ? this._fileStream
      : new Uint8Array(this._fileStream);
  }

  public constructor(stream: Uint8Array, notification?: NotificationEventHandler) {
    super(stream, notification);
    this.Configuration = new DxfReaderConfiguration();
  }

  public IsBinary(): boolean {
    return DxfReader.IsBinaryStream(this.fileStream);
  }

  public static IsBinaryStream(stream: Uint8Array, resetPos: boolean = false): boolean {
    const sentinelBytes = DxfBinaryReader.SentinelBytes;
    if (stream.length < sentinelBytes.length) {
      return false;
    }

    for (let i = 0; i < sentinelBytes.length; i++) {
      if (stream[i] !== sentinelBytes[i]) {
        return false;
      }
    }

    return true;
  }

  public static ReadFromStream(stream: Uint8Array, notification?: NotificationEventHandler): CadDocument {
    const reader = new DxfReader(stream, notification);
    const doc = reader.Read();
    reader.Dispose();
    return doc;
  }

  public static ReadFromStreamWithConfig(
    stream: Uint8Array,
    configuration: DxfReaderConfiguration,
    notification?: NotificationEventHandler
  ): CadDocument {
    const reader = new DxfReader(stream, notification);
    reader.Configuration = configuration;
    const doc = reader.Read();
    reader.Dispose();
    return doc;
  }

  public override Read(): CadDocument {
    this._document = new CadDocument();
    this._document.summaryInfo = new CadSummaryInfo();

    this._reader = this._reader ?? this.getReader();

    this._builder = new DxfDocumentBuilder(this._version, this._document, this.Configuration);
    this._builder.OnNotification = this.onNotificationEvent.bind(this);

    while (this._reader.ValueAsString !== DxfFileToken.EndOfFile) {
      if (this._reader.ValueAsString !== DxfFileToken.BeginSection) {
        this._reader.ReadNext();
        continue;
      } else {
        this._reader.ReadNext();
      }

      switch (this._reader.ValueAsString as string) {
        case DxfFileToken.HeaderSection:
          this._document.header = this.ReadHeader();
          this._document.header.Document = this._document;
          this._builder.InitialHandSeed = this._document.header.HandleSeed;
          break;
        case DxfFileToken.ClassesSection:
          this._document.classes = this.readClasses();
          break;
        case DxfFileToken.TablesSection:
          this.readTables();
          break;
        case DxfFileToken.BlocksSection:
          this.readBlocks();
          break;
        case DxfFileToken.EntitiesSection:
          this.readEntities();
          break;
        case DxfFileToken.ObjectsSection:
          this.readObjects();
          break;
        default:
          this.triggerNotification(`Section not implemented ${this._reader.ValueAsString}`, NotificationType.NotImplemented);
          break;
      }

      this._reader.ReadNext();
    }

    if (this._document.header === null) {
      this._document.header = new CadHeader(this._document);
    }

    this._builder.BuildDocument();

    return this._document;
  }

  public override ReadHeader(): CadHeader {
    this._reader = this.goToSection(DxfFileToken.HeaderSection);

    const header = new CadHeader();

    const headerMap: Map<string, CadSystemVariable> = CadHeader.GetHeaderMap();

    this._reader.ReadNext();

    while (this._reader.ValueAsString !== DxfFileToken.EndSection) {
      const currVar = this._reader.ValueAsString;

      if (currVar === null || currVar === undefined || !headerMap.has(currVar)) {
        this._reader.ReadNext();
        continue;
      }

      const data = headerMap.get(currVar)!;

      const parameters: unknown[] = new Array(data.DxfCodes.length);
      for (let i = 0; i < data.DxfCodes.length; i++) {
        this._reader.ReadNext();

        if (this._reader.DxfCode === DxfCode.CLShapeText) {
          const c = data.DxfCodes[i];
          const g = GroupCodeValue.transformValue(c);
          switch (g) {
            case GroupCodeValueType.Bool:
              parameters[i] = false;
              break;
            case GroupCodeValueType.Byte:
            case GroupCodeValueType.Int16:
            case GroupCodeValueType.Int32:
            case GroupCodeValueType.Int64:
            case GroupCodeValueType.Double:
            case GroupCodeValueType.Point3D:
              parameters[i] = 0;
              break;
            case GroupCodeValueType.None:
            case GroupCodeValueType.String:
            default:
              parameters[i] = undefined;
              break;
          }

          break;
        }

        parameters[i] = this._reader.Value;
      }

      try {
        header.SetValue(currVar, parameters);

        if (currVar === '$DWGCODEPAGE') {
          this._encoding = getDecoderEncodingLabel(header.codePage);
          this._reader.encoding = this._encoding;
        }
      } catch (ex) {
        this.triggerNotification(
          `Invalid value for header variable ${currVar} | ${parameters[0]}`,
          NotificationType.Warning,
          ex instanceof Error ? ex : undefined
        );
      }

      if (this._reader.DxfCode !== DxfCode.CLShapeText) {
        this._reader.ReadNext();
      }
    }

    return header;
  }

  public ReadTables(): CadDocument {
    this._reader = this._reader ?? this.getReader();

    this._builder = new DxfDocumentBuilder(this._version, this._document, this.Configuration);
    this._builder.OnNotification = this.onNotificationEvent.bind(this);

    this.readTables();

    this._document.header = new CadHeader(this._document);

    this._builder.RegisterTables();

    this._builder.BuildTables();

    return this._document;
  }

  public ReadEntities(): Entity[] {
    this._reader = this._reader ?? this.getReader();

    this._builder = new DxfDocumentBuilder(this._version, this._document, this.Configuration);
    this._builder.OnNotification = this.onNotificationEvent.bind(this);

    this.readEntities();

    return this._builder.BuildEntities();
  }

  public override Dispose(): void {
    super.Dispose();

    if (this.Configuration.ClearCache) {
      DxfMap.clearCache();
    }
  }

  private readClasses(): DxfClassCollection {
    this._reader = this.goToSection(DxfFileToken.ClassesSection);

    const classes = new DxfClassCollection();

    this._reader.ReadNext();
    while (this._reader.ValueAsString !== DxfFileToken.EndSection) {
      if (this._reader.ValueAsString === DxfFileToken.ClassEntry) {
        const dxfClass = this.readClass();

        if (dxfClass.classNumber < 500) {
          dxfClass.classNumber = 500 + classes.count;
        }

        classes.addOrUpdate(dxfClass);
      } else {
        this._reader.ReadNext();
      }
    }

    return classes;
  }

  private readClass(): DxfClass {
    const curr = new DxfClass();

    this._reader.ReadNext();
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code) {
        case 1:
          curr.dxfName = this._reader.ValueAsString;
          break;
        case 2:
          curr.cppClassName = this._reader.ValueAsString;
          break;
        case 3:
          curr.applicationName = this._reader.ValueAsString;
          break;
        case 90:
          curr.proxyFlags = this._reader.ValueAsInt as ProxyFlags;
          break;
        case 91:
          curr.instanceCount = this._reader.ValueAsInt;
          break;
        case 280:
          curr.wasZombie = this._reader.ValueAsBool;
          break;
        case 281:
          curr.isAnEntity = this._reader.ValueAsBool;
          break;
        default:
          break;
      }

      this._reader.ReadNext();
    }

    return curr;
  }

  private readTables(): void {
    this._reader = this.goToSection(DxfFileToken.TablesSection);

    const reader = new DxfTablesSectionReader(this._reader, this._builder);

    reader.Read();
  }

  private readBlocks(): void {
    this._reader = this.goToSection(DxfFileToken.BlocksSection);

    const reader = new DxfBlockSectionReader(this._reader, this._builder);

    reader.Read();
  }

  private readEntities(): void {
    this._reader = this.goToSection(DxfFileToken.EntitiesSection);

    const reader = new DxfEntitiesSectionReader(this._reader, this._builder);

    reader.Read();
  }

  private readObjects(): void {
    this._reader = this.goToSection(DxfFileToken.ObjectsSection);

    const reader = new DxfObjectsSectionReader(this._reader, this._builder);

    reader.Read();
  }

  private getReader(): IDxfStreamReader {
    this._version = ACadVersion.Unknown;
    this._encoding = getDecoderEncodingLabel('ANSI_1252');

    const stream = this.fileStream;
    const isBinary = DxfReader.IsBinaryStream(stream);
    let isAC1009Format = false;

    if (isBinary && stream.length > DxfBinaryReader.SentinelBytes.length) {
      const flag = stream[DxfBinaryReader.SentinelBytes.length];
      if (flag !== undefined && flag !== 0) {
        isAC1009Format = true;
      }
    }

    let tmpReader = this.createReader(isBinary, isAC1009Format);

    if (!tmpReader.Find(DxfFileToken.HeaderSection)) {
      this.triggerNotification('Header section not found, using a generic reader.', NotificationType.Warning);

      this._version = ACadVersion.Unknown;
      tmpReader.Start();
      return tmpReader;
    }

    while (tmpReader.ValueAsString !== DxfFileToken.EndSection) {
      if (tmpReader.ValueAsString === '$ACADVER') {
        tmpReader.ReadNext();
        this._version = CadUtils.getVersionFromName(tmpReader.ValueAsString);

        if (this._version < ACadVersion.AC1002) {
          if (this._version === ACadVersion.Unknown) {
            throw new CadNotSupportedException();
          } else {
            throw new CadNotSupportedException(this._version);
          }
        }
      } else if (tmpReader.ValueAsString === '$DWGCODEPAGE') {
        tmpReader.ReadNext();
        this._encoding = getDecoderEncodingLabel(tmpReader.ValueAsString);
        tmpReader.encoding = this._encoding;
      }

      tmpReader.ReadNext();
    }

    if (this._version === ACadVersion.Unknown) {
      this.triggerNotification('Dxf version not found, using a generic reader.', NotificationType.Warning);
    }

    return this.createReader(isBinary, isAC1009Format);
  }

  private goToSection(sectionName: string): IDxfStreamReader {
    this._reader = this._reader ?? this.getReader();

    if (this._reader.ValueAsString === sectionName) {
      return this._reader;
    }

    this._reader.Find(sectionName);

    return this._reader;
  }

  private createReader(isBinary: boolean, isAC1009Format: boolean): IDxfStreamReader {
    const stream = this.fileStream;
    let reader: IDxfStreamReader;

    if (isBinary) {
      if (isAC1009Format) {
        reader = new DxfBinaryReaderAC1009(stream);
      } else {
        reader = new DxfBinaryReader(stream);
      }
    } else {
      reader = new DxfTextReader(stream);
    }

    reader.encoding = this._encoding;
    return reader;
  }

  protected createDefaultConfiguration(): DxfReaderConfiguration { return new DxfReaderConfiguration(); }
}
