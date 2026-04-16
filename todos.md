# TODO's

Recently completed
- Seqend, Wall, and ProxyEntity are now supported in the DWG object writer.
- AEC wall companion objects (AecWallStyle, AecCleanupGroup, AecBinRecord) now write through the DWG object writer.
- DwgObjectReader now preserves the AEC wall bin record handle.
- TableEntity, Solid3D, CadBody, and Region are now supported in the DWG object writer.
- EvaluationGraph, VisualStyle, TableStyle, Material, DimensionAssociation, ProxyObject, and related object-context data now write through the DWG object writer.
- DwgObjectReader no longer throws for procedural material map sources, evaluation-expression value codes, or buffer/result-buffer CadValue branches during DWG reads.

4. Add full-document DXF -> DWG write support for imported documents with unresolved table/object references, so the documented `read` -> `modify` -> `DwgWriter` flow works without the current entity-transfer workaround in [tests/IO/PortedIOTests.test.ts](tests/IO/PortedIOTests.test.ts).

5. Complete DWG writer coverage for unsupported XData and XRecord payload variants. The docs promise extended-data access on CAD objects, but [src/IO/DWG/DwgStreamWriters/DwgObjectWriter.ts](src/IO/DWG/DwgStreamWriters/DwgObjectWriter.ts) still throws for unsupported `ExtendedDataRecord` kinds and some XRecord/group-code value types.

6. fix the remaining full-document DXF to DWG imported-document gap

7. finish unsupported DWG XData and XRecord payload coverage