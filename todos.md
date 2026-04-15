# TODO Audit

Generated on 2026-04-15 from the current `src/**` inventory.

## Summary

- `0` TODO matches currently exist under `src`.
- `0` `any` matches currently exist under `src`.
- The cleanup backlog tracked in this audit is fully resolved for `src/**`.

## Current Status

- No remaining `TODO` or `any` matches were found under `src/**`.
- The final cleanup pass covered the last DWG reader, SVG writer, polyline-template, DXF table-reader, and small object-model/template leftovers.

## Recently Completed

- Eliminated the remaining source TODOs, including the dimension subtype block-generation stubs, block/layout clone work, template-reference TODOs, and the lingering DWG reader TODO comments.
- Tightened entity/helper typing in [src/Entities/Hatch.ts](src/Entities/Hatch.ts), [src/Entities/MLine.ts](src/Entities/MLine.ts), and [src/Entities/Insert.ts](src/Entities/Insert.ts).
- Tightened parser/template typing in [src/IO/DXF/DxfStreamReader/DxfTablesSectionReader.ts](src/IO/DXF/DxfStreamReader/DxfTablesSectionReader.ts) and [src/IO/Templates/CadTableTemplate.ts](src/IO/Templates/CadTableTemplate.ts).
- Tightened table/AEC/evaluation typing in [src/Objects/TableContent.ts](src/Objects/TableContent.ts), [src/Objects/Evaluations/BlockVisibilityParameter.ts](src/Objects/Evaluations/BlockVisibilityParameter.ts), [src/Entities/AecObjects/Wall.ts](src/Entities/AecObjects/Wall.ts), and [src/IO/DXF/DxfStreamReader/DxfSectionReaderBase.ts](src/IO/DXF/DxfStreamReader/DxfSectionReaderBase.ts).
- Tightened builder/table/object-model typing in [src/IO/CadDocumentBuilder.ts](src/IO/CadDocumentBuilder.ts), [src/Objects/LinkedData.ts](src/Objects/LinkedData.ts), [src/Objects/XRecrod.ts](src/Objects/XRecrod.ts), and [src/Entities/TableEntity.ts](src/Entities/TableEntity.ts).
- Tightened shared DXF/DWG utility surfaces in [src/IO/DXF/DxfStreamWriter/DxfStreamWriterBase.ts](src/IO/DXF/DxfStreamWriter/DxfStreamWriterBase.ts), [src/IO/DXF/DxfStreamReader/DxfStreamReaderBase.ts](src/IO/DXF/DxfStreamReader/DxfStreamReaderBase.ts), [src/IO/DXF/DxfReader.ts](src/IO/DXF/DxfReader.ts), [src/IO/Templates/CadTemplate.ts](src/IO/Templates/CadTemplate.ts), [src/IO/Templates/CadXRecordTemplate.ts](src/IO/Templates/CadXRecordTemplate.ts), [src/IO/DWG/DwgStreamWriters/DwgStreamWriterBase.ts](src/IO/DWG/DwgStreamWriters/DwgStreamWriterBase.ts), and [src/CadSystemVariable.ts](src/CadSystemVariable.ts).
- Tightened header/system-variable typing in [src/Header/CadHeader.ts](src/Header/CadHeader.ts).
- Tightened remaining small utility/domain types in [src/CadValue.ts](src/CadValue.ts) and [src/Color.ts](src/Color.ts).
- Finished the last cleanup slice in [src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts](src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts), [src/IO/SVG/SvgXmlWriter.ts](src/IO/SVG/SvgXmlWriter.ts), [src/IO/Templates/CadPolyLineTemplate.ts](src/IO/Templates/CadPolyLineTemplate.ts), [src/IO/DXF/DxfStreamReader/DxfTablesSectionReader.ts](src/IO/DXF/DxfStreamReader/DxfTablesSectionReader.ts), and [src/IO/Templates/CadTableEntryTemplate.ts](src/IO/Templates/CadTableEntryTemplate.ts).
- Kept focused regressions and sample-backed checks green across entity helpers, SVG layout output, DXF table reading, AC1018 table roundtrips, and full TypeScript builds.

## Remaining TODOs

- None under `src/**`.

## Remaining `any` Hotspots

- None under `src/**`.