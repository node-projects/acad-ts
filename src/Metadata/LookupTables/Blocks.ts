import { ClassMetadata } from '../MetadataTypes.js';

export const metadataLookupBlocks: readonly ClassMetadata[] = [
  {
    "typeName": "Block",
    "baseTypeName": "Entity",
    "properties": [
      {
        "propertyName": "basePoint",
        "valueCodes": [
          10,
          20,
          30
        ],
        "referenceType": 0
      },
      {
        "propertyName": "comments",
        "valueCodes": [
          4
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
        "propertyName": "isUnloaded",
        "valueCodes": [
          71
        ],
        "referenceType": 0
      },
      {
        "propertyName": "name",
        "valueCodes": [
          2,
          3
        ],
        "referenceType": 0
      },
      {
        "propertyName": "xRefPath",
        "valueCodes": [
          1
        ],
        "referenceType": 0
      }
    ],
    "systemVariables": [],
    "dxfName": "BLOCK",
    "dxfSubClassName": "AcDbBlockBegin"
  },
  {
    "typeName": "BlockEnd",
    "baseTypeName": "Entity",
    "properties": [],
    "systemVariables": [],
    "dxfName": "ENDBLK",
    "dxfSubClassName": "AcDbBlockEnd"
  }
] as const;
