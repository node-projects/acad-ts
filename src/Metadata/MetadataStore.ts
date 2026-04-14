import { ClassMetadata, PropertyMetadata, SystemVariableMetadata } from './MetadataTypes.js';
import { metadataLookupTable } from './MetadataLookupTable.js';

const classMetadataByName = new Map<string, ClassMetadata>();
let initialized = false;

function clonePropertyMetadata<T extends PropertyMetadata>(metadata: T): T {
	return {
		...metadata,
		valueCodes: [...metadata.valueCodes],
		collectionCodes: metadata.collectionCodes ? [...metadata.collectionCodes] : undefined,
	};
}

function cloneClassMetadata(metadata: ClassMetadata): ClassMetadata {
	return {
		...metadata,
		properties: metadata.properties.map(clonePropertyMetadata),
		systemVariables: metadata.systemVariables.map(clonePropertyMetadata) as SystemVariableMetadata[],
	};
}

function ensureInitialized(): void {
	if (initialized) {
		return;
	}

	for (const metadata of metadataLookupTable) {
		classMetadataByName.set(metadata.typeName, cloneClassMetadata(metadata));
	}

	initialized = true;
}

export function clearMetadataCache(): void {
	initialized = false;
	classMetadataByName.clear();
}

export function getClassMetadata(type: Function | string): ClassMetadata | undefined {
	ensureInitialized();
	const typeName = typeof type === 'string' ? type : type.name;
	const metadata = classMetadataByName.get(typeName);
	return metadata ? cloneClassMetadata(metadata) : undefined;
}

export function getClassPropertyMetadata(type: Function | string): PropertyMetadata[] {
	return getClassMetadata(type)?.properties ?? [];
}

export function getSystemVariableMetadata(type: Function | string): SystemVariableMetadata[] {
	return getClassMetadata(type)?.systemVariables ?? [];
}

export function getSystemVariableMetadataMap(type: Function | string): Map<string, SystemVariableMetadata> {
	const map = new Map<string, SystemVariableMetadata>();
	for (const metadata of getSystemVariableMetadata(type)) {
		map.set(metadata.name, clonePropertyMetadata(metadata) as SystemVariableMetadata);
	}
	return map;
}