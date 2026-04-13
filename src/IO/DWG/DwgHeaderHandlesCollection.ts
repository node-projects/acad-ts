import { CadHeader } from '../../Header/CadHeader.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { TableEntry } from '../../Tables/TableEntry.js';
import { DwgDocumentBuilder } from './DwgDocumentBuilder.js';

export class DwgHeaderHandlesCollection {
	private _handles: Map<string, number | null> = new Map();

	get CMATERIAL(): number | null { return this.GetHandle('CMATERIAL'); }
	set CMATERIAL(value: number | null) { this.SetHandle('CMATERIAL', value); }

	get CLAYER(): number | null { return this.GetHandle('CLAYER'); }
	set CLAYER(value: number | null) { this.SetHandle('CLAYER', value); }

	get TEXTSTYLE(): number | null { return this.GetHandle('TEXTSTYLE'); }
	set TEXTSTYLE(value: number | null) { this.SetHandle('TEXTSTYLE', value); }

	get CELTYPE(): number | null { return this.GetHandle('CELTYPE'); }
	set CELTYPE(value: number | null) { this.SetHandle('CELTYPE', value); }

	get DIMSTYLE(): number | null { return this.GetHandle('DIMSTYLE'); }
	set DIMSTYLE(value: number | null) { this.SetHandle('DIMSTYLE', value); }

	get CMLSTYLE(): number | null { return this.GetHandle('CMLSTYLE'); }
	set CMLSTYLE(value: number | null) { this.SetHandle('CMLSTYLE', value); }

	get UCSNAME_PSPACE(): number | null { return this.GetHandle('UCSNAME_PSPACE'); }
	set UCSNAME_PSPACE(value: number | null) { this.SetHandle('UCSNAME_PSPACE', value); }

	get UCSNAME_MSPACE(): number | null { return this.GetHandle('UCSNAME_MSPACE'); }
	set UCSNAME_MSPACE(value: number | null) { this.SetHandle('UCSNAME_MSPACE', value); }

	get PUCSORTHOREF(): number | null { return this.GetHandle('PUCSORTHOREF'); }
	set PUCSORTHOREF(value: number | null) { this.SetHandle('PUCSORTHOREF', value); }

	get PUCSBASE(): number | null { return this.GetHandle('PUCSBASE'); }
	set PUCSBASE(value: number | null) { this.SetHandle('PUCSBASE', value); }

	get UCSORTHOREF(): number | null { return this.GetHandle('UCSORTHOREF'); }
	set UCSORTHOREF(value: number | null) { this.SetHandle('UCSORTHOREF', value); }

	get DIMTXSTY(): number | null { return this.GetHandle('DIMTXSTY'); }
	set DIMTXSTY(value: number | null) { this.SetHandle('DIMTXSTY', value); }

	get DIMLDRBLK(): number | null { return this.GetHandle('DIMLDRBLK'); }
	set DIMLDRBLK(value: number | null) { this.SetHandle('DIMLDRBLK', value); }

	get DIMBLK(): number | null { return this.GetHandle('DIMBLK'); }
	set DIMBLK(value: number | null) { this.SetHandle('DIMBLK', value); }

	get DIMBLK1(): number | null { return this.GetHandle('DIMBLK1'); }
	set DIMBLK1(value: number | null) { this.SetHandle('DIMBLK1', value); }

	get DIMBLK2(): number | null { return this.GetHandle('DIMBLK2'); }
	set DIMBLK2(value: number | null) { this.SetHandle('DIMBLK2', value); }

	get DICTIONARY_LAYOUTS(): number | null { return this.GetHandle('DICTIONARY_LAYOUTS'); }
	set DICTIONARY_LAYOUTS(value: number | null) { this.SetHandle('DICTIONARY_LAYOUTS', value); }

	get DICTIONARY_PLOTSETTINGS(): number | null { return this.GetHandle('DICTIONARY_PLOTSETTINGS'); }
	set DICTIONARY_PLOTSETTINGS(value: number | null) { this.SetHandle('DICTIONARY_PLOTSETTINGS', value); }

	get DICTIONARY_PLOTSTYLES(): number | null { return this.GetHandle('DICTIONARY_PLOTSTYLES'); }
	set DICTIONARY_PLOTSTYLES(value: number | null) { this.SetHandle('DICTIONARY_PLOTSTYLES', value); }

	get CPSNID(): number | null { return this.GetHandle('CPSNID'); }
	set CPSNID(value: number | null) { this.SetHandle('CPSNID', value); }

