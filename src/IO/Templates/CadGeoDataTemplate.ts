import { GeoData } from '../../Objects/GeoData.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadGeoDataTemplate extends CadTemplateT<GeoData> {
	HostBlockHandle: number | null = null;

	constructor(geodata?: GeoData) {
		super(geodata ?? new GeoData());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const host = this.getTableReference<BlockRecord>(builder, this.HostBlockHandle, '');
		if (host) {
			this.CadObject.hostBlock = host;
		}
	}
}
