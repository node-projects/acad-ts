import { GeoData } from '../../Objects/GeoData.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadGeoDataTemplate extends CadTemplateT<GeoData> {
	hostBlockHandle: number | null = null;

	constructor(geodata?: GeoData) {
		super(geodata ?? new GeoData());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const host = this.getTableReference<BlockRecord>(builder, this.hostBlockHandle, '');
		if (host) {
			this.cadObject.hostBlock = host;
		}
	}
}
