import { DxfProperty } from './DxfProperty.js';
import { getClassPropertyMetadata } from './Metadata/MetadataStore.js';

export abstract class DxfMapBase {
	public name: string = "";
	public dxfProperties: Map<number, DxfProperty> = new Map();

	protected static addClassProperties(map: DxfMapBase, type: Function | string, obj?: object): void {
		for (const [code, property] of DxfMapBase.cadObjectMapDxf(type)) {
			map.dxfProperties.set(code, property);
			if (obj != null) {
				property.storedValue = property.getRawValue(obj);
			}
		}
	}

	protected static *cadObjectMapDxf(type: Function | string): IterableIterator<[number, DxfProperty]> {
		for (const metadata of getClassPropertyMetadata(type)) {
			for (const code of metadata.valueCodes) {
				yield [code, new DxfProperty(code, metadata)];
			}
		}
	}
}
