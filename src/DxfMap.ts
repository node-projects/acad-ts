import { DxfMapBase } from './DxfMapBase.js';
import { DxfClassMap } from './DxfClassMap.js';
import { DxfProperty } from './DxfProperty.js';
import { getClassMetadata } from './Metadata/MetadataStore.js';

export class DxfMap extends DxfMapBase {
	private static readonly _cache: Map<string, DxfMap> = new Map();

	public subClasses: Map<string, DxfClassMap> = new Map();

	public static create(type: Function | string, name?: string): DxfMap {
		const typeName = typeof type === 'string' ? type : type.name;
		if (DxfMap._cache.has(typeName)) {
			return DxfMap.clone(DxfMap._cache.get(typeName)!, name);
		}

		const map = new DxfMap();
		const metadata = getClassMetadata(typeName);
		map.name = name ?? metadata?.dxfName ?? "";

		let isDimensionStyle = false;
		let current = metadata;
		while (current) {
			if (current.typeName === 'DimensionStyle') {
				isDimensionStyle = true;
			}

			if (current.typeName === 'CadObject') {
				DxfMap.addClassProperties(map, current.typeName);
				break;
			}

			if (current.dxfSubClassName && current.dxfSubClassIsEmpty) {
				const classMap = [...map.subClasses.values()].at(-1);
				if (classMap) {
					DxfMap.addClassProperties(classMap, current.typeName);
				}

				map.subClasses.set(current.dxfSubClassName, new DxfClassMap(current.dxfSubClassName));
			} else if (current.dxfSubClassName) {
				const classMap = new DxfClassMap(current.dxfSubClassName);
				DxfMap.addClassProperties(classMap, current.typeName);
				map.subClasses.set(classMap.name, classMap);
			}

			current = current.baseTypeName ? getClassMetadata(current.baseTypeName) : undefined;
		}

		if (isDimensionStyle && map.dxfProperties.has(5)) {
			map.dxfProperties.set(105, map.dxfProperties.get(5)!);
			map.dxfProperties.delete(5);
		}

		if (map.subClasses.size > 1) {
			map.subClasses = new Map([...map.subClasses.entries()].reverse());
		}

		DxfMap._cache.set(typeName, map);
		return DxfMap.clone(map, name);
	}

	public static clearCache(): void {
		DxfMap._cache.clear();
	}

	public toString(): string {
		return `DxfMap:${this.name}`;
	}

	private static clone(source: DxfMap, name?: string): DxfMap {
		const map = new DxfMap();
		map.name = name ?? source.name;
		for (const [k, v] of source.dxfProperties) {
			map.dxfProperties.set(k, v);
		}
		for (const [k, v] of source.subClasses) {
			map.subClasses.set(k, v);
		}
		return map;
	}
}
