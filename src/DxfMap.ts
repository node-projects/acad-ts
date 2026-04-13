import { DxfMapBase } from './DxfMapBase.js';
import { DxfClassMap } from './DxfClassMap.js';
import { DxfProperty } from './DxfProperty.js';

export class DxfMap extends DxfMapBase {
	private static readonly _cache: Map<string, DxfMap> = new Map();

	public subClasses: Map<string, DxfClassMap> = new Map();

	// TODO: Create methods depend on C# reflection which is not directly available in TypeScript
	public static create(type: Function | string, name?: string): DxfMap {
		const typeName = typeof type === 'string' ? type : type.name;
		if (DxfMap._cache.has(typeName)) {
			const cached = DxfMap._cache.get(typeName)!;
			const map = new DxfMap();
			map.name = cached.name;
			for (const [k, v] of cached.dxfProperties) {
				map.dxfProperties.set(k, v);
			}
			for (const [k, v] of cached.subClasses) {
				map.subClasses.set(k, v);
			}
			return map;
		}

		const map = new DxfMap();
		map.name = name ?? "";
		// TODO: Full reflection-based mapping not directly convertible
		DxfMap._cache.set(typeName, map);
		return map;
	}

	public static clearCache(): void {
		DxfMap._cache.clear();
	}

	public toString(): string {
		return `DxfMap:${this.name}`;
	}
}
