import { CadHeader } from '../../Header/CadHeader.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { TableEntry } from '../../Tables/TableEntry.js';
import { DwgDocumentBuilder } from './DwgDocumentBuilder.js';

export class DwgHeaderHandlesCollection {
	private _handles: Map<string, number | null> = new Map();

	get cmaterial(): number | null { return this.getHandle('CMATERIAL'); }
	set cmaterial(value: number | null) { this.setHandle('CMATERIAL', value); }

	get clayer(): number | null { return this.getHandle('CLAYER'); }
	set clayer(value: number | null) { this.setHandle('CLAYER', value); }

	get textstyle(): number | null { return this.getHandle('TEXTSTYLE'); }
	set textstyle(value: number | null) { this.setHandle('TEXTSTYLE', value); }

	get celtype(): number | null { return this.getHandle('CELTYPE'); }
	set celtype(value: number | null) { this.setHandle('CELTYPE', value); }

	get dimstyle(): number | null { return this.getHandle('DIMSTYLE'); }
	set dimstyle(value: number | null) { this.setHandle('DIMSTYLE', value); }

	get cmlstyle(): number | null { return this.getHandle('CMLSTYLE'); }
	set cmlstyle(value: number | null) { this.setHandle('CMLSTYLE', value); }

	get ucsname_pspace(): number | null { return this.getHandle('UCSNAME_PSPACE'); }
	set ucsname_pspace(value: number | null) { this.setHandle('UCSNAME_PSPACE', value); }

	get ucsname_mspace(): number | null { return this.getHandle('UCSNAME_MSPACE'); }
	set ucsname_mspace(value: number | null) { this.setHandle('UCSNAME_MSPACE', value); }

	get pucsorthoref(): number | null { return this.getHandle('PUCSORTHOREF'); }
	set pucsorthoref(value: number | null) { this.setHandle('PUCSORTHOREF', value); }

	get pucsbase(): number | null { return this.getHandle('PUCSBASE'); }
	set pucsbase(value: number | null) { this.setHandle('PUCSBASE', value); }

	get ucsorthoref(): number | null { return this.getHandle('UCSORTHOREF'); }
	set ucsorthoref(value: number | null) { this.setHandle('UCSORTHOREF', value); }

	get dimtxsty(): number | null { return this.getHandle('DIMTXSTY'); }
	set dimtxsty(value: number | null) { this.setHandle('DIMTXSTY', value); }

	get dimldrblk(): number | null { return this.getHandle('DIMLDRBLK'); }
	set dimldrblk(value: number | null) { this.setHandle('DIMLDRBLK', value); }

	get dimblk(): number | null { return this.getHandle('DIMBLK'); }
	set dimblk(value: number | null) { this.setHandle('DIMBLK', value); }

	get dimblk1(): number | null { return this.getHandle('DIMBLK1'); }
	set dimblk1(value: number | null) { this.setHandle('DIMBLK1', value); }

	get dimblk2(): number | null { return this.getHandle('DIMBLK2'); }
	set dimblk2(value: number | null) { this.setHandle('DIMBLK2', value); }

	get dictionary_layouts(): number | null { return this.getHandle('DICTIONARY_LAYOUTS'); }
	set dictionary_layouts(value: number | null) { this.setHandle('DICTIONARY_LAYOUTS', value); }

	get dictionary_plotsettings(): number | null { return this.getHandle('DICTIONARY_PLOTSETTINGS'); }
	set dictionary_plotsettings(value: number | null) { this.setHandle('DICTIONARY_PLOTSETTINGS', value); }

	get dictionary_plotstyles(): number | null { return this.getHandle('DICTIONARY_PLOTSTYLES'); }
	set dictionary_plotstyles(value: number | null) { this.setHandle('DICTIONARY_PLOTSTYLES', value); }

	get cpsnid(): number | null { return this.getHandle('CPSNID'); }
	set cpsnid(value: number | null) { this.setHandle('CPSNID', value); }

