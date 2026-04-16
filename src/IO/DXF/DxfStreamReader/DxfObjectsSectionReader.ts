import { DxfSectionReaderBase } from './DxfSectionReaderBase.js';
import { IDxfStreamReader } from './IDxfStreamReader.js';
import { DxfDocumentBuilder } from '../DxfDocumentBuilder.js';
import { CadObject } from '../../../CadObject.js';
import { CadTemplate } from '../../Templates/CadTemplate.js';
import { CadNonGraphicalObjectTemplate } from '../../Templates/CadNonGraphicalObjectTemplate.js';
import { CadAnnotScaleObjectContextDataTemplate } from '../../Templates/CadAnnotScaleObjectContextDataTemplate.js';
import { CadDimensionAssociationTemplate } from '../../Templates/CadDimensionAssociationTemplate.js';
import { CadDictionaryTemplate } from '../../Templates/CadDictionaryTemplate.js';
import { CadDictionaryWithDefaultTemplate } from '../../Templates/CadDictionaryWithDefaultTemplate.js';
import { CadLayoutTemplate } from '../../Templates/CadLayoutTemplate.js';
import { CadEvaluationGraphTemplate } from '../../Templates/CadEvaluationGraphTemplate.js';
import { CadGroupTemplate } from '../../Templates/CadGroupTemplate.js';
import { CadGeoDataTemplate } from '../../Templates/CadGeoDataTemplate.js';
import { CadMaterialTemplate } from '../../Templates/CadMaterialTemplate.js';
import { CadTableContentTemplate } from '../../Templates/CadTableContentTemplate.js';
import { CadSpatialFilterTemplate } from '../../Templates/CadSpatialFilterTemplate.js';
import { CadMLineStyleTemplate } from '../../Templates/CadMLineStyleTemplate.js';
import { CadMLeaderStyleTemplate } from '../../Templates/CadMLeaderStyleTemplate.js';
import { CadTableStyleTemplate } from '../../Templates/CadTableStyleTemplate.js';
import { CadXRecordTemplate } from '../../Templates/CadXRecordTemplate.js';
import { CadBlockRepresentationDataTemplate } from '../../Templates/CadBlockRepresentationDataTemplate.js';
import { CadBlockGripExpressionTemplate } from '../../Templates/CadBlockGripExpressionTemplate.js';
import { CadBlockVisibilityGripTemplate } from '../../Templates/CadBlockVisibilityGripTemplate.js';
import { CadBlockVisibilityParameterTemplate } from '../../Templates/CadBlockVisibilityParameterTemplate.js';
import { CadBlockRotationParameterTemplate } from '../../Templates/CadBlockRotationParameterTemplate.js';
import { CadBlockRotationGripTemplate } from '../../Templates/CadBlockRotationGripTemplate.js';
import { CadBlockRotationActionTemplate } from '../../Templates/CadBlockRotationActionTemplate.js';
import { CadFieldTemplate } from '../../Templates/CadFieldTemplate.js';
import { CadFieldListTemplate } from '../../Templates/CadFieldListTemplate.js';
import { CadProxyObjectTemplate } from '../../Templates/CadProxyObjectTemplate.js';
import { CadSortensTableTemplate } from '../../Templates/CadSortensTableTemplate.js';
import { CadUnknownNonGraphicalObjectTemplate } from '../../Templates/CadUnknownEntityTemplate.js';
import { CadEvaluationExpressionTemplate } from '../../Templates/CadEvaluationExpressionTemplate.js';
import { CadBlockElementTemplate } from '../../Templates/CadBlockElementTemplate.js';
import { CadBlockActionTemplate } from '../../Templates/CadBlockActionTemplate.js';
import { CadBlockActionBasePtTemplate } from '../../Templates/CadBlockActionBasePtTemplate.js';
import { CadBlockParameterTemplate } from '../../Templates/CadBlockParameterTemplate.js';
import { CadBlock1PtParameterTemplate } from '../../Templates/CadBlock1PtParameterTemplate.js';
import { CadBlock2PtParameterTemplate } from '../../Templates/CadBlock2PtParameterTemplate.js';
import { CadBlockGripTemplate } from '../../Templates/CadBlockGripTemplate.js';
import { CadTableEntityTemplate , CadCellStyleTemplate, CadTableCellContentFormatTemplate, CadTableCellContentTemplate} from '../../Templates/CadTableEntityTemplate.js';
import { BlockReferenceObjectContextData } from '../../../Objects/BlockReferenceObjectContextData.js';
import { MTextAttributeObjectContextData } from '../../../Objects/MTextAttributeObjectContextData.js';
import { AcdbPlaceHolder } from '../../../Objects/AcdbPlaceHolder.js';
import { BookColor } from '../../../Objects/BookColor.js';
import { DimensionAssociation , OsnapPointRef} from '../../../Objects/DimensionAssociation.js';
import { AssociativityFlags } from '../../../Objects/AssociativityFlags.js';
import { ObjectOsnapType } from '../../../Objects/ObjectOsnapType.js';
import { SubentType } from '../../../Objects/SubentType.js';
import { CadDictionary } from '../../../Objects/CadDictionary.js';
import { DictionaryCloningFlags } from '../../../Objects/DictionaryCloningFlags.js';
import { CadDictionaryWithDefault } from '../../../Objects/CadDictionaryWithDefault.js';
import { Layout } from '../../../Objects/Layout.js';
import { PlotSettings } from '../../../Objects/PlotSettings.js';
import { EvaluationGraph } from '../../../Objects/Evaluations/EvaluationGraph.js';
import { ImageDefinition } from '../../../Objects/ImageDefinition.js';
import { DictionaryVariable } from '../../../Objects/DictionaryVariable.js';
import { PdfUnderlayDefinition } from '../../../Objects/PdfUnderlayDefinition.js';
import { SortEntitiesTable } from '../../../Objects/SortEntitiesTable.js';
import { ImageDefinitionReactor } from '../../../Objects/ImageDefinitionReactor.js';
import { ProxyObject } from '../../../Objects/ProxyObject.js';
import { RasterVariables } from '../../../Objects/RasterVariables.js';
import { Group } from '../../../Objects/Group.js';
import { GeoData , GeoMeshPoint, GeoMeshFace} from '../../../Objects/GeoData.js';
import { GeoDataVersion } from '../../../Objects/GeoDataVersion.js';
import { Material } from '../../../Objects/Material.js';
import { Scale } from '../../../Objects/Scale.js';
import { TableContent } from '../../../Objects/TableContent.js';
import { LinkedData } from '../../../Objects/LinkedData.js';
import { FormattedTableData } from '../../../Objects/FormattedTableData.js';
import { VisualStyle } from '../../../Objects/VisualStyle.js';
import { SpatialFilter } from '../../../Objects/SpatialFilter.js';
import { MLineStyle , MLineStyleElement} from '../../../Objects/MLineStyle.js';
import { MultiLeaderStyle } from '../../../Objects/MultiLeaderStyle.js';
import { TableStyle } from '../../../Objects/TableStyle.js';
import { XRecord } from '../../../Objects/XRecrod.js';
import { BlockRepresentationData } from '../../../Objects/BlockRepresentationData.js';
import { BlockGripExpression } from '../../../Objects/Evaluations/BlockGripExpression.js';
import { BlockVisibilityGrip } from '../../../Objects/Evaluations/BlockVisibilityGrip.js';
import { BlockVisibilityParameter , BlockVisibilityState} from '../../../Objects/Evaluations/BlockVisibilityParameter.js';
import { BlockRotationParameter } from '../../../Objects/Evaluations/BlockRotationParameter.js';
import { BlockRotationGrip } from '../../../Objects/Evaluations/BlockRotationGrip.js';
import { BlockRotationAction } from '../../../Objects/Evaluations/BlockRotationAction.js';
import { Field } from '../../../Objects/Field.js';
import { FieldList } from '../../../Objects/FieldList.js';
import { UnknownNonGraphicalObject } from '../../../Objects/UnknownNonGraphicalObject.js';
import { TableEntity , CellRange, TableEntityColumn, TableEntityRow, TableEntityCell, CellContent, ContentFormat, CellStyle, CellBorder, CellEdgeFlags, CellAlignmentType, CellStyleType, CellStyleClass} from '../../../Entities/TableEntity.js';
import { CadValue } from '../../../CadValue.js';
import { Color } from '../../../Color.js';
import { LineWeightType } from '../../../Types/LineWeightType.js';
import { ACadVersion } from '../../../ACadVersion.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../../DxfSubclassMarker.js';
import { DxfMap } from '../../../DxfMap.js';
import { DxfClassMap } from '../../../DxfClassMap.js';
import { GroupCodeValueType } from '../../../GroupCodeValue.js';
import { NotificationType } from '../../NotificationEventHandler.js';
import { Matrix4 } from '../../../Math/Matrix4.js';
import { XY } from '../../../Math/XY.js';
import { XYZ } from '../../../Math/XYZ.js';

