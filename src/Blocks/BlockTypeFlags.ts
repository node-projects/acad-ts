export enum BlockTypeFlags {
	None = 0,
	Anonymous = 1,
	NonConstantAttributeDefinitions = 2,
	XRef = 4,
	XRefOverlay = 8,
	XRefDependent = 16,
	XRefResolved = 32,
	Referenced = 64,
}
