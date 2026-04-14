import { ClassMetadata } from '../MetadataTypes.js';

export const metadataLookupObjects: readonly ClassMetadata[] = [
  {
    "typeName": "AcdbPlaceHolder",
    "baseTypeName": "NonGraphicalObject",
    "properties": [],
    "systemVariables": [],
    "dxfName": "ACDBPLACEHOLDER",
    "dxfSubClassName": "AcDbPlaceHolder"
  },
  {
    "typeName": "AecBinRecord",
    "baseTypeName": "NonGraphicalObject",
    "properties": [],
    "systemVariables": [],
    "dxfName": "BINRECORD",
    "dxfSubClassName": "BinRecord"
  },
  {
    "typeName": "AecCleanupGroup",
    "baseTypeName": "NonGraphicalObject",
    "properties": [],
    "systemVariables": [],
    "dxfName": "AEC_CLEANUP_GROUP_DEF",
    "dxfSubClassName": "AecDbCleanupGroupDef"
  },
  {
    "typeName": "AecWallStyle",
    "baseTypeName": "NonGraphicalObject",
    "properties": [],
    "systemVariables": [],
    "dxfName": "AEC_WALL_STYLE",
    "dxfSubClassName": "AecDbWallStyle"
  },
  {
    "typeName": "AnnotScaleObjectContextData",
    "baseTypeName": "ObjectContextData",
    "properties": [
      {
        "propertyName": "scale",
        "valueCodes": [
          340
        ],
        "referenceType": 1
      }
    ],
    "systemVariables": [],
    "dxfSubClassIsEmpty": true
  },
  {
    "typeName": "Block1PtParameter",
    "baseTypeName": "BlockParameter",
    "properties": [
      {
        "propertyName": "location",
        "valueCodes": [
          1010,
          1020,
          1030
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value93",
        "valueCodes": [
          93
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value170",
        "valueCodes": [
          170
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value171",
        "valueCodes": [
          171
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbBlock1PtParameter"
  },
  {
    "typeName": "Block2PtParameter",
    "baseTypeName": "BlockParameter",
    "properties": [
      {
        "propertyName": "firstPoint",
        "valueCodes": [
          1010,
          1020,
          1030
        ],
        "referenceType": 0
      },
      {
        "propertyName": "secondPoint",
        "valueCodes": [
          1011,
          1021,
          1031
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value170",
        "valueCodes": [
          170
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value171",
        "valueCodes": [
          171
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value172",
        "valueCodes": [
          172
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value173",
        "valueCodes": [
          173
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value174",
        "valueCodes": [
          174
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value177",
        "valueCodes": [
          177
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value303",
        "valueCodes": [
          303
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value304",
        "valueCodes": [
          304
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value94",
        "valueCodes": [
          94
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value95",
        "valueCodes": [
          95
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbBlock2PtParameter"
  },
  {
    "typeName": "BlockAction",
    "baseTypeName": "BlockElement",
    "properties": [
      {
        "propertyName": "actionPoint",
        "valueCodes": [
          1010,
          1020,
          1030
        ],
        "referenceType": 0
      },
      {
        "propertyName": "entities",
        "valueCodes": [
          71
        ],
        "referenceType": 4,
        "collectionCodes": [
          330
        ]
      },
      {
        "propertyName": "value70",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbBlockAction"
  },
  {
    "typeName": "BlockActionBasePt",
    "baseTypeName": "BlockAction",
    "properties": [
      {
        "propertyName": "value1011",
        "valueCodes": [
          1011,
          1021,
          1031
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value1012",
        "valueCodes": [
          1012,
          1022,
          1032
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value280",
        "valueCodes": [
          280
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value301",
        "valueCodes": [
          301
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value302",
        "valueCodes": [
          302
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value92",
        "valueCodes": [
          92
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value93",
        "valueCodes": [
          93
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbBlockActionWithBasePt"
  },
  {
    "typeName": "BlockBasePointParameter",
    "baseTypeName": "Block1PtParameter",
    "properties": [
      {
        "propertyName": "point1010",
        "valueCodes": [
          1011,
          1021,
          1031
        ],
        "referenceType": 0
      },
      {
        "propertyName": "point1012",
        "valueCodes": [
          1012,
          1022,
          1032
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbBlockBasePointParameter"
  },
  {
    "typeName": "BlockElement",
    "baseTypeName": "EvaluationExpression",
    "properties": [
      {
        "propertyName": "elementName",
        "valueCodes": [
          300
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value1071",
        "valueCodes": [
          1071
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbBlockElement"
  },
  {
    "typeName": "BlockFlipAction",
    "baseTypeName": "BlockAction",
    "properties": [
      {
        "propertyName": "caption301",
        "valueCodes": [
          301
        ],
        "referenceType": 0
      },
      {
        "propertyName": "caption302",
        "valueCodes": [
          302
        ],
        "referenceType": 0
      },
      {
        "propertyName": "caption303",
        "valueCodes": [
          303
        ],
        "referenceType": 0
      },
      {
        "propertyName": "caption304",
        "valueCodes": [
          304
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value92",
        "valueCodes": [
          92
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value93",
        "valueCodes": [
          93
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value94",
        "valueCodes": [
          94
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value95",
        "valueCodes": [
          95
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "BLOCKFLIPACTION",
    "dxfSubClassName": "AcDbBlockFlipAction"
  },
  {
    "typeName": "BlockFlipGrip",
    "baseTypeName": "BlockGrip",
    "properties": [
      {
        "propertyName": "value140",
        "valueCodes": [
          140
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value141",
        "valueCodes": [
          141
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value142",
        "valueCodes": [
          142
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value93N",
        "valueCodes": [
          93
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbBlockFlipGrip"
  },
  {
    "typeName": "BlockFlipParameter",
    "baseTypeName": "Block2PtParameter",
    "properties": [],
    "systemVariables": [],
    "dxfSubClassName": "AcDbBlockFlipParameter"
  },
  {
    "typeName": "BlockGrip",
    "baseTypeName": "BlockElement",
    "properties": [
      {
        "propertyName": "location",
        "valueCodes": [
          1010,
          1020,
          1030
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value280",
        "valueCodes": [
          280
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value91",
        "valueCodes": [
          91
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value92",
        "valueCodes": [
          92
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value93",
        "valueCodes": [
          93
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbBlockGrip"
  },
  {
    "typeName": "BlockGripExpression",
    "baseTypeName": "EvaluationExpression",
    "properties": [
      {
        "propertyName": "value300",
        "valueCodes": [
          300
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value91",
        "valueCodes": [
          91
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "BLOCKGRIPLOCATIONCOMPONENT",
    "dxfSubClassName": "AcDbBlockGripExpr"
  },
  {
    "typeName": "BlockLinearParameter",
    "baseTypeName": "Block2PtParameter",
    "properties": [
      {
        "propertyName": "label",
        "valueCodes": [
          305
        ],
        "referenceType": 0
      },
      {
        "propertyName": "description",
        "valueCodes": [
          306
        ],
        "referenceType": 0
      },
      {
        "propertyName": "labelOffset",
        "valueCodes": [
          140
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "BLOCKLINEARPARAMETER",
    "dxfSubClassName": "AcDbBlockLinearParameter"
  },
  {
    "typeName": "BlockParameter",
    "baseTypeName": "BlockElement",
    "properties": [
      {
        "propertyName": "value280",
        "valueCodes": [
          280
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value281",
        "valueCodes": [
          281
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbBlockParameter"
  },
  {
    "typeName": "BlockReferenceObjectContextData",
    "baseTypeName": "AnnotScaleObjectContextData",
    "properties": [
      {
        "propertyName": "insertionPoint",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "rotation",
        "valueCodes": [
          50
        ],
        "referenceType": 32
      },
      {
        "propertyName": "xScale",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "yScale",
        "valueCodes": [
          42
        ],
        "referenceType": 0
      },
      {
        "propertyName": "zScale",
        "valueCodes": [
          43
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "ACDB_BLKREFOBJECTCONTEXTDATA_CLASS",
    "dxfSubClassName": "AcDbAnnotScaleObjectContextData"
  },
  {
    "typeName": "BlockRepresentationData",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "block",
        "valueCodes": [
          330
        ],
        "referenceType": 1
      },
      {
        "propertyName": "value70",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "ACDB_BLOCKREPRESENTATION_DATA",
    "dxfSubClassName": "AcDbBlockRepresentationData"
  },
  {
    "typeName": "BlockRotationAction",
    "baseTypeName": "BlockActionBasePt",
    "properties": [
      {
        "propertyName": "value303",
        "valueCodes": [
          303
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value94",
        "valueCodes": [
          94
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "BLOCKROTATEACTION",
    "dxfSubClassName": "AcDbBlockRotationAction"
  },
  {
    "typeName": "BlockRotationGrip",
    "baseTypeName": "BlockGrip",
    "properties": [],
    "systemVariables": [],
    "dxfName": "BLOCKROTATIONGRIP",
    "dxfSubClassName": "AcDbBlockRotationGrip"
  },
  {
    "typeName": "BlockRotationParameter",
    "baseTypeName": "Block2PtParameter",
    "properties": [
      {
        "propertyName": "description",
        "valueCodes": [
          306
        ],
        "referenceType": 0
      },
      {
        "propertyName": "name",
        "valueCodes": [
          305
        ],
        "referenceType": 0
      },
      {
        "propertyName": "nameOffset",
        "valueCodes": [
          140
        ],
        "referenceType": 0
      },
      {
        "propertyName": "point",
        "valueCodes": [
          1011,
          1021,
          1031
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value141",
        "valueCodes": [
          141
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value142",
        "valueCodes": [
          142
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value143",
        "valueCodes": [
          143
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value175",
        "valueCodes": [
          175
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value307",
        "valueCodes": [
          307
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value96",
        "valueCodes": [
          96
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "BLOCKROTATIONPARAMETER",
    "dxfSubClassName": "AcDbBlockRotationParameter"
  },
  {
    "typeName": "BlockVisibilityGrip",
    "baseTypeName": "BlockGrip",
    "properties": [],
    "systemVariables": [],
    "dxfName": "BLOCKVISIBILITYGRIP",
    "dxfSubClassName": "AcDbBlockVisibilityGrip"
  },
  {
    "typeName": "BlockVisibilityParameter",
    "baseTypeName": "Block1PtParameter",
    "properties": [
      {
        "propertyName": "description",
        "valueCodes": [
          302
        ],
        "referenceType": 0
      },
      {
        "propertyName": "entities",
        "valueCodes": [
          93
        ],
        "referenceType": 4
      },
      {
        "propertyName": "name",
        "valueCodes": [
          301
        ],
        "referenceType": 0
      },
      {
        "propertyName": "states",
        "valueCodes": [
          92
        ],
        "referenceType": 4
      },
      {
        "propertyName": "value91",
        "valueCodes": [
          91
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "BLOCKVISIBILITYPARAMETER",
    "dxfSubClassName": "AcDbBlockVisibilityParameter"
  },
  {
    "typeName": "BookColor",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "color",
        "valueCodes": [
          62,
          420
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "DBCOLOR",
    "dxfSubClassName": "AcDbColor"
  },
  {
    "typeName": "CadDictionary",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "clonningFlags",
        "valueCodes": [
          281
        ],
        "referenceType": 0
      },
      {
        "propertyName": "entryHandles",
        "valueCodes": [
          350
        ],
        "referenceType": 0
      },
      {
        "propertyName": "entryNames",
        "valueCodes": [
          3
        ],
        "referenceType": 0
      },
      {
        "propertyName": "hardOwnerFlag",
        "valueCodes": [
          280
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "DICTIONARY",
    "dxfSubClassName": "AcDbDictionary"
  },
  {
    "typeName": "CadDictionaryWithDefault",
    "baseTypeName": "CadDictionary",
    "properties": [
      {
        "propertyName": "defaultEntry",
        "valueCodes": [
          340
        ],
        "referenceType": 1
      }
    ],
    "systemVariables": [],
    "dxfName": "ACDBDICTIONARYWDFLT",
    "dxfSubClassName": "AcDbDictionaryWithDefault"
  },
  {
    "typeName": "DictionaryVariable",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "objectSchemaNumber",
        "valueCodes": [
          280
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value",
        "valueCodes": [
          1
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "DICTIONARYVAR",
    "dxfSubClassName": "DictionaryVariables"
  },
  {
    "typeName": "DimensionAssociation",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "associativityFlags",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "dimension",
        "valueCodes": [
          330
        ],
        "referenceType": 1
      },
      {
        "propertyName": "isTransSpace",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "rotatedDimensionType",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "DIMASSOC",
    "dxfSubClassName": "AcDbDimAssoc"
  },
  {
    "typeName": "EvaluationExpression",
    "baseTypeName": "CadObject",
    "properties": [
      {
        "propertyName": "id",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value98",
        "valueCodes": [
          98
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value99",
        "valueCodes": [
          99
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbEvalExpr"
  },
  {
    "typeName": "EvaluationGraph",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "value96",
        "valueCodes": [
          96
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value97",
        "valueCodes": [
          97
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "ACAD_EVALUATION_GRAPH",
    "dxfSubClassName": "AcDbEvalGraph"
  },
  {
    "typeName": "Field",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "cadObjects",
        "valueCodes": [
          97
        ],
        "referenceType": 4,
        "collectionCodes": [
          331
        ]
      },
      {
        "propertyName": "children",
        "valueCodes": [
          90
        ],
        "referenceType": 4,
        "collectionCodes": [
          360
        ]
      },
      {
        "propertyName": "evaluationErrorCode",
        "valueCodes": [
          96
        ],
        "referenceType": 0
      },
      {
        "propertyName": "evaluationErrorMessage",
        "valueCodes": [
          300
        ],
        "referenceType": 0
      },
      {
        "propertyName": "evaluationOptionFlags",
        "valueCodes": [
          91
        ],
        "referenceType": 0
      },
      {
        "propertyName": "evaluationStatusFlags",
        "valueCodes": [
          95
        ],
        "referenceType": 0
      },
      {
        "propertyName": "evaluatorId",
        "valueCodes": [
          1
        ],
        "referenceType": 0
      },
      {
        "propertyName": "fieldCode",
        "valueCodes": [
          2
        ],
        "referenceType": 0
      },
      {
        "propertyName": "fieldStateFlags",
        "valueCodes": [
          94
        ],
        "referenceType": 0
      },
      {
        "propertyName": "filingOptionFlags",
        "valueCodes": [
          92
        ],
        "referenceType": 0
      },
      {
        "propertyName": "formatString",
        "valueCodes": [
          301
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value",
        "valueCodes": [
          7
        ],
        "referenceType": 0
      },
      {
        "propertyName": "values",
        "valueCodes": [
          93
        ],
        "referenceType": 4,
        "collectionCodes": [
          6
        ]
      }
    ],
    "systemVariables": [],
    "dxfName": "FIELD",
    "dxfSubClassName": "AcDbField"
  },
  {
    "typeName": "FieldList",
    "baseTypeName": "NonGraphicalObject",
    "properties": [],
    "systemVariables": [],
    "dxfName": "FIELDLIST",
    "dxfSubClassName": "AcDbFieldList"
  },
  {
    "typeName": "Filter",
    "baseTypeName": "NonGraphicalObject",
    "properties": [],
    "systemVariables": [],
    "dxfSubClassName": "AcDbFilter"
  },
  {
    "typeName": "FormattedTableData",
    "baseTypeName": "LinkedTableData",
    "properties": [
      {
        "propertyName": "description",
        "valueCodes": [
          300
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbFormattedTableData"
  },
  {
    "typeName": "GeoData",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "version",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "coordinatesType",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "designPoint",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "referencePoint",
        "valueCodes": [
          11,
          21,
          31
        ],
        "referenceType": 0
      },
      {
        "propertyName": "northDirection",
        "valueCodes": [
          12,
          22
        ],
        "referenceType": 0
      },
      {
        "propertyName": "horizontalUnitScale",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "verticalUnitScale",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "horizontalUnits",
        "valueCodes": [
          91
        ],
        "referenceType": 0
      },
      {
        "propertyName": "verticalUnits",
        "valueCodes": [
          92
        ],
        "referenceType": 0
      },
      {
        "propertyName": "upDirection",
        "valueCodes": [
          210,
          220,
          230
        ],
        "referenceType": 0
      },
      {
        "propertyName": "scaleEstimationMethod",
        "valueCodes": [
          95
        ],
        "referenceType": 0
      },
      {
        "propertyName": "enableSeaLevelCorrection",
        "valueCodes": [
          294
        ],
        "referenceType": 0
      },
      {
        "propertyName": "userSpecifiedScaleFactor",
        "valueCodes": [
          141
        ],
        "referenceType": 0
      },
      {
        "propertyName": "seaLevelElevation",
        "valueCodes": [
          142
        ],
        "referenceType": 0
      },
      {
        "propertyName": "coordinateProjectionRadius",
        "valueCodes": [
          143
        ],
        "referenceType": 0
      },
      {
        "propertyName": "coordinateSystemDefinition",
        "valueCodes": [
          301
        ],
        "referenceType": 0
      },
      {
        "propertyName": "geoRssTag",
        "valueCodes": [
          302
        ],
        "referenceType": 0
      },
      {
        "propertyName": "observationFromTag",
        "valueCodes": [
          305
        ],
        "referenceType": 0
      },
      {
        "propertyName": "observationToTag",
        "valueCodes": [
          306
        ],
        "referenceType": 0
      },
      {
        "propertyName": "observationCoverageTag",
        "valueCodes": [
          307
        ],
        "referenceType": 0
      },
      {
        "propertyName": "points",
        "valueCodes": [
          93
        ],
        "referenceType": 4
      },
      {
        "propertyName": "faces",
        "valueCodes": [
          96
        ],
        "referenceType": 4
      }
    ],
    "systemVariables": [],
    "dxfName": "GEODATA",
    "dxfSubClassName": "AcDbGeoData"
  },
  {
    "typeName": "Group",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "description",
        "valueCodes": [
          300
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isUnnamed",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "selectable",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "GROUP",
    "dxfSubClassName": "AcDbGroup"
  },
  {
    "typeName": "ImageDefinition",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "classVersion",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "fileName",
        "valueCodes": [
          1
        ],
        "referenceType": 0
      },
      {
        "propertyName": "size",
        "valueCodes": [
          10,
          20
        ],
        "referenceType": 0
      },
      {
        "propertyName": "defaultSize",
        "valueCodes": [
          11,
          21
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isLoaded",
        "valueCodes": [
          280
        ],
        "referenceType": 0
      },
      {
        "propertyName": "units",
        "valueCodes": [
          281
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "IMAGEDEF",
    "dxfSubClassName": "AcDbRasterImageDef"
  },
  {
    "typeName": "ImageDefinitionReactor",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "classVersion",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "image",
        "valueCodes": [
          330
        ],
        "referenceType": 1
      }
    ],
    "systemVariables": [],
    "dxfName": "IMAGEDEF_REACTOR",
    "dxfSubClassName": "AcDbRasterImageDefReactor"
  },
  {
    "typeName": "Layout",
    "baseTypeName": "PlotSettings",
    "properties": [
      {
        "propertyName": "associatedBlock",
        "valueCodes": [
          330
        ],
        "referenceType": 1
      },
      {
        "propertyName": "baseUCS",
        "valueCodes": [
          346
        ],
        "referenceType": 1
      },
      {
        "propertyName": "elevation",
        "valueCodes": [
          146
        ],
        "referenceType": 0
      },
      {
        "propertyName": "insertionBasePoint",
        "valueCodes": [
          12,
          22,
          32
        ],
        "referenceType": 0
      },
      {
        "propertyName": "lastActiveViewport",
        "valueCodes": [
          331
        ],
        "referenceType": 1
      },
      {
        "propertyName": "layoutFlags",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "maxExtents",
        "valueCodes": [
          15,
          25,
          35
        ],
        "referenceType": 0
      },
      {
        "propertyName": "maxLimits",
        "valueCodes": [
          11,
          21
        ],
        "referenceType": 0
      },
      {
        "propertyName": "minExtents",
        "valueCodes": [
          14,
          24,
          34
        ],
        "referenceType": 0
      },
      {
        "propertyName": "minLimits",
        "valueCodes": [
          10,
          20
        ],
        "referenceType": 0
      },
      {
        "propertyName": "origin",
        "valueCodes": [
          13,
          23,
          33
        ],
        "referenceType": 0
      },
      {
        "propertyName": "tabOrder",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "ucsOrthographicType",
        "valueCodes": [
          76
        ],
        "referenceType": 0
      },
      {
        "propertyName": "xAxis",
        "valueCodes": [
          16,
          26,
          36
        ],
        "referenceType": 0
      },
      {
        "propertyName": "yAxis",
        "valueCodes": [
          17,
          27,
          37
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "LAYOUT",
    "dxfSubClassName": "AcDbLayout"
  },
  {
    "typeName": "LinkedData",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "description",
        "valueCodes": [
          300
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbLinkedData"
  },
  {
    "typeName": "LinkedTableData",
    "baseTypeName": "LinkedData",
    "properties": [
      {
        "propertyName": "description",
        "valueCodes": [
          300
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbLinkedTableData"
  },
  {
    "typeName": "Material",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "ambientColor",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "ambientColorFactor",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "ambientColorMethod",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "bumpAutoTransform",
        "valueCodes": [
          272
        ],
        "referenceType": 0
      },
      {
        "propertyName": "bumpMapBlendFactor",
        "valueCodes": [
          143
        ],
        "referenceType": 0
      },
      {
        "propertyName": "bumpMapFileName",
        "valueCodes": [
          8
        ],
        "referenceType": 0
      },
      {
        "propertyName": "bumpMapSource",
        "valueCodes": [
          179
        ],
        "referenceType": 0
      },
      {
        "propertyName": "bumpMatrix",
        "valueCodes": [
          144
        ],
        "referenceType": 0
      },
      {
        "propertyName": "bumpProjectionMethod",
        "valueCodes": [
          270
        ],
        "referenceType": 0
      },
      {
        "propertyName": "bumpTilingMethod",
        "valueCodes": [
          271
        ],
        "referenceType": 0
      },
      {
        "propertyName": "channelFlags",
        "valueCodes": [
          94
        ],
        "referenceType": 0
      },
      {
        "propertyName": "description",
        "valueCodes": [
          2
        ],
        "referenceType": 0
      },
      {
        "propertyName": "diffuseAutoTransform",
        "valueCodes": [
          75
        ],
        "referenceType": 0
      },
      {
        "propertyName": "diffuseColor",
        "valueCodes": [
          91
        ],
        "referenceType": 0
      },
      {
        "propertyName": "diffuseColorFactor",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "diffuseColorMethod",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "diffuseMapBlendFactor",
        "valueCodes": [
          42
        ],
        "referenceType": 0
      },
      {
        "propertyName": "diffuseMapFileName",
        "valueCodes": [
          3
        ],
        "referenceType": 0
      },
      {
        "propertyName": "diffuseMapSource",
        "valueCodes": [
          72
        ],
        "referenceType": 0
      },
      {
        "propertyName": "diffuseMatrix",
        "valueCodes": [
          43
        ],
        "referenceType": 0
      },
      {
        "propertyName": "diffuseProjectionMethod",
        "valueCodes": [
          73
        ],
        "referenceType": 0
      },
      {
        "propertyName": "diffuseTilingMethod",
        "valueCodes": [
          74
        ],
        "referenceType": 0
      },
      {
        "propertyName": "illuminationModel",
        "valueCodes": [
          93
        ],
        "referenceType": 0
      },
      {
        "propertyName": "opacity",
        "valueCodes": [
          140
        ],
        "referenceType": 0
      },
      {
        "propertyName": "opacityAutoTransform",
        "valueCodes": [
          178
        ],
        "referenceType": 0
      },
      {
        "propertyName": "opacityMapBlendFactor",
        "valueCodes": [
          141
        ],
        "referenceType": 0
      },
      {
        "propertyName": "opacityMapFileName",
        "valueCodes": [
          7
        ],
        "referenceType": 0
      },
      {
        "propertyName": "opacityMapSource",
        "valueCodes": [
          175
        ],
        "referenceType": 0
      },
      {
        "propertyName": "opacityMatrix",
        "valueCodes": [
          142
        ],
        "referenceType": 0
      },
      {
        "propertyName": "opacityProjectionMethod",
        "valueCodes": [
          176
        ],
        "referenceType": 0
      },
      {
        "propertyName": "opacityTilingMethod",
        "valueCodes": [
          177
        ],
        "referenceType": 0
      },
      {
        "propertyName": "reflectionAutoTransform",
        "valueCodes": [
          174
        ],
        "referenceType": 0
      },
      {
        "propertyName": "reflectionMapBlendFactor",
        "valueCodes": [
          48
        ],
        "referenceType": 0
      },
      {
        "propertyName": "reflectionMapFileName",
        "valueCodes": [
          6
        ],
        "referenceType": 0
      },
      {
        "propertyName": "reflectionMapSource",
        "valueCodes": [
          171
        ],
        "referenceType": 0
      },
      {
        "propertyName": "reflectionMatrix",
        "valueCodes": [
          49
        ],
        "referenceType": 0
      },
      {
        "propertyName": "reflectionProjectionMethod",
        "valueCodes": [
          172
        ],
        "referenceType": 0
      },
      {
        "propertyName": "reflectionTilingMethod",
        "valueCodes": [
          173
        ],
        "referenceType": 0
      },
      {
        "propertyName": "reflectivity",
        "valueCodes": [
          468
        ],
        "referenceType": 0
      },
      {
        "propertyName": "refractionAutoTransform",
        "valueCodes": [
          276
        ],
        "referenceType": 0
      },
      {
        "propertyName": "refractionIndex",
        "valueCodes": [
          145
        ],
        "referenceType": 0
      },
      {
        "propertyName": "refractionMapBlendFactor",
        "valueCodes": [
          146
        ],
        "referenceType": 0
      },
      {
        "propertyName": "refractionMapFileName",
        "valueCodes": [
          9
        ],
        "referenceType": 0
      },
      {
        "propertyName": "refractionMapSource",
        "valueCodes": [
          273
        ],
        "referenceType": 0
      },
      {
        "propertyName": "refractionMatrix",
        "valueCodes": [
          147
        ],
        "referenceType": 0
      },
      {
        "propertyName": "refractionProjectionMethod",
        "valueCodes": [
          274
        ],
        "referenceType": 0
      },
      {
        "propertyName": "refractionTilingMethod",
        "valueCodes": [
          275
        ],
        "referenceType": 0
      },
      {
        "propertyName": "specularAutoTransform",
        "valueCodes": [
          170
        ],
        "referenceType": 0
      },
      {
        "propertyName": "specularColor",
        "valueCodes": [
          92
        ],
        "referenceType": 0
      },
      {
        "propertyName": "specularColorFactor",
        "valueCodes": [
          45
        ],
        "referenceType": 0
      },
      {
        "propertyName": "specularColorMethod",
        "valueCodes": [
          76
        ],
        "referenceType": 0
      },
      {
        "propertyName": "specularGlossFactor",
        "valueCodes": [
          44
        ],
        "referenceType": 0
      },
      {
        "propertyName": "specularMapBlendFactor",
        "valueCodes": [
          46
        ],
        "referenceType": 0
      },
      {
        "propertyName": "specularMapFileName",
        "valueCodes": [
          4
        ],
        "referenceType": 0
      },
      {
        "propertyName": "specularMapSource",
        "valueCodes": [
          77
        ],
        "referenceType": 0
      },
      {
        "propertyName": "specularMatrix",
        "valueCodes": [
          47
        ],
        "referenceType": 0
      },
      {
        "propertyName": "specularProjectionMethod",
        "valueCodes": [
          78
        ],
        "referenceType": 0
      },
      {
        "propertyName": "specularTilingMethod",
        "valueCodes": [
          79
        ],
        "referenceType": 0
      },
      {
        "propertyName": "translucence",
        "valueCodes": [
          148
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "MATERIAL",
    "dxfSubClassName": "AcDbMaterial"
  },
  {
    "typeName": "MLineStyle",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "description",
        "valueCodes": [
          3
        ],
        "referenceType": 0
      },
      {
        "propertyName": "elements",
        "valueCodes": [
          71
        ],
        "referenceType": 4
      },
      {
        "propertyName": "endAngle",
        "valueCodes": [
          52
        ],
        "referenceType": 32
      },
      {
        "propertyName": "fillColor",
        "valueCodes": [
          62
        ],
        "referenceType": 0
      },
      {
        "propertyName": "flags",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "startAngle",
        "valueCodes": [
          51
        ],
        "referenceType": 32
      }
    ],
    "systemVariables": [],
    "dxfName": "MLINESTYLE",
    "dxfSubClassName": "AcDbMlineStyle"
  },
  {
    "typeName": "MTextAttributeObjectContextData",
    "baseTypeName": "AnnotScaleObjectContextData",
    "properties": [
      {
        "propertyName": "alignmentPoint",
        "valueCodes": [
          11,
          21,
          31
        ],
        "referenceType": 0
      },
      {
        "propertyName": "attachmentPoint",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "insertPoint",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "rotation",
        "valueCodes": [
          50
        ],
        "referenceType": 32
      },
      {
        "propertyName": "value290",
        "valueCodes": [
          290
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "ACDB_MTEXTATTRIBUTEOBJECTCONTEXTDATA_CLASS",
    "dxfSubClassName": "AcDbAnnotScaleObjectContextData"
  },
  {
    "typeName": "MultiLeaderObjectContextData",
    "baseTypeName": "AnnotScaleObjectContextData",
    "properties": [
      {
        "propertyName": "arrowheadSize",
        "valueCodes": [
          140
        ],
        "referenceType": 0
      },
      {
        "propertyName": "backgroundFillColor",
        "valueCodes": [
          91
        ],
        "referenceType": 0
      },
      {
        "propertyName": "backgroundFillEnabled",
        "valueCodes": [
          291
        ],
        "referenceType": 0
      },
      {
        "propertyName": "backgroundMaskFillOn",
        "valueCodes": [
          292
        ],
        "referenceType": 0
      },
      {
        "propertyName": "backgroundScaleFactor",
        "valueCodes": [
          141
        ],
        "referenceType": 0
      },
      {
        "propertyName": "backgroundTransparency",
        "valueCodes": [
          92
        ],
        "referenceType": 0
      },
      {
        "propertyName": "baseDirection",
        "valueCodes": [
          111,
          121,
          131
        ],
        "referenceType": 0
      },
      {
        "propertyName": "basePoint",
        "valueCodes": [
          110,
          120,
          130
        ],
        "referenceType": 0
      },
      {
        "propertyName": "baseVertical",
        "valueCodes": [
          112,
          122,
          132
        ],
        "referenceType": 0
      },
      {
        "propertyName": "blockContent",
        "valueCodes": [
          341
        ],
        "referenceType": 1
      },
      {
        "propertyName": "blockContentColor",
        "valueCodes": [
          93
        ],
        "referenceType": 0
      },
      {
        "propertyName": "blockContentConnection",
        "valueCodes": [
          177
        ],
        "referenceType": 0
      },
      {
        "propertyName": "blockContentLocation",
        "valueCodes": [
          15,
          25,
          35
        ],
        "referenceType": 0
      },
      {
        "propertyName": "blockContentNormal",
        "valueCodes": [
          14,
          24,
          34
        ],
        "referenceType": 0
      },
      {
        "propertyName": "blockContentRotation",
        "valueCodes": [
          46
        ],
        "referenceType": 32
      },
      {
        "propertyName": "blockContentScale",
        "valueCodes": [
          16,
          26,
          36
        ],
        "referenceType": 0
      },
      {
        "propertyName": "boundaryHeight",
        "valueCodes": [
          44
        ],
        "referenceType": 0
      },
      {
        "propertyName": "boundaryWidth",
        "valueCodes": [
          43
        ],
        "referenceType": 0
      },
      {
        "propertyName": "columnFlowReversed",
        "valueCodes": [
          294
        ],
        "referenceType": 0
      },
      {
        "propertyName": "columnGutter",
        "valueCodes": [
          143
        ],
        "referenceType": 0
      },
      {
        "propertyName": "columnSizes",
        "valueCodes": [
          144
        ],
        "referenceType": 0
      },
      {
        "propertyName": "columnType",
        "valueCodes": [
          173
        ],
        "referenceType": 0
      },
      {
        "propertyName": "columnWidth",
        "valueCodes": [
          142
        ],
        "referenceType": 0
      },
      {
        "propertyName": "contentBasePoint",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "direction",
        "valueCodes": [
          13,
          23,
          33
        ],
        "referenceType": 0
      },
      {
        "propertyName": "flowDirection",
        "valueCodes": [
          172
        ],
        "referenceType": 0
      },
      {
        "propertyName": "hasContentsBlock",
        "valueCodes": [
          296
        ],
        "referenceType": 0
      },
      {
        "propertyName": "hasTextContents",
        "valueCodes": [
          290
        ],
        "referenceType": 0
      },
      {
        "propertyName": "landingGap",
        "valueCodes": [
          145
        ],
        "referenceType": 0
      },
      {
        "propertyName": "lineSpacing",
        "valueCodes": [
          170
        ],
        "referenceType": 0
      },
      {
        "propertyName": "lineSpacingFactor",
        "valueCodes": [
          45
        ],
        "referenceType": 0
      },
      {
        "propertyName": "normalReversed",
        "valueCodes": [
          297
        ],
        "referenceType": 0
      },
      {
        "propertyName": "scaleFactor",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textAlignment",
        "valueCodes": [
          176
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textAttachmentPoint",
        "valueCodes": [
          171
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textBottomAttachment",
        "valueCodes": [
          272
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textColor",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textHeight",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textHeightAutomatic",
        "valueCodes": [
          293
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textLabel",
        "valueCodes": [
          304
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textLeftAttachment",
        "valueCodes": [
          174
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textLocation",
        "valueCodes": [
          12,
          22,
          32
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textNormal",
        "valueCodes": [
          11,
          21,
          31
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textRightAttachment",
        "valueCodes": [
          175
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textRotation",
        "valueCodes": [
          42
        ],
        "referenceType": 32
      },
      {
        "propertyName": "textStyle",
        "valueCodes": [
          340
        ],
        "referenceType": 1
      },
      {
        "propertyName": "textTopAttachment",
        "valueCodes": [
          273
        ],
        "referenceType": 0
      },
      {
        "propertyName": "transformationMatrix",
        "valueCodes": [
          93
        ],
        "referenceType": 0
      },
      {
        "propertyName": "wordBreak",
        "valueCodes": [
          295
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "ACDB_MLEADEROBJECTCONTEXTDATA_CLASS",
    "dxfSubClassName": "AcDbMLeaderObjectContextData"
  },
  {
    "typeName": "MultiLeaderStyle",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "alignSpace",
        "valueCodes": [
          46
        ],
        "referenceType": 0
      },
      {
        "propertyName": "arrowhead",
        "valueCodes": [
          341
        ],
        "referenceType": 1
      },
      {
        "propertyName": "arrowheadSize",
        "valueCodes": [
          44
        ],
        "referenceType": 0
      },
      {
        "propertyName": "blockContent",
        "valueCodes": [
          343
        ],
        "referenceType": 1
      },
      {
        "propertyName": "blockContentColor",
        "valueCodes": [
          94
        ],
        "referenceType": 0
      },
      {
        "propertyName": "blockContentConnection",
        "valueCodes": [
          177
        ],
        "referenceType": 0
      },
      {
        "propertyName": "blockContentRotation",
        "valueCodes": [
          141
        ],
        "referenceType": 32
      },
      {
        "propertyName": "blockContentScaleX",
        "valueCodes": [
          47
        ],
        "referenceType": 0
      },
      {
        "propertyName": "blockContentScaleY",
        "valueCodes": [
          49
        ],
        "referenceType": 0
      },
      {
        "propertyName": "blockContentScaleZ",
        "valueCodes": [
          140
        ],
        "referenceType": 0
      },
      {
        "propertyName": "breakGapSize",
        "valueCodes": [
          143
        ],
        "referenceType": 0
      },
      {
        "propertyName": "contentType",
        "valueCodes": [
          170
        ],
        "referenceType": 0
      },
      {
        "propertyName": "defaultTextContents",
        "valueCodes": [
          300
        ],
        "referenceType": 0
      },
      {
        "propertyName": "description",
        "valueCodes": [
          3
        ],
        "referenceType": 0
      },
      {
        "propertyName": "enableBlockContentRotation",
        "valueCodes": [
          294
        ],
        "referenceType": 0
      },
      {
        "propertyName": "enableBlockContentScale",
        "valueCodes": [
          293
        ],
        "referenceType": 0
      },
      {
        "propertyName": "enableDogleg",
        "valueCodes": [
          291
        ],
        "referenceType": 0
      },
      {
        "propertyName": "enableLanding",
        "valueCodes": [
          290
        ],
        "referenceType": 0
      },
      {
        "propertyName": "firstSegmentAngleConstraint",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isAnnotative",
        "valueCodes": [
          296
        ],
        "referenceType": 0
      },
      {
        "propertyName": "landingDistance",
        "valueCodes": [
          43
        ],
        "referenceType": 0
      },
      {
        "propertyName": "landingGap",
        "valueCodes": [
          42
        ],
        "referenceType": 0
      },
      {
        "propertyName": "leaderDrawOrder",
        "valueCodes": [
          172
        ],
        "referenceType": 0
      },
      {
        "propertyName": "leaderLineType",
        "valueCodes": [
          340
        ],
        "referenceType": 1
      },
      {
        "propertyName": "leaderLineWeight",
        "valueCodes": [
          92
        ],
        "referenceType": 0
      },
      {
        "propertyName": "lineColor",
        "valueCodes": [
          91
        ],
        "referenceType": 0
      },
      {
        "propertyName": "maxLeaderSegmentsPoints",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "multiLeaderDrawOrder",
        "valueCodes": [
          171
        ],
        "referenceType": 0
      },
      {
        "propertyName": "overwritePropertyValue",
        "valueCodes": [
          295
        ],
        "referenceType": 0
      },
      {
        "propertyName": "pathType",
        "valueCodes": [
          173
        ],
        "referenceType": 0
      },
      {
        "propertyName": "scaleFactor",
        "valueCodes": [
          142
        ],
        "referenceType": 0
      },
      {
        "propertyName": "secondSegmentAngleConstraint",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textAlignAlwaysLeft",
        "valueCodes": [
          297
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textAlignment",
        "valueCodes": [
          176
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textAngle",
        "valueCodes": [
          175
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textAttachmentDirection",
        "valueCodes": [
          271
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textBottomAttachment",
        "valueCodes": [
          272
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textColor",
        "valueCodes": [
          93
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textFrame",
        "valueCodes": [
          292
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textHeight",
        "valueCodes": [
          45
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textLeftAttachment",
        "valueCodes": [
          174
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textRightAttachment",
        "valueCodes": [
          178
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textStyle",
        "valueCodes": [
          342
        ],
        "referenceType": 1
      },
      {
        "propertyName": "textTopAttachment",
        "valueCodes": [
          273
        ],
        "referenceType": 0
      },
      {
        "propertyName": "unknownFlag298",
        "valueCodes": [
          298
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "MLEADERSTYLE",
    "dxfSubClassName": "AcDbMLeaderStyle"
  },
  {
    "typeName": "ObjectContextData",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "version",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "hasFileToExtensionDictionary",
        "valueCodes": [],
        "referenceType": 0
      },
      {
        "propertyName": "default",
        "valueCodes": [
          290
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbObjectContextData"
  },
  {
    "typeName": "PdfUnderlayDefinition",
    "baseTypeName": "UnderlayDefinition",
    "properties": [
      {
        "propertyName": "page",
        "valueCodes": [
          2
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "PDFDEFINITION",
    "dxfSubClassName": "AcDbUnderlayDefinition"
  },
  {
    "typeName": "PlotSettings",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "denominatorScale",
        "valueCodes": [
          143
        ],
        "referenceType": 0
      },
      {
        "propertyName": "flags",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "numeratorScale",
        "valueCodes": [
          142
        ],
        "referenceType": 0
      },
      {
        "propertyName": "pageName",
        "valueCodes": [
          1
        ],
        "referenceType": 0
      },
      {
        "propertyName": "paperHeight",
        "valueCodes": [
          45
        ],
        "referenceType": 0
      },
      {
        "propertyName": "paperImageOriginX",
        "valueCodes": [
          148
        ],
        "referenceType": 0
      },
      {
        "propertyName": "paperImageOriginY",
        "valueCodes": [
          149
        ],
        "referenceType": 0
      },
      {
        "propertyName": "paperRotation",
        "valueCodes": [
          73
        ],
        "referenceType": 0
      },
      {
        "propertyName": "paperSize",
        "valueCodes": [
          4
        ],
        "referenceType": 0
      },
      {
        "propertyName": "paperUnits",
        "valueCodes": [
          72
        ],
        "referenceType": 0
      },
      {
        "propertyName": "paperWidth",
        "valueCodes": [
          44
        ],
        "referenceType": 0
      },
      {
        "propertyName": "plotOriginX",
        "valueCodes": [
          46
        ],
        "referenceType": 0
      },
      {
        "propertyName": "plotOriginY",
        "valueCodes": [
          47
        ],
        "referenceType": 0
      },
      {
        "propertyName": "plotType",
        "valueCodes": [
          74
        ],
        "referenceType": 0
      },
      {
        "propertyName": "plotViewName",
        "valueCodes": [
          6
        ],
        "referenceType": 0
      },
      {
        "propertyName": "scaledFit",
        "valueCodes": [
          75
        ],
        "referenceType": 0
      },
      {
        "propertyName": "shadePlotDPI",
        "valueCodes": [
          78
        ],
        "referenceType": 0
      },
      {
        "propertyName": "shadePlotIDHandle",
        "valueCodes": [
          333
        ],
        "referenceType": 16
      },
      {
        "propertyName": "shadePlotMode",
        "valueCodes": [
          76
        ],
        "referenceType": 0
      },
      {
        "propertyName": "shadePlotResolutionMode",
        "valueCodes": [
          77
        ],
        "referenceType": 0
      },
      {
        "propertyName": "standardScale",
        "valueCodes": [
          147
        ],
        "referenceType": 0
      },
      {
        "propertyName": "styleSheet",
        "valueCodes": [
          7
        ],
        "referenceType": 0
      },
      {
        "propertyName": "systemPrinterName",
        "valueCodes": [
          2
        ],
        "referenceType": 0
      },
      {
        "propertyName": "unprintableMargin",
        "valueCodes": [
          40,
          41,
          42,
          43
        ],
        "referenceType": 0
      },
      {
        "propertyName": "windowLowerLeftX",
        "valueCodes": [
          48
        ],
        "referenceType": 0
      },
      {
        "propertyName": "windowLowerLeftY",
        "valueCodes": [
          49
        ],
        "referenceType": 0
      },
      {
        "propertyName": "windowUpperLeftX",
        "valueCodes": [
          140
        ],
        "referenceType": 0
      },
      {
        "propertyName": "windowUpperLeftY",
        "valueCodes": [
          141
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "PLOTSETTINGS",
    "dxfSubClassName": "AcDbPlotSettings"
  },
  {
    "typeName": "ProxyObject",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "classId",
        "valueCodes": [
          91
        ],
        "referenceType": 0
      },
      {
        "propertyName": "drawingFormat",
        "valueCodes": [
          95
        ],
        "referenceType": 0
      },
      {
        "propertyName": "originalDataFormatDxf",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "proxyClassId",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "binaryData",
        "valueCodes": [
          310
        ],
        "referenceType": 0
      },
      {
        "propertyName": "data",
        "valueCodes": [
          311
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "ACAD_PROXY_OBJECT",
    "dxfSubClassName": "AcDbProxyObject"
  },
  {
    "typeName": "RasterVariables",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "classVersion",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "displayQuality",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isDisplayFrameShown",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "units",
        "valueCodes": [
          72
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "RASTERVARIABLES",
    "dxfSubClassName": "AcDbRasterVariables"
  },
  {
    "typeName": "Scale",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "paperUnits",
        "valueCodes": [
          140
        ],
        "referenceType": 0
      },
      {
        "propertyName": "drawingUnits",
        "valueCodes": [
          141
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isUnitScale",
        "valueCodes": [
          290
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "SCALE",
    "dxfSubClassName": "AcDbScale"
  },
  {
    "typeName": "SortEntitiesTable",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "blockOwner",
        "valueCodes": [
          330
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "SORTENTSTABLE",
    "dxfSubClassName": "AcDbSortentsTable"
  },
  {
    "typeName": "SpatialFilter",
    "baseTypeName": "Filter",
    "properties": [
      {
        "propertyName": "backDistance",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "boundaryPoints",
        "valueCodes": [
          70
        ],
        "referenceType": 4,
        "collectionCodes": [
          10,
          20
        ]
      },
      {
        "propertyName": "clipBackPlane",
        "valueCodes": [
          73
        ],
        "referenceType": 0
      },
      {
        "propertyName": "clipFrontPlane",
        "valueCodes": [
          72
        ],
        "referenceType": 0
      },
      {
        "propertyName": "displayBoundary",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "frontDistance",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "normal",
        "valueCodes": [
          210,
          220,
          230
        ],
        "referenceType": 0
      },
      {
        "propertyName": "origin",
        "valueCodes": [
          11,
          21,
          31
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "SPATIAL_FILTER",
    "dxfSubClassName": "AcDbSpatialFilter"
  },
  {
    "typeName": "TableStyle",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "description",
        "valueCodes": [
          3
        ],
        "referenceType": 0
      },
      {
        "propertyName": "flags",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "flowDirection",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "horizontalCellMargin",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "suppressHeaderRow",
        "valueCodes": [
          281
        ],
        "referenceType": 0
      },
      {
        "propertyName": "suppressTitle",
        "valueCodes": [
          280
        ],
        "referenceType": 0
      },
      {
        "propertyName": "verticalCellMargin",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "STYLE",
    "dxfSubClassName": "AcDbTableStyle"
  },
  {
    "typeName": "UnderlayDefinition",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "file",
        "valueCodes": [
          1
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassIsEmpty": true
  },
  {
    "typeName": "VisualStyle",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "brightness",
        "valueCodes": [
          44
        ],
        "referenceType": 0
      },
      {
        "propertyName": "color",
        "valueCodes": [
          62,
          63
        ],
        "referenceType": 0
      },
      {
        "propertyName": "description",
        "valueCodes": [
          2
        ],
        "referenceType": 0
      },
      {
        "propertyName": "displaySettings",
        "valueCodes": [
          93
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeApplyStyleFlag",
        "valueCodes": [
          174
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeColor",
        "valueCodes": [
          66
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeCreaseAngle",
        "valueCodes": [
          42
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeIntersectionColor",
        "valueCodes": [
          64
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeIntersectionLineType",
        "valueCodes": [
          175
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeIsolineCount",
        "valueCodes": [
          171
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeJitter",
        "valueCodes": [
          78
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeModifiers",
        "valueCodes": [
          92
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeObscuredColor",
        "valueCodes": [
          65
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeObscuredLineType",
        "valueCodes": [
          75
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeOverhang",
        "valueCodes": [
          77
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeSilhouetteColor",
        "valueCodes": [
          67
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeSilhouetteWidth",
        "valueCodes": [
          79
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeStyle",
        "valueCodes": [
          91
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeStyleModel",
        "valueCodes": [
          74
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edgeWidth",
        "valueCodes": [
          76
        ],
        "referenceType": 0
      },
      {
        "propertyName": "faceColorMode",
        "valueCodes": [
          73
        ],
        "referenceType": 0
      },
      {
        "propertyName": "faceLightingModel",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "faceLightingQuality",
        "valueCodes": [
          72
        ],
        "referenceType": 0
      },
      {
        "propertyName": "faceModifiers",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "faceOpacityLevel",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "faceSpecularLevel",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "faceStyleMonoColor",
        "valueCodes": [
          421
        ],
        "referenceType": 0
      },
      {
        "propertyName": "haloGap",
        "valueCodes": [
          170
        ],
        "referenceType": 0
      },
      {
        "propertyName": "internalFlag",
        "valueCodes": [
          291
        ],
        "referenceType": 0
      },
      {
        "propertyName": "opacityLevel",
        "valueCodes": [
          43
        ],
        "referenceType": 0
      },
      {
        "propertyName": "precisionFlag",
        "valueCodes": [
          290
        ],
        "referenceType": 0
      },
      {
        "propertyName": "rasterFile",
        "valueCodes": [
          1
        ],
        "referenceType": 0
      },
      {
        "propertyName": "shadowType",
        "valueCodes": [
          173
        ],
        "referenceType": 0
      },
      {
        "propertyName": "type",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "VISUALSTYLE",
    "dxfSubClassName": "AcDbVisualStyle"
  },
  {
    "typeName": "XRecord",
    "baseTypeName": "NonGraphicalObject",
    "properties": [
      {
        "propertyName": "cloningFlags",
        "valueCodes": [
          280
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "XRECORD",
    "dxfSubClassName": "AcDbXrecord"
  }
] as const;
