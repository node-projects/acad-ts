# TODO Audit

Generated on 2026-04-15 from the current `src/**` inventory.

## Summary

- `116` TODO matches currently exist under `src`.
- Most TODOs are TypeScript port gaps, not upstream ACadSharp gaps.
- The highest concentration is now in geometry, dimension helpers, and the remaining DWG object-reader gaps.

## Highest Concentration

- `13` in [src/Entities/Hatch.ts](src/Entities/Hatch.ts)
- `9` in [src/Entities/Dimension.ts](src/Entities/Dimension.ts)
- `7` in [src/Entities/Entity.ts](src/Entities/Entity.ts)
- `4` in [src/Extensions/PolylineExtensions.ts](src/Extensions/PolylineExtensions.ts)
- `4` in [src/Entities/Ellipse.ts](src/Entities/Ellipse.ts)
- `4` in [src/Entities/Arc.ts](src/Entities/Arc.ts)
- `3` in [src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts](src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts)

## TS-Only Backlog

- Geometry and transform helpers are still missing in the TS port. This drives many TODOs in [src/Entities/Entity.ts](src/Entities/Entity.ts), [src/Entities/Arc.ts](src/Entities/Arc.ts), [src/Entities/Circle.ts](src/Entities/Circle.ts), [src/Entities/Ellipse.ts](src/Entities/Ellipse.ts), [src/Entities/Polyline.ts](src/Entities/Polyline.ts), and related entity files.
- Dimension override and block-generation helpers are largely unported. The main concentration is [src/Entities/Dimension.ts](src/Entities/Dimension.ts) plus the dimension subtype files.
- Hatch explode/transform support is largely unported in [src/Entities/Hatch.ts](src/Entities/Hatch.ts).
- Block record helper logic, layout viewport management, and viewport IDs are largely implemented now; the remaining `BlockRecord` TODOs are the extended-data source lookup and the xref constructor overload.
- Polyline helper extensions are stubbed in [src/Extensions/PolylineExtensions.ts](src/Extensions/PolylineExtensions.ts).
- Table and object-context DWG reader helpers are now narrowed to [src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts](src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts) `readTableContent`, `VisualStyle`, and `MTextAttributeObjectContextData`. The legacy `readTableCellData` path and the border-visibility override branch are implemented.
- Some TODOs are stale comments rather than missing behavior. Those should be removed as they are encountered.

## Shared Upstream TODOs

- [src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts](src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts): `VisualStyle` DWG reader is still unfinished upstream too.
- [src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts](src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts): `MTextAttributeObjectContextData` DWG reader is also still unimplemented upstream.

## Started

- Remove stale TODO comments and placeholder types where the TS implementation already exists.
- Implement missing collection teardown in [src/CadDocument.ts](src/CadDocument.ts) so nested entity collections can be cleanly detached from a document.
- Implement legacy DWG table-cell parsing and AC1018 table-content regression coverage in [src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts](src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts) and [tests/IO/Roundtrip.test.ts](tests/IO/Roundtrip.test.ts).
- Implement `BlockRecord` sorted-entity, sort-table, layout, evaluation-graph, and bounding-box helpers in [src/Tables/BlockRecord.ts](src/Tables/BlockRecord.ts).
- Implement owner-order and template-applied viewport IDs plus layout paper-viewport management in [src/Entities/Viewport.ts](src/Entities/Viewport.ts), [src/IO/Templates/CadViewportTemplate.ts](src/IO/Templates/CadViewportTemplate.ts), and [src/Objects/Layout.ts](src/Objects/Layout.ts).
- Restore simple bounding boxes for [src/Entities/Point.ts](src/Entities/Point.ts), [src/Entities/Face3D.ts](src/Entities/Face3D.ts), [src/Entities/Solid.ts](src/Entities/Solid.ts), [src/Entities/Leader.ts](src/Entities/Leader.ts), and [src/Entities/Ole2Frame.ts](src/Entities/Ole2Frame.ts).
- Replace stale XData and text-style placeholder types in [src/XData/ExtendedDataDictionary.ts](src/XData/ExtendedDataDictionary.ts), [src/XData/ExtendedDataLayer.ts](src/XData/ExtendedDataLayer.ts), and [src/Tables/TextStyle.ts](src/Tables/TextStyle.ts).
- Fix SVG layout writers to use the real TS block entity collection in [src/IO/SVG/SvgXmlWriter.ts](src/IO/SVG/SvgXmlWriter.ts) and [src/IO/SVG/SvgDocumentBuilder.ts](src/IO/SVG/SvgDocumentBuilder.ts).

## Good Next Targets

- Continue with the dimension backlog in [src/Entities/Dimension.ts](src/Entities/Dimension.ts) and the transform-heavy geometry backlog in [src/Entities/Entity.ts](src/Entities/Entity.ts), [src/Entities/Arc.ts](src/Entities/Arc.ts), and [src/Entities/Ellipse.ts](src/Entities/Ellipse.ts).
- Revisit [src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts](src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts) only when a later-version DWG fixture exposes a sample-backed oracle for `readTableContent`.
- Treat `VisualStyle` and `MTextAttributeObjectContextData` in [src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts](src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts) as upstream-shared work rather than quick cleanup.