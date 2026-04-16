import { ACadVersion } from '../../ACadVersion.js';
import { CadDocument } from '../../CadDocument.js';
import { Entity } from '../../Entities/Entity.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { DwgHeaderHandlesCollection } from './DwgHeaderHandlesCollection.js';
import { DwgReaderConfiguration } from './DwgReaderConfiguration.js';
import { CadBlockRecordTemplate } from '../Templates/CadBlockRecordTemplate.js';

export class DwgDocumentBuilder extends CadDocumentBuilder {
	configuration: DwgReaderConfiguration;

	headerHandles: DwgHeaderHandlesCollection = new DwgHeaderHandlesCollection();

	blockRecordTemplates: CadBlockRecordTemplate[] = [];

	paperSpaceEntities: Entity[] = [];

	modelSpaceEntities: Entity[] = [];

	override get keepUnknownEntities(): boolean { return this.configuration.keepUnknownEntities; }
	override get keepUnknownNonGraphicalObjects(): boolean { return this.configuration.keepUnknownNonGraphicalObjects; }

	constructor(version: ACadVersion, document: CadDocument, configuration: DwgReaderConfiguration) {
		super(version, document);
		this.configuration = configuration;
	}

	override buildDocument(): void {
		this.createMissingHandles();

		for (const item of this.blockRecordTemplates) {
			item.setBlockToRecord(this, this.headerHandles);
		}

		this.registerTables();
		this.buildTables();
		if (this.documentToBuild.vEntityControl) {
			this.documentToBuild.registerCollection(this.documentToBuild.vEntityControl);
			this.buildTable(this.documentToBuild.vEntityControl);
		}
		this.buildDictionaries();

		super.buildDocument();

		this._ensureDefaultTableEntries();

		this.headerHandles.updateHeader(this.documentToBuild.header, this);
	}

	private _ensureDefaultTableEntries(): void {
		const doc = this.documentToBuild;
		if (doc.lineTypes && typeof doc.lineTypes.createDefaultEntries === 'function') {
			doc.lineTypes.createDefaultEntries();
		}
		if (doc.layers && typeof doc.layers.createDefaultEntries === 'function') {
			doc.layers.createDefaultEntries();
		}
		if (doc.blockRecords && typeof doc.blockRecords.createDefaultEntries === 'function') {
			doc.blockRecords.createDefaultEntries();
		}
		if (doc.textStyles && typeof doc.textStyles.createDefaultEntries === 'function') {
			doc.textStyles.createDefaultEntries();
		}
		if (doc.dimensionStyles && typeof doc.dimensionStyles.createDefaultEntries === 'function') {
			doc.dimensionStyles.createDefaultEntries();
		}
		if (doc.appIds && typeof doc.appIds.createDefaultEntries === 'function') {
			doc.appIds.createDefaultEntries();
		}
		if (doc.vPorts && typeof doc.vPorts.createDefaultEntries === 'function') {
			doc.vPorts.createDefaultEntries();
		}
	}
}