	get paper_space(): number | null { return this.getHandle('PAPER_SPACE'); }
	set paper_space(value: number | null) { this.setHandle('PAPER_SPACE', value); }

	get model_space(): number | null { return this.getHandle('MODEL_SPACE'); }
	set model_space(value: number | null) { this.setHandle('MODEL_SPACE', value); }

	get bylayer(): number | null { return this.getHandle('BYLAYER'); }
	set bylayer(value: number | null) { this.setHandle('BYLAYER', value); }

	get byblock(): number | null { return this.getHandle('BYBLOCK'); }
	set byblock(value: number | null) { this.setHandle('BYBLOCK', value); }

	get continuous(): number | null { return this.getHandle('CONTINUOUS'); }
	set continuous(value: number | null) { this.setHandle('CONTINUOUS', value); }

	get dimltype(): number | null { return this.getHandle('DIMLTYPE'); }
	set dimltype(value: number | null) { this.setHandle('DIMLTYPE', value); }

	get dimltex1(): number | null { return this.getHandle('DIMLTEX1'); }
	set dimltex1(value: number | null) { this.setHandle('DIMLTEX1', value); }

	get dimltex2(): number | null { return this.getHandle('DIMLTEX2'); }
	set dimltex2(value: number | null) { this.setHandle('DIMLTEX2', value); }

	get viewport_entity_header_control_object(): number | null { return this.getHandle('VIEWPORT_ENTITY_HEADER_CONTROL_OBJECT'); }
	set viewport_entity_header_control_object(value: number | null) { this.setHandle('VIEWPORT_ENTITY_HEADER_CONTROL_OBJECT', value); }

	get dictionary_acad_group(): number | null { return this.getHandle('DICTIONARY_ACAD_GROUP'); }
	set dictionary_acad_group(value: number | null) { this.setHandle('DICTIONARY_ACAD_GROUP', value); }

	get dictionary_acad_mlinestyle(): number | null { return this.getHandle('DICTIONARY_ACAD_MLINESTYLE'); }
	set dictionary_acad_mlinestyle(value: number | null) { this.setHandle('DICTIONARY_ACAD_MLINESTYLE', value); }

	get dictionary_named_objects(): number | null { return this.getHandle('DICTIONARY_NAMED_OBJECTS'); }
	set dictionary_named_objects(value: number | null) { this.setHandle('DICTIONARY_NAMED_OBJECTS', value); }

	get block_control_object(): number | null { return this.getHandle('BLOCK_CONTROL_OBJECT'); }
	set block_control_object(value: number | null) { this.setHandle('BLOCK_CONTROL_OBJECT', value); }

	get layer_control_object(): number | null { return this.getHandle('LAYER_CONTROL_OBJECT'); }
	set layer_control_object(value: number | null) { this.setHandle('LAYER_CONTROL_OBJECT', value); }

	get style_control_object(): number | null { return this.getHandle('STYLE_CONTROL_OBJECT'); }
	set style_control_object(value: number | null) { this.setHandle('STYLE_CONTROL_OBJECT', value); }

	get linetype_control_object(): number | null { return this.getHandle('LINETYPE_CONTROL_OBJECT'); }
	set linetype_control_object(value: number | null) { this.setHandle('LINETYPE_CONTROL_OBJECT', value); }

	get view_control_object(): number | null { return this.getHandle('VIEW_CONTROL_OBJECT'); }
	set view_control_object(value: number | null) { this.setHandle('VIEW_CONTROL_OBJECT', value); }

	get ucs_control_object(): number | null { return this.getHandle('UCS_CONTROL_OBJECT'); }
	set ucs_control_object(value: number | null) { this.setHandle('UCS_CONTROL_OBJECT', value); }

	get vport_control_object(): number | null { return this.getHandle('VPORT_CONTROL_OBJECT'); }
	set vport_control_object(value: number | null) { this.setHandle('VPORT_CONTROL_OBJECT', value); }

	get appid_control_object(): number | null { return this.getHandle('APPID_CONTROL_OBJECT'); }
	set appid_control_object(value: number | null) { this.setHandle('APPID_CONTROL_OBJECT', value); }

