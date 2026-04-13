import { ACadVersion } from '../../ACadVersion.js';
import { CadDocument } from '../../CadDocument.js';
import { Entity } from '../../Entities/Entity.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { DwgHeaderHandlesCollection } from './DwgHeaderHandlesCollection.js';
import { DwgReaderConfiguration } from './DwgReaderConfiguration.js';
import { CadBlockRecordTemplate } from '../Templates/CadBlockRecordTemplate.js';

export class DwgDocumentBuilder extends CadDocumentBuilder {
	Configuration: DwgReaderConfiguration;

	HeaderHandles: DwgHeaderHandlesCollection = new DwgHeaderHandlesCollection();

	BlockRecordTemplates: CadBlockRecordTemplate[] = [];

	PaperSpaceEntities: Entity[] = [];

	ModelSpaceEntities: Entity[] = [];

	override get KeepUnknownEntities(): boolean { return this.Configuration.KeepUnknownEntities; }
	override get KeepUnknownNonGraphicalObjects(): boolean { return this.Configuration.KeepUnknownNonGraphicalObjects; }

	constructor(version: ACadVersion, document: CadDocument, configuration: DwgReaderConfiguration) {
		super(version, document);
		this.Configuration = configuration;
	}

	override BuildDocument(): void {
		this.createMissingHandles();

		for (const item of this.BlockRecordTemplates) {
			item.SetBlockToRecord(this, this.HeaderHandles);
		}

		this.RegisterTables();
		this.BuildTables();
		this.buildDictionaries();

		super.BuildDocument();

		this.ensureDefaultTableEntries();

		this.HeaderHandles.UpdateHeader(this.DocumentToBuild.header, this);
	}

	private ensureDefaultTableEntries(): void {
		const doc = this.DocumentToBuild;
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
