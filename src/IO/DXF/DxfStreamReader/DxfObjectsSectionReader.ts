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

  public Read(): void {
    this._reader.ReadNext();

    while (this._reader.ValueAsString !== DxfFileToken.EndSection) {
      let template: CadTemplate | null = null;

      try {
        template = this.readObject();
      } catch (ex: any) {
        if (!this._builder.Configuration.Failsafe) {
          throw ex;
        }

        this._builder.Notify(`Error while reading an object at line ${this._reader.Position}`, NotificationType.Error, ex);

        while (this._reader.DxfCode !== DxfCode.Start) {
          this._reader.ReadNext();
        }
      }

      if (template === null) {
        continue;
      }

      this._builder.AddTemplate(template);
    }
  }

  private readObject(): CadTemplate | null {
    this.currentSubclass = '';
    switch (this._reader.ValueAsString as string) {
      case DxfFileToken.BlkRefObjectContextData:
        return this.readObjectCodes(new CadAnnotScaleObjectContextDataTemplate(new BlockReferenceObjectContextData()), this.readAnnotScaleObjectContextData.bind(this), BlockReferenceObjectContextData);
      case DxfFileToken.MTextAttributeObjectContextData:
        return this.readObjectCodes(new CadAnnotScaleObjectContextDataTemplate(new MTextAttributeObjectContextData()), this.readAnnotScaleObjectContextData.bind(this), MTextAttributeObjectContextData);
      case DxfFileToken.ObjectPlaceholder:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new AcdbPlaceHolder()), this.readObjectSubclassMap.bind(this), AcdbPlaceHolder);
      case DxfFileToken.ObjectDBColor:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new BookColor()), this.readBookColor.bind(this), BookColor);
      case DxfFileToken.ObjectDimensionAssociation:
        return this.readObjectCodes(new CadDimensionAssociationTemplate(), this.readDimensionAssociation.bind(this), DimensionAssociation);
      case DxfFileToken.ObjectDictionary:
        return this.readObjectCodes(new CadDictionaryTemplate(), this.readDictionary.bind(this), CadDictionary);
      case DxfFileToken.ObjectDictionaryWithDefault:
        return this.readObjectCodes(new CadDictionaryWithDefaultTemplate(), this.readDictionaryWithDefault.bind(this), CadDictionaryWithDefault);
      case DxfFileToken.ObjectLayout:
        return this.readObjectCodes(new CadLayoutTemplate(), this.readLayout.bind(this), Layout);
      case DxfFileToken.ObjectPlotSettings:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new PlotSettings()), this.readPlotSettings.bind(this), PlotSettings);
      case DxfFileToken.ObjectEvalGraph:
        return this.readObjectCodes(new CadEvaluationGraphTemplate(), this.readEvaluationGraph.bind(this), EvaluationGraph);
      case DxfFileToken.ObjectImageDefinition:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new ImageDefinition()), this.readObjectSubclassMap.bind(this), ImageDefinition);
      case DxfFileToken.ObjectDictionaryVar:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new DictionaryVariable()), this.readObjectSubclassMap.bind(this), DictionaryVariable);
      case DxfFileToken.ObjectPdfDefinition:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new PdfUnderlayDefinition()), this.readObjectSubclassMap.bind(this), PdfUnderlayDefinition);
      case DxfFileToken.ObjectSortEntsTable:
        return this.readSortentsTable();
      case DxfFileToken.ObjectImageDefinitionReactor:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new ImageDefinitionReactor()), this.readObjectSubclassMap.bind(this), ImageDefinitionReactor);
      case DxfFileToken.ObjectProxyObject:
        return this.readObjectCodes(new CadProxyObjectTemplate(), this.readProxyObject.bind(this), ProxyObject);
      case DxfFileToken.ObjectRasterVariables:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new RasterVariables()), this.readObjectSubclassMap.bind(this), RasterVariables);
      case DxfFileToken.ObjectGroup:
        return this.readObjectCodes(new CadGroupTemplate(), this.readGroup.bind(this), Group);
      case DxfFileToken.ObjectGeoData:
        return this.readObjectCodes(new CadGeoDataTemplate(), this.readGeoData.bind(this), GeoData);
      case DxfFileToken.ObjectMaterial:
        return this.readObjectCodes(new CadMaterialTemplate(), this.readMaterial.bind(this), Material);
      case DxfFileToken.ObjectScale:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new Scale()), this.readScale.bind(this), Scale);
      case DxfFileToken.ObjectTableContent:
        return this.readObjectCodes(new CadTableContentTemplate(), this.readTableContent.bind(this), TableContent);
      case DxfFileToken.ObjectVisualStyle:
        return this.readObjectCodes(new CadNonGraphicalObjectTemplate(new VisualStyle()), this.readVisualStyle.bind(this), VisualStyle);
      case DxfFileToken.ObjectSpatialFilter:
        return this.readObjectCodes(new CadSpatialFilterTemplate(), this.readSpatialFilter.bind(this), SpatialFilter);
      case DxfFileToken.ObjectMLineStyle:
        return this.readObjectCodes(new CadMLineStyleTemplate(), this.readMLineStyle.bind(this), MLineStyle);
      case DxfFileToken.ObjectMLeaderStyle:
        return this.readObjectCodes(new CadMLeaderStyleTemplate(), this.readMLeaderStyle.bind(this), MultiLeaderStyle);
      case DxfFileToken.ObjectTableStyle:
        return this.readObjectCodes(new CadTableStyleTemplate(), this.readTableStyle.bind(this), TableStyle);
      case DxfFileToken.ObjectXRecord:
        return this.readObjectCodes(new CadXRecordTemplate(), this.readXRecord.bind(this), XRecord);
      case DxfFileToken.ObjectBlockRepresentationData:
        return this.readObjectCodes(new CadBlockRepresentationDataTemplate(), this.readBlockRepresentationData.bind(this), BlockRepresentationData);
      case DxfFileToken.ObjectBlockGripLocationComponent:
        return this.readObjectCodes(new CadBlockGripExpressionTemplate(), this.readBlockGripExpression.bind(this), BlockGripExpression);
      case DxfFileToken.ObjectBlockVisibilityGrip:
        return this.readObjectCodes(new CadBlockVisibilityGripTemplate(), this.readBlockVisibilityGrip.bind(this), BlockVisibilityGrip);
      case DxfFileToken.ObjectBlockVisibilityParameter:
        return this.readObjectCodes(new CadBlockVisibilityParameterTemplate(), this.readBlockVisibilityParameter.bind(this), BlockVisibilityParameter);
      case DxfFileToken.ObjectBlockRotationParameter:
        return this.readObjectCodes(new CadBlockRotationParameterTemplate(), this.readBlockRotationParameter.bind(this), BlockRotationParameter);
      case DxfFileToken.ObjectBlockRotationGrip:
        return this.readObjectCodes(new CadBlockRotationGripTemplate(), this.readBlockRotationGrip.bind(this), BlockRotationGrip);
      case DxfFileToken.ObjectBlockRotateAction:
        return this.readObjectCodes(new CadBlockRotationActionTemplate(), this.readBlockRotationAction.bind(this), BlockRotationAction);
      case DxfFileToken.ObjectField:
        return this.readObjectCodes(new CadFieldTemplate(new Field()), this.readField.bind(this), Field);
      case DxfFileToken.ObjectFieldList:
        return this.readObjectCodes(new CadFieldListTemplate(new FieldList()), this.readFieldList.bind(this), FieldList);
      default: {
        const map = DxfMap.create(CadObject);
        let unknownEntityTemplate: CadUnknownNonGraphicalObjectTemplate | null = null;
        const dxfClass = this._builder.DocumentToBuild.classes.tryGetByName(this._reader.ValueAsString);
        if (dxfClass) {
          this._builder.Notify(`NonGraphicalObject not supported read as an UnknownNonGraphicalObject: ${this._reader.ValueAsString}`, NotificationType.NotImplemented);
          unknownEntityTemplate = new CadUnknownNonGraphicalObjectTemplate(new UnknownNonGraphicalObject(dxfClass));
        } else {
          this._builder.Notify(`UnknownNonGraphicalObject not supported: ${this._reader.ValueAsString}`, NotificationType.NotImplemented);
        }

        this._reader.ReadNext();

        do {
          if (unknownEntityTemplate !== null && this._builder.KeepUnknownEntities) {
            const isExtendedData = { value: false };
            this.readCommonCodes(unknownEntityTemplate, isExtendedData, map);
            if (isExtendedData.value) {
              continue;
            }
          }
          this._reader.ReadNext();
        } while (this._reader.DxfCode !== DxfCode.Start);

        return unknownEntityTemplate;
      }
    }
  }

  protected readObjectCodes(template: CadTemplate, readObject: ReadObjectDelegate, objectType: Function): CadTemplate {
    this._reader.ReadNext();

    const map = DxfMap.create(typeof objectType === 'string' ? objectType : objectType.name);

    while (this._reader.DxfCode !== DxfCode.Start) {
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

      if (this._reader.Code !== DxfCode.Start) {
        this._reader.ReadNext();
      }
    }

    return template;
  }

  private readFieldList(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadFieldListTemplate;

    switch (this._reader.Code as number) {
      case 100:
        if (this._reader.ValueAsString === DxfSubclassMarker.IdSet) {
          this.currentSubclass = this._reader.ValueAsString;
          return true;
        }
        return false;
      case 90:
        if (this.currentSubclass === DxfSubclassMarker.IdSet) {
          return true;
        }
        return false;
      case 330:
        if (this.currentSubclass === DxfSubclassMarker.IdSet) {
          tmp.OwnedObjectsHandlers.add(this._reader.ValueAsHandle);
          return true;
        }
        return false;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.FieldList)!);
    }
  }

  private readField(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadFieldTemplate;

    switch (this._reader.Code as number) {
      case 3:
        tmp.CadObject.fieldCode += this._reader.ValueAsString;
        return true;
      case 98:
        return true;
      case 6: {
        const key = this._reader.ValueAsString;
        const t = this.readCadValue(new CadValue());
        tmp.CadObject.values.set(key, t.CadValue);
        tmp.CadValueTemplates.push(t);
        return true;
      }
      case 7: {
        const t = this.readCadValue(new CadValue());
        tmp.CadObject.value = t.CadValue;
        tmp.CadValueTemplates.push(t);
        return true;
      }
      case 331:
        tmp.CadObjectsHandles.push(this._reader.ValueAsHandle);
        return true;
      case 360:
        tmp.ChildrenHandles.push(this._reader.ValueAsHandle);
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.Field)!);
    }
  }

  private readProxyObject(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadProxyObjectTemplate;
    const proxy = template.CadObject as ProxyObject;

    switch (this._reader.Code as number) {
      case 90:
      case 94:
      case 97:
      case 71:
        return true;
      case 95: {
        const format = this._reader.ValueAsInt;
        proxy.version = (format & 0xFFFF) as ACadVersion;
        proxy.maintenanceVersion = (format >> 16);
        return true;
      }
      case 91: {
        const classId = this._reader.ValueAsShort;
        const dxfClass = this._builder.DocumentToBuild.classes.tryGetByClassNumber(classId);
        if (dxfClass) {
          proxy.dxfClass = dxfClass;
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
        proxy.binaryData = this.appendBinaryChunk(proxy.binaryData, this._reader.ValueAsBinaryChunk);
        return true;
      case 311:
        if (proxy.data === null) {
          proxy.data = new Uint8Array(0);
        }
        proxy.data = this.appendBinaryChunk(proxy.data, this._reader.ValueAsBinaryChunk);
        return true;
      case 330:
      case 340:
      case 350:
      case 360:
        tmp.Entries.push(this._reader.ValueAsHandle);
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.ProxyObject)!);
    }
  }

  private readObjectSubclassMap(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      default:
        if (!this.currentSubclass) {
          return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(template.CadObject.subclassMarker)!);
        } else {
          return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(this.currentSubclass)!);
        }
    }
  }

  private readAnnotScaleObjectContextData(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadAnnotScaleObjectContextDataTemplate;
    switch (this._reader.Code as number) {
      case 340:
        tmp.scaleHandle = this._reader.ValueAsHandle;
        return true;
      default:
        if (!this.currentSubclass) {
          return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(template.CadObject.subclassMarker)!);
        } else {
          return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(this.currentSubclass)!);
        }
    }
  }

  private readPlotSettings(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.PlotSettings)!);
    }
  }

  private readEvaluationGraph(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadEvaluationGraphTemplate;
    const evGraph = tmp.CadObject as EvaluationGraph;

    switch (this._reader.Code as number) {
      case 91:
        while (this._reader.Code === 91) {
          const nodeTemplate = new CadEvaluationGraphTemplate.GraphNodeTemplate();
          const node = nodeTemplate.Node;

          node.index = this._reader.ValueAsInt;

          this._reader.ExpectedCode(93);
          node.flags = this._reader.ValueAsInt;

          this._reader.ExpectedCode(95);
          node.nextNodeIndex = this._reader.ValueAsInt;

          this._reader.ExpectedCode(360);
          nodeTemplate.ExpressionHandle = this._reader.ValueAsHandle;

          this._reader.ExpectedCode(92);
          node.data1 = this._reader.ValueAsInt;
          this._reader.ExpectedCode(92);
          node.data2 = this._reader.ValueAsInt;
          this._reader.ExpectedCode(92);
          node.data3 = this._reader.ValueAsInt;
          this._reader.ExpectedCode(92);
          node.data4 = this._reader.ValueAsInt;

          this._reader.ReadNext();

          tmp.NodeTemplates.push(nodeTemplate);
        }

        this.lockPointer = true;
        return true;
      case 92:
        while (this._reader.Code === 92) {
          this._reader.ExpectedCode(93);
          this._reader.ExpectedCode(94);
          this._reader.ExpectedCode(91);
          this._reader.ExpectedCode(91);
          this._reader.ExpectedCode(92);
          this._reader.ExpectedCode(92);
          this._reader.ExpectedCode(92);
          this._reader.ExpectedCode(92);
          this._reader.ExpectedCode(92);

          this._reader.ReadNext();
        }

        this.lockPointer = true;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.EvalGraph)!);
    }
  }

  private readLayout(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadLayoutTemplate;

    switch (this._reader.Code as number) {
      case 330:
        if (template.OwnerHandle !== null) {
          tmp.PaperSpaceBlockHandle = this._reader.ValueAsHandle;
          return true;
        }
        return false;
      case 331:
        tmp.LasActiveViewportHandle = this._reader.ValueAsHandle;
        return true;
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.Layout)!)) {
          return this.readPlotSettings(template, map);
        }
        return true;
    }
  }

  private readGroup(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadGroupTemplate;

    switch (this._reader.Code as number) {
      case 70:
        return true;
      case 340:
        tmp.Handles.add(this._reader.ValueAsHandle);
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(template.CadObject.subclassMarker)!);
    }
  }

  private readGeoData(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadGeoDataTemplate;

    switch (this._reader.Code as number) {
      case 40:
        if (tmp.CadObject.version === GeoDataVersion.R2009) {
          tmp.CadObject.referencePoint = new XYZ(
            tmp.CadObject.referencePoint.x,
            this._reader.ValueAsDouble,
            tmp.CadObject.referencePoint.z
          );
          return true;
        }
        return false;
      case 41:
        if (tmp.CadObject.version === GeoDataVersion.R2009) {
          tmp.CadObject.referencePoint = new XYZ(
            this._reader.ValueAsDouble,
            tmp.CadObject.referencePoint.y,
            tmp.CadObject.referencePoint.z
          );
          return true;
        }
        return false;
      case 42:
        if (tmp.CadObject.version === GeoDataVersion.R2009) {
          tmp.CadObject.referencePoint = new XYZ(
            tmp.CadObject.referencePoint.x,
            tmp.CadObject.referencePoint.y,
            this._reader.ValueAsDouble
          );
          return true;
        }
        return false;
      case 46:
        if (tmp.CadObject.version === GeoDataVersion.R2009) {
          tmp.CadObject.horizontalUnitScale = this._reader.ValueAsDouble;
          return true;
        }
        return false;
      case 52:
        if (tmp.CadObject.version === GeoDataVersion.R2009) {
          const angle = Math.PI / 2.0 - this._reader.ValueAsAngle;
          tmp.CadObject.northDirection = new XY(Math.cos(angle), Math.sin(angle));
          return true;
        }
        return false;
      case 93: {
        const npts = this._reader.ValueAsInt;
        for (let i = 0; i < npts; i++) {
          this._reader.ReadNext();
          const sourceX = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          const sourceY = this._reader.ValueAsDouble;

          this._reader.ReadNext();
          const destX = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          const destY = this._reader.ValueAsDouble;

          const point = new GeoMeshPoint();
          point.source = new XY(sourceX, sourceY);
          point.destination = new XY(destX, destY);
          tmp.CadObject.points.push(point);
        }
        return true;
      }
      case 96: {
        const nfaces = this._reader.ValueAsInt;
        for (let i = 0; i < nfaces; i++) {
          this._reader.ReadNext();
          const index1 = this._reader.ValueAsInt;
          this._reader.ReadNext();
          const index2 = this._reader.ValueAsInt;
          this._reader.ReadNext();
          const index3 = this._reader.ValueAsInt;

          const face = new GeoMeshFace();
          face.index1 = index1;
          face.index2 = index2;
          face.index3 = index3;
          tmp.CadObject.faces.push(face);
        }
        return true;
      }
      case 303:
        tmp.CadObject.coordinateSystemDefinition += this._reader.ValueAsString;
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
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readMaterial(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadMaterialTemplate;

    const readMatrix = (expectedCode: number, assignFn: (m: number[]) => void): boolean => {
      const arr: number[] = [];
      for (let i = 0; i < 16; i++) {
        arr.push(this._reader.ValueAsDouble);
        this._reader.ReadNext();
      }
      assignFn(arr);
      return this.checkObjectEnd(template, map, this.readMaterial.bind(this));
    };

    switch (this._reader.Code as number) {
      case 43:
        return readMatrix(43, m => tmp.CadObject.diffuseMatrix = m);
      case 47:
        return readMatrix(47, m => tmp.CadObject.specularMatrix = m);
      case 49:
        return readMatrix(49, m => tmp.CadObject.reflectionMatrix = m);
      case 142:
        return readMatrix(142, m => tmp.CadObject.opacityMatrix = m);
      case 144:
        return readMatrix(144, m => tmp.CadObject.bumpMatrix = m);
      case 147:
        return readMatrix(147, m => tmp.CadObject.refractionMatrix = m);
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readScale(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      case 70:
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.Scale)!);
    }
  }

  private readLinkedData(template: CadTemplate, map: DxfMap): void {
    const tmp = template as CadTableContentTemplate;
    const linkedData = tmp.CadObject as LinkedData;

    this._reader.ReadNext();

    while (this._reader.DxfCode !== DxfCode.Start && this._reader.DxfCode !== DxfCode.Subclass) {
      switch (this._reader.Code as number) {
        default:
          if (!this.tryAssignCurrentValue(linkedData, map.subClasses.get(DxfSubclassMarker.LinkedData)!)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readLinkedData ${this._reader.Position}.`, NotificationType.None);
          }
          break;
      }

      this._reader.ReadNext();
    }
  }

  private readTableContent(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      case 100:
        if (this._reader.ValueAsString.toUpperCase() === DxfSubclassMarker.TableContent.toUpperCase()) {
          this.readTableContentSubclass(template, map);
          this.lockPointer = true;
          return true;
        }
        if (this._reader.ValueAsString.toUpperCase() === DxfSubclassMarker.FormattedTableData.toUpperCase()) {
          this.readFormattedTableDataSubclass(template, map);
          this.lockPointer = true;
          return true;
        }
        if (this._reader.ValueAsString.toUpperCase() === DxfSubclassMarker.LinkedTableData.toUpperCase()) {
          this.readLinkedTableDataSubclass(template, map);
          this.lockPointer = true;
          return true;
        }
        if (this._reader.ValueAsString.toUpperCase() === DxfSubclassMarker.LinkedData.toUpperCase()) {
          this.readLinkedData(template, map);
          this.lockPointer = true;
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  private readTableContentSubclass(template: CadTemplate, map: DxfMap): void {
    const tmp = template as CadTableContentTemplate;
    const tableContent = tmp.CadObject as TableContent;

    this._reader.ReadNext();

    while (this._reader.DxfCode !== DxfCode.Start && this._reader.DxfCode !== DxfCode.Subclass) {
      switch (this._reader.Code as number) {
        case 340:
          tmp.SytleHandle = this._reader.ValueAsHandle;
          break;
        default:
          if (!this.tryAssignCurrentValue(tableContent, map.subClasses.get(DxfSubclassMarker.TableContent)!)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readTableContentSubclass ${this._reader.Position}.`, NotificationType.None);
          }
          break;
      }

      this._reader.ReadNext();
    }
  }

  private readFormattedTableDataSubclass(template: CadTemplate, map: DxfMap): void {
    const tmp = template as CadTableContentTemplate;
    const formattedTable = tmp.CadObject as FormattedTableData;

    this._reader.ReadNext();

    let cellRange: CellRange | null = null;
    while (this._reader.DxfCode !== DxfCode.Start && this._reader.DxfCode !== DxfCode.Subclass) {
      switch (this._reader.Code as number) {
        case 90:
          break;
        case 91:
          if (cellRange === null) {
            cellRange = new CellRange();
            formattedTable.mergedCellRanges.push(cellRange);
          }
          cellRange.topRowIndex = this._reader.ValueAsInt;
          break;
        case 92:
          if (cellRange === null) {
            cellRange = new CellRange();
            formattedTable.mergedCellRanges.push(cellRange);
          }
          cellRange.leftColumnIndex = this._reader.ValueAsInt;
          break;
        case 93:
          if (cellRange === null) {
            cellRange = new CellRange();
            formattedTable.mergedCellRanges.push(cellRange);
          }
          cellRange.bottomRowIndex = this._reader.ValueAsInt;
          break;
        case 94:
          if (cellRange === null) {
            cellRange = new CellRange();
            formattedTable.mergedCellRanges.push(cellRange);
          }
          cellRange.rightColumnIndex = this._reader.ValueAsInt;
          cellRange = null;
          break;
        case 300:
          if (this._reader.ValueAsString.toUpperCase() === 'TABLEFORMAT') {
            this.readStyleOverride(new CadCellStyleTemplate(formattedTable.cellStyleOverride));
          }
          break;
        default:
          if (!this.tryAssignCurrentValue(formattedTable, map.subClasses.get(DxfSubclassMarker.FormattedTableData)!)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readFormattedTableDataSubclass ${this._reader.Position}.`, NotificationType.None);
          }
          break;
      }

      this._reader.ReadNext();
    }
  }

  private readLinkedTableDataSubclass(template: CadTemplate, map: DxfMap): void {
    const tmp = template as CadTableContentTemplate;
    const tableContent = tmp.CadObject as TableContent;

    this._reader.ReadNext();

    while (this._reader.DxfCode !== DxfCode.Start && this._reader.DxfCode !== DxfCode.Subclass) {
      switch (this._reader.Code as number) {
        case 90:
        case 91:
        case 92:
          break;
        case 300:
          if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.ObjectTableColumn.toUpperCase()) {
            this.readTableColumn();
          }
          break;
        case 301:
          if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.ObjectTableRow.toUpperCase()) {
            this.readTableRow();
          }
          break;
        default:
          if (!this.tryAssignCurrentValue(tableContent, map.subClasses.get(DxfSubclassMarker.LinkedTableData)!)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readLinkedTableDataSubclass ${this._reader.Position}.`, NotificationType.None);
          }
          break;
      }

      this._reader.ReadNext();
    }
  }

  private readTableColumn(): TableEntityColumn {
    this._reader.ReadNext();

    const column = new TableEntityColumn();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 1:
          if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.LinkedTableDataColumn_BEGIN.toUpperCase()) {
            this.readLinkedTableColumn(column);
          } else if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.FormattedTableDataColumn_BEGIN.toUpperCase()) {
            this.readFormattedTableColumn(column);
          } else if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.ObjectTableColumnBegin.toUpperCase()) {
            this.readTableColumnData(column);
            end = true;
          }
          break;
        default:
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readTableColumn method.`, NotificationType.None);
          break;
      }

      if (end) {
        return column;
      }

      this._reader.ReadNext();
    }

    return column;
  }

  private readTableRow(): TableEntityRow {
    this._reader.ReadNext();

    const row = new TableEntityRow();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 1:
          if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.LinkedTableDataRow_BEGIN.toUpperCase()) {
            this.readLinkedTableRow(row);
          } else if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.FormattedTableDataRow_BEGIN.toUpperCase()) {
            this.readFormattedTableRow(row);
          } else if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.ObjectTableRowBegin.toUpperCase()) {
            this.readTableRowData(row);
            end = true;
          }
          break;
        default:
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readTableRow method.`, NotificationType.None);
          break;
      }

      if (end) {
        return row;
      }

      this._reader.ReadNext();
    }

    return row;
  }

  private readTableRowData(row: TableEntityRow): void {
    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 40:
          row.height = this._reader.ValueAsDouble;
          break;
        case 90:
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'TABLEROW_END';
          break;
        default:
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readTableRowData method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readFormattedTableRow(row: TableEntityRow): void {
    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 300:
          break;
        case 1:
          if (this._reader.ValueAsString.toUpperCase() === 'TABLEFORMAT_BEGIN') {
            this.readStyleOverride(new CadCellStyleTemplate(row.cellStyleOverride));
          }
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'FORMATTEDTABLEDATAROW_END';
          break;
        default:
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readFormattedTableRow method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readTableColumnData(column: TableEntityColumn): void {
    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 1:
          if (this._reader.ValueAsString.toUpperCase() === 'TABLECOLUMN_BEGIN') {
            break;
          }
          end = true;
          break;
        case 40:
          column.width = this._reader.ValueAsDouble;
          break;
        case 90:
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'TABLECOLUMN_END';
          break;
        default:
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readTableColumnData method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readLinkedTableColumn(column: TableEntityColumn): void {
    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 1:
          if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.LinkedTableDataColumn_BEGIN.toUpperCase()) {
            break;
          }
          end = true;
          break;
        case 91:
          column.customData = this._reader.ValueAsInt;
          break;
        case 300:
          column.name = this._reader.ValueAsString;
          break;
        case 301:
          if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.CustomData.toUpperCase()) {
            this.readCustomData();
          }
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === DxfFileToken.LinkedTableDataColumn_END.toUpperCase();
          break;
        default:
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readLinkedTableColumn method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readLinkedTableRow(row: TableEntityRow): void {
    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 1:
          if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.LinkedTableDataRow_BEGIN.toUpperCase()) {
            break;
          }
          break;
        case 90:
          break;
        case 91:
          row.customData = this._reader.ValueAsInt;
          break;
        case 300:
          if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.ObjectCell.toUpperCase()) {
            this.readCell();
          }
          break;
        case 301:
          if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.CustomData.toUpperCase()) {
            this.readCustomData();
          }
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === DxfFileToken.LinkedTableDataRow_END.toUpperCase();
          break;
        default:
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readLinkedTableRow method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readCell(): TableEntityCell {
    this._reader.ReadNext();

    const cell = new TableEntityCell();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 1:
          if (this._reader.ValueAsString.toUpperCase() === 'LINKEDTABLEDATACELL_BEGIN') {
            this.readLinkedTableCell(cell);
          } else if (this._reader.ValueAsString.toUpperCase() === 'FORMATTEDTABLEDATACELL_BEGIN') {
            this.readFormattedTableCell(cell);
          } else if (this._reader.ValueAsString.toUpperCase() === 'TABLECELL_BEGIN') {
            this.readTableCellData(cell);
            end = true;
          }
          break;
        default:
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readCell method.`, NotificationType.None);
          break;
      }

      if (end) {
        return cell;
      }

      this._reader.ReadNext();
    }

    return cell;
  }

  private readTableCellData(cell: TableEntityCell): void {
    const map = DxfClassMap.Create(cell.constructor, 'TABLECELL_BEGIN');

    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 40:
        case 41:
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'TABLECELL_END';
          break;
        case 330:
          break;
        default:
          if (!this.tryAssignCurrentValue(cell, map)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readTableCellData ${this._reader.Position}.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readFormattedTableCell(cell: TableEntityCell): void {
    const map = DxfClassMap.Create(cell.constructor, 'FORMATTEDTABLEDATACELL_BEGIN');

    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 300:
          if (this._reader.ValueAsString.toUpperCase() === 'CELLTABLEFORMAT') {
            this.readCellTableFormat(cell);
            continue;
          }
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'FORMATTEDTABLEDATACELL_END';
          break;
        default:
          if (!this.tryAssignCurrentValue(cell, map)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readFormattedTableCell ${this._reader.Position}.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readCellTableFormat(cell: TableEntityCell): void {
    const map = DxfClassMap.Create(cell.constructor, 'CELLTABLEFORMAT');

    this._reader.ReadNext();

    let end = false;
    while (this._reader.Code === 1) {
      if (this._reader.ValueAsString.toUpperCase() === 'TABLEFORMAT_BEGIN') {
        this.readStyleOverride(new CadCellStyleTemplate(cell.styleOverride));
      } else if (this._reader.ValueAsString.toUpperCase() === 'CELLSTYLE_BEGIN') {
        this.readCellStyle(new CadCellStyleTemplate());
      } else {
        if (!this.tryAssignCurrentValue(cell, map)) {
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readCellTableFormat ${this._reader.Position}.`, NotificationType.None);
        }
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readCellStyle(template: CadCellStyleTemplate): void {
    this._reader.ReadNext();

    let end = false;
    while (this._reader.Code !== 1) {
      switch (this._reader.Code as number) {
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'CELLSTYLE_END';
          break;
        default:
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readCellStyle ${this._reader.Position}.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readLinkedTableCell(cell: TableEntityCell): void {
    const map = DxfClassMap.Create(cell.constructor, 'LINKEDTABLEDATACELL_BEGIN');

    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 95:
          break;
        case 301:
          if (this._reader.ValueAsString.toUpperCase() === DxfFileToken.CustomData.toUpperCase()) {
            this.readCustomData();
          }
          break;
        case 302:
          if (this._reader.ValueAsString.toUpperCase() === 'CONTENT') {
            this.readLinkedTableCellContent();
          }
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'LINKEDTABLEDATACELL_END';
          break;
        default:
          if (!this.tryAssignCurrentValue(cell, map)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readLinkedTableCell ${this._reader.Position}.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readLinkedTableCellContent(): CadTableCellContentTemplate {
    const content = new CellContent();
    const template = new CadTableCellContentTemplate(content);
    const map = DxfClassMap.Create(content.constructor, 'CONTENT');

    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 1:
          if (this._reader.ValueAsString.toUpperCase() === 'FORMATTEDCELLCONTENT_BEGIN') {
            this.readFormattedCellContent();
            end = true;
          } else if (this._reader.ValueAsString.toUpperCase() === 'CELLCONTENT_BEGIN') {
            this.readCellContent(template);
          }
          break;
        default:
          if (!this.tryAssignCurrentValue(content, map)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readLinkedTableCellContent ${this._reader.Position}.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }

    return template;
  }

  private readCellContent(template: CadTableCellContentTemplate): void {
    const content = template.Content;
    const map = DxfClassMap.Create(content.constructor, 'CELLCONTENT_BEGIN');

    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 91:
          break;
        case 300:
          if (this._reader.ValueAsString.toUpperCase() === 'VALUE') {
            const valueTemplate = this.readCadValue(content.cadValue);
            template.CadValueTemplate = valueTemplate;
          }
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'CELLCONTENT_END';
          break;
        case 340:
          template.BlockRecordHandle = this._reader.ValueAsHandle;
          break;
        default:
          if (!this.tryAssignCurrentValue(content, map)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readCellContent ${this._reader.Position}.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readFormattedCellContent(): void {
    const format = new ContentFormat();
    const template = new CadTableCellContentFormatTemplate(format);
    const map = DxfClassMap.Create(format.constructor, 'FORMATTEDCELLCONTENT');

    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 300:
          if (this._reader.ValueAsString.toUpperCase() === 'CONTENTFORMAT') {
            this.readContentFormat(template);
          }
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'FORMATTEDCELLCONTENT_END';
          break;
        default:
          if (!this.tryAssignCurrentValue(format, map)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readFormattedCellContent method.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readContentFormat(template: CadTableCellContentFormatTemplate): void {
    const format = template.Format;
    const map = DxfClassMap.Create(format.constructor, 'CONTENTFORMAT_BEGIN');

    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 1:
          if (this._reader.ValueAsString.toUpperCase() === 'CONTENTFORMAT_BEGIN') {
            break;
          }
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'CONTENTFORMAT_END';
          break;
        case 340:
          template.TextStyleHandle = this._reader.ValueAsHandle;
          break;
        default:
          if (!this.tryAssignCurrentValue(format, map)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readContentFormat method.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readFormattedTableColumn(column: TableEntityColumn): void {
    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 300:
          break;
        case 1:
          if (this._reader.ValueAsString.toUpperCase() === 'TABLEFORMAT_BEGIN') {
            this.readStyleOverride(new CadCellStyleTemplate(column.cellStyleOverride));
          }
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === DxfFileToken.FormattedTableDataColumn_END.toUpperCase();
          break;
        default:
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readFormattedTableColumn method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readStyleOverride(template: CadCellStyleTemplate): void {
    const style = template.Format as CellStyle;
    const mapstyle = DxfClassMap.Create(style.constructor, 'TABLEFORMAT_STYLE');
    const mapformat = DxfClassMap.Create(ContentFormat, 'TABLEFORMAT_BEGIN');

    this._reader.ReadNext();

    let end = false;
    let currBorder: CellEdgeFlags = CellEdgeFlags.Unknown;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 95:
          currBorder = this._reader.ValueAsInt as CellEdgeFlags;
          break;
        case 1:
          break;
        case 300:
          if (this._reader.ValueAsString.toUpperCase() === 'CONTENTFORMAT') {
            this.readContentFormat(new CadTableCellContentFormatTemplate(new ContentFormat()));
          }
          break;
        case 301:
          if (this._reader.ValueAsString.toUpperCase() === 'MARGIN') {
            this.readCellMargin(template);
          }
          break;
        case 302:
          if (this._reader.ValueAsString.toUpperCase() === 'GRIDFORMAT') {
            const border = new CellBorder(currBorder);
            this.readGridFormat(template, border);
          }
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'TABLEFORMAT_END';
          break;
        default:
          if (!this.tryAssignCurrentValue(style, mapstyle) && !this.tryAssignCurrentValue(style, mapformat)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readStyleOverride method.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readGridFormat(template: CadCellStyleTemplate, border: CellBorder): void {
    const map = DxfClassMap.Create(border.constructor, 'CellBorder');

    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 1:
          break;
        case 62:
          border.color = new Color(this._reader.ValueAsShort);
          break;
        case 92:
          border.lineWeight = this._reader.ValueAsInt as LineWeightType;
          break;
        case 93:
          border.isInvisible = this._reader.ValueAsBool;
          break;
        case 340:
          template.BorderLinetypePairs.push([border, this._reader.ValueAsHandle]);
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'GRIDFORMAT_END';
          break;
        default:
          if (!this.tryAssignCurrentValue(border, map)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readGridFormat method.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readCellMargin(template: CadCellStyleTemplate): void {
    const style = template.Format as CellStyle;

    this._reader.ReadNext();

    let end = false;
    let i = 0;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 1:
          break;
        case 40:
          switch (i) {
            case 0: style.verticalMargin = this._reader.ValueAsDouble; break;
            case 1: style.horizontalMargin = this._reader.ValueAsDouble; break;
            case 2: style.bottomMargin = this._reader.ValueAsDouble; break;
            case 3: style.rightMargin = this._reader.ValueAsDouble; break;
            case 4: style.marginHorizontalSpacing = this._reader.ValueAsDouble; break;
            case 5: style.marginVerticalSpacing = this._reader.ValueAsDouble; break;
          }
          i++;
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'CELLMARGIN_END';
          break;
        default:
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readCellMargin method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readCustomData(): void {
    this._reader.ReadNext();

    let ndata = 0;
    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 1:
          break;
        case 90:
          ndata = this._reader.ValueAsInt;
          break;
        case 300:
          break;
        case 301:
          if (this._reader.ValueAsString.toUpperCase() === 'DATAMAP_VALUE') {
            this.readDataMapValue();
          }
          break;
        case 309:
          end = this._reader.ValueAsString.toUpperCase() === 'DATAMAP_END';
          break;
        default:
          this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readCustomData method.`, NotificationType.None);
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readDataMapValue(): void {
    const value = new CadValue();
    const map = DxfClassMap.Create(value.constructor, 'DATAMAP_VALUE');

    this._reader.ReadNext();

    let end = false;
    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 11:
        case 21:
        case 31:
        case 91:
        case 92:
        case 140:
        case 310:
          break;
        case 304:
          end = this._reader.ValueAsString.toUpperCase() === 'ACVALUE_END';
          break;
        default:
          if (!this.tryAssignCurrentValue(value, map)) {
            this._builder.Notify(`Unhandled dxf code ${this._reader.Code} value ${this._reader.ValueAsString} at readDataMapValue method.`, NotificationType.None);
          }
          break;
      }

      if (end) {
        break;
      }

      this._reader.ReadNext();
    }
  }

  private readVisualStyle(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      case 176:
      case 177:
      case 420:
        return true;
      default:
        return true;
    }
  }

  private readSpatialFilter(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadSpatialFilterTemplate;
    const filter = tmp.CadObject as SpatialFilter;

    switch (this._reader.Code as number) {
      case 10:
        filter.boundaryPoints.push(new XY(this._reader.ValueAsDouble, 0));
        return true;
      case 20: {
        const pt = filter.boundaryPoints[filter.boundaryPoints.length - 1];
        filter.boundaryPoints.push(new XY(pt.x, this._reader.ValueAsDouble));
        return true;
      }
      case 40: {
        if (filter.clipFrontPlane && !tmp.HasFrontPlane) {
          filter.frontDistance = this._reader.ValueAsDouble;
          tmp.HasFrontPlane = true;
        }

        const array: number[] = [
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 1
        ];

        for (let i = 0; i < 12; i++) {
          array[i] = this._reader.ValueAsDouble;
          if (i < 11) {
            this._reader.ReadNext();
          }
        }

        if (tmp.InsertTransformRead) {
          filter.insertTransform = new Matrix4(array);
          tmp.InsertTransformRead = true;
        } else {
          filter.inverseInsertTransform = new Matrix4(array);
        }

        return true;
      }
      case 73:
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.SpatialFilter)!);
    }
  }

  private readMLineStyle(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadMLineStyleTemplate;
    const mLineStyle = template.CadObject as MLineStyle;

    switch (this._reader.Code as number) {
      case 6: {
        const t = tmp.ElementTemplates[tmp.ElementTemplates.length - 1];
        if (!t) {
          return true;
        }
        t.LineTypeName = this._reader.ValueAsString;
        return true;
      }
      case 49: {
        const element = new MLineStyleElement();
        const elementTemplate = new CadMLineStyleTemplate.ElementTemplate(element);
        element.offset = this._reader.ValueAsDouble;

        tmp.ElementTemplates.push(elementTemplate);
        mLineStyle.addElement(element);
        return true;
      }
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readTableStyle(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadTableStyleTemplate;
    const style = tmp.CadObject as TableStyle;
    const cellStyle = tmp.CurrentCellStyleTemplate?.CellStyle ?? null;

    switch (this._reader.Code as number) {
      case 7:
        tmp.CreateCurrentCellStyleTemplate();
        tmp.CurrentCellStyleTemplate!.TextStyleName = this._reader.ValueAsString;
        return true;
      case 94:
        if (cellStyle) cellStyle.alignment = this._reader.ValueAsInt;
        return true;
      case 62:
        if (cellStyle) cellStyle.color = new Color(this._reader.ValueAsShort);
        return true;
      case 63:
        if (cellStyle) cellStyle.backgroundColor = new Color(this._reader.ValueAsShort);
        return true;
      case 140:
        if (cellStyle) cellStyle.textHeight = this._reader.ValueAsDouble;
        return true;
      case 170:
        if (cellStyle) cellStyle.cellAlignment = this._reader.ValueAsShort as CellAlignmentType;
        return true;
      case 283:
        if (cellStyle) cellStyle.isFillColorOn = this._reader.ValueAsBool;
        return true;
      case 90:
        if (cellStyle) cellStyle.cellStyleType = this._reader.ValueAsShort as CellStyleType;
        return true;
      case 91:
        if (cellStyle) cellStyle.styleClass = this._reader.ValueAsShort as CellStyleClass;
        return true;
      case 1:
        return true;
      case 274:
        if (cellStyle) cellStyle.topBorder.lineWeight = this._reader.ValueAsInt as LineWeightType;
        return true;
      case 275:
        if (cellStyle) cellStyle.horizontalInsideBorder.lineWeight = this._reader.ValueAsInt as LineWeightType;
        return true;
      case 276:
        if (cellStyle) cellStyle.bottomBorder.lineWeight = this._reader.ValueAsInt as LineWeightType;
        return true;
      case 277:
        if (cellStyle) cellStyle.leftBorder.lineWeight = this._reader.ValueAsInt as LineWeightType;
        return true;
      case 278:
        if (cellStyle) cellStyle.verticalInsideBorder.lineWeight = this._reader.ValueAsInt as LineWeightType;
        return true;
      case 279:
        if (cellStyle) cellStyle.rightBorder.lineWeight = this._reader.ValueAsInt as LineWeightType;
        return true;
      case 284:
        if (cellStyle) cellStyle.topBorder.isInvisible = this._reader.ValueAsBool;
        return true;
      case 285:
        if (cellStyle) cellStyle.horizontalInsideBorder.isInvisible = this._reader.ValueAsBool;
        return true;
      case 286:
        if (cellStyle) cellStyle.bottomBorder.isInvisible = this._reader.ValueAsBool;
        return true;
      case 287:
        if (cellStyle) cellStyle.leftBorder.isInvisible = this._reader.ValueAsBool;
        return true;
      case 288:
        if (cellStyle) cellStyle.verticalInsideBorder.isInvisible = this._reader.ValueAsBool;
        return true;
      case 289:
        if (cellStyle) cellStyle.rightBorder.isInvisible = this._reader.ValueAsBool;
        return true;
      case 64:
        if (cellStyle) cellStyle.topBorder.color = new Color(this._reader.ValueAsShort);
        return true;
      case 65:
        if (cellStyle) cellStyle.horizontalInsideBorder.color = new Color(this._reader.ValueAsShort);
        return true;
      case 66:
        if (cellStyle) cellStyle.bottomBorder.color = new Color(this._reader.ValueAsShort);
        return true;
      case 67:
        if (cellStyle) cellStyle.leftBorder.color = new Color(this._reader.ValueAsShort);
        return true;
      case 68:
        if (cellStyle) cellStyle.verticalInsideBorder.color = new Color(this._reader.ValueAsShort);
        return true;
      case 69:
        if (cellStyle) cellStyle.rightBorder.color = new Color(this._reader.ValueAsShort);
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readMLeaderStyle(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadMLeaderStyleTemplate;

    switch (this._reader.Code as number) {
      case 179:
        return true;
      case 340:
        tmp.LeaderLineTypeHandle = this._reader.ValueAsHandle;
        return true;
      case 342:
        tmp.MTextStyleHandle = this._reader.ValueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readEvaluationExpression(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadEvaluationExpressionTemplate;

    switch (this._reader.Code as number) {
      case 1:
        this._reader.ExpectedCode(70);
        this._reader.ExpectedCode(140);
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.EvalGraphExpr)!);
    }
  }

  private readBlockElement(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.BlockElement)!)) {
          return this.readEvaluationExpression(template, map);
        }
        return true;
    }
  }

  private readBlockAction(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.BlockAction)!)) {
          return this.readBlockElement(template, map);
        }
        return true;
    }
  }

  private readBlockActionBasePt(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.BlockActionBasePt)!)) {
          return this.readBlockAction(template, map);
        }
        return true;
    }
  }

  private readBlockRotationAction(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.BlockRotationAction)!)) {
          return this.readBlockActionBasePt(template, map);
        }
        return true;
    }
  }

  private readBlockParameter(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.BlockParameter)!)) {
          return this.readBlockElement(template, map);
        }
        return true;
    }
  }

  private readBlock1PtParameter(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.Block1PtParameter)!)) {
          return this.readBlockParameter(template, map);
        }
        return true;
    }
  }

  private readBlock2PtParameter(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      case 91:
        return true;
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map)) {
          return this.readBlockParameter(template, map);
        }
        return true;
    }
  }

  private readBlockVisibilityParameter(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadBlockVisibilityParameterTemplate;

    switch (this._reader.Code as number) {
      case 92: {
        const stateCount = this._reader.ValueAsInt;
        for (let i = 0; i < stateCount; i++) {
          this._reader.ReadNext();
          tmp.StateTemplates.push(this.readState());
        }
        return true;
      }
      case 93:
        if (this.currentSubclass === DxfSubclassMarker.BlockVisibilityParameter) {
          const entityCount = this._reader.ValueAsInt;
          for (let i = 0; i < entityCount; i++) {
            this._reader.ReadNext();
            tmp.entityHandles.push(this._reader.ValueAsHandle);
          }
          return true;
        }
        return false;
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.BlockVisibilityParameter)!)) {
          return this.readBlock1PtParameter(template, map);
        }
        return true;
    }
  }

  private readBlockRotationParameter(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map)) {
          return this.readBlock2PtParameter(template, map);
        }
        return true;
    }
  }

  private readState(): CadBlockVisibilityParameterTemplate.StateTemplate {
    const state = new BlockVisibilityState();
    const template = new CadBlockVisibilityParameterTemplate.StateTemplate(state);

    const expectedCodes: number[] = [303, 94, 95];

    while (this._reader.DxfCode !== DxfCode.Start) {
      const idx = expectedCodes.indexOf(this._reader.Code);
      if (idx >= 0) {
        expectedCodes.splice(idx, 1);
      }

      switch (this._reader.Code as number) {
        case 303:
          state.name = this._reader.ValueAsString;
          break;
        case 94: {
          const count = this._reader.ValueAsInt;
          for (let i = 0; i < count; i++) {
            this._reader.ReadNext();
            template.entityHandles.add(this._reader.ValueAsHandle);
          }
          break;
        }
        case 95: {
          const count = this._reader.ValueAsInt;
          for (let i = 0; i < count; i++) {
            this._reader.ReadNext();
            template.expressionHandles.add(this._reader.ValueAsHandle);
          }
          break;
        }
        default:
          return template;
      }

      if (expectedCodes.length === 0) {
        break;
      }

      this._reader.ReadNext();
    }

    return template;
  }

  private readBlockGrip(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.BlockGrip)!)) {
          return this.readBlockElement(template, map);
        }
        return true;
    }
  }

  private readBlockRotationGrip(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.BlockRotationGrip)!)) {
          return this.readBlockGrip(template, map);
        }
        return true;
    }
  }

  private readBlockVisibilityGrip(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.BlockVisibilityGrip)!)) {
          return this.readBlockGrip(template, map);
        }
        return true;
    }
  }

  private readBlockRepresentationData(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadBlockRepresentationDataTemplate;

    switch (this._reader.Code as number) {
      case 340:
        tmp.BlockHandle = this._reader.ValueAsHandle;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readBlockGripExpression(template: CadTemplate, map: DxfMap): boolean {
    switch (this._reader.Code as number) {
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.BlockGripExpression)!)) {
          return this.readEvaluationExpression(template, map);
        }
        return true;
    }
  }

  private readXRecord(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadXRecordTemplate;

    switch (this._reader.Code as number) {
      case 100:
        if (this._reader.ValueAsString === DxfSubclassMarker.XRecord) {
          this.readXRecordEntries(tmp);
          return true;
        }
        return false;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.XRecord)!);
    }
  }

  private readXRecordEntries(template: CadXRecordTemplate): void {
    const xRecord = template.CadObject as XRecord;
    this._reader.ReadNext();

    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.GroupCodeValue) {
        case GroupCodeValueType.Point3D: {
          const code = this._reader.Code;
          const x = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          const y = this._reader.ValueAsDouble;
          this._reader.ReadNext();
          const z = this._reader.ValueAsDouble;
          const pt = new XYZ(x, y, z);
          xRecord.CreateEntry(code, pt);
          break;
        }
        case GroupCodeValueType.Handle:
        case GroupCodeValueType.ObjectId:
        case GroupCodeValueType.ExtendedDataHandle:
          template.AddHandleReference(this._reader.Code, this._reader.ValueAsHandle);
          break;
        default:
          xRecord.CreateEntry(this._reader.Code, this._reader.Value);
          break;
      }

      this._reader.ReadNext();
    }
  }

  private readBookColor(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadNonGraphicalObjectTemplate;
    const color = tmp.CadObject as BookColor;

    switch (this._reader.Code as number) {
      case 430:
        color.name = this._reader.ValueAsString;
        return true;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.DbColor)!);
    }
  }

  private readDimensionAssociation(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadDimensionAssociationTemplate;
    const dimassoc = tmp.CadObject as DimensionAssociation;

    switch (this._reader.Code as number) {
      case 1:
        if (this._reader.ValueAsString === DimensionAssociation.OsnapPointRefClassName) {
          if ((dimassoc.associativityFlags & AssociativityFlags.FirstPointReference) !== 0
            && dimassoc.firstPointRef === null) {
            dimassoc.firstPointRef = new OsnapPointRef();
            this.readOsnapPointRef(dimassoc.firstPointRef);
            this.lockPointer = true;
            return true;
          }

          if ((dimassoc.associativityFlags & AssociativityFlags.SecondPointReference) !== 0
            && dimassoc.secondPointRef === null) {
            dimassoc.secondPointRef = new OsnapPointRef();
            this.readOsnapPointRef(dimassoc.secondPointRef);
            this.lockPointer = true;
            return true;
          }

          if ((dimassoc.associativityFlags & AssociativityFlags.ThirdPointReference) !== 0
            && dimassoc.thirdPointRef === null) {
            dimassoc.thirdPointRef = new OsnapPointRef();
            this.readOsnapPointRef(dimassoc.thirdPointRef);
            this.lockPointer = true;
            return true;
          }

          if ((dimassoc.associativityFlags & AssociativityFlags.FourthPointReference) !== 0
            && dimassoc.fourthPointRef === null) {
            dimassoc.fourthPointRef = new OsnapPointRef();
            this.readOsnapPointRef(dimassoc.fourthPointRef);
            this.lockPointer = true;
            return true;
          }

          return true;
        }
        return false;
      case 330:
        if (template.OwnerHandle !== null) {
          tmp.DimensionHandle = this._reader.ValueAsHandle;
          return true;
        }
        return false;
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(tmp.CadObject.subclassMarker)!);
    }
  }

  private readOsnapPointRef(osnapPoint: OsnapPointRef): CadDimensionAssociationTemplate.OsnapPointRefTemplate {
    const template = new CadDimensionAssociationTemplate.OsnapPointRefTemplate(osnapPoint);

    this._reader.ReadNext();

    let end = false;
    while (!end) {
      switch (this._reader.Code as number) {
        case 10:
          osnapPoint.osnapPoint = new XYZ(this._reader.ValueAsDouble, osnapPoint.osnapPoint.Y, osnapPoint.osnapPoint.Z);
          break;
        case 20:
          osnapPoint.osnapPoint = new XYZ(osnapPoint.osnapPoint.X, this._reader.ValueAsDouble, osnapPoint.osnapPoint.Z);
          break;
        case 30:
          osnapPoint.osnapPoint = new XYZ(osnapPoint.osnapPoint.X, osnapPoint.osnapPoint.Y, this._reader.ValueAsDouble);
          break;
        case 40:
          osnapPoint.geometryParameter = this._reader.ValueAsDouble;
          break;
        case 72:
          osnapPoint.objectOsnapType = this._reader.ValueAsShort as ObjectOsnapType;
          break;
        case 73:
          osnapPoint.subentType = this._reader.ValueAsShort as SubentType;
          break;
        case 74:
          osnapPoint.intersectionSubType = this._reader.ValueAsShort as SubentType;
          break;
        case 75:
          osnapPoint.hasLastPointRef = this._reader.ValueAsBool;
          break;
        case 91:
          osnapPoint.gsMarker = this._reader.ValueAsInt;
          break;
        case 92:
          osnapPoint.intersectionGsMarker = this._reader.ValueAsInt;
          break;
        case 331:
          template.ObjectHandle = this._reader.ValueAsHandle;
          break;
        case 302:
        case 332:
          break;
        default:
          end = true;
          continue;
      }

      this._reader.ReadNext();
    }

    return template;
  }

  private readDictionary(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadDictionaryTemplate;
    const cadDictionary = tmp.CadObject as CadDictionary;

    switch (this._reader.Code as number) {
      case 280:
        cadDictionary.hardOwnerFlag = this._reader.ValueAsBool;
        return true;
      case 281:
        cadDictionary.clonningFlags = this._reader.Value as DictionaryCloningFlags;
        return true;
      case 3:
        tmp.Entries.set(this._reader.ValueAsString, null);
        return true;
      case 350:
      case 360: {
        const keys = Array.from(tmp.Entries.keys());
        const lastKey = keys[keys.length - 1];
        tmp.Entries.set(lastKey, this._reader.ValueAsHandle);
        return true;
      }
      default:
        return this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.Dictionary)!);
    }
  }

  private readDictionaryWithDefault(template: CadTemplate, map: DxfMap): boolean {
    const tmp = template as CadDictionaryWithDefaultTemplate;

    switch (this._reader.Code as number) {
      case 340:
        tmp.DefaultEntryHandle = this._reader.ValueAsHandle;
        return true;
      default:
        if (!this.tryAssignCurrentValue(template.CadObject, map.subClasses.get(DxfSubclassMarker.DictionaryWithDefault)!)) {
          return this.readDictionary(template, map);
        }
        return true;
    }
  }

  private readSortentsTable(): CadTemplate {
    const sortTable = new SortEntitiesTable();
    const template = new CadSortensTableTemplate(sortTable);

    this._reader.ReadNext();

    this.readCommonObjectData(template);

    // Debug.Assert(DxfSubclassMarker.SortentsTable == this._reader.ValueAsString);

    this._reader.ReadNext();

    let pair: { item1: number | null, item2: number | null } = { item1: null, item2: null };

    while (this._reader.DxfCode !== DxfCode.Start) {
      switch (this._reader.Code as number) {
        case 5:
          pair.item1 = this._reader.ValueAsHandle;
          break;
        case 330:
          template.BlockOwnerHandle = this._reader.ValueAsHandle;
          break;
        case 331:
          pair.item2 = this._reader.ValueAsHandle;
          break;
        default:
          this._builder.Notify(`Group Code not handled ${this._reader.GroupCodeValue} for SortEntitiesTable, code : ${this._reader.Code} | value : ${this._reader.ValueAsString}`);
          break;
      }

      if (pair.item1 !== null && pair.item2 !== null) {
        template.Values.push([pair.item1, pair.item2]);
        pair = { item1: null, item2: null };
      }

      this._reader.ReadNext();
    }

    return template;
  }

  private appendBinaryChunk(current: Uint8Array | null, chunk: Uint8Array): Uint8Array {
    if (current === null || current.length === 0) {
      return new Uint8Array(chunk);
    }

    const combined = new Uint8Array(current.length + chunk.length);
    combined.set(current, 0);
    combined.set(chunk, current.length);
    return combined;
  }
}