	get dimstyle_control_object(): number | null { return this.getHandle('DIMSTYLE_CONTROL_OBJECT'); }
	set dimstyle_control_object(value: number | null) { this.setHandle('DIMSTYLE_CONTROL_OBJECT', value); }

	get dictionary_materials(): number | null { return this.getHandle('DICTIONARY_MATERIALS'); }
	set dictionary_materials(value: number | null) { this.setHandle('DICTIONARY_MATERIALS', value); }

	get dictionary_colors(): number | null { return this.getHandle('DICTIONARY_COLORS'); }
	set dictionary_colors(value: number | null) { this.setHandle('DICTIONARY_COLORS', value); }

	get dictionary_visualstyle(): number | null { return this.getHandle('DICTIONARY_VISUALSTYLE'); }
	set dictionary_visualstyle(value: number | null) { this.setHandle('DICTIONARY_VISUALSTYLE', value); }

	get interfereobjvs(): number | null { return this.getHandle('INTERFEREOBJVS'); }
	set interfereobjvs(value: number | null) { this.setHandle('INTERFEREOBJVS', value); }

	get interferevpvs(): number | null { return this.getHandle('INTERFEREVPVS'); }
	set interferevpvs(value: number | null) { this.setHandle('INTERFEREVPVS', value); }

	get dragvs(): number | null { return this.getHandle('DRAGVS'); }
	set dragvs(value: number | null) { this.setHandle('DRAGVS', value); }

	get ucsbase(): number | null { return this.getHandle('UCSBASE'); }
	set ucsbase(value: number | null) { this.setHandle('UCSBASE', value); }

	getHandle(name: string): number | null {
		return this._handles.get(name) ?? null;
	}

	setHandle(name: string, value: number | null): void {
		this._handles.set(name, value);
	}

	getHandles(): (number | null)[] {
		return Array.from(this._handles.values());
	}

	updateHeader(header: CadHeader, builder: DwgDocumentBuilder): void {
		let entry: TableEntry | null;

		entry = builder.tryGetCadObject<TableEntry>(this.clayer);
		if (entry && builder.documentToBuild.layers?.tryGetValue(entry.name)) {
			header.currentLayerName = entry.name;
		}

		entry = builder.tryGetCadObject<TableEntry>(this.celtype);
		if (entry && builder.documentToBuild.lineTypes?.tryGetValue(entry.name)) {
			header.currentLineTypeName = entry.name;
		}

		entry = builder.tryGetCadObject<TableEntry>(this.cmlstyle);
		if (entry) { header.currentMLineStyleName = entry.name; }

		entry = builder.tryGetCadObject<TableEntry>(this.textstyle);
		if (entry && builder.documentToBuild.textStyles?.tryGetValue(entry.name)) {
			header.currentTextStyleName = entry.name;
		}

		entry = builder.tryGetCadObject<TableEntry>(this.dimtxsty);
		if (entry && builder.documentToBuild.textStyles?.tryGetValue(entry.name)) {
			header.dimensionTextStyleName = entry.name;
		}

		entry = builder.tryGetCadObject<TableEntry>(this.dimstyle);
		if (entry && builder.documentToBuild.dimensionStyles?.tryGetValue(entry.name)) {
			header.currentDimensionStyleName = entry.name;
		}

		let record: BlockRecord | null;

		record = builder.tryGetCadObject<BlockRecord>(this.dimblk);
		if (record) { header.dimensionBlockName = record.name; }

		record = builder.tryGetCadObject<BlockRecord>(this.dimldrblk);
		if (record) { header.dimensionBlockName = record.name; }

		record = builder.tryGetCadObject<BlockRecord>(this.dimblk1);
		if (record) { header.dimensionBlockNameFirst = record.name; }

		record = builder.tryGetCadObject<BlockRecord>(this.dimblk2);
		if (record) { header.dimensionBlockNameSecond = record.name; }
	}
}
