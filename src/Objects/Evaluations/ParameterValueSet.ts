export enum ParameterValueSetType {
	None = 1,
	Unknown = 2,
	Increment = 4,
	List = 8,
}

export class ParameterValueSet {
	allowedValues: number[] = [];
	increment: number = 0;
	maximum: number = 0;
	minimum: number = 0;
	type: ParameterValueSetType = ParameterValueSetType.None;
}