	get PAPER_SPACE(): number | null { return this.GetHandle('PAPER_SPACE'); }
	set PAPER_SPACE(value: number | null) { this.SetHandle('PAPER_SPACE', value); }

	get MODEL_SPACE(): number | null { return this.GetHandle('MODEL_SPACE'); }
	set MODEL_SPACE(value: number | null) { this.SetHandle('MODEL_SPACE', value); }

	get BYLAYER(): number | null { return this.GetHandle('BYLAYER'); }
	set BYLAYER(value: number | null) { this.SetHandle('BYLAYER', value); }

	get BYBLOCK(): number | null { return this.GetHandle('BYBLOCK'); }
	set BYBLOCK(value: number | null) { this.SetHandle('BYBLOCK', value); }

	get CONTINUOUS(): number | null { return this.GetHandle('CONTINUOUS'); }
	set CONTINUOUS(value: number | null) { this.SetHandle('CONTINUOUS', value); }

	get DIMLTYPE(): number | null { return this.GetHandle('DIMLTYPE'); }
	set DIMLTYPE(value: number | null) { this.SetHandle('DIMLTYPE', value); }

	get DIMLTEX1(): number | null { return this.GetHandle('DIMLTEX1'); }
	set DIMLTEX1(value: number | null) { this.SetHandle('DIMLTEX1', value); }

	get DIMLTEX2(): number | null { return this.GetHandle('DIMLTEX2'); }
	set DIMLTEX2(value: number | null) { this.SetHandle('DIMLTEX2', value); }

	get VIEWPORT_ENTITY_HEADER_CONTROL_OBJECT(): number | null { return this.GetHandle('VIEWPORT_ENTITY_HEADER_CONTROL_OBJECT'); }
	set VIEWPORT_ENTITY_HEADER_CONTROL_OBJECT(value: number | null) { this.SetHandle('VIEWPORT_ENTITY_HEADER_CONTROL_OBJECT', value); }

	get DICTIONARY_ACAD_GROUP(): number | null { return this.GetHandle('DICTIONARY_ACAD_GROUP'); }
	set DICTIONARY_ACAD_GROUP(value: number | null) { this.SetHandle('DICTIONARY_ACAD_GROUP', value); }

	get DICTIONARY_ACAD_MLINESTYLE(): number | null { return this.GetHandle('DICTIONARY_ACAD_MLINESTYLE'); }
	set DICTIONARY_ACAD_MLINESTYLE(value: number | null) { this.SetHandle('DICTIONARY_ACAD_MLINESTYLE', value); }

	get DICTIONARY_NAMED_OBJECTS(): number | null { return this.GetHandle('DICTIONARY_NAMED_OBJECTS'); }
	set DICTIONARY_NAMED_OBJECTS(value: number | null) { this.SetHandle('DICTIONARY_NAMED_OBJECTS', value); }

	get BLOCK_CONTROL_OBJECT(): number | null { return this.GetHandle('BLOCK_CONTROL_OBJECT'); }
	set BLOCK_CONTROL_OBJECT(value: number | null) { this.SetHandle('BLOCK_CONTROL_OBJECT', value); }

	get LAYER_CONTROL_OBJECT(): number | null { return this.GetHandle('LAYER_CONTROL_OBJECT'); }
	set LAYER_CONTROL_OBJECT(value: number | null) { this.SetHandle('LAYER_CONTROL_OBJECT', value); }

	get STYLE_CONTROL_OBJECT(): number | null { return this.GetHandle('STYLE_CONTROL_OBJECT'); }
	set STYLE_CONTROL_OBJECT(value: number | null) { this.SetHandle('STYLE_CONTROL_OBJECT', value); }

	get LINETYPE_CONTROL_OBJECT(): number | null { return this.GetHandle('LINETYPE_CONTROL_OBJECT'); }
	set LINETYPE_CONTROL_OBJECT(value: number | null) { this.SetHandle('LINETYPE_CONTROL_OBJECT', value); }

	get VIEW_CONTROL_OBJECT(): number | null { return this.GetHandle('VIEW_CONTROL_OBJECT'); }
	set VIEW_CONTROL_OBJECT(value: number | null) { this.SetHandle('VIEW_CONTROL_OBJECT', value); }

	get UCS_CONTROL_OBJECT(): number | null { return this.GetHandle('UCS_CONTROL_OBJECT'); }
	set UCS_CONTROL_OBJECT(value: number | null) { this.SetHandle('UCS_CONTROL_OBJECT', value); }

