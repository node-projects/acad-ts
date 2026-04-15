# TODO Audit

Generated on 2026-04-15 from the current `src/**` inventory.

## Summary

- `145` TODO matches currently exist under `src`.
- Most TODOs are TypeScript port gaps, not upstream ACadSharp gaps.
- The highest concentration is in geometry, block/dimension helpers, and DWG table/object readers.

## Highest Concentration

- `13` in [src/Entities/Hatch.ts](src/Entities/Hatch.ts)
- `11` in [src/Tables/BlockRecord.ts](src/Tables/BlockRecord.ts)
- `9` in [src/Entities/Dimension.ts](src/Entities/Dimension.ts)
- `7` in [src/Entities/Entity.ts](src/Entities/Entity.ts)
- `6` in [src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts](src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts)

## TS-Only Backlog

- Geometry and transform helpers are still missing in the TS port. This drives many TODOs in [src/Entities/Entity.ts](src/Entities/Entity.ts), [src/Entities/Arc.ts](src/Entities/Arc.ts), [src/Entities/Circle.ts](src/Entities/Circle.ts), [src/Entities/Ellipse.ts](src/Entities/Ellipse.ts), [src/Entities/Polyline.ts](src/Entities/Polyline.ts), and related entity files.
- Dimension override and block-generation helpers are largely unported. The main concentration is [src/Entities/Dimension.ts](src/Entities/Dimension.ts) plus the dimension subtype files.
- Hatch explode/transform support is largely unported in [src/Entities/Hatch.ts](src/Entities/Hatch.ts).
- Block record helper logic such as sorted entities, sort tables, and bounding boxes is still unported in [src/Tables/BlockRecord.ts](src/Tables/BlockRecord.ts).
- Polyline helper extensions are stubbed in [src/Extensions/PolylineExtensions.ts](src/Extensions/PolylineExtensions.ts).
- Table and object-context DWG reader helpers are TS-only gaps in [src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts](src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts). Upstream ACadSharp already implements `readCellStyle`, `readTableContent`, `readTableCellData`, and the border-visibility override branch.
- Some TODOs are stale comments rather than missing behavior. Those should be removed as they are encountered.

## Shared Upstream TODOs

- [src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts](src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts): `VisualStyle` DWG reader is still unfinished upstream too.
- [src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts](src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts): `MTextAttributeObjectContextData` DWG reader is also still unimplemented upstream.

## Started

- Remove stale TODO comments where the TS implementation already exists.
- Implement missing collection teardown in [src/CadDocument.ts](src/CadDocument.ts) so nested entity collections can be cleanly detached from a document.

## Good Next Targets

- Finish the remaining stale TODO cleanup in infrastructure files first.
- Continue with [src/CadDocument.ts](src/CadDocument.ts) and other collection/document lifecycle gaps.
- Then move to the highest-value reader gap in [src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts](src/IO/DWG/DwgStreamReaders/DwgObjectReader.ts) or the dimension backlog in [src/Entities/Dimension.ts](src/Entities/Dimension.ts).