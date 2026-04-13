// TODO: PropertyReflection relies heavily on C# reflection (Expression, PropertyInfo, Attributes)
// This cannot be directly converted to TypeScript as there's no equivalent reflection system.
// A simplified decorator-based approach could be used instead.

export class PropertyExpression<TClass, TAttribute> {
	public cache: Map<string, PropertyExpression.Prop<TClass, TAttribute>> = new Map();

	constructor(keySelector: (propertyName: string, attribute: TAttribute) => string) {
		// TODO: C# reflection-based property discovery is not directly convertible to TypeScript
		// In TypeScript, decorators and metadata reflection (reflect-metadata) could be used
	}

	public getProperty(propName: string): PropertyExpression.Prop<TClass, TAttribute> | undefined {
		return this.cache.get(propName);
	}
}

export namespace PropertyExpression {
	export class Prop<TClass, TAttribute> {
		public getter: ((instance: TClass) => any) | null = null;
		public setter: ((instance: TClass, value: any) => void) | null = null;
		public attribute: TAttribute | null = null;
		public propertyName: string = "";
	}
}