export type ReadObjectDelegate = (template: CadTemplate, map: DxfMap) => boolean;

export class DxfObjectsSectionReader extends DxfSectionReaderBase {

  constructor(reader: IDxfStreamReader, builder: DxfDocumentBuilder) {
    super(reader, builder);
  }

  public read(): void {
    this._reader.readNext();

    while (this._reader.valueAsString !== DxfFileToken.endSection) {
      let template: CadTemplate | null = null;

      try {
        template = this._readObject();
      } catch (ex: unknown) {
        if (!this._builder.configuration.failsafe) {
          throw ex;
        }

        this._builder.notify(`Error while reading an object at line ${this._reader.position}`, NotificationType.Error, ex instanceof Error ? ex : null);

        while (this._reader.dxfCode !== DxfCode.Start) {
          this._reader.readNext();
        }
      }

      if (template === null) {
        continue;
      }

      this._builder.addTemplate(template);
    }
  }

  private _readObject(): CadTemplate | null {
    this.currentSubclass = '';
    switch (this._reader.valueAsString as string) {
      case DxfFileToken.blkRefObjectContextData:
        return this.readObjectCodes(new CadAnnotScaleObjectContextDataTemplate(new BlockReferenceObjectContextData()), this._readAnnotScaleObjectContextData.bind(this), BlockReferenceObjectContextData);
      case DxfFileToken.mTextAttributeObjectContextData:
        return this.readObjectCodes(new CadAnnotScaleObjectContextDataTemplate(new MTextAttributeObjectContextData()), this._readAnnotScaleObjectContextData.bind(this), MTextAttributeObjectContextData);
      case DxfFileToken.objectPlaceholder:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new AcdbPlaceHolder()), this._readObjectSubclassMap.bind(this), AcdbPlaceHolder);
      case DxfFileToken.objectDBColor:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new BookColor()), this._readBookColor.bind(this), BookColor);
      case DxfFileToken.objectDimensionAssociation:
        return this.readObjectCodes(new CadDimensionAssociationTemplate(), this._readDimensionAssociation.bind(this), DimensionAssociation);
      case DxfFileToken.objectDictionary:
        return this.readObjectCodes(new CadDictionaryTemplate(), this._readDictionary.bind(this), CadDictionary);
      case DxfFileToken.objectDictionaryWithDefault:
        return this.readObjectCodes(new CadDictionaryWithDefaultTemplate(), this._readDictionaryWithDefault.bind(this), CadDictionaryWithDefault);
      case DxfFileToken.objectLayout:
        return this.readObjectCodes(new CadLayoutTemplate(), this._readLayout.bind(this), Layout);
      case DxfFileToken.objectPlotSettings:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new PlotSettings()), this._readPlotSettings.bind(this), PlotSettings);
      case DxfFileToken.objectEvalGraph:
        return this.readObjectCodes(new CadEvaluationGraphTemplate(), this._readEvaluationGraph.bind(this), EvaluationGraph);
      case DxfFileToken.objectImageDefinition:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new ImageDefinition()), this._readObjectSubclassMap.bind(this), ImageDefinition);
      case DxfFileToken.objectDictionaryVar:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new DictionaryVariable()), this._readObjectSubclassMap.bind(this), DictionaryVariable);
      case DxfFileToken.objectPdfDefinition:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new PdfUnderlayDefinition()), this._readObjectSubclassMap.bind(this), PdfUnderlayDefinition);
      case DxfFileToken.objectSortEntsTable:
        return this._readSortentsTable();
      case DxfFileToken.objectImageDefinitionReactor:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new ImageDefinitionReactor()), this._readObjectSubclassMap.bind(this), ImageDefinitionReactor);
      case DxfFileToken.objectProxyObject:
        return this.readObjectCodes(new CadProxyObjectTemplate(), this._readProxyObject.bind(this), ProxyObject);
      case DxfFileToken.objectRasterVariables:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new RasterVariables()), this._readObjectSubclassMap.bind(this), RasterVariables);
      case DxfFileToken.objectGroup:
        return this.readObjectCodes(new CadGroupTemplate(), this._readGroup.bind(this), Group);
      case DxfFileToken.objectGeoData:
        return this.readObjectCodes(new CadGeoDataTemplate(), this._readGeoData.bind(this), GeoData);
      case DxfFileToken.objectMaterial:
        return this.readObjectCodes(new CadMaterialTemplate(), this._readMaterial.bind(this), Material);
      case DxfFileToken.objectScale:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new Scale()), this._readScale.bind(this), Scale);
      case DxfFileToken.objectTableContent:
        return this.readObjectCodes(new CadTableContentTemplate(), this._readTableContent.bind(this), TableContent);
      case DxfFileToken.objectVisualStyle:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new VisualStyle()), this._readVisualStyle.bind(this), VisualStyle);
      case DxfFileToken.objectSpatialFilter:
        return this.readObjectCodes(new CadSpatialFilterTemplate(), this._readSpatialFilter.bind(this), SpatialFilter);
      case DxfFileToken.objectMLineStyle:
        return this.readObjectCodes(new CadMLineStyleTemplate(), this._readMLineStyle.bind(this), MLineStyle);
      case DxfFileToken.objectMLeaderStyle:
        return this.readObjectCodes(new CadMLeaderStyleTemplate(), this._readMLeaderStyle.bind(this), MultiLeaderStyle);
      case DxfFileToken.objectTableStyle:
        return this.readObjectCodes(new CadTableStyleTemplate(), this._readTableStyle.bind(this), TableStyle);
      case DxfFileToken.objectXRecord:
        return this.readObjectCodes(new CadXRecordTemplate(), this._readXRecord.bind(this), XRecord);
      case DxfFileToken.objectBlockRepresentationData:
        return this.readObjectCodes(new CadBlockRepresentationDataTemplate(), this._readBlockRepresentationData.bind(this), BlockRepresentationData);
      case DxfFileToken.objectBlockGripLocationComponent:
        return this.readObjectCodes(new CadBlockGripExpressionTemplate(), this._readBlockGripExpression.bind(this), BlockGripExpression);
      case DxfFileToken.objectBlockVisibilityGrip:
        return this.readObjectCodes(new CadBlockVisibilityGripTemplate(), this._readBlockVisibilityGrip.bind(this), BlockVisibilityGrip);
      case DxfFileToken.objectBlockVisibilityParameter:
        return this.readObjectCodes(new CadBlockVisibilityParameterTemplate(), this._readBlockVisibilityParameter.bind(this), BlockVisibilityParameter);
      case DxfFileToken.objectBlockRotationParameter:
        return this.readObjectCodes(new CadBlockRotationParameterTemplate(), this._readBlockRotationParameter.bind(this), BlockRotationParameter);
      case DxfFileToken.objectBlockRotationGrip:
        return this.readObjectCodes(new CadBlockRotationGripTemplate(), this._readBlockRotationGrip.bind(this), BlockRotationGrip);
      case DxfFileToken.objectBlockRotateAction:
        return this.readObjectCodes(new CadBlockRotationActionTemplate(), this._readBlockRotationAction.bind(this), BlockRotationAction);
      case DxfFileToken.objectField:
        return this.readObjectCodes(new CadFieldTemplate(new Field()), this._readField.bind(this), Field);
      case DxfFileToken.objectFieldList:
        return this.readObjectCodes(new CadFieldListTemplate(new FieldList()), this._readFieldList.bind(this), FieldList);
      default: {
        const map = DxfMap.create(CadObject);
        let unknownEntityTemplate: CadUnknownNonGraphicalObjectTemplate | null = null;
        const dxfClass = this._builder.documentToBuild.classes.tryGetByName(this._reader.valueAsString);
        if (dxfClass) {
          this._builder.notify(`NonGraphicalObject not supported read as an UnknownNonGraphicalObject: ${this._reader.valueAsString}`, NotificationType.NotImplemented);
          unknownEntityTemplate = new CadUnknownNonGraphicalObjectTemplate(new UnknownNonGraphicalObject(dxfClass));
        } else {
          this._builder.notify(`UnknownNonGraphicalObject not supported: ${this._reader.valueAsString}`, NotificationType.NotImplemented);
        }

        this._reader.readNext();

        do {
          if (unknownEntityTemplate !== null && this._builder.keepUnknownEntities) {
            const isExtendedData = { value: false };
            this.readCommonCodes(unknownEntityTemplate, isExtendedData, map);
            if (isExtendedData.value) {
              continue;
            }
          }
          this._reader.readNext();
        } while (this._reader.dxfCode !== DxfCode.Start);

        return unknownEntityTemplate;
      }
    }
  }

  protected readObjectCodes(template: CadTemplate, readObject: ReadObjectDelegate, objectType: Function): CadTemplate {
    this._reader.readNext();

    const commonData = this.readCommonObjectData() as {
      name: string | null;
      handle: number;
      ownerHandle: number | null;
      xdictHandle: number | null;
      reactors: Set<number>;
    };
    template.cadObject.handle = commonData.handle;
    template.ownerHandle = commonData.ownerHandle;
    template.xDictHandle = commonData.xdictHandle;
    template.reactorsHandles = commonData.reactors;
    const namedObject = template.cadObject as unknown as { name?: string };
    if (commonData.name && 'name' in namedObject) {
      namedObject.name = commonData.name;
    }

    const map = DxfMap.create(typeof objectType === 'string' ? objectType : objectType.name);

    while (this._reader.dxfCode !== DxfCode.Start) {
      if (!readObject(template, map)) {
        const isExtendedData = { value: false };
        this.readCommonCodes(template, isExtendedData, map);
        if (isExtendedData.value) {
          continue;
        }
      }

      if (this.lockPointer) {
        this.lockPointer = false;
        continue;
      }

      if (this._reader.code !== DxfCode.Start) {
        this._reader.readNext();
      }
    }

    return template;
  }

  private _readFieldList(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadFieldListTemplate;

    switch (this._reader.code as number) {
      case 100:
        if (this._reader.valueAsString === DxfSubclassMarker.idSet) {
          this.currentSubclass = this._reader.valueAsString;
          return true;
        }
        return false;
      case 90:
        if (this.currentSubclass === DxfSubclassMarker.idSet) {
          return true;
        }
        return false;
      case 330:
        if (this.currentSubclass === DxfSubclassMarker.idSet) {
          tmp.ownedObjectsHandlers.add(this._reader.valueAsHandle);
          return true;
        }
        return false;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.fieldList)!);
    }
  }

  private _readField(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadFieldTemplate;

    switch (this._reader.code as number) {
      case 3:
        tmp.cadObject.fieldCode += this._reader.valueAsString;
        return true;
      case 98:
        return true;
      case 6: {
        const key = this._reader.valueAsString;
        const t = this.readCadValue(new CadValue());
        tmp.cadObject.values.set(key, t.cadValue);
        tmp.cadValueTemplates.push(t);
        return true;
      }
      case 7: {
        const t = this.readCadValue(new CadValue());
        tmp.cadObject.value = t.cadValue;
        tmp.cadValueTemplates.push(t);
        return true;
      }
      case 331:
        tmp.cadObjectsHandles.push(this._reader.valueAsHandle);
        return true;
      case 360:
        tmp.childrenHandles.push(this._reader.valueAsHandle);
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.field)!);
    }
  }

  private _readProxyObject(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadProxyObjectTemplate;
    const proxy = template.cadObject as ProxyObject;

    switch (this._reader.code as number) {
      case 90:
      case 94:
      case 97:
      case 71:
        return true;
      case 95: {
        const format = this._reader.valueAsInt;
        proxy.version = (format & 0xFFFF) as ACadVersion;
        proxy.maintenanceVersion = (format >> 16);
        return true;
      }
      case 91: {
        const classId = this._reader.valueAsShort;
        const dxfClass = this._builder.documentToBuild.classes.tryGetByClassNumber(classId);
        if (dxfClass.found && dxfClass.result) {
          proxy.dxfClass = dxfClass.result;
        }
        return true;
      }
      case 161:
      case 162:
        return true;
      case 310:
        if (proxy.binaryData === null) {
          proxy.binaryData = new Uint8Array(0);
        }
        proxy.binaryData = this._appendBinaryChunk(proxy.binaryData, this._reader.valueAsBinaryChunk);
        return true;
      case 311:
        if (proxy.data === null) {
          proxy.data = new Uint8Array(0);
        }
        proxy.data = this._appendBinaryChunk(proxy.data, this._reader.valueAsBinaryChunk);
        return true;
      case 330:
      case 340:
      case 350:
      case 360:
        tmp.entries.push(this._reader.valueAsHandle);
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.proxyObject)!);
    }
  }

  private _readObjectSubclassMap(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      default:
        if (!this.currentSubclass) {
          return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(template.cadObject.subclassMarker)!);
        } else {
          return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(this.currentSubclass)!);
        }
    }
  }

  private _readAnnotScaleObjectContextData(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadAnnotScaleObjectContextDataTemplate;
    switch (this._reader.code as number) {
      case 340:
        tmp.scaleHandle = this._reader.valueAsHandle;
        return true;
      default:
        if (!this.currentSubclass) {
          return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(template.cadObject.subclassMarker)!);
        } else {
          return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(this.currentSubclass)!);
        }
    }
  }

  private _readPlotSettings(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.plotSettings)!);
    }
  }

  private _readEvaluationGraph(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadEvaluationGraphTemplate;
    const evGraph = tmp.cadObject as EvaluationGraph;

    switch (this._reader.code as number) {
      case 91:
        while (this._reader.code === 91) {
          const nodeTemplate = new CadEvaluationGraphTemplate.GraphNodeTemplate();
          const node = nodeTemplate.node;

          node.index = this._reader.valueAsInt;

          this._reader.expectedCode(93);
          node.flags = this._reader.valueAsInt;

          this._reader.expectedCode(95);
          node.nextNodeIndex = this._reader.valueAsInt;

          this._reader.expectedCode(360);
          nodeTemplate.expressionHandle = this._reader.valueAsHandle;

          this._reader.expectedCode(92);
          node.data1 = this._reader.valueAsInt;
          this._reader.expectedCode(92);
          node.data2 = this._reader.valueAsInt;
          this._reader.expectedCode(92);
          node.data3 = this._reader.valueAsInt;
          this._reader.expectedCode(92);
          node.data4 = this._reader.valueAsInt;

          this._reader.readNext();

          tmp.nodeTemplates.push(nodeTemplate);
        }

        this.lockPointer = true;
        return true;
      case 92:
        while (this._reader.code === 92) {
          this._reader.expectedCode(93);
          this._reader.expectedCode(94);
          this._reader.expectedCode(91);
          this._reader.expectedCode(91);
          this._reader.expectedCode(92);
          this._reader.expectedCode(92);
          this._reader.expectedCode(92);
          this._reader.expectedCode(92);
          this._reader.expectedCode(92);

          this._reader.readNext();
        }

        this.lockPointer = true;
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.evalGraph)!);
    }
  }

  private _readLayout(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadLayoutTemplate;

    switch (this._reader.code as number) {
      case 330:
        if (template.ownerHandle !== null) {
          tmp.paperSpaceBlockHandle = this._reader.valueAsHandle;
          return true;
        }
        return false;
      case 331:
        tmp.lasActiveViewportHandle = this._reader.valueAsHandle;
        return true;
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.layout)!)) {
          return this._readPlotSettings(template, map);
        }
        return true;
    }
  }

  private _readGroup(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadGroupTemplate;

    switch (this._reader.code as number) {
      case 70:
        return true;
      case 340:
        tmp.handles.add(this._reader.valueAsHandle);
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(template.cadObject.subclassMarker)!);
    }
  }

  private _readGeoData(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadGeoDataTemplate;

    switch (this._reader.code as number) {
      case 40:
        if (tmp.cadObject.version === GeoDataVersion.R2009) {
          tmp.cadObject.referencePoint = new XYZ(
            tmp.cadObject.referencePoint.x,
            this._reader.valueAsDouble,
            tmp.cadObject.referencePoint.z
          );
          return true;
        }
        return false;
      case 41:
        if (tmp.cadObject.version === GeoDataVersion.R2009) {
          tmp.cadObject.referencePoint = new XYZ(
            this._reader.valueAsDouble,
            tmp.cadObject.referencePoint.y,
            tmp.cadObject.referencePoint.z
          );
          return true;
        }
        return false;
      case 42:
        if (tmp.cadObject.version === GeoDataVersion.R2009) {
          tmp.cadObject.referencePoint = new XYZ(
            tmp.cadObject.referencePoint.x,
            tmp.cadObject.referencePoint.y,
            this._reader.valueAsDouble
          );
          return true;
        }
        return false;
      case 46:
        if (tmp.cadObject.version === GeoDataVersion.R2009) {
          tmp.cadObject.horizontalUnitScale = this._reader.valueAsDouble;
          return true;
        }
        return false;
      case 52:
        if (tmp.cadObject.version === GeoDataVersion.R2009) {
          const angle = Math.PI / 2.0 - this._reader.valueAsAngle;
          tmp.cadObject.northDirection = new XY(Math.cos(angle), Math.sin(angle));
          return true;
        }
        return false;
      case 93: {
        const npts = this._reader.valueAsInt;
        for (let i = 0; i < npts; i++) {
          this._reader.readNext();
          const sourceX = this._reader.valueAsDouble;
          this._reader.readNext();
          const sourceY = this._reader.valueAsDouble;

          this._reader.readNext();
          const destX = this._reader.valueAsDouble;
          this._reader.readNext();
          const destY = this._reader.valueAsDouble;

          const point = new GeoMeshPoint();
          point.source = new XY(sourceX, sourceY);
          point.destination = new XY(destX, destY);
          tmp.cadObject.points.push(point);
        }
        return true;
      }
      case 96: {
        const nfaces = this._reader.valueAsInt;
        for (let i = 0; i < nfaces; i++) {
          this._reader.readNext();
          const index1 = this._reader.valueAsInt;
          this._reader.readNext();
          const index2 = this._reader.valueAsInt;
          this._reader.readNext();
          const index3 = this._reader.valueAsInt;

          const face = new GeoMeshFace();
          face.index1 = index1;
          face.index2 = index2;
          face.index3 = index3;
          tmp.cadObject.faces.push(face);
        }
        return true;
      }
      case 303:
        tmp.cadObject.coordinateSystemDefinition += this._reader.valueAsString;
        return true;
      case 3:
      case 4:
      case 14:
      case 24:
      case 15:
      case 25:
      case 43:
      case 44:
      case 45:
      case 94:
      case 293:
      case 16:
      case 26:
      case 17:
      case 27:
      case 54:
      case 140:
      case 304:
      case 292:
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker)!);
    }
  }

  private _readMaterial(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadMaterialTemplate;

    const readMatrix = (expectedCode: number, assignFn: (m: number[]) => void): boolean => {
      const arr: number[] = [];
      for (let i = 0; i < 16; i++) {
        arr.push(this._reader.valueAsDouble);
        this._reader.readNext();
      }
      assignFn(arr);
      return this.checkObjectEnd(template, map, this._readMaterial.bind(this));
    };

    switch (this._reader.code as number) {
      case 43:
        return readMatrix(43, m => tmp.cadObject.diffuseMatrix = m);
      case 47:
        return readMatrix(47, m => tmp.cadObject.specularMatrix = m);
      case 49:
        return readMatrix(49, m => tmp.cadObject.reflectionMatrix = m);
      case 142:
        return readMatrix(142, m => tmp.cadObject.opacityMatrix = m);
      case 144:
        return readMatrix(144, m => tmp.cadObject.bumpMatrix = m);
      case 147:
        return readMatrix(147, m => tmp.cadObject.refractionMatrix = m);
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker)!);
    }
  }

  private _readScale(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      case 70:
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.scale)!);
    }
  }

  private _readLinkedData(template: CadTemplate, map: DxfMap): void {
    const tmp = template as CadTableContentTemplate;
    const linkedData = tmp.cadObject as LinkedData;

    this._reader.readNext();

    while (this._reader.dxfCode !== DxfCode.Start && this._reader.dxfCode !== DxfCode.Subclass) {
      switch (this._reader.code as number) {
        default:
          if (!this.tryAssignCurrentValue(linkedData, map.subClasses.get(DxfSubclassMarker.linkedData)!)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readLinkedData ${this._reader.position}.`, NotificationType.None);
          }
          break;
      }

      this._reader.readNext();
    }
  }

  private _readTableContent(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      case 100:
        if (this._reader.valueAsString.toUpperCase() === DxfSubclassMarker.tableContent.toUpperCase()) {
          this._readTableContentSubclass(template, map);
          this.lockPointer = true;
          return true;
        }
        if (this._reader.valueAsString.toUpperCase() === DxfSubclassMarker.formattedTableData.toUpperCase()) {
          this._readFormattedTableDataSubclass(template, map);
          this.lockPointer = true;
          return true;
        }
        if (this._reader.valueAsString.toUpperCase() === DxfSubclassMarker.linkedTableData.toUpperCase()) {
          this._readLinkedTableDataSubclass(template, map);
          this.lockPointer = true;
          return true;
        }
        if (this._reader.valueAsString.toUpperCase() === DxfSubclassMarker.linkedData.toUpperCase()) {
          this._readLinkedData(template, map);
          this.lockPointer = true;
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  private _readTableContentSubclass(template: CadTemplate, map: DxfMap): void {
    const tmp = template as CadTableContentTemplate;
    const tableContent = tmp.cadObject as TableContent;

    this._reader.readNext();

    while (this._reader.dxfCode !== DxfCode.Start && this._reader.dxfCode !== DxfCode.Subclass) {
      switch (this._reader.code as number) {
        case 340:
          tmp.sytleHandle = this._reader.valueAsHandle;
          break;
        default:
          if (!this.tryAssignCurrentValue(tableContent, map.subClasses.get(DxfSubclassMarker.tableContent)!)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readTableContentSubclass ${this._reader.position}.`, NotificationType.None);
          }
          break;
      }

      this._reader.readNext();
    }
  }

  private _readFormattedTableDataSubclass(template: CadTemplate, map: DxfMap): void {
    const tmp = template as CadTableContentTemplate;
    const formattedTable = tmp.cadObject as FormattedTableData;

    this._reader.readNext();

    let cellRange: CellRange | null = null;
    while (this._reader.dxfCode !== DxfCode.Start && this._reader.dxfCode !== DxfCode.Subclass) {
      switch (this._reader.code as number) {
        case 90:
          break;
        case 91:
          if (cellRange === null) {
            cellRange = new CellRange();
            formattedTable.mergedCellRanges.push(cellRange);
          }
          cellRange.topRowIndex = this._reader.valueAsInt;
          break;
        case 92:
          if (cellRange === null) {
            cellRange = new CellRange();
            formattedTable.mergedCellRanges.push(cellRange);
          }
          cellRange.leftColumnIndex = this._reader.valueAsInt;
          break;
        case 93:
          if (cellRange === null) {
            cellRange = new CellRange();
            formattedTable.mergedCellRanges.push(cellRange);
          }
          cellRange.bottomRowIndex = this._reader.valueAsInt;
          break;
        case 94:
          if (cellRange === null) {
            cellRange = new CellRange();
            formattedTable.mergedCellRanges.push(cellRange);
          }
          cellRange.rightColumnIndex = this._reader.valueAsInt;
          cellRange = null;
          break;
        case 300:
          if (this._reader.valueAsString.toUpperCase() === 'TABLEFORMAT') {
            this._readStyleOverride(new CadCellStyleTemplate(formattedTable.cellStyleOverride));
          }
          break;
        default:
          if (!this.tryAssignCurrentValue(formattedTable, map.subClasses.get(DxfSubclassMarker.formattedTableData)!)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readFormattedTableDataSubclass ${this._reader.position}.`, NotificationType.None);
          }
          break;
      }

      this._reader.readNext();
    }
  }

  private _readLinkedTableDataSubclass(template: CadTemplate, map: DxfMap): void {
    const tmp = template as CadTableContentTemplate;
    const tableContent = tmp.cadObject as TableContent;

    this._reader.readNext();

    while (this._reader.dxfCode !== DxfCode.Start && this._reader.dxfCode !== DxfCode.Subclass) {
      switch (this._reader.code as number) {
        case 90:
        case 91:
        case 92:
          break;
        case 300:
          if (this._reader.valueAsString.toUpperCase() === DxfFileToken.objectTableColumn.toUpperCase()) {
            this._readTableColumn();
          }
          break;
        case 301:
          if (this._reader.valueAsString.toUpperCase() === DxfFileToken.objectTableRow.toUpperCase()) {
            this._readTableRow();
          }
          break;
        default:
          if (!this.tryAssignCurrentValue(tableContent, map.subClasses.get(DxfSubclassMarker.linkedTableData)!)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readLinkedTableDataSubclass ${this._reader.position}.`, NotificationType.None);
          }
          break;
      }

      this._reader.readNext();
    }
  }

  private _readTableColumn(): TableEntityColumn {
    this._reader.readNext();

    const column = new TableEntityColumn();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 1:
          if (this._reader.valueAsString.toUpperCase() === DxfFileToken.linkedTableDataColumn_BEGIN.toUpperCase()) {
            this._readLinkedTableColumn(column);
          } else if (this._reader.valueAsString.toUpperCase() === DxfFileToken.formattedTableDataColumn_BEGIN.toUpperCase()) {
            this._readFormattedTableColumn(column);
          } else if (this._reader.valueAsString.toUpperCase() === DxfFileToken.objectTableColumnBegin.toUpperCase()) {
            this._readTableColumnData(column);
            end = true;
          }
          break;
        default:
          this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readTableColumn method.`, NotificationType.None);
          break;
      }

      if (end) {
        return column;
      }

      this._reader.readNext();
    }

    return column;
  }

  private _readTableRow(): TableEntityRow {
    this._reader.readNext();

    const row = new TableEntityRow();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 1:
          if (this._reader.valueAsString.toUpperCase() === DxfFileToken.linkedTableDataRow_BEGIN.toUpperCase()) {
            this._readLinkedTableRow(row);
          } else if (this._reader.valueAsString.toUpperCase() === DxfFileToken.formattedTableDataRow_BEGIN.toUpperCase()) {
            this._readFormattedTableRow(row);
          } else if (this._reader.valueAsString.toUpperCase() === DxfFileToken.objectTableRowBegin.toUpperCase()) {
            this._readTableRowData(row);
            end = true;
          }
          break;
        default:
          this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readTableRow method.`, NotificationType.None);
          break;
      }

      if (end) {
        return row;
      }

      this._reader.readNext();
    }

    return row;
  }

  private _readTableRowData(row: TableEntityRow): void {
    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 40:
          row.height = this._reader.valueAsDouble;
          break;
        case 90:
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'TABLEROW_END';
          break;
        default:
          this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readTableRowData method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readFormattedTableRow(row: TableEntityRow): void {
    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 300:
          break;
        case 1:
          if (this._reader.valueAsString.toUpperCase() === 'TABLEFORMAT_BEGIN') {
            this._readStyleOverride(new CadCellStyleTemplate(row.cellStyleOverride));
          }
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'FORMATTEDTABLEDATAROW_END';
          break;
        default:
          this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readFormattedTableRow method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readTableColumnData(column: TableEntityColumn): void {
    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 1:
          if (this._reader.valueAsString.toUpperCase() === 'TABLECOLUMN_BEGIN') {
            break;
          }
          end = true;
          break;
        case 40:
          column.width = this._reader.valueAsDouble;
          break;
        case 90:
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'TABLECOLUMN_END';
          break;
        default:
          this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readTableColumnData method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readLinkedTableColumn(column: TableEntityColumn): void {
    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 1:
          if (this._reader.valueAsString.toUpperCase() === DxfFileToken.linkedTableDataColumn_BEGIN.toUpperCase()) {
            break;
          }
          end = true;
          break;
        case 91:
          column.customData = this._reader.valueAsInt;
          break;
        case 300:
          column.name = this._reader.valueAsString;
          break;
        case 301:
          if (this._reader.valueAsString.toUpperCase() === DxfFileToken.customData.toUpperCase()) {
            this._readCustomData();
          }
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === DxfFileToken.linkedTableDataColumn_END.toUpperCase();
          break;
        default:
          this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readLinkedTableColumn method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readLinkedTableRow(row: TableEntityRow): void {
    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 1:
          if (this._reader.valueAsString.toUpperCase() === DxfFileToken.linkedTableDataRow_BEGIN.toUpperCase()) {
            break;
          }
          break;
        case 90:
          break;
        case 91:
          row.customData = this._reader.valueAsInt;
          break;
        case 300:
          if (this._reader.valueAsString.toUpperCase() === DxfFileToken.objectCell.toUpperCase()) {
            this._readCell();
          }
          break;
        case 301:
          if (this._reader.valueAsString.toUpperCase() === DxfFileToken.customData.toUpperCase()) {
            this._readCustomData();
          }
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === DxfFileToken.linkedTableDataRow_END.toUpperCase();
          break;
        default:
          this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readLinkedTableRow method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readCell(): TableEntityCell {
    this._reader.readNext();

    const cell = new TableEntityCell();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 1:
          if (this._reader.valueAsString.toUpperCase() === 'LINKEDTABLEDATACELL_BEGIN') {
            this._readLinkedTableCell(cell);
          } else if (this._reader.valueAsString.toUpperCase() === 'FORMATTEDTABLEDATACELL_BEGIN') {
            this._readFormattedTableCell(cell);
          } else if (this._reader.valueAsString.toUpperCase() === 'TABLECELL_BEGIN') {
            this._readTableCellData(cell);
            end = true;
          }
          break;
        default:
          this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readCell method.`, NotificationType.None);
          break;
      }

      if (end) {
        return cell;
      }

      this._reader.readNext();
    }

    return cell;
  }

  private _readTableCellData(cell: TableEntityCell): void {
    const map = DxfClassMap.create(cell.constructor, 'TABLECELL_BEGIN');

    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 40:
        case 41:
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'TABLECELL_END';
          break;
        case 330:
          break;
        default:
          if (!this.tryAssignCurrentValue(cell, map)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readTableCellData ${this._reader.position}.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readFormattedTableCell(cell: TableEntityCell): void {
    const map = DxfClassMap.create(cell.constructor, 'FORMATTEDTABLEDATACELL_BEGIN');

    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 300:
          if (this._reader.valueAsString.toUpperCase() === 'CELLTABLEFORMAT') {
            this._readCellTableFormat(cell);
            continue;
          }
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'FORMATTEDTABLEDATACELL_END';
          break;
        default:
          if (!this.tryAssignCurrentValue(cell, map)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readFormattedTableCell ${this._reader.position}.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readCellTableFormat(cell: TableEntityCell): void {
    const map = DxfClassMap.create(cell.constructor, 'CELLTABLEFORMAT');

    this._reader.readNext();

    let end = false;
    while (this._reader.code === 1) {
      if (this._reader.valueAsString.toUpperCase() === 'TABLEFORMAT_BEGIN') {
        this._readStyleOverride(new CadCellStyleTemplate(cell.styleOverride));
      } else if (this._reader.valueAsString.toUpperCase() === 'CELLSTYLE_BEGIN') {
        this._readCellStyle(new CadCellStyleTemplate());
      } else {
        if (!this.tryAssignCurrentValue(cell, map)) {
          this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readCellTableFormat ${this._reader.position}.`, NotificationType.None);
        }
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readCellStyle(template: CadCellStyleTemplate): void {
    this._reader.readNext();

    let end = false;
    while (this._reader.code !== 1) {
      switch (this._reader.code as number) {
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'CELLSTYLE_END';
          break;
        default:
          this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readCellStyle ${this._reader.position}.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readLinkedTableCell(cell: TableEntityCell): void {
    const map = DxfClassMap.create(cell.constructor, 'LINKEDTABLEDATACELL_BEGIN');

    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 95:
          break;
        case 301:
          if (this._reader.valueAsString.toUpperCase() === DxfFileToken.customData.toUpperCase()) {
            this._readCustomData();
          }
          break;
        case 302:
          if (this._reader.valueAsString.toUpperCase() === 'CONTENT') {
            this._readLinkedTableCellContent();
          }
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'LINKEDTABLEDATACELL_END';
          break;
        default:
          if (!this.tryAssignCurrentValue(cell, map)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readLinkedTableCell ${this._reader.position}.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readLinkedTableCellContent(): CadTableCellContentTemplate {
    const content = new CellContent();
    const template = new CadTableCellContentTemplate(content);
    const map = DxfClassMap.create(content.constructor, 'CONTENT');

    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 1:
          if (this._reader.valueAsString.toUpperCase() === 'FORMATTEDCELLCONTENT_BEGIN') {
            this._readFormattedCellContent();
            end = true;
          } else if (this._reader.valueAsString.toUpperCase() === 'CELLCONTENT_BEGIN') {
            this._readCellContent(template);
          }
          break;
        default:
          if (!this.tryAssignCurrentValue(content, map)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readLinkedTableCellContent ${this._reader.position}.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }

    return template;
  }

  private _readCellContent(template: CadTableCellContentTemplate): void {
    const content = template.content;
    const map = DxfClassMap.create(content.constructor, 'CELLCONTENT_BEGIN');

    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 91:
          break;
        case 300:
          if (this._reader.valueAsString.toUpperCase() === 'VALUE') {
            const valueTemplate = this.readCadValue(content.cadValue);
            template.cadValueTemplate = valueTemplate;
          }
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'CELLCONTENT_END';
          break;
        case 340:
          template.blockRecordHandle = this._reader.valueAsHandle;
          break;
        default:
          if (!this.tryAssignCurrentValue(content, map)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readCellContent ${this._reader.position}.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readFormattedCellContent(): void {
    const format = new ContentFormat();
    const template = new CadTableCellContentFormatTemplate(format);
    const map = DxfClassMap.create(format.constructor, 'FORMATTEDCELLCONTENT');

    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 300:
          if (this._reader.valueAsString.toUpperCase() === 'CONTENTFORMAT') {
            this._readContentFormat(template);
          }
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'FORMATTEDCELLCONTENT_END';
          break;
        default:
          if (!this.tryAssignCurrentValue(format, map)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readFormattedCellContent method.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readContentFormat(template: CadTableCellContentFormatTemplate): void {
    const format = template.format;
    const map = DxfClassMap.create(format.constructor, 'CONTENTFORMAT_BEGIN');

    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 1:
          if (this._reader.valueAsString.toUpperCase() === 'CONTENTFORMAT_BEGIN') {
            break;
          }
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'CONTENTFORMAT_END';
          break;
        case 340:
          template.textStyleHandle = this._reader.valueAsHandle;
          break;
        default:
          if (!this.tryAssignCurrentValue(format, map)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readContentFormat method.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readFormattedTableColumn(column: TableEntityColumn): void {
    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 300:
          break;
        case 1:
          if (this._reader.valueAsString.toUpperCase() === 'TABLEFORMAT_BEGIN') {
            this._readStyleOverride(new CadCellStyleTemplate(column.cellStyleOverride));
          }
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === DxfFileToken.formattedTableDataColumn_END.toUpperCase();
          break;
        default:
          this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readFormattedTableColumn method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readStyleOverride(template: CadCellStyleTemplate): void {
    const style = template.format as CellStyle;
    const mapstyle = DxfClassMap.create(style.constructor, 'TABLEFORMAT_STYLE');
    const mapformat = DxfClassMap.create(ContentFormat, 'TABLEFORMAT_BEGIN');

    this._reader.readNext();

    let end = false;
    let currBorder: CellEdgeFlags = CellEdgeFlags.Unknown;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 95:
          currBorder = this._reader.valueAsInt as CellEdgeFlags;
          break;
        case 1:
          break;
        case 300:
          if (this._reader.valueAsString.toUpperCase() === 'CONTENTFORMAT') {
            this._readContentFormat(new CadTableCellContentFormatTemplate(new ContentFormat()));
          }
          break;
        case 301:
          if (this._reader.valueAsString.toUpperCase() === 'MARGIN') {
            this._readCellMargin(template);
          }
          break;
        case 302:
          if (this._reader.valueAsString.toUpperCase() === 'GRIDFORMAT') {
            const border = new CellBorder(currBorder);
            this._readGridFormat(template, border);
          }
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'TABLEFORMAT_END';
          break;
        default:
          if (!this.tryAssignCurrentValue(style, mapstyle) && !this.tryAssignCurrentValue(style, mapformat)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readStyleOverride method.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readGridFormat(template: CadCellStyleTemplate, border: CellBorder): void {
    const map = DxfClassMap.create(border.constructor, 'CellBorder');

    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 1:
          break;
        case 62:
          border.color = new Color(this._reader.valueAsShort);
          break;
        case 92:
          border.lineWeight = this._reader.valueAsInt as LineWeightType;
          break;
        case 93:
          border.isInvisible = this._reader.valueAsBool;
          break;
        case 340:
          template.borderLinetypePairs.push([border, this._reader.valueAsHandle]);
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'GRIDFORMAT_END';
          break;
        default:
          if (!this.tryAssignCurrentValue(border, map)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readGridFormat method.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readCellMargin(template: CadCellStyleTemplate): void {
    const style = template.format as CellStyle;

    this._reader.readNext();

    let end = false;
    let i = 0;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 1:
          break;
        case 40:
          switch (i) {
            case 0: style.verticalMargin = this._reader.valueAsDouble; break;
            case 1: style.horizontalMargin = this._reader.valueAsDouble; break;
            case 2: style.bottomMargin = this._reader.valueAsDouble; break;
            case 3: style.rightMargin = this._reader.valueAsDouble; break;
            case 4: style.marginHorizontalSpacing = this._reader.valueAsDouble; break;
            case 5: style.marginVerticalSpacing = this._reader.valueAsDouble; break;
          }
          i++;
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'CELLMARGIN_END';
          break;
        default:
          this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readCellMargin method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readCustomData(): void {
    this._reader.readNext();

    let ndata = 0;
    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 1:
          break;
        case 90:
          ndata = this._reader.valueAsInt;
          break;
        case 300:
          break;
        case 301:
          if (this._reader.valueAsString.toUpperCase() === 'DATAMAP_VALUE') {
            this._readDataMapValue();
          }
          break;
        case 309:
          end = this._reader.valueAsString.toUpperCase() === 'DATAMAP_END';
          break;
        default:
          this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readCustomData method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readDataMapValue(): void {
    const value = new CadValue();
    const map = DxfClassMap.create(value.constructor, 'DATAMAP_VALUE');

    this._reader.readNext();

    let end = false;
    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 11:
        case 21:
        case 31:
        case 91:
        case 92:
        case 140:
        case 310:
          break;
        case 304:
          end = this._reader.valueAsString.toUpperCase() === 'ACVALUE_END';
          break;
        default:
          if (!this.tryAssignCurrentValue(value, map)) {
            this._builder.notify(`Unhandled dxf code ${this._reader.code} value ${this._reader.valueAsString} at readDataMapValue method.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.readNext();
    }
  }

  private _readVisualStyle(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      case 176:
      case 177:
      case 420:
        return true;
      default:
        return true;
    }
  }

  private _readSpatialFilter(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadSpatialFilterTemplate;
    const filter = tmp.cadObject as SpatialFilter;

    switch (this._reader.code as number) {
      case 10:
        filter.boundaryPoints.push(new XY(this._reader.valueAsDouble, 0));
        return true;
      case 20: {
        const pt = filter.boundaryPoints[filter.boundaryPoints.length - 1];
        filter.boundaryPoints.push(new XY(pt.x, this._reader.valueAsDouble));
        return true;
      }
      case 40: {
        if (filter.clipFrontPlane && !tmp.hasFrontPlane) {
          filter.frontDistance = this._reader.valueAsDouble;
          tmp.hasFrontPlane = true;
        }

        const array: number[] = [
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 1
        ];

        for (let i = 0; i < 12; i++) {
          array[i] = this._reader.valueAsDouble;
          if (i < 11) {
            this._reader.readNext();
          }
        }

        if (tmp.insertTransformRead) {
          filter.insertTransform = new Matrix4(array);
          tmp.insertTransformRead = true;
        } else {
          filter.inverseInsertTransform = new Matrix4(array);
        }

        return true;
      }
      case 73:
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.spatialFilter)!);
    }
  }

  private _readMLineStyle(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadMLineStyleTemplate;
    const mLineStyle = template.cadObject as MLineStyle;

    switch (this._reader.code as number) {
      case 6: {
        const t = tmp.elementTemplates[tmp.elementTemplates.length - 1];
        if (!t) {
          return true;
        }
        t.lineTypeName = this._reader.valueAsString;
        return true;
      }
      case 49: {
        const element = new MLineStyleElement();
        const elementTemplate = new CadMLineStyleTemplate.ElementTemplate(element);
        element.offset = this._reader.valueAsDouble;

        tmp.elementTemplates.push(elementTemplate);
        mLineStyle.addElement(element);
        return true;
      }
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker)!);
    }
  }

  private _readTableStyle(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadTableStyleTemplate;
    const style = tmp.cadObject as TableStyle;
    const cellStyle = tmp.currentCellStyleTemplate?.cellStyle ?? null;

    switch (this._reader.code as number) {
      case 7:
        tmp.createCurrentCellStyleTemplate();
        tmp.currentCellStyleTemplate!.textStyleName = this._reader.valueAsString;
        return true;
      case 94:
        if (cellStyle) cellStyle.alignment = this._reader.valueAsInt;
        return true;
      case 62:
        if (cellStyle) cellStyle.color = new Color(this._reader.valueAsShort);
        return true;
      case 63:
        if (cellStyle) cellStyle.backgroundColor = new Color(this._reader.valueAsShort);
        return true;
      case 140:
        if (cellStyle) cellStyle.textHeight = this._reader.valueAsDouble;
        return true;
      case 170:
        if (cellStyle) cellStyle.cellAlignment = this._reader.valueAsShort as CellAlignmentType;
        return true;
      case 283:
        if (cellStyle) cellStyle.isFillColorOn = this._reader.valueAsBool;
        return true;
      case 90:
        if (cellStyle) cellStyle.cellStyleType = this._reader.valueAsShort as CellStyleType;
        return true;
      case 91:
        if (cellStyle) cellStyle.styleClass = this._reader.valueAsShort as CellStyleClass;
        return true;
      case 1:
        return true;
      case 274:
        if (cellStyle) cellStyle.topBorder.lineWeight = this._reader.valueAsInt as LineWeightType;
        return true;
      case 275:
        if (cellStyle) cellStyle.horizontalInsideBorder.lineWeight = this._reader.valueAsInt as LineWeightType;
        return true;
      case 276:
        if (cellStyle) cellStyle.bottomBorder.lineWeight = this._reader.valueAsInt as LineWeightType;
        return true;
      case 277:
        if (cellStyle) cellStyle.leftBorder.lineWeight = this._reader.valueAsInt as LineWeightType;
        return true;
      case 278:
        if (cellStyle) cellStyle.verticalInsideBorder.lineWeight = this._reader.valueAsInt as LineWeightType;
        return true;
      case 279:
        if (cellStyle) cellStyle.rightBorder.lineWeight = this._reader.valueAsInt as LineWeightType;
        return true;
      case 284:
        if (cellStyle) cellStyle.topBorder.isInvisible = this._reader.valueAsBool;
        return true;
      case 285:
        if (cellStyle) cellStyle.horizontalInsideBorder.isInvisible = this._reader.valueAsBool;
        return true;
      case 286:
        if (cellStyle) cellStyle.bottomBorder.isInvisible = this._reader.valueAsBool;
        return true;
      case 287:
        if (cellStyle) cellStyle.leftBorder.isInvisible = this._reader.valueAsBool;
        return true;
      case 288:
        if (cellStyle) cellStyle.verticalInsideBorder.isInvisible = this._reader.valueAsBool;
        return true;
      case 289:
        if (cellStyle) cellStyle.rightBorder.isInvisible = this._reader.valueAsBool;
        return true;
      case 64:
        if (cellStyle) cellStyle.topBorder.color = new Color(this._reader.valueAsShort);
        return true;
      case 65:
        if (cellStyle) cellStyle.horizontalInsideBorder.color = new Color(this._reader.valueAsShort);
        return true;
      case 66:
        if (cellStyle) cellStyle.bottomBorder.color = new Color(this._reader.valueAsShort);
        return true;
      case 67:
        if (cellStyle) cellStyle.leftBorder.color = new Color(this._reader.valueAsShort);
        return true;
      case 68:
        if (cellStyle) cellStyle.verticalInsideBorder.color = new Color(this._reader.valueAsShort);
        return true;
      case 69:
        if (cellStyle) cellStyle.rightBorder.color = new Color(this._reader.valueAsShort);
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker)!);
    }
  }

  private _readMLeaderStyle(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadMLeaderStyleTemplate;

    switch (this._reader.code as number) {
      case 179:
        return true;
      case 340:
        tmp.leaderLineTypeHandle = this._reader.valueAsHandle;
        return true;
      case 342:
        tmp.mTextStyleHandle = this._reader.valueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker)!);
    }
  }

  private _readEvaluationExpression(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadEvaluationExpressionTemplate;

    switch (this._reader.code as number) {
      case 1:
        this._reader.expectedCode(70);
        this._reader.expectedCode(140);
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.evalGraphExpr)!);
    }
  }

  private _readBlockElement(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.blockElement)!)) {
          return this._readEvaluationExpression(template, map);
        }
        return true;
    }
  }

  private _readBlockAction(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.blockAction)!)) {
          return this._readBlockElement(template, map);
        }
        return true;
    }
  }

  private _readBlockActionBasePt(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.blockActionBasePt)!)) {
          return this._readBlockAction(template, map);
        }
        return true;
    }
  }

  private _readBlockRotationAction(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.blockRotationAction)!)) {
          return this._readBlockActionBasePt(template, map);
        }
        return true;
    }
  }

  private _readBlockParameter(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.blockParameter)!)) {
          return this._readBlockElement(template, map);
        }
        return true;
    }
  }

  private _readBlock1PtParameter(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.block1PtParameter)!)) {
          return this._readBlockParameter(template, map);
        }
        return true;
    }
  }

  private _readBlock2PtParameter(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      case 91:
        return true;
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map)) {
          return this._readBlockParameter(template, map);
        }
        return true;
    }
  }

  private _readBlockVisibilityParameter(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadBlockVisibilityParameterTemplate;

    switch (this._reader.code as number) {
      case 92: {
        const stateCount = this._reader.valueAsInt;
        for (let i = 0; i < stateCount; i++) {
          this._reader.readNext();
          tmp.stateTemplates.push(this._readState());
        }
        return true;
      }
      case 93:
        if (this.currentSubclass === DxfSubclassMarker.blockVisibilityParameter) {
          const entityCount = this._reader.valueAsInt;
          for (let i = 0; i < entityCount; i++) {
            this._reader.readNext();
            tmp.entityHandles.push(this._reader.valueAsHandle);
          }
          return true;
        }
        return false;
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.blockVisibilityParameter)!)) {
          return this._readBlock1PtParameter(template, map);
        }
        return true;
    }
  }

  private _readBlockRotationParameter(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map)) {
          return this._readBlock2PtParameter(template, map);
        }
        return true;
    }
  }

  private _readState(): CadBlockVisibilityParameterTemplate.StateTemplate {
    const state = new BlockVisibilityState();
    const template = new CadBlockVisibilityParameterTemplate.StateTemplate(state);

    const expectedCodes: number[] = [303, 94, 95];

    while (this._reader.dxfCode !== DxfCode.Start) {
      const idx = expectedCodes.indexOf(this._reader.code);
      if (idx >= 0) {
        expectedCodes.splice(idx, 1);
      }

      switch (this._reader.code as number) {
        case 303:
          state.name = this._reader.valueAsString;
          break;
        case 94: {
          const count = this._reader.valueAsInt;
          for (let i = 0; i < count; i++) {
            this._reader.readNext();
            template.entityHandles.add(this._reader.valueAsHandle);
          }
          break;
        }
        case 95: {
          const count = this._reader.valueAsInt;
          for (let i = 0; i < count; i++) {
            this._reader.readNext();
            template.expressionHandles.add(this._reader.valueAsHandle);
          }
          break;
        }
        default:
          return template;
      }

      if (expectedCodes.length === 0) {
        break;
      }

      this._reader.readNext();
    }

    return template;
  }

  private _readBlockGrip(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.blockGrip)!)) {
          return this._readBlockElement(template, map);
        }
        return true;
    }
  }

  private _readBlockRotationGrip(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.blockRotationGrip)!)) {
          return this._readBlockGrip(template, map);
        }
        return true;
    }
  }

  private _readBlockVisibilityGrip(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.blockVisibilityGrip)!)) {
          return this._readBlockGrip(template, map);
        }
        return true;
    }
  }

  private _readBlockRepresentationData(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadBlockRepresentationDataTemplate;

    switch (this._reader.code as number) {
      case 340:
        tmp.blockHandle = this._reader.valueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker)!);
    }
  }

  private _readBlockGripExpression(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.blockGripExpression)!)) {
          return this._readEvaluationExpression(template, map);
        }
        return true;
    }
  }

  private _readXRecord(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadXRecordTemplate;

    switch (this._reader.code as number) {
      case 100:
        if (this._reader.valueAsString === DxfSubclassMarker.xRecord) {
          this._readXRecordEntries(tmp);
          return true;
        }
        return false;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.xRecord)!);
    }
  }

  private _readXRecordEntries(template: CadXRecordTemplate): void {
    const xRecord = template.cadObject as XRecord;
    this._reader.readNext();

    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.groupCodeValue) {
        case GroupCodeValueType.Point3D: {
          const code = this._reader.code;
          const x = this._reader.valueAsDouble;
          this._reader.readNext();
          const y = this._reader.valueAsDouble;
          this._reader.readNext();
          const z = this._reader.valueAsDouble;
          const pt = new XYZ(x, y, z);
          xRecord.createEntry(code, pt);
          break;
        }
        case GroupCodeValueType.Handle:
        case GroupCodeValueType.ObjectId:
        case GroupCodeValueType.ExtendedDataHandle:
          template.addHandleReference(this._reader.code, this._reader.valueAsHandle);
          break;
        default:
          xRecord.createEntry(this._reader.code, this._reader.value);
          break;
      }

      this._reader.readNext();
    }
  }

  private _readBookColor(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadNonGraphicalObjectTemplate;
    const color = tmp.cadObject as BookColor;

    switch (this._reader.code as number) {
      case 430:
        color.name = this._reader.valueAsString;
        return true;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.dbColor)!);
    }
  }

  private _readDimensionAssociation(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadDimensionAssociationTemplate;
    const dimassoc = tmp.cadObject as DimensionAssociation;

    switch (this._reader.code as number) {
      case 1:
        if (this._reader.valueAsString === DimensionAssociation.osnapPointRefClassName) {
          if ((dimassoc.associativityFlags & AssociativityFlags.FirstPointReference) !== 0
            && dimassoc.firstPointRef === null) {
            dimassoc.firstPointRef = new OsnapPointRef();
            this._readOsnapPointRef(dimassoc.firstPointRef);
            this.lockPointer = true;
            return true;
          }

          if ((dimassoc.associativityFlags & AssociativityFlags.SecondPointReference) !== 0
            && dimassoc.secondPointRef === null) {
            dimassoc.secondPointRef = new OsnapPointRef();
            this._readOsnapPointRef(dimassoc.secondPointRef);
            this.lockPointer = true;
            return true;
          }

          if ((dimassoc.associativityFlags & AssociativityFlags.ThirdPointReference) !== 0
            && dimassoc.thirdPointRef === null) {
            dimassoc.thirdPointRef = new OsnapPointRef();
            this._readOsnapPointRef(dimassoc.thirdPointRef);
            this.lockPointer = true;
            return true;
          }

          if ((dimassoc.associativityFlags & AssociativityFlags.FourthPointReference) !== 0
            && dimassoc.fourthPointRef === null) {
            dimassoc.fourthPointRef = new OsnapPointRef();
            this._readOsnapPointRef(dimassoc.fourthPointRef);
            this.lockPointer = true;
            return true;
          }

          return true;
        }
        return false;
      case 330:
        if (template.ownerHandle !== null) {
          tmp.dimensionHandle = this._reader.valueAsHandle;
          return true;
        }
        return false;
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(tmp.cadObject.subclassMarker)!);
    }
  }

  private _readOsnapPointRef(osnapPoint: OsnapPointRef): CadDimensionAssociationTemplate.OsnapPointRefTemplate {
    const template = new CadDimensionAssociationTemplate.OsnapPointRefTemplate(osnapPoint);

    this._reader.readNext();

    let end = false;
    while (!end) {
      switch (this._reader.code as number) {
        case 10:
          osnapPoint.osnapPoint = new XYZ(this._reader.valueAsDouble, osnapPoint.osnapPoint.y, osnapPoint.osnapPoint.z);
          break;
        case 20:
          osnapPoint.osnapPoint = new XYZ(osnapPoint.osnapPoint.x, this._reader.valueAsDouble, osnapPoint.osnapPoint.z);
          break;
        case 30:
          osnapPoint.osnapPoint = new XYZ(osnapPoint.osnapPoint.x, osnapPoint.osnapPoint.y, this._reader.valueAsDouble);
          break;
        case 40:
          osnapPoint.geometryParameter = this._reader.valueAsDouble;
          break;
        case 72:
          osnapPoint.objectOsnapType = this._reader.valueAsShort as ObjectOsnapType;
          break;
        case 73:
          osnapPoint.subentType = this._reader.valueAsShort as SubentType;
          break;
        case 74:
          osnapPoint.intersectionSubType = this._reader.valueAsShort as SubentType;
          break;
        case 75:
          osnapPoint.hasLastPointRef = this._reader.valueAsBool;
          break;
        case 91:
          osnapPoint.gsMarker = this._reader.valueAsInt;
          break;
        case 92:
          osnapPoint.intersectionGsMarker = this._reader.valueAsInt;
          break;
        case 331:
          template.objectHandle = this._reader.valueAsHandle;
          break;
        case 302:
        case 332:
          break;
        default:
          end = true;
          continue;
      }

      this._reader.readNext();
    }

    return template;
  }

  private _readDictionary(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadDictionaryTemplate;
    const cadDictionary = tmp.cadObject as CadDictionary;

    switch (this._reader.code as number) {
      case 280:
        cadDictionary.hardOwnerFlag = this._reader.valueAsBool;
        return true;
      case 281:
        cadDictionary.clonningFlags = this._reader.value as DictionaryCloningFlags;
        return true;
      case 3:
        tmp.entries.set(this._reader.valueAsString, null);
        return true;
      case 350:
      case 360: {
        const keys = Array.from(tmp.entries.keys());
        const lastKey = keys[keys.length - 1];
        tmp.entries.set(lastKey, this._reader.valueAsHandle);
        return true;
      }
      default:
        return this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.dictionary)!);
    }
  }

  private _readDictionaryWithDefault(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadDictionaryWithDefaultTemplate;

    switch (this._reader.code as number) {
      case 340:
        tmp.defaultEntryHandle = this._reader.valueAsHandle;
        return true;
      default:
        if (!this.tryAssignCurrentValue(template.cadObject, map.subClasses.get(DxfSubclassMarker.dictionaryWithDefault)!)) {
          return this._readDictionary(template, map);
        }
        return true;
    }
  }

  private _readSortentsTable(): CadTemplate {
    const sortTable = new SortEntitiesTable();
    const template = new CadSortensTableTemplate(sortTable);

    this._reader.readNext();

    this.readCommonObjectData(template);

    // Debug.Assert(DxfSubclassMarker.SortentsTable == this._reader.ValueAsString);

    this._reader.readNext();

    let pair: { item1: number | null, item2: number | null } = { item1: null, item2: null };

    while (this._reader.dxfCode !== DxfCode.Start) {
      switch (this._reader.code as number) {
        case 5:
          pair.item1 = this._reader.valueAsHandle;
          break;
        case 330:
          template.blockOwnerHandle = this._reader.valueAsHandle;
          break;
        case 331:
          pair.item2 = this._reader.valueAsHandle;
          break;
        default:
          this._builder.notify(`Group Code not handled ${this._reader.groupCodeValue} for SortEntitiesTable, code : ${this._reader.code} | value : ${this._reader.valueAsString}`);
          break;
      }

      if (pair.item1 !== null && pair.item2 !== null) {
        template.values.push([pair.item1, pair.item2]);
        pair = { item1: null, item2: null };
      }

      this._reader.readNext();
    }

    return template;
  }

  private _appendBinaryChunk(current: Uint8Array | null, chunk: Uint8Array): Uint8Array {
    if (current === null || current.length === 0) {
      return new Uint8Array(chunk);
    }

    const combined = new Uint8Array(current.length + chunk.length);
    combined.set(current, 0);
    combined.set(chunk, current.length);
    return combined;
  }
}
