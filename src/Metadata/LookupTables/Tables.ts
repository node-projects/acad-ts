import { ClassMetadata } from '../MetadataTypes.js';

export const metadataLookupTables: readonly ClassMetadata[] = [
  {
    "typeName": "AppId",
    "baseTypeName": "TableEntry",
    "properties": [],
    "systemVariables": [],
    "dxfName": "APPID",
    "dxfSubClassName": "AcDbRegAppTableRecord"
  },
  {
    "typeName": "BlockRecord",
    "baseTypeName": "TableEntry",
    "properties": [
      {
        "propertyName": "canScale",
        "valueCodes": [
          281
        ],
        "referenceType": 8
      },
      {
        "propertyName": "isExplodable",
        "valueCodes": [
          280
        ],
        "referenceType": 8
      },
      {
        "propertyName": "layout",
        "valueCodes": [
          340
        ],
        "referenceType": 1
      },
      {
        "propertyName": "preview",
        "valueCodes": [
          310
        ],
        "referenceType": 8
      }
    ],
    "systemVariables": [],
    "dxfName": "BLOCK_RECORD",
    "dxfSubClassName": "AcDbBlockTableRecord"
  },
  {
    "typeName": "DimensionStyle",
    "baseTypeName": "TableEntry",
    "properties": [
      {
        "propertyName": "alternateDimensioningSuffix",
        "valueCodes": [
          4
        ],
        "referenceType": 0
      },
      {
        "propertyName": "alternateUnitDecimalPlaces",
        "valueCodes": [
          171
        ],
        "referenceType": 0
      },
      {
        "propertyName": "alternateUnitDimensioning",
        "valueCodes": [
          170
        ],
        "referenceType": 0
      },
      {
        "propertyName": "alternateUnitFormat",
        "valueCodes": [
          273
        ],
        "referenceType": 0
      },
      {
        "propertyName": "alternateUnitRounding",
        "valueCodes": [
          148
        ],
        "referenceType": 0
      },
      {
        "propertyName": "alternateUnitScaleFactor",
        "valueCodes": [
          143
        ],
        "referenceType": 0
      },
      {
        "propertyName": "alternateUnitToleranceDecimalPlaces",
        "valueCodes": [
          274
        ],
        "referenceType": 0
      },
      {
        "propertyName": "alternateUnitToleranceZeroHandling",
        "valueCodes": [
          286
        ],
        "referenceType": 0
      },
      {
        "propertyName": "alternateUnitZeroHandling",
        "valueCodes": [
          285
        ],
        "referenceType": 0
      },
      {
        "propertyName": "angularDecimalPlaces",
        "valueCodes": [
          179
        ],
        "referenceType": 0
      },
      {
        "propertyName": "angularUnit",
        "valueCodes": [
          275
        ],
        "referenceType": 0
      },
      {
        "propertyName": "angularZeroHandling",
        "valueCodes": [
          79
        ],
        "referenceType": 0
      },
      {
        "propertyName": "arcLengthSymbolPosition",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "arrowBlock",
        "valueCodes": [
          342
        ],
        "referenceType": 1
      },
      {
        "propertyName": "arrowSize",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "centerMarkSize",
        "valueCodes": [
          141
        ],
        "referenceType": 0
      },
      {
        "propertyName": "cursorUpdate",
        "valueCodes": [
          288
        ],
        "referenceType": 0
      },
      {
        "propertyName": "decimalPlaces",
        "valueCodes": [
          271
        ],
        "referenceType": 0
      },
      {
        "propertyName": "decimalSeparator",
        "valueCodes": [
          278
        ],
        "referenceType": 0
      },
      {
        "propertyName": "dimArrow1",
        "valueCodes": [
          343
        ],
        "referenceType": 1
      },
      {
        "propertyName": "dimArrow2",
        "valueCodes": [
          344
        ],
        "referenceType": 1
      },
      {
        "propertyName": "dimensionFit",
        "valueCodes": [
          287
        ],
        "referenceType": 0
      },
      {
        "propertyName": "dimensionLineColor",
        "valueCodes": [
          176
        ],
        "referenceType": 0
      },
      {
        "propertyName": "dimensionLineExtension",
        "valueCodes": [
          46
        ],
        "referenceType": 0
      },
      {
        "propertyName": "dimensionLineGap",
        "valueCodes": [
          147
        ],
        "referenceType": 0
      },
      {
        "propertyName": "dimensionLineIncrement",
        "valueCodes": [
          43
        ],
        "referenceType": 0
      },
      {
        "propertyName": "dimensionLineWeight",
        "valueCodes": [
          371
        ],
        "referenceType": 0
      },
      {
        "propertyName": "dimensionTextArrowFit",
        "valueCodes": [
          289
        ],
        "referenceType": 0
      },
      {
        "propertyName": "dimensionUnit",
        "valueCodes": [
          270
        ],
        "referenceType": 0
      },
      {
        "propertyName": "extensionLineColor",
        "valueCodes": [
          177
        ],
        "referenceType": 0
      },
      {
        "propertyName": "extensionLineExtension",
        "valueCodes": [
          44
        ],
        "referenceType": 0
      },
      {
        "propertyName": "extensionLineOffset",
        "valueCodes": [
          42
        ],
        "referenceType": 0
      },
      {
        "propertyName": "extensionLineWeight",
        "valueCodes": [
          372
        ],
        "referenceType": 0
      },
      {
        "propertyName": "fixedExtensionLineLength",
        "valueCodes": [
          49
        ],
        "referenceType": 0
      },
      {
        "propertyName": "fractionFormat",
        "valueCodes": [
          276
        ],
        "referenceType": 0
      },
      {
        "propertyName": "generateTolerances",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isExtensionLineLengthFixed",
        "valueCodes": [
          290
        ],
        "referenceType": 0
      },
      {
        "propertyName": "joggedRadiusDimensionTransverseSegmentAngle",
        "valueCodes": [
          50
        ],
        "referenceType": 32
      },
      {
        "propertyName": "leaderArrow",
        "valueCodes": [
          341
        ],
        "referenceType": 1
      },
      {
        "propertyName": "limitsGeneration",
        "valueCodes": [
          72
        ],
        "referenceType": 0
      },
      {
        "propertyName": "linearScaleFactor",
        "valueCodes": [
          144
        ],
        "referenceType": 0
      },
      {
        "propertyName": "linearUnitFormat",
        "valueCodes": [
          277
        ],
        "referenceType": 0
      },
      {
        "propertyName": "lineType",
        "valueCodes": [
          345
        ],
        "referenceType": 1
      },
      {
        "propertyName": "lineTypeExt1",
        "valueCodes": [
          346
        ],
        "referenceType": 1
      },
      {
        "propertyName": "lineTypeExt2",
        "valueCodes": [
          347
        ],
        "referenceType": 1
      },
      {
        "propertyName": "minusTolerance",
        "valueCodes": [
          48
        ],
        "referenceType": 0
      },
      {
        "propertyName": "plusTolerance",
        "valueCodes": [
          47
        ],
        "referenceType": 0
      },
      {
        "propertyName": "postFix",
        "valueCodes": [
          3
        ],
        "referenceType": 0
      },
      {
        "propertyName": "rounding",
        "valueCodes": [
          45
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
        "propertyName": "separateArrowBlocks",
        "valueCodes": [
          173
        ],
        "referenceType": 0
      },
      {
        "propertyName": "style",
        "valueCodes": [
          340
        ],
        "referenceType": 1
      },
      {
        "propertyName": "suppressFirstDimensionLine",
        "valueCodes": [
          281
        ],
        "referenceType": 0
      },
      {
        "propertyName": "suppressFirstExtensionLine",
        "valueCodes": [
          75
        ],
        "referenceType": 0
      },
      {
        "propertyName": "suppressOutsideExtensions",
        "valueCodes": [
          175
        ],
        "referenceType": 0
      },
      {
        "propertyName": "suppressSecondDimensionLine",
        "valueCodes": [
          282
        ],
        "referenceType": 0
      },
      {
        "propertyName": "suppressSecondExtensionLine",
        "valueCodes": [
          76
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textBackgroundFillMode",
        "valueCodes": [
          69
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textColor",
        "valueCodes": [
          178
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textDirection",
        "valueCodes": [
          295
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textHeight",
        "valueCodes": [
          140
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textHorizontalAlignment",
        "valueCodes": [
          280
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textInsideExtensions",
        "valueCodes": [
          174
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textInsideHorizontal",
        "valueCodes": [
          73
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textMovement",
        "valueCodes": [
          279
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textOutsideExtensions",
        "valueCodes": [
          172
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textOutsideHorizontal",
        "valueCodes": [
          74
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textVerticalAlignment",
        "valueCodes": [
          77
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textVerticalPosition",
        "valueCodes": [
          145
        ],
        "referenceType": 0
      },
      {
        "propertyName": "tickSize",
        "valueCodes": [
          142
        ],
        "referenceType": 0
      },
      {
        "propertyName": "toleranceAlignment",
        "valueCodes": [
          283
        ],
        "referenceType": 0
      },
      {
        "propertyName": "toleranceDecimalPlaces",
        "valueCodes": [
          272
        ],
        "referenceType": 0
      },
      {
        "propertyName": "toleranceScaleFactor",
        "valueCodes": [
          146
        ],
        "referenceType": 0
      },
      {
        "propertyName": "toleranceZeroHandling",
        "valueCodes": [
          284
        ],
        "referenceType": 0
      },
      {
        "propertyName": "zeroHandling",
        "valueCodes": [
          78
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "DIMSTYLE",
    "dxfSubClassName": "AcDbDimStyleTableRecord"
  },
  {
    "typeName": "Layer",
    "baseTypeName": "TableEntry",
    "properties": [
      {
        "propertyName": "color",
        "valueCodes": [
          62,
          420,
          430
        ],
        "referenceType": 0
      },
      {
        "propertyName": "lineType",
        "valueCodes": [
          6
        ],
        "referenceType": 2
      },
      {
        "propertyName": "lineWeight",
        "valueCodes": [
          370
        ],
        "referenceType": 0
      },
      {
        "propertyName": "material",
        "valueCodes": [
          347
        ],
        "referenceType": 1
      },
      {
        "propertyName": "plotFlag",
        "valueCodes": [
          290
        ],
        "referenceType": 0
      },
      {
        "propertyName": "plotStyleName",
        "valueCodes": [
          390
        ],
        "referenceType": 64
      }
    ],
    "systemVariables": [],
    "dxfName": "LAYER",
    "dxfSubClassName": "AcDbLayerTableRecord"
  },
  {
    "typeName": "LineType",
    "baseTypeName": "TableEntry",
    "properties": [
      {
        "propertyName": "alignment",
        "valueCodes": [
          72
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
        "propertyName": "patternLength",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "segments",
        "valueCodes": [
          73
        ],
        "referenceType": 4
      }
    ],
    "systemVariables": [],
    "dxfName": "LTYPE",
    "dxfSubClassName": "AcDbLinetypeTableRecord"
  },
  {
    "typeName": "Table",
    "properties": [
      {
        "propertyName": "count",
        "valueCodes": [
          70
        ],
        "referenceType": 4
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbSymbolTable"
  },
  {
    "typeName": "TableEntry",
    "baseTypeName": "CadObject",
    "properties": [
      {
        "propertyName": "flags",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "name",
        "valueCodes": [
          2
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbSymbolTableRecord",
    "dxfSubClassIsEmpty": true
  },
  {
    "typeName": "TextStyle",
    "baseTypeName": "TableEntry",
    "properties": [
      {
        "propertyName": "filename",
        "valueCodes": [
          3
        ],
        "referenceType": 0
      },
      {
        "propertyName": "bigFontFilename",
        "valueCodes": [
          4
        ],
        "referenceType": 0
      },
      {
        "propertyName": "height",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "width",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "lastHeight",
        "valueCodes": [
          42
        ],
        "referenceType": 0
      },
      {
        "propertyName": "obliqueAngle",
        "valueCodes": [
          50
        ],
        "referenceType": 32
      },
      {
        "propertyName": "mirrorFlag",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "trueType",
        "valueCodes": [
          1071
        ],
        "referenceType": 8
      }
    ],
    "systemVariables": [],
    "dxfName": "STYLE",
    "dxfSubClassName": "AcDbTextStyleTableRecord"
  },
  {
    "typeName": "UCS",
    "baseTypeName": "TableEntry",
    "properties": [
      {
        "propertyName": "origin",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "xAxis",
        "valueCodes": [
          11,
          21,
          31
        ],
        "referenceType": 0
      },
      {
        "propertyName": "yAxis",
        "valueCodes": [
          12,
          22,
          32
        ],
        "referenceType": 0
      },
      {
        "propertyName": "orthographicType",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "orthographicViewType",
        "valueCodes": [
          79
        ],
        "referenceType": 0
      },
      {
        "propertyName": "elevation",
        "valueCodes": [
          146
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "UCS",
    "dxfSubClassName": "AcDbUCSTableRecord"
  },
  {
    "typeName": "View",
    "baseTypeName": "TableEntry",
    "properties": [
      {
        "propertyName": "height",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "width",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "lensLength",
        "valueCodes": [
          42
        ],
        "referenceType": 0
      },
      {
        "propertyName": "frontClipping",
        "valueCodes": [
          43
        ],
        "referenceType": 0
      },
      {
        "propertyName": "backClipping",
        "valueCodes": [
          44
        ],
        "referenceType": 0
      },
      {
        "propertyName": "angle",
        "valueCodes": [
          50
        ],
        "referenceType": 32
      },
      {
        "propertyName": "viewMode",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isUcsAssociated",
        "valueCodes": [
          72
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isPlottable",
        "valueCodes": [
          73
        ],
        "referenceType": 0
      },
      {
        "propertyName": "renderMode",
        "valueCodes": [
          281
        ],
        "referenceType": 0
      },
      {
        "propertyName": "center",
        "valueCodes": [
          10,
          20
        ],
        "referenceType": 0
      },
      {
        "propertyName": "direction",
        "valueCodes": [
          11,
          21,
          31
        ],
        "referenceType": 0
      },
      {
        "propertyName": "target",
        "valueCodes": [
          12,
          22,
          32
        ],
        "referenceType": 0
      },
      {
        "propertyName": "visualStyle",
        "valueCodes": [
          348
        ],
        "referenceType": 1
      },
      {
        "propertyName": "ucsOrigin",
        "valueCodes": [
          110,
          120,
          130
        ],
        "referenceType": 0
      },
      {
        "propertyName": "ucsXAxis",
        "valueCodes": [
          111,
          121,
          131
        ],
        "referenceType": 0
      },
      {
        "propertyName": "ucsYAxis",
        "valueCodes": [
          112,
          122,
          132
        ],
        "referenceType": 0
      },
      {
        "propertyName": "ucsElevation",
        "valueCodes": [
          146
        ],
        "referenceType": 0
      },
      {
        "propertyName": "ucsOrthographicType",
        "valueCodes": [
          79
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "VIEW",
    "dxfSubClassName": "AcDbViewTableRecord"
  },
  {
    "typeName": "VPort",
    "baseTypeName": "TableEntry",
    "properties": [
      {
        "propertyName": "bottomLeft",
        "valueCodes": [
          10,
          20
        ],
        "referenceType": 0
      },
      {
        "propertyName": "topRight",
        "valueCodes": [
          11,
          21
        ],
        "referenceType": 0
      },
      {
        "propertyName": "center",
        "valueCodes": [
          12,
          22
        ],
        "referenceType": 0
      },
      {
        "propertyName": "snapBasePoint",
        "valueCodes": [
          13,
          23
        ],
        "referenceType": 0
      },
      {
        "propertyName": "snapSpacing",
        "valueCodes": [
          14,
          24
        ],
        "referenceType": 0
      },
      {
        "propertyName": "gridSpacing",
        "valueCodes": [
          15,
          25
        ],
        "referenceType": 0
      },
      {
        "propertyName": "direction",
        "valueCodes": [
          16,
          26,
          36
        ],
        "referenceType": 0
      },
      {
        "propertyName": "target",
        "valueCodes": [
          17,
          27,
          37
        ],
        "referenceType": 0
      },
      {
        "propertyName": "aspectRatio",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "lensLength",
        "valueCodes": [
          42
        ],
        "referenceType": 0
      },
      {
        "propertyName": "frontClippingPlane",
        "valueCodes": [
          43
        ],
        "referenceType": 0
      },
      {
        "propertyName": "backClippingPlane",
        "valueCodes": [
          44
        ],
        "referenceType": 0
      },
      {
        "propertyName": "snapRotation",
        "valueCodes": [
          50
        ],
        "referenceType": 32
      },
      {
        "propertyName": "twistAngle",
        "valueCodes": [
          51
        ],
        "referenceType": 32
      },
      {
        "propertyName": "circleZoomPercent",
        "valueCodes": [
          72
        ],
        "referenceType": 0
      },
      {
        "propertyName": "renderMode",
        "valueCodes": [
          281
        ],
        "referenceType": 0
      },
      {
        "propertyName": "viewMode",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "ucsIconDisplay",
        "valueCodes": [
          74
        ],
        "referenceType": 0
      },
      {
        "propertyName": "snapOn",
        "valueCodes": [
          75
        ],
        "referenceType": 0
      },
      {
        "propertyName": "showGrid",
        "valueCodes": [
          76
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isometricSnap",
        "valueCodes": [
          77
        ],
        "referenceType": 0
      },
      {
        "propertyName": "snapIsoPair",
        "valueCodes": [
          78
        ],
        "referenceType": 0
      },
      {
        "propertyName": "origin",
        "valueCodes": [
          110,
          120,
          130
        ],
        "referenceType": 0
      },
      {
        "propertyName": "xAxis",
        "valueCodes": [
          111,
          121,
          131
        ],
        "referenceType": 0
      },
      {
        "propertyName": "yAxis",
        "valueCodes": [
          112,
          122,
          132
        ],
        "referenceType": 0
      },
      {
        "propertyName": "namedUcs",
        "valueCodes": [
          345
        ],
        "referenceType": 1
      },
      {
        "propertyName": "baseUcs",
        "valueCodes": [
          346
        ],
        "referenceType": 1
      },
      {
        "propertyName": "orthographicType",
        "valueCodes": [
          79
        ],
        "referenceType": 0
      },
      {
        "propertyName": "elevation",
        "valueCodes": [
          146
        ],
        "referenceType": 0
      },
      {
        "propertyName": "gridFlags",
        "valueCodes": [
          60
        ],
        "referenceType": 0
      },
      {
        "propertyName": "minorGridLinesPerMajorGridLine",
        "valueCodes": [
          61
        ],
        "referenceType": 0
      },
      {
        "propertyName": "visualStyle",
        "valueCodes": [
          348
        ],
        "referenceType": 1
      },
      {
        "propertyName": "useDefaultLighting",
        "valueCodes": [
          292
        ],
        "referenceType": 0
      },
      {
        "propertyName": "defaultLighting",
        "valueCodes": [
          282
        ],
        "referenceType": 0
      },
      {
        "propertyName": "brightness",
        "valueCodes": [
          141
        ],
        "referenceType": 0
      },
      {
        "propertyName": "contrast",
        "valueCodes": [
          142
        ],
        "referenceType": 0
      },
      {
        "propertyName": "ambientColor",
        "valueCodes": [
          63,
          421,
          431
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "VPORT",
    "dxfSubClassName": "AcDbViewportTableRecord"
  }
] as const;
