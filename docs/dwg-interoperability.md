# DWG interoperability validation

Issue [#11](https://github.com/node-projects/acad-ts/issues/11) reports ODA recovery failures that internal round trips did not detect.

The regression coverage now checks legacy EED string bytes against the ODA specification (chapter 28), TABLESTYLE row and cell layouts, and full consumption of VisualStyle data from the original R2010â€“R2018 samples. The writer also emits typed references for table styles, evaluation expressions and image reactors, and queues evaluation expressions for writing.

AC1021 (R2007) output uses the native R2007 container: duplicated file headers and maps, normal and mirrored CRC64 checksums, and interleaved RS(255,239)/RS(255,251) protection. Eligible data pages use AC21 LZ77 when compression reduces their size; other pages retain equal stored/uncompressed sizes. System maps and header metadata retain their supported raw representation. No runtime converter dependency is required. The earlier R2004-container compatibility fallback is not used for this output.

To verify with an installed ODA File Converter:

```sh
npm run build
node tools/check-dwg-oda.mjs "/path/to/ODAFileConverter"
```

The check uses the public top-level samples, keeps unknown reader objects, and writes both default and dynamic-block configurations. Each run creates a fresh folder under `output/oda-check-*`, converts originals as a baseline, and enables ODA audit. Success requires an actual DXF, no error file and retention of every baseline 3DSOLID/REGION/BODY handle; the converter exit code alone is insufficient. Results, including missing geometry handles, are saved in `results.json`. Unknown objects that the writer cannot serialize are still subject to its existing skip policy.

To prepare files for testing on another machine:

```sh
node tools/check-dwg-oda.mjs --generate-only
```

The follow-up fixes cover full R2010+ table content, sized CadValue payloads, eight-byte XRecord handles, dimension association point references, R2018 MTEXT text frames, block representation ownership, inline SAT/SAB geometry and null owners/viewport colors. Legacy table-style round-trip metadata is migrated into the modern style instead of emitting an obsolete XRecord. Object serialization also avoids repeated queue shifts and duplicate handle writes.

Validation on Windows with ODA File Converter 27.9 and audit enabled:

| Inputs | Accepted with baseline modeler handles retained |
| --- | --- |
| Original public DWG samples | 7 / 7 |
| Same-version rewrites, default and dynamic block configurations | 12 / 12 |
| Expanded target-version matrix, both configurations | 60 / 60 |

Run the expanded conversion check with:

```sh
node tools/check-dwg-oda.mjs "/path/to/ODAFileConverter" --matrix
```

The eight formerly failing AC1014/AC1015 upgrades to AC1027/AC1032 now store their modeler payloads in AcDs, with entity flags and a handle search index. Inline legacy ACIS flags are retained, and SAT whitespace is decoded correctly. Native R2013/R2018 AcDs records are read in payload-offset order, and the entity reader skips the absent inline prefix. ASM binary signatures and end markers are recognized when downgrading R2018 geometry. That historical matrix excluded AC1021; the new R2007 checks are described below.

ODA acceptance is not proof of complete content preservation. Regression tests compare modeler payload hashes for all six writable sample versions, legacy upgrades and R2018 downgrades, alongside original modern table content. The native check verifies all three baseline modeler handles in every rewritten drawing. Objects rejected by the reader or skipped by the writer can still be missing. The reporter's broader drawing collection, AEC/private objects, large-file performance and DXF entity omissions have not been validated here.

### Large modeler payloads

DWG writing supports 3DSOLID, REGION and BODY entities, including AcDs payloads larger than 256 KiB. Small payloads stay inline within the AcDs data segment; larger ones use a blob reference and `blob01` segments. Each page carries up to `0xfffb0` payload bytes, so its segment and page headers fit within 1 MiB. Page records preserve total size, byte offsets, page order and handle lookup. The storage builder uses byte buffers rather than arrays of boxed numbers.

To run the native blob regression after building:

```sh
node tools/check-dwg-oda-blobs.mjs "/path/to/ODAFileConverter"
```

The native check covers 14 generated R2013/R2018 drawings and four small-payload drawings for R14/R2000/R2004/R2010, retaining each solid, region and body handle and entity type. The large-payload cases cover the 256 KiB threshold, full pages, partial final pages and payloads spanning three pages. They use real legacy SAT geometry padded with whitespace to exercise storage boundaries without changing the geometry. Separate tests compare exact payload lengths and hashes, including binary data and mixed inline/blob records.

The small-payload cases create new documents containing all three entity types. R2004 empty class tables now emit maximum class number 499, avoiding the invalid class count ODA inferred from zero.

Set `ODA_FILE_CONVERTER` to the executable path when running tests to enable both optional ODA checks (build first).

### R12, R13 and R2007

R12 ASCII/binary DXF and DWG, R13 DWG and R2007 DWG writing have a separate native check:

```sh
npm run build
node tools/check-legacy-formats-oda.mjs "/path/to/ODAFileConverter"
```

With ODA File Converter 27.9.0.0 and audit enabled, all five outputs convert
without error reports. The check verifies coordinates, circle radius, text,
block content and references, and polyline elevation, closure and bulge after
conversion. The R12 cases also check 3D polylines, polygon/polyface meshes,
and INSERT attribute tags, values and definition prompts.
The regular tests include an independently re-encoded R13 fixture, the
five-record R13 file header and CRC, binary R12 code encoding, indexed-color
downgrade, extended data and notification of unsupported modern entities.

This coverage does not establish support for every entity in every old format.
The R12 DWG codec covers the legacy primitives and sequences exercised here,
plus layers, simple linetypes, text styles and application tables. New documents
use an empty-drawing template for remaining header defaults. Loaded documents
retain opaque header fields on rewrite; only common header settings are exposed.
Dimension/view/UCS table customization, extended entity data and overflow
records are not fully supported. Strict mode rejects unsupported entity types;
the default recovery mode reports and skips them. Older drawings can also
contain newer custom classes whose data layouts are not decoded.