	get VPORT_CONTROL_OBJECT(): number | null { return this.GetHandle('VPORT_CONTROL_OBJECT'); }
	set VPORT_CONTROL_OBJECT(value: number | null) { this.SetHandle('VPORT_CONTROL_OBJECT', value); }

	get APPID_CONTROL_OBJECT(): number | null { return this.GetHandle('APPID_CONTROL_OBJECT'); }
	set APPID_CONTROL_OBJECT(value: number | null) { this.SetHandle('APPID_CONTROL_OBJECT', value); }

	get DIMSTYLE_CONTROL_OBJECT(): number | null { return this.GetHandle('DIMSTYLE_CONTROL_OBJECT'); }
	set DIMSTYLE_CONTROL_OBJECT(value: number | null) { this.SetHandle('DIMSTYLE_CONTROL_OBJECT', value); }

	get DICTIONARY_MATERIALS(): number | null { return this.GetHandle('DICTIONARY_MATERIALS'); }
	set DICTIONARY_MATERIALS(value: number | null) { this.SetHandle('DICTIONARY_MATERIALS', value); }

	get DICTIONARY_COLORS(): number | null { return this.GetHandle('DICTIONARY_COLORS'); }
	set DICTIONARY_COLORS(value: number | null) { this.SetHandle('DICTIONARY_COLORS', value); }

	get DICTIONARY_VISUALSTYLE(): number | null { return this.GetHandle('DICTIONARY_VISUALSTYLE'); }
	set DICTIONARY_VISUALSTYLE(value: number | null) { this.SetHandle('DICTIONARY_VISUALSTYLE', value); }

	get INTERFEREOBJVS(): number | null { return this.GetHandle('INTERFEREOBJVS'); }
	set INTERFEREOBJVS(value: number | null) { this.SetHandle('INTERFEREOBJVS', value); }

	get INTERFEREVPVS(): number | null { return this.GetHandle('INTERFEREVPVS'); }
	set INTERFEREVPVS(value: number | null) { this.SetHandle('INTERFEREVPVS', value); }

	get DRAGVS(): number | null { return this.GetHandle('DRAGVS'); }
	set DRAGVS(value: number | null) { this.SetHandle('DRAGVS', value); }

	get UCSBASE(): number | null { return this.GetHandle('UCSBASE'); }
	set UCSBASE(value: number | null) { this.SetHandle('UCSBASE', value); }

	GetHandle(name: string): number | null {
		return this._handles.get(name) ?? null;
	}

	SetHandle(name: string, value: number | null): void {
		this._handles.set(name, value);
	}

	GetHandles(): (number | null)[] {
		return Array.from(this._handles.values());
	}

	UpdateHeader(header: CadHeader, builder: DwgDocumentBuilder): void {
		let entry: TableEntry | null;

		entry = builder.TryGetCadObject<TableEntry>(this.CLAYER);
		if (entry) { header.currentLayerName = entry.name; }

		entry = builder.TryGetCadObject<TableEntry>(this.CELTYPE);
		if (entry) { header.currentLineTypeName = entry.name; }

		entry = builder.TryGetCadObject<TableEntry>(this.CMLSTYLE);
		if (entry) { header.currentMLineStyleName = entry.name; }

		entry = builder.TryGetCadObject<TableEntry>(this.TEXTSTYLE);
		if (entry) { header.currentTextStyleName = entry.name; }

		entry = builder.TryGetCadObject<TableEntry>(this.DIMTXSTY);
		if (entry) { header.dimensionTextStyleName = entry.name; }

		entry = builder.TryGetCadObject<TableEntry>(this.DIMSTYLE);
		if (entry) { header.currentDimensionStyleName = entry.name; }

		let record: BlockRecord | null;

		record = builder.TryGetCadObject<BlockRecord>(this.DIMBLK);
		if (record) { header.dimensionBlockName = record.name; }

		record = builder.TryGetCadObject<BlockRecord>(this.DIMLDRBLK);
		if (record) { header.dimensionBlockName = record.name; }

		record = builder.TryGetCadObject<BlockRecord>(this.DIMBLK1);
		if (record) { header.dimensionBlockNameFirst = record.name; }

		record = builder.TryGetCadObject<BlockRecord>(this.DIMBLK2);
		if (record) { header.dimensionBlockNameSecond = record.name; }
	}
}
