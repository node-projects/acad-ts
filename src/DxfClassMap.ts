import { DxfMapBase } from './DxfMapBase.js';
import { DxfProperty } from './DxfProperty.js';
import { getClassMetadata } from './Metadata/MetadataStore.js';

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

	public static createFromType(typeName: string, name?: string): DxfClassMap {
		if (DxfClassMap._cache.has(typeName)) {
			return new DxfClassMap(DxfClassMap._cache.get(typeName)!);
		}

		const classMap = new DxfClassMap();
		const metadata = getClassMetadata(typeName);
		if (!name && metadata?.dxfSubClassName == null) {
			throw new Error(`${typeName} is not a DXF subclass`);
		}

		classMap.name = name ?? metadata?.dxfSubClassName ?? typeName;
		DxfClassMap.addClassProperties(classMap, typeName);

		const baseMetadata = metadata?.baseTypeName ? getClassMetadata(metadata.baseTypeName) : undefined;
		if (baseMetadata?.dxfSubClassIsEmpty) {
			DxfClassMap.addClassProperties(classMap, baseMetadata.typeName);
		}

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
