import { PropertyMetadata, SystemVariableMetadata } from './Metadata/MetadataTypes.js';
import { getClassPropertyMetadata, getSystemVariableMetadata } from './Metadata/MetadataStore.js';

export class PropertyExpression<TClass, TAttribute> {
	public cache: Map<string, PropertyExpression.Prop<TClass, TAttribute>> = new Map();
	private readonly _keySelector: (propertyName: string, attribute: TAttribute) => string;

	constructor(keySelector: (propertyName: string, attribute: TAttribute) => string) {
		this._keySelector = keySelector;
	}

	public getProperty(propName: string): PropertyExpression.Prop<TClass, TAttribute> | undefined {
		return this.cache.get(propName);
	}

	public registerProperty(propertyName: string, attribute: TAttribute): void {
		const prop = new PropertyExpression.Prop<TClass, TAttribute>();
		prop.propertyName = propertyName;
		prop.attribute = attribute;
		prop.getter = (instance: TClass) => (instance as unknown as Record<string, unknown>)[propertyName];
		prop.setter = (instance: TClass, value: unknown) => {
			(instance as unknown as Record<string, unknown>)[propertyName] = value;
		};
		this.cache.set(this._keySelector(propertyName, attribute), prop);
	}

	public static fromClassProperties<TClass>(
		type: Function | string,
		keySelector: (propertyName: string, attribute: PropertyMetadata) => string,
	): PropertyExpression<TClass, PropertyMetadata> {
		const expression = new PropertyExpression<TClass, PropertyMetadata>(keySelector);
		for (const metadata of getClassPropertyMetadata(type)) {
			expression.registerProperty(metadata.propertyName, metadata);
		}
		return expression;
	}

	public static fromSystemVariables<TClass>(
		type: Function | string,
		keySelector: (propertyName: string, attribute: SystemVariableMetadata) => string,
	): PropertyExpression<TClass, SystemVariableMetadata> {
		const expression = new PropertyExpression<TClass, SystemVariableMetadata>(keySelector);
		for (const metadata of getSystemVariableMetadata(type)) {
			expression.registerProperty(metadata.propertyName, metadata);
		}
		return expression;
	}
}

export namespace PropertyExpression {
	export class Prop<TClass, TAttribute> {
		public getter: ((instance: TClass) => unknown) | null = null;
		public setter: ((instance: TClass, value: unknown) => void) | null = null;
		public attribute: TAttribute | null = null;
		public propertyName: string = "";
	}
}
