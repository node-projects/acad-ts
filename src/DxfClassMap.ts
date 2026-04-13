import { DxfMapBase } from './DxfMapBase.js';
import { DxfProperty } from './DxfProperty.js';

export class DxfClassMap extends DxfMapBase {
	private static readonly _cache: Map<string, DxfClassMap> = new Map();

	constructor(name?: string);
	constructor(map: DxfClassMap);
	constructor(arg?: string | DxfClassMap) {
		super();
		if (arg instanceof DxfClassMap) {
			this.name = arg.name;
			for (const [k, v] of arg.dxfProperties) {
				this.dxfProperties.set(k, v);
			}
		} else if (typeof arg === 'string') {
			this.name = arg;
		}
	}

	// TODO: create requires C# reflection
	public static createFromType(typeName: string, name?: string): DxfClassMap {
		if (DxfClassMap._cache.has(typeName)) {
			return new DxfClassMap(DxfClassMap._cache.get(typeName)!);
		}

		const classMap = new DxfClassMap();
		classMap.name = name ?? typeName;
		// TODO: Reflection-based property mapping
		DxfClassMap._cache.set(typeName, classMap);
		return new DxfClassMap(classMap);
	}

	public static Create(type: Function | string, name?: string): DxfClassMap {
		const typeName = typeof type === 'string' ? type : type.name;
		return DxfClassMap.createFromType(typeName, name);
	}

	public clearCache(): void {
		DxfClassMap._cache.clear();
	}

	public toString(): string {
		return `DxfClassMap:${this.name}`;
	}
}
