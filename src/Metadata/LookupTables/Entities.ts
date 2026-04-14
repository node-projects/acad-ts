import { ClassMetadata } from '../MetadataTypes.js';

export const metadataLookupEntities: readonly ClassMetadata[] = [
  {
    "typeName": "Arc",
    "baseTypeName": "Circle",
    "properties": [
      {
        "propertyName": "endAngle",
        "valueCodes": [
          51
        ],
        "referenceType": 32
      },
      {
        "propertyName": "startAngle",
        "valueCodes": [
          50
        ],
        "referenceType": 32
      }
    ],
    "systemVariables": [],
    "dxfName": "ARC",
    "dxfSubClassName": "AcDbArc"
  },
  {
    "typeName": "AttributeBase",
    "baseTypeName": "TextEntity",
    "properties": [
      {
        "propertyName": "attributeType",
        "valueCodes": [
          71
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
        "propertyName": "tag",
        "valueCodes": [
          2
        ],
        "referenceType": 0
      },
      {
        "propertyName": "version",
        "valueCodes": [
          280
        ],
        "referenceType": 0
      },
      {
        "propertyName": "verticalAlignment",
        "valueCodes": [
          74
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassIsEmpty": true
  },
  {
    "typeName": "AttributeDefinition",
    "baseTypeName": "AttributeBase",
    "properties": [
      {
        "propertyName": "prompt",
        "valueCodes": [
          3
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "ATTDEF",
    "dxfSubClassName": "AcDbAttributeDefinition"
  },
  {
    "typeName": "AttributeEntity",
    "baseTypeName": "AttributeBase",
    "properties": [],
    "systemVariables": [],
    "dxfName": "ATTRIB",
    "dxfSubClassName": "AcDbAttribute"
  },
  {
    "typeName": "CadBody",
    "baseTypeName": "ModelerGeometry",
    "properties": [],
    "systemVariables": [],
    "dxfName": "BODY"
  },
  {
    "typeName": "CadWipeoutBase",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "brightness",
        "valueCodes": [
          281
        ],
        "referenceType": 0
      },
      {
        "propertyName": "classVersion",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "clipBoundaryVertices",
        "valueCodes": [
          91
        ],
        "referenceType": 4,
        "collectionCodes": [
          14,
          24
        ]
      },
      {
        "propertyName": "clipMode",
        "valueCodes": [
          290
        ],
        "referenceType": 0
      },
      {
        "propertyName": "clippingState",
        "valueCodes": [
          280
        ],
        "referenceType": 0
      },
      {
        "propertyName": "clipType",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "contrast",
        "valueCodes": [
          282
        ],
        "referenceType": 0
      },
      {
        "propertyName": "definition",
        "valueCodes": [
          340
        ],
        "referenceType": 1
      },
      {
        "propertyName": "fade",
        "valueCodes": [
          283
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
        "propertyName": "insertPoint",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "size",
        "valueCodes": [
          13,
          23
        ],
        "referenceType": 0
      },
      {
        "propertyName": "uVector",
        "valueCodes": [
          11,
          21,
          31
        ],
        "referenceType": 0
      },
      {
        "propertyName": "vVector",
        "valueCodes": [
          12,
          22,
          32
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassIsEmpty": true
  },
  {
    "typeName": "Circle",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "center",
        "valueCodes": [
          10,
          20,
          30
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
        "propertyName": "radius",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "thickness",
        "valueCodes": [
          39
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "CIRCLE",
    "dxfSubClassName": "AcDbCircle"
  },
  {
    "typeName": "Dimension",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "attachmentPoint",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "block",
        "valueCodes": [
          2
        ],
        "referenceType": 2
      },
      {
        "propertyName": "definitionPoint",
        "valueCodes": [
          10,
          20,
          30
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
        "propertyName": "flipArrow1",
        "valueCodes": [
          74
        ],
        "referenceType": 0
      },
      {
        "propertyName": "flipArrow2",
        "valueCodes": [
          75
        ],
        "referenceType": 0
      },
      {
        "propertyName": "horizontalDirection",
        "valueCodes": [
          51
        ],
        "referenceType": 8
      },
      {
        "propertyName": "insertionPoint",
        "valueCodes": [
          12,
          22,
          32
        ],
        "referenceType": 0
      },
      {
        "propertyName": "lineSpacingFactor",
        "valueCodes": [
          41
        ],
        "referenceType": 8
      },
      {
        "propertyName": "lineSpacingStyle",
        "valueCodes": [
          72
        ],
        "referenceType": 8
      },
      {
        "propertyName": "measurement",
        "valueCodes": [
          42
        ],
        "referenceType": 8
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
        "propertyName": "style",
        "valueCodes": [
          3
        ],
        "referenceType": 2
      },
      {
        "propertyName": "text",
        "valueCodes": [
          1
        ],
        "referenceType": 8
      },
      {
        "propertyName": "textMiddlePoint",
        "valueCodes": [
          11,
          21,
          31
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textRotation",
        "valueCodes": [
          53
        ],
        "referenceType": 8
      },
      {
        "propertyName": "version",
        "valueCodes": [
          280
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "DIMENSION",
    "dxfSubClassName": "AcDbDimension"
  },
  {
    "typeName": "DimensionAligned",
    "baseTypeName": "Dimension",
    "properties": [
      {
        "propertyName": "extLineRotation",
        "valueCodes": [
          52
        ],
        "referenceType": 8
      },
      {
        "propertyName": "firstPoint",
        "valueCodes": [
          13,
          23,
          33
        ],
        "referenceType": 0
      },
      {
        "propertyName": "secondPoint",
        "valueCodes": [
          14,
          24,
          34
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "DIMENSION",
    "dxfSubClassName": "AcDbAlignedDimension"
  },
  {
    "typeName": "DimensionAngular2Line",
    "baseTypeName": "Dimension",
    "properties": [
      {
        "propertyName": "angleVertex",
        "valueCodes": [
          15,
          25,
          35
        ],
        "referenceType": 0
      },
      {
        "propertyName": "dimensionArc",
        "valueCodes": [
          16,
          26,
          36
        ],
        "referenceType": 0
      },
      {
        "propertyName": "firstPoint",
        "valueCodes": [
          13,
          23,
          33
        ],
        "referenceType": 0
      },
      {
        "propertyName": "secondPoint",
        "valueCodes": [
          14,
          24,
          34
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "DIMENSION",
    "dxfSubClassName": "AcDb2LineAngularDimension"
  },
  {
    "typeName": "DimensionAngular3Pt",
    "baseTypeName": "Dimension",
    "properties": [
      {
        "propertyName": "angleVertex",
        "valueCodes": [
          15,
          25,
          35
        ],
        "referenceType": 0
      },
      {
        "propertyName": "firstPoint",
        "valueCodes": [
          13,
          23,
          33
        ],
        "referenceType": 0
      },
      {
        "propertyName": "secondPoint",
        "valueCodes": [
          14,
          24,
          34
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "DIMENSION",
    "dxfSubClassName": "AcDb3PointAngularDimension"
  },
  {
    "typeName": "DimensionDiameter",
    "baseTypeName": "Dimension",
    "properties": [
      {
        "propertyName": "angleVertex",
        "valueCodes": [
          15,
          25,
          35
        ],
        "referenceType": 0
      },
      {
        "propertyName": "leaderLength",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "DIMENSION",
    "dxfSubClassName": "AcDbDiametricDimension"
  },
  {
    "typeName": "DimensionLinear",
    "baseTypeName": "DimensionAligned",
    "properties": [
      {
        "propertyName": "rotation",
        "valueCodes": [
          50
        ],
        "referenceType": 32
      }
    ],
    "systemVariables": [],
    "dxfName": "DIMENSION",
    "dxfSubClassName": "AcDbRotatedDimension"
  },
  {
    "typeName": "DimensionOrdinate",
    "baseTypeName": "Dimension",
    "properties": [
      {
        "propertyName": "featureLocation",
        "valueCodes": [
          13,
          23,
          33
        ],
        "referenceType": 0
      },
      {
        "propertyName": "leaderEndpoint",
        "valueCodes": [
          14,
          24,
          34
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "DIMENSION",
    "dxfSubClassName": "AcDbOrdinateDimension"
  },
  {
    "typeName": "DimensionRadius",
    "baseTypeName": "Dimension",
    "properties": [
      {
        "propertyName": "angleVertex",
        "valueCodes": [
          15,
          25,
          35
        ],
        "referenceType": 0
      },
      {
        "propertyName": "leaderLength",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "DIMENSION",
    "dxfSubClassName": "AcDbRadialDimension"
  },
  {
    "typeName": "Ellipse",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "center",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "endParameter",
        "valueCodes": [
          42
        ],
        "referenceType": 0
      },
      {
        "propertyName": "majorAxisEndPoint",
        "valueCodes": [
          11,
          21,
          31
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
        "propertyName": "radiusRatio",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "startParameter",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "thickness",
        "valueCodes": [
          39
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "ELLIPSE",
    "dxfSubClassName": "AcDbEllipse"
  },
  {
    "typeName": "Entity",
    "baseTypeName": "CadObject",
    "properties": [
      {
        "propertyName": "bookColor",
        "valueCodes": [
          430
        ],
        "referenceType": 2
      },
      {
        "propertyName": "color",
        "valueCodes": [
          62,
          420
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isInvisible",
        "valueCodes": [
          60
        ],
        "referenceType": 0
      },
      {
        "propertyName": "layer",
        "valueCodes": [
          8
        ],
        "referenceType": 2
      },
      {
        "propertyName": "lineType",
        "valueCodes": [
          6
        ],
        "referenceType": 2
      },
      {
        "propertyName": "lineTypeScale",
        "valueCodes": [
          48
        ],
        "referenceType": 0
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
        "propertyName": "transparency",
        "valueCodes": [
          440
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbEntity"
  },
  {
    "typeName": "Face3D",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "firstCorner",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "secondCorner",
        "valueCodes": [
          11,
          21,
          31
        ],
        "referenceType": 0
      },
      {
        "propertyName": "thirdCorner",
        "valueCodes": [
          12,
          22,
          32
        ],
        "referenceType": 0
      },
      {
        "propertyName": "fourthCorner",
        "valueCodes": [
          13,
          23,
          33
        ],
        "referenceType": 0
      },
      {
        "propertyName": "flags",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "3DFACE",
    "dxfSubClassName": "AcDbFace"
  },
  {
    "typeName": "GradientColor",
    "properties": [
      {
        "propertyName": "value",
        "valueCodes": [
          463
        ],
        "referenceType": 0
      },
      {
        "propertyName": "color",
        "valueCodes": [
          421
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": []
  },
  {
    "typeName": "Hatch",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "elevation",
        "valueCodes": [
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "gradientColor",
        "valueCodes": [
          470
        ],
        "referenceType": 2
      },
      {
        "propertyName": "isAssociative",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isDouble",
        "valueCodes": [
          77
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isSolid",
        "valueCodes": [
          70
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
        "propertyName": "paths",
        "valueCodes": [
          91
        ],
        "referenceType": 4
      },
      {
        "propertyName": "pattern",
        "valueCodes": [
          2
        ],
        "referenceType": 2
      },
      {
        "propertyName": "patternAngle",
        "valueCodes": [
          52
        ],
        "referenceType": 32
      },
      {
        "propertyName": "patternScale",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "patternType",
        "valueCodes": [
          76
        ],
        "referenceType": 0
      },
      {
        "propertyName": "pixelSize",
        "valueCodes": [
          47
        ],
        "referenceType": 0
      },
      {
        "propertyName": "seedPoints",
        "valueCodes": [
          98
        ],
        "referenceType": 4,
        "collectionCodes": [
          10,
          20
        ]
      },
      {
        "propertyName": "style",
        "valueCodes": [
          75
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "HATCH",
    "dxfSubClassName": "AcDbHatch"
  },
  {
    "typeName": "HatchGradientPattern",
    "properties": [
      {
        "propertyName": "enabled",
        "valueCodes": [
          450
        ],
        "referenceType": 0
      },
      {
        "propertyName": "angle",
        "valueCodes": [
          460
        ],
        "referenceType": 0
      },
      {
        "propertyName": "shift",
        "valueCodes": [
          461
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isSingleColorGradient",
        "valueCodes": [
          452
        ],
        "referenceType": 0
      },
      {
        "propertyName": "colorTint",
        "valueCodes": [
          462
        ],
        "referenceType": 0
      },
      {
        "propertyName": "colors",
        "valueCodes": [
          453
        ],
        "referenceType": 0
      },
      {
        "propertyName": "name",
        "valueCodes": [
          470
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": []
  },
  {
    "typeName": "HatchPattern",
    "properties": [
      {
        "propertyName": "lines",
        "valueCodes": [
          79
        ],
        "referenceType": 4
      },
      {
        "propertyName": "name",
        "valueCodes": [
          2
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": []
  },
  {
    "typeName": "Insert",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "block",
        "valueCodes": [
          2
        ],
        "referenceType": 2
      },
      {
        "propertyName": "columnCount",
        "valueCodes": [
          70
        ],
        "referenceType": 8
      },
      {
        "propertyName": "columnSpacing",
        "valueCodes": [
          44
        ],
        "referenceType": 8
      },
      {
        "propertyName": "hasAttributes",
        "valueCodes": [
          66
        ],
        "referenceType": 16
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
        "propertyName": "normal",
        "valueCodes": [
          210,
          220,
          230
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
        "propertyName": "rowCount",
        "valueCodes": [
          71
        ],
        "referenceType": 8
      },
      {
        "propertyName": "rowSpacing",
        "valueCodes": [
          45
        ],
        "referenceType": 8
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
    "dxfName": "INSERT",
    "dxfSubClassName": "AcDbBlockReference"
  },
  {
    "typeName": "Leader",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "annotationOffset",
        "valueCodes": [
          213,
          223,
          233
        ],
        "referenceType": 0
      },
      {
        "propertyName": "arrowHeadEnabled",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "associatedAnnotation",
        "valueCodes": [
          340
        ],
        "referenceType": 1
      },
      {
        "propertyName": "blockOffset",
        "valueCodes": [
          212,
          222,
          232
        ],
        "referenceType": 0
      },
      {
        "propertyName": "creationType",
        "valueCodes": [
          73
        ],
        "referenceType": 0
      },
      {
        "propertyName": "hasHookline",
        "valueCodes": [
          75
        ],
        "referenceType": 0
      },
      {
        "propertyName": "hookLineDirection",
        "valueCodes": [
          74
        ],
        "referenceType": 0
      },
      {
        "propertyName": "horizontalDirection",
        "valueCodes": [
          211,
          221,
          231
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
        "propertyName": "pathType",
        "valueCodes": [
          72
        ],
        "referenceType": 0
      },
      {
        "propertyName": "style",
        "valueCodes": [
          3
        ],
        "referenceType": 2
      },
      {
        "propertyName": "textHeight",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textWidth",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "vertices",
        "valueCodes": [
          76
        ],
        "referenceType": 4,
        "collectionCodes": [
          10,
          20,
          30
        ]
      }
    ],
    "systemVariables": [],
    "dxfName": "LEADER",
    "dxfSubClassName": "AcDbLeader"
  },
  {
    "typeName": "Line",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "endPoint",
        "valueCodes": [
          11,
          21,
          31
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
        "propertyName": "startPoint",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "thickness",
        "valueCodes": [
          39
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "LINE",
    "dxfSubClassName": "AcDbLine"
  },
  {
    "typeName": "Mesh",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "blendCrease",
        "valueCodes": [
          72
        ],
        "referenceType": 0
      },
      {
        "propertyName": "edges",
        "valueCodes": [
          94
        ],
        "referenceType": 4,
        "collectionCodes": [
          90
        ]
      },
      {
        "propertyName": "faces",
        "valueCodes": [
          93
        ],
        "referenceType": 4,
        "collectionCodes": [
          90
        ]
      },
      {
        "propertyName": "subdivisionLevel",
        "valueCodes": [
          91
        ],
        "referenceType": 0
      },
      {
        "propertyName": "version",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "vertices",
        "valueCodes": [
          92
        ],
        "referenceType": 4,
        "collectionCodes": [
          10,
          20,
          30
        ]
      }
    ],
    "systemVariables": [],
    "dxfName": "MESH",
    "dxfSubClassName": "AcDbSubDMesh"
  },
  {
    "typeName": "MLine",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "flags",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "justification",
        "valueCodes": [
          70
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
        "propertyName": "scaleFactor",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "startPoint",
        "valueCodes": [
          10,
          20,
          30
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
        "propertyName": "vertices",
        "valueCodes": [
          72
        ],
        "referenceType": 4
      }
    ],
    "systemVariables": [],
    "dxfName": "MLINE",
    "dxfSubClassName": "AcDbMline"
  },
  {
    "typeName": "MText",
    "baseTypeName": "Entity",
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
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "backgroundColor",
        "valueCodes": [
          63,
          421,
          430
        ],
        "referenceType": 0
      },
      {
        "propertyName": "backgroundFillFlags",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "backgroundScale",
        "valueCodes": [
          45
        ],
        "referenceType": 0
      },
      {
        "propertyName": "backgroundTransparency",
        "valueCodes": [
          441
        ],
        "referenceType": 0
      },
      {
        "propertyName": "drawingDirection",
        "valueCodes": [
          72
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
        "propertyName": "horizontalWidth",
        "valueCodes": [
          42
        ],
        "referenceType": 16
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
        "propertyName": "lineSpacing",
        "valueCodes": [
          44
        ],
        "referenceType": 0
      },
      {
        "propertyName": "lineSpacingStyle",
        "valueCodes": [
          73
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
        "propertyName": "rectangleHeight",
        "valueCodes": [
          46
        ],
        "referenceType": 0
      },
      {
        "propertyName": "rectangleWidth",
        "valueCodes": [
          41
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
        "propertyName": "style",
        "valueCodes": [
          7
        ],
        "referenceType": 2
      },
      {
        "propertyName": "value",
        "valueCodes": [
          1
        ],
        "referenceType": 0
      },
      {
        "propertyName": "verticalHeight",
        "valueCodes": [
          43
        ],
        "referenceType": 16
      }
    ],
    "systemVariables": [],
    "dxfName": "MTEXT",
    "dxfSubClassName": "AcDbMText"
  },
  {
    "typeName": "MultiLeader",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "arrowhead",
        "valueCodes": [
          342
        ],
        "referenceType": 1
      },
      {
        "propertyName": "arrowheadSize",
        "valueCodes": [
          42
        ],
        "referenceType": 0
      },
      {
        "propertyName": "contentType",
        "valueCodes": [
          172
        ],
        "referenceType": 0
      },
      {
        "propertyName": "enableAnnotationScale",
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
        "propertyName": "extendedToText",
        "valueCodes": [
          295
        ],
        "referenceType": 0
      },
      {
        "propertyName": "landingDistance",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "leaderLineType",
        "valueCodes": [
          341
        ],
        "referenceType": 1
      },
      {
        "propertyName": "leaderLineWeight",
        "valueCodes": [
          171
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
        "propertyName": "pathType",
        "valueCodes": [
          170
        ],
        "referenceType": 0
      },
      {
        "propertyName": "propertyOverrideFlags",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "scaleFactor",
        "valueCodes": [
          45
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
        "propertyName": "textAligninIPE",
        "valueCodes": [
          178
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
        "propertyName": "textAttachmentPoint",
        "valueCodes": [
          179
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
        "propertyName": "textDirectionNegative",
        "valueCodes": [
          294
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textTopAttachment",
        "valueCodes": [
          273
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textAlignment",
        "valueCodes": [
          175
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textAngle",
        "valueCodes": [
          174
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textColor",
        "valueCodes": [
          92
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
        "propertyName": "textLeftAttachment",
        "valueCodes": [
          173
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textRightAttachment",
        "valueCodes": [
          95
        ],
        "referenceType": 0
      },
      {
        "propertyName": "textStyle",
        "valueCodes": [
          343
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
          176
        ],
        "referenceType": 0
      },
      {
        "propertyName": "blockContentRotation",
        "valueCodes": [
          43
        ],
        "referenceType": 32
      },
      {
        "propertyName": "blockContentScale",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "MULTILEADER",
    "dxfSubClassName": "AcDbMLeader"
  },
  {
    "typeName": "Ole2Frame",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "binaryData",
        "valueCodes": [
          310
        ],
        "referenceType": 0
      },
      {
        "propertyName": "isPaperSpace",
        "valueCodes": [
          72
        ],
        "referenceType": 0
      },
      {
        "propertyName": "lowerRightCorner",
        "valueCodes": [
          11,
          21,
          31
        ],
        "referenceType": 0
      },
      {
        "propertyName": "oleObjectType",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "sourceApplication",
        "valueCodes": [
          3
        ],
        "referenceType": 0
      },
      {
        "propertyName": "upperLeftCorner",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "version",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "OLE2FRAME",
    "dxfSubClassName": "AcDbOle2Frame"
  },
  {
    "typeName": "PdfUnderlay",
    "baseTypeName": "UnderlayEntity",
    "properties": [],
    "systemVariables": [],
    "dxfName": "PDFUNDERLAY",
    "dxfSubClassName": "AcDbUnderlayReference"
  },
  {
    "typeName": "Point",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "location",
        "valueCodes": [
          10,
          20,
          30
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
        "propertyName": "rotation",
        "valueCodes": [
          50
        ],
        "referenceType": 32
      },
      {
        "propertyName": "thickness",
        "valueCodes": [
          39
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "POINT",
    "dxfSubClassName": "AcDbPoint"
  },
  {
    "typeName": "PolyfaceMesh",
    "baseTypeName": "Polyline",
    "properties": [
      {
        "propertyName": "faces",
        "valueCodes": [
          72
        ],
        "referenceType": 4
      }
    ],
    "systemVariables": [],
    "dxfName": "POLYLINE",
    "dxfSubClassName": "AcDbPolyFaceMesh"
  },
  {
    "typeName": "PolygonMesh",
    "baseTypeName": "Polyline",
    "properties": [
      {
        "propertyName": "mSmoothSurfaceDensity",
        "valueCodes": [
          73
        ],
        "referenceType": 8
      },
      {
        "propertyName": "mVertexCount",
        "valueCodes": [
          71
        ],
        "referenceType": 8
      },
      {
        "propertyName": "nSmoothSurfaceDensity",
        "valueCodes": [
          74
        ],
        "referenceType": 8
      },
      {
        "propertyName": "nVertexCount",
        "valueCodes": [
          72
        ],
        "referenceType": 8
      }
    ],
    "systemVariables": [],
    "dxfName": "POLYLINE",
    "dxfSubClassName": "AcDbPolygonMesh"
  },
  {
    "typeName": "PolygonMeshVertex",
    "baseTypeName": "Vertex",
    "properties": [],
    "systemVariables": [],
    "dxfName": "VERTEX",
    "dxfSubClassName": "AcDbPolygonMeshVertex"
  },
  {
    "typeName": "ProxyEntity",
    "baseTypeName": "Entity",
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
      }
    ],
    "systemVariables": [],
    "dxfName": "ACAD_PROXY_ENTITY",
    "dxfSubClassName": "AcDbProxyEntity"
  },
  {
    "typeName": "RasterImage",
    "baseTypeName": "CadWipeoutBase",
    "properties": [],
    "systemVariables": [],
    "dxfName": "IMAGE",
    "dxfSubClassName": "AcDbRasterImage"
  },
  {
    "typeName": "Ray",
    "baseTypeName": "Entity",
    "properties": [
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
        "propertyName": "startPoint",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "RAY",
    "dxfSubClassName": "AcDbRay"
  },
  {
    "typeName": "Region",
    "baseTypeName": "ModelerGeometry",
    "properties": [],
    "systemVariables": [],
    "dxfName": "REGION"
  },
  {
    "typeName": "Seqend",
    "baseTypeName": "Entity",
    "properties": [],
    "systemVariables": [],
    "dxfName": "SEQEND"
  },
  {
    "typeName": "Shape",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "thickness",
        "valueCodes": [
          39
        ],
        "referenceType": 0
      },
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
        "propertyName": "size",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "shapeStyle",
        "valueCodes": [
          2
        ],
        "referenceType": 2
      },
      {
        "propertyName": "rotation",
        "valueCodes": [
          50
        ],
        "referenceType": 32
      },
      {
        "propertyName": "relativeXScale",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "obliqueAngle",
        "valueCodes": [
          51
        ],
        "referenceType": 32
      },
      {
        "propertyName": "normal",
        "valueCodes": [
          210,
          220,
          230
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "SHAPE",
    "dxfSubClassName": "AcDbShape"
  },
  {
    "typeName": "Solid",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "firstCorner",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "fourthCorner",
        "valueCodes": [
          13,
          23,
          33
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
        "propertyName": "secondCorner",
        "valueCodes": [
          11,
          21,
          31
        ],
        "referenceType": 0
      },
      {
        "propertyName": "thickness",
        "valueCodes": [
          39
        ],
        "referenceType": 0
      },
      {
        "propertyName": "thirdCorner",
        "valueCodes": [
          12,
          22,
          32
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "SOLID",
    "dxfSubClassName": "AcDbTrace"
  },
  {
    "typeName": "Solid3D",
    "baseTypeName": "ModelerGeometry",
    "properties": [],
    "systemVariables": [],
    "dxfName": "3DSOLID",
    "dxfSubClassName": "AcDb3dSolid"
  },
  {
    "typeName": "Spline",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "controlPoints",
        "valueCodes": [
          73
        ],
        "referenceType": 4,
        "collectionCodes": [
          10,
          20,
          30
        ]
      },
      {
        "propertyName": "controlPointTolerance",
        "valueCodes": [
          43
        ],
        "referenceType": 0
      },
      {
        "propertyName": "degree",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "endTangent",
        "valueCodes": [
          13,
          23,
          33
        ],
        "referenceType": 0
      },
      {
        "propertyName": "fitPoints",
        "valueCodes": [
          74
        ],
        "referenceType": 4,
        "collectionCodes": [
          11,
          21,
          31
        ]
      },
      {
        "propertyName": "fitTolerance",
        "valueCodes": [
          44
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
        "propertyName": "knots",
        "valueCodes": [
          72
        ],
        "referenceType": 4,
        "collectionCodes": [
          40
        ]
      },
      {
        "propertyName": "knotTolerance",
        "valueCodes": [
          42
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
        "propertyName": "startTangent",
        "valueCodes": [
          12,
          22,
          32
        ],
        "referenceType": 0
      },
      {
        "propertyName": "weights",
        "valueCodes": [
          41
        ],
        "referenceType": 4
      }
    ],
    "systemVariables": [],
    "dxfName": "SPLINE",
    "dxfSubClassName": "AcDbSpline"
  },
  {
    "typeName": "TableContent",
    "baseTypeName": "FormattedTableData",
    "properties": [
      {
        "propertyName": "style",
        "valueCodes": [
          340
        ],
        "referenceType": 1
      }
    ],
    "systemVariables": [],
    "dxfName": "TABLECONTENT",
    "dxfSubClassName": "AcDbTableContent"
  },
  {
    "typeName": "TableEntity",
    "baseTypeName": "Insert",
    "properties": [
      {
        "propertyName": "columns",
        "valueCodes": [
          92
        ],
        "referenceType": 4
      },
      {
        "propertyName": "horizontalDirection",
        "valueCodes": [
          11,
          21,
          31
        ],
        "referenceType": 0
      },
      {
        "propertyName": "overrideBorderColor",
        "valueCodes": [
          94
        ],
        "referenceType": 0
      },
      {
        "propertyName": "overrideBorderLineWeight",
        "valueCodes": [
          95
        ],
        "referenceType": 0
      },
      {
        "propertyName": "overrideBorderVisibility",
        "valueCodes": [
          96
        ],
        "referenceType": 0
      },
      {
        "propertyName": "overrideFlag",
        "valueCodes": [
          93
        ],
        "referenceType": 0
      },
      {
        "propertyName": "rows",
        "valueCodes": [
          91
        ],
        "referenceType": 4
      },
      {
        "propertyName": "style",
        "valueCodes": [
          342
        ],
        "referenceType": 1
      },
      {
        "propertyName": "valueFlag",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "version",
        "valueCodes": [
          280
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "ACAD_TABLE",
    "dxfSubClassName": "AcDbTable"
  },
  {
    "typeName": "TextEntity",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "alignmentPoint",
        "valueCodes": [
          11,
          21,
          31
        ],
        "referenceType": 8
      },
      {
        "propertyName": "height",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      },
      {
        "propertyName": "horizontalAlignment",
        "valueCodes": [
          72
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
        "propertyName": "mirror",
        "valueCodes": [
          71
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
        "propertyName": "obliqueAngle",
        "valueCodes": [
          51
        ],
        "referenceType": 32
      },
      {
        "propertyName": "rotation",
        "valueCodes": [
          50
        ],
        "referenceType": 32
      },
      {
        "propertyName": "style",
        "valueCodes": [
          7
        ],
        "referenceType": 2
      },
      {
        "propertyName": "thickness",
        "valueCodes": [
          39
        ],
        "referenceType": 0
      },
      {
        "propertyName": "value",
        "valueCodes": [
          1
        ],
        "referenceType": 0
      },
      {
        "propertyName": "verticalAlignment",
        "valueCodes": [
          73
        ],
        "referenceType": 8
      },
      {
        "propertyName": "widthFactor",
        "valueCodes": [
          41
        ],
        "referenceType": 8
      }
    ],
    "systemVariables": [],
    "dxfName": "TEXT",
    "dxfSubClassName": "AcDbText"
  },
  {
    "typeName": "Tolerance",
    "baseTypeName": "Entity",
    "properties": [
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
        "propertyName": "insertionPoint",
        "valueCodes": [
          10,
          20,
          30
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
        "propertyName": "style",
        "valueCodes": [
          3
        ],
        "referenceType": 2
      },
      {
        "propertyName": "text",
        "valueCodes": [
          1
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "TOLERANCE",
    "dxfSubClassName": "AcDbFcf"
  },
  {
    "typeName": "UnderlayEntity",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "contrast",
        "valueCodes": [
          281
        ],
        "referenceType": 0
      },
      {
        "propertyName": "definition",
        "valueCodes": [
          340
        ],
        "referenceType": 1
      },
      {
        "propertyName": "fade",
        "valueCodes": [
          282
        ],
        "referenceType": 0
      },
      {
        "propertyName": "flags",
        "valueCodes": [
          280
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
        "propertyName": "normal",
        "valueCodes": [
          210,
          220,
          230
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
    "dxfSubClassIsEmpty": true
  },
  {
    "typeName": "Vertex",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "bulge",
        "valueCodes": [
          42
        ],
        "referenceType": 8
      },
      {
        "propertyName": "curveTangent",
        "valueCodes": [
          50
        ],
        "referenceType": 32
      },
      {
        "propertyName": "endWidth",
        "valueCodes": [
          41
        ],
        "referenceType": 8
      },
      {
        "propertyName": "flags",
        "valueCodes": [
          70
        ],
        "referenceType": 0
      },
      {
        "propertyName": "location",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "startWidth",
        "valueCodes": [
          40
        ],
        "referenceType": 8
      }
    ],
    "systemVariables": [],
    "dxfSubClassName": "AcDbVertex",
    "dxfSubClassIsEmpty": true
  },
  {
    "typeName": "Vertex2D",
    "baseTypeName": "Vertex",
    "properties": [],
    "systemVariables": [],
    "dxfName": "VERTEX",
    "dxfSubClassName": "AcDb2dVertex"
  },
  {
    "typeName": "Vertex3D",
    "baseTypeName": "Vertex",
    "properties": [],
    "systemVariables": [],
    "dxfName": "VERTEX",
    "dxfSubClassName": "AcDb3dPolylineVertex"
  },
  {
    "typeName": "VertexFaceMesh",
    "baseTypeName": "Vertex",
    "properties": [],
    "systemVariables": [],
    "dxfName": "VERTEX",
    "dxfSubClassName": "AcDbPolyFaceMeshVertex"
  },
  {
    "typeName": "VertexFaceRecord",
    "baseTypeName": "Vertex",
    "properties": [
      {
        "propertyName": "index1",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "index2",
        "valueCodes": [
          72
        ],
        "referenceType": 0
      },
      {
        "propertyName": "index3",
        "valueCodes": [
          73
        ],
        "referenceType": 0
      },
      {
        "propertyName": "index4",
        "valueCodes": [
          74
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "VERTEX",
    "dxfSubClassName": "AcDbFaceRecord"
  },
  {
    "typeName": "Viewport",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "ambientLightColor",
        "valueCodes": [
          63,
          421,
          431
        ],
        "referenceType": 0
      },
      {
        "propertyName": "backClipPlane",
        "valueCodes": [
          44
        ],
        "referenceType": 0
      },
      {
        "propertyName": "boundary",
        "valueCodes": [
          340
        ],
        "referenceType": 1
      },
      {
        "propertyName": "brightness",
        "valueCodes": [
          141
        ],
        "referenceType": 0
      },
      {
        "propertyName": "center",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "circleZoomPercent",
        "valueCodes": [
          72
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
        "propertyName": "defaultLightingType",
        "valueCodes": [
          282
        ],
        "referenceType": 0
      },
      {
        "propertyName": "displayUcsIcon",
        "valueCodes": [
          74
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
        "propertyName": "frontClipPlane",
        "valueCodes": [
          43
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
        "propertyName": "height",
        "valueCodes": [
          41
        ],
        "referenceType": 0
      },
      {
        "propertyName": "id",
        "valueCodes": [
          69
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
        "propertyName": "majorGridLineFrequency",
        "valueCodes": [
          61
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
        "propertyName": "shadePlotMode",
        "valueCodes": [
          170
        ],
        "referenceType": 0
      },
      {
        "propertyName": "snapAngle",
        "valueCodes": [
          50
        ],
        "referenceType": 32
      },
      {
        "propertyName": "snapBase",
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
        "propertyName": "status",
        "valueCodes": [
          90
        ],
        "referenceType": 0
      },
      {
        "propertyName": "styleSheetName",
        "valueCodes": [
          1
        ],
        "referenceType": 0
      },
      {
        "propertyName": "twistAngle",
        "valueCodes": [
          51
        ],
        "referenceType": 32
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
        "propertyName": "ucsOrthographicType",
        "valueCodes": [
          79
        ],
        "referenceType": 0
      },
      {
        "propertyName": "ucsPerViewport",
        "valueCodes": [
          71
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
        "propertyName": "useDefaultLighting",
        "valueCodes": [
          292
        ],
        "referenceType": 0
      },
      {
        "propertyName": "viewCenter",
        "valueCodes": [
          12,
          22
        ],
        "referenceType": 0
      },
      {
        "propertyName": "viewDirection",
        "valueCodes": [
          16,
          26,
          36
        ],
        "referenceType": 0
      },
      {
        "propertyName": "viewHeight",
        "valueCodes": [
          45
        ],
        "referenceType": 0
      },
      {
        "propertyName": "viewTarget",
        "valueCodes": [
          17,
          27,
          37
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
        "propertyName": "width",
        "valueCodes": [
          40
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "VIEWPORT",
    "dxfSubClassName": "AcDbViewport"
  },
  {
    "typeName": "Wall",
    "baseTypeName": "Entity",
    "properties": [],
    "systemVariables": [],
    "dxfName": "AEC_WALL",
    "dxfSubClassName": "AecDbWall"
  },
  {
    "typeName": "Wipeout",
    "baseTypeName": "CadWipeoutBase",
    "properties": [],
    "systemVariables": [],
    "dxfName": "WIPEOUT",
    "dxfSubClassName": "AcDbWipeout"
  },
  {
    "typeName": "XLine",
    "baseTypeName": "Entity",
    "properties": [
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
        "propertyName": "firstPoint",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "XLINE",
    "dxfSubClassName": "AcDbXline"
  }
] as const;
