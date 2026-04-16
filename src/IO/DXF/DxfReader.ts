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
    this.configuration = new DxfReaderConfiguration();
  }

  public isBinary(): boolean {
    return DxfReader.isBinaryStream(this.fileStream);
  }

  public static isBinaryStream(stream: Uint8Array, resetPos: boolean = false): boolean {
    const sentinelBytes = DxfBinaryReader.sentinelBytes;
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

  public static readFromStream(stream: Uint8Array, notification?: NotificationEventHandler): CadDocument {
    const reader = new DxfReader(stream, notification);
    const doc = reader.read();
    reader.dispose();
    return doc;
  }

  public static readFromStreamWithConfig(
    stream: Uint8Array,
    configuration: DxfReaderConfiguration,
    notification?: NotificationEventHandler
  ): CadDocument {
    const reader = new DxfReader(stream, notification);
    reader.configuration = configuration;
    const doc = reader.read();
    reader.dispose();
    return doc;
  }

  public override read(): CadDocument {
    this._document = new CadDocument();
    this._document.summaryInfo = new CadSummaryInfo();

    this._reader = this._reader ?? this._getReader();

    this._builder = new DxfDocumentBuilder(this._version, this._document, this.configuration);
    this._builder.onNotification = this.onNotificationEvent.bind(this);

    while (this._reader.valueAsString !== DxfFileToken.endOfFile) {
      if (this._reader.valueAsString !== DxfFileToken.beginSection) {
        this._reader.readNext();
        continue;
      } else {
        this._reader.readNext();
      }

      switch (this._reader.valueAsString as string) {
        case DxfFileToken.headerSection:
          this._document.header = this.readHeader();
          this._document.header.document = this._document;
          this._builder.initialHandSeed = this._document.header.handleSeed;
          break;
        case DxfFileToken.classesSection:
          this._document.classes = this._readClasses();
          break;
        case DxfFileToken.tablesSection:
          this._readTablesSection();
          break;
        case DxfFileToken.blocksSection:
          this._readBlocks();
          break;
        case DxfFileToken.entitiesSection:
          this._readEntitiesSection();
          break;
        case DxfFileToken.objectsSection:
          this._readObjects();
          break;
        default:
          this.triggerNotification(`Section not implemented ${this._reader.valueAsString}`, NotificationType.NotImplemented);
          break;
      }

      this._reader.readNext();
    }

    if (this._document.header === null) {
      this._document.header = new CadHeader(this._document);
    }

    this._builder.buildDocument();

    return this._document;
  }

  public override readHeader(): CadHeader {
    this._reader = this._goToSection(DxfFileToken.headerSection);

    const header = new CadHeader();

    const headerMap: Map<string, CadSystemVariable> = CadHeader.getHeaderMap();

    this._reader.readNext();

    while (this._reader.valueAsString !== DxfFileToken.endSection) {
      const currVar = this._reader.valueAsString;

      if (currVar === null || currVar === undefined || !headerMap.has(currVar)) {
        this._reader.readNext();
        continue;
      }

      const data = headerMap.get(currVar)!;

      const parameters: unknown[] = new Array(data.dxfCodes.length);
      for (let i = 0; i < data.dxfCodes.length; i++) {
        this._reader.readNext();

        if (this._reader.dxfCode === DxfCode.CLShapeText) {
          const c = data.dxfCodes[i];
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

        parameters[i] = this._reader.value;
      }

      try {
        header.setValue(currVar, parameters);

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

      if (this._reader.dxfCode !== DxfCode.CLShapeText) {
        this._reader.readNext();
      }
    }

    return header;
  }

  public readTablesOnly(): CadDocument {
    this._reader = this._reader ?? this._getReader();

    this._builder = new DxfDocumentBuilder(this._version, this._document, this.configuration);
    this._builder.onNotification = this.onNotificationEvent.bind(this);

    this._readTablesSection();

    this._document.header = new CadHeader(this._document);

    this._builder.registerTables();

    this._builder.buildTables();

    return this._document;
  }

  public readTables(): CadDocument {
    return this.readTablesOnly();
  }

  public readEntitiesOnly(): Entity[] {
    this._reader = this._reader ?? this._getReader();

    this._builder = new DxfDocumentBuilder(this._version, this._document, this.configuration);
    this._builder.onNotification = this.onNotificationEvent.bind(this);

    this._readEntitiesSection();

    return this._builder.buildEntities();
  }

  public readEntities(): Entity[] {
    return this.readEntitiesOnly();
  }

  public getReader(): IDxfStreamReader {
    return this._getReader();
  }

  public override dispose(): void {
    super.dispose();

    if (this.configuration.clearCache) {
      DxfMap.clearCache();
    }
  }

  private _readClasses(): DxfClassCollection {
    this._reader = this._goToSection(DxfFileToken.classesSection);

    const classes = new DxfClassCollection();

    this._reader.readNext();
    while (this._reader.valueAsString !== DxfFileToken.endSection) {
      if (this._reader.valueAsString === DxfFileToken.classEntry) {
        const dxfClass = this._readClass();

        if (dxfClass.classNumber < 500) {
          dxfClass.classNumber = 500 + classes.count;
        }

        classes.addOrUpdate(dxfClass);
      } else {
        this._reader.readNext();
      }
    }

    return classes;
  }

  private _readClass(): DxfClass {
    const curr = new DxfClass();

    this._reader.readNext();
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code) {
        case 1:
          curr.dxfName = this._reader.valueAsString;
          break;
        case 2:
          curr.cppClassName = this._reader.valueAsString;
          break;
        case 3:
          curr.applicationName = this._reader.valueAsString;
          break;
        case 90:
          curr.proxyFlags = this._reader.valueAsInt as ProxyFlags;
          break;
        case 91:
          curr.instanceCount = this._reader.valueAsInt;
          break;
        case 280:
          curr.wasZombie = this._reader.valueAsBool;
          break;
        case 281:
          curr.isAnEntity = this._reader.valueAsBool;
          break;
        default:
          break;
      }

      this._reader.readNext();
    }

    return curr;
  }

  private _readTablesSection(): void {
    this._reader = this._goToSection(DxfFileToken.tablesSection);

    const reader = new DxfTablesSectionReader(this._reader, this._builder);

    reader.read();
  }

  private _readBlocks(): void {
    this._reader = this._goToSection(DxfFileToken.blocksSection);

    const reader = new DxfBlockSectionReader(this._reader, this._builder);

    reader.read();
  }

  private _readEntitiesSection(): void {
    this._reader = this._goToSection(DxfFileToken.entitiesSection);

    const reader = new DxfEntitiesSectionReader(this._reader, this._builder);

    reader.read();
  }

  private _readObjects(): void {
    this._reader = this._goToSection(DxfFileToken.objectsSection);

    const reader = new DxfObjectsSectionReader(this._reader, this._builder);

    reader.read();
  }

  private _getReader(): IDxfStreamReader {
    this._version = ACadVersion.Unknown;
    this._encoding = getDecoderEncodingLabel('ANSI_1252');

    const stream = this.fileStream;
    const isBinary = DxfReader.isBinaryStream(stream);
    let isAC1009Format = false;

    if (isBinary && stream.length > DxfBinaryReader.sentinelBytes.length) {
      const flag = stream[DxfBinaryReader.sentinelBytes.length];
      if (flag !== undefined && flag !== 0) {
        isAC1009Format = true;
      }
    }

    let tmpReader = this._createReader(isBinary, isAC1009Format);

    if (!tmpReader.find(DxfFileToken.headerSection)) {
      this.triggerNotification('Header section not found, using a generic reader.', NotificationType.Warning);

      this._version = ACadVersion.Unknown;
      tmpReader.start();
      return tmpReader;
    }

    while (tmpReader.valueAsString !== DxfFileToken.endSection) {
      if (tmpReader.valueAsString === '$ACADVER') {
        tmpReader.readNext();
        this._version = CadUtils.getVersionFromName(tmpReader.valueAsString);

        if (this._version < ACadVersion.AC1002) {
          if (this._version === ACadVersion.Unknown) {
            throw new CadNotSupportedException();
          } else {
            throw new CadNotSupportedException(this._version);
          }
        }
      } else if (tmpReader.valueAsString === '$DWGCODEPAGE') {
        tmpReader.readNext();
        this._encoding = getDecoderEncodingLabel(tmpReader.valueAsString);
        tmpReader.encoding = this._encoding;
      }

      tmpReader.readNext();
    }

    if (this._version === ACadVersion.Unknown) {
      this.triggerNotification('Dxf version not found, using a generic reader.', NotificationType.Warning);
    }

    return this._createReader(isBinary, isAC1009Format);
  }

  private _goToSection(sectionName: string): IDxfStreamReader {
    this._reader = this._reader ?? this._getReader();

    if (this._reader.valueAsString === sectionName) {
      return this._reader;
    }

    this._reader.find(sectionName);

    return this._reader;
  }

  private _createReader(isBinary: boolean, isAC1009Format: boolean): IDxfStreamReader {
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
