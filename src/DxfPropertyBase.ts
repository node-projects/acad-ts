import { DxfCode } from './DxfCode.js';
import { GroupCodeValueType } from './GroupCodeValueType.js';
import { GroupCodeValue } from './GroupCodeValue.js';
import { XY } from './Math/XY.js';
import { XYZ } from './Math/XYZ.js';
import { Color } from './Color.js';
import { Transparency } from './Transparency.js';
import { PaperMargin } from './Objects/PaperMargin.js';
import { CadUtils } from './CadUtils.js';
import { PropertyMetadata } from './Metadata/MetadataTypes.js';

function isVector(value: unknown): value is XY | XYZ {
	return value instanceof XY || value instanceof XYZ;
}

function toNumber(value: unknown): number {
	return typeof value === 'number' ? value : Number(value);
}

type PropertyBag = Record<string, unknown>;

export abstract class DxfPropertyBase {
	public get assignedCode(): number {
		if (this._assignedCode !== null) return this._assignedCode;
		if (this.dxfCodes.length === 1) return this.dxfCodes[0];
		return DxfCode.Invalid;
	}

	public dxfCodes: number[] = [];
	public referenceType: number = 0; // DxfReferenceType

	public get storedValue(): unknown {
		return this._storedValue;
	}
	public set storedValue(value: unknown) {
		this._storedValue = this.normalizeStoredValue(value);
	}

	public get groupCode(): GroupCodeValueType {
		const code = this.dxfCodes[0];
		return GroupCodeValue.transformValue(code);
	}

	protected _assignedCode: number | null = null;
	protected _storedValue: unknown = null;
	protected _propertyName: string = "";
	protected _collectionCodes: number[] | null = null;
	protected _valueKind: PropertyMetadata['valueKind'];

	constructor(propertyName: string, dxfCodes: number[]);
	constructor(metadata: PropertyMetadata);
	constructor(propertyNameOrMetadata: string | PropertyMetadata, dxfCodes: number[] = []) {
		if (typeof propertyNameOrMetadata === 'string') {
			this._propertyName = propertyNameOrMetadata;
			this.dxfCodes = dxfCodes;
			this.referenceType = 0;
			this._valueKind = undefined;
		} else {
			this._propertyName = propertyNameOrMetadata.propertyName;
			this.dxfCodes = [...propertyNameOrMetadata.valueCodes];
			this.referenceType = propertyNameOrMetadata.referenceType;
			this._collectionCodes = propertyNameOrMetadata.collectionCodes ? [...propertyNameOrMetadata.collectionCodes] : null;
			this._valueKind = propertyNameOrMetadata.valueKind;
		}
	}

	public setValue(code: number, obj: object | null | undefined, value: unknown): void {
		if (!obj || !this._propertyName) {
			return;
		}

		const currentValue = this.getPropertyValue(obj);

		if (isVector(currentValue)) {
			const index = Math.max(0, Math.floor(code / 10) % 10 - 1);
			currentValue[index] = toNumber(value);
			this.setPropertyValue(obj, currentValue);
			return;
		}

		if (currentValue instanceof Color) {
			switch (code) {
				case 62:
				case 70:
					this.setPropertyValue(obj, new Color(toNumber(value)));
					return;
				case 90:
				case 420: {
					const colorValue = toNumber(value) >>> 0;
					const red = (colorValue >> 16) & 0xFF;
					const green = (colorValue >> 8) & 0xFF;
					const blue = colorValue & 0xFF;
					this.setPropertyValue(obj, new Color(red, green, blue));
					return;
				}
			}
		}

		if (currentValue instanceof PaperMargin) {
			let margin = currentValue;
			switch (code) {
				case 40:
					margin = new PaperMargin(toNumber(value), margin.bottom, margin.right, margin.top);
					break;
				case 41:
					margin = new PaperMargin(margin.left, toNumber(value), margin.right, margin.top);
					break;
				case 42:
					margin = new PaperMargin(margin.left, margin.bottom, toNumber(value), margin.top);
					break;
				case 43:
					margin = new PaperMargin(margin.left, margin.bottom, margin.right, toNumber(value));
					break;
			}

			this.setPropertyValue(obj, margin);
			return;
		}

		if (currentValue instanceof Transparency) {
			this.setPropertyValue(obj, Transparency.fromAlphaValue(toNumber(value)));
			return;
		}

		if (this._valueKind === 'date' || currentValue instanceof Date) {
			this.setPropertyValue(obj, value instanceof Date ? value : CadUtils.fromJulianCalendar(toNumber(value)));
			return;
		}

		if (this._valueKind === 'timespan') {
			this.setPropertyValue(obj, toNumber(value) * 86400000);
			return;
		}

		if (typeof currentValue === 'boolean') {
			this.setPropertyValue(obj, typeof value === 'boolean' ? value : toNumber(value) !== 0);
			return;
		}

		if (typeof currentValue === 'string') {
			this.setPropertyValue(obj, value == null ? '' : String(value));
			return;
		}

		if (typeof currentValue === 'number') {
			this.setPropertyValue(obj, toNumber(value));
			return;
		}

		this.setPropertyValue(obj, value);
	}

	public applyValues(obj: object | null | undefined, values: unknown[]): void {
		if (!obj || !this._propertyName || values.length === 0) {
			return;
		}

		const currentValue = this.getPropertyValue(obj);
		if (values.length > 1) {
			if (currentValue instanceof XY) {
				this.setPropertyValue(obj, new XY(toNumber(values[0]), toNumber(values[1])));
				return;
			}

			if (currentValue instanceof XYZ) {
				this.setPropertyValue(obj, new XYZ(toNumber(values[0]), toNumber(values[1]), toNumber(values[2] ?? 0)));
				return;
			}
		}

		const assignedCode = this.assignedCode !== DxfCode.Invalid ? this.assignedCode : this.dxfCodes[0];
		this.setValue(assignedCode, obj, values[0]);
	}

	public getRawValue(obj: object): unknown {
		return this.getRawValueByCode(this.assignedCode, obj);
	}

	protected getPropertyValue(obj: object | null | undefined): unknown {
		return (obj as PropertyBag | null | undefined)?.[this._propertyName];
	}

	protected setPropertyValue(obj: object, value: unknown): void {
		(obj as PropertyBag)[this._propertyName] = value;
	}

	protected getRawValueByCode(code: number, obj: object): unknown {
		const value = this.getPropertyValue(obj);
		if (value == null) {
			return value;
		}

		const groupCode = GroupCodeValue.transformValue(code);
		switch (groupCode) {
			case GroupCodeValueType.Handle:
			case GroupCodeValueType.ObjectId:
			case GroupCodeValueType.ExtendedDataHandle:
				return this.getHandledValue(obj);
		}

		if (isVector(value)) {
			const index = Math.max(0, Math.floor(code / 10) % 10 - 1);
			return value[index];
		}

		if (this._valueKind === 'date' || value instanceof Date) {
			return CadUtils.toJulianCalendar(value instanceof Date ? value : new Date(toNumber(value)));
		}

		if (this._valueKind === 'timespan') {
			return toNumber(value) / 86400000;
		}

		if (value instanceof Color) {
			switch (code) {
				case 62:
				case 70:
					return value.index;
				case 420:
					return value.trueColor;
				default:
					return null;
			}
		}

		if (value instanceof PaperMargin) {
			switch (code) {
				case 40:
					return value.left;
				case 41:
					return value.bottom;
				case 42:
					return value.right;
				case 43:
					return value.top;
				default:
					return null;
			}
		}

		if (value instanceof Transparency) {
			return Transparency.toAlphaValue(value);
		}

		return value;
	}

	protected getCounterValue(obj: object): number {
		const collection = this.getPropertyValue(obj);
		if (collection == null) {
			return 0;
		}

		if (Array.isArray(collection) || typeof collection === 'string') {
			return collection.length;
		}

		if (typeof collection === 'object' && collection !== null && 'length' in collection) {
			const length = (collection as { length?: unknown }).length;
			if (typeof length === 'number') {
				return length;
			}
		}

		let count = 0;
		for (const _item of collection as Iterable<unknown>) {
			count += 1;
		}
		return count;
	}

	protected getHandledValue(obj: object): number | null {
		const handled = this.getPropertyValue(obj);
		if (handled == null || typeof handled !== 'object') {
			return null;
		}
		const candidate = handled as { handle?: unknown; };
		return typeof candidate.handle === 'number'
			? candidate.handle
			: typeof candidate.handle === 'number'
				? candidate.handle
				: null;
	}

	protected getNamedValue(obj: object): string | null {
		const named = this.getPropertyValue(obj);
		if (named == null || typeof named !== 'object') {
			return null;
		}
		const candidate = named as { name?: unknown; };
		return typeof candidate.name === 'string'
			? candidate.name
			: typeof candidate.name === 'string'
				? candidate.name
				: null;
	}

	protected normalizeStoredValue(value: unknown): unknown {
		if (value == null) {
			return value;
		}

		switch (this.groupCode) {
			case GroupCodeValueType.String:
			case GroupCodeValueType.Comment:
			case GroupCodeValueType.ExtendedDataString:
				return String(value);
			case GroupCodeValueType.Point3D:
				return value;
			case GroupCodeValueType.Double:
			case GroupCodeValueType.ExtendedDataDouble:
				return toNumber(value);
			case GroupCodeValueType.Byte:
			case GroupCodeValueType.Int16:
			case GroupCodeValueType.ExtendedDataInt16:
			case GroupCodeValueType.Int32:
			case GroupCodeValueType.ExtendedDataInt32:
			case GroupCodeValueType.Int64:
				return toNumber(value);
			case GroupCodeValueType.Bool:
				return Boolean(value);
			case GroupCodeValueType.Chunk:
			case GroupCodeValueType.ExtendedDataChunk:
				if (value instanceof Uint8Array) {
					return value;
				}
				if (value instanceof ArrayBuffer) {
					return new Uint8Array(value);
				}
				if (ArrayBuffer.isView(value)) {
					return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
				}
				if (Array.isArray(value)) {
					return new Uint8Array(value);
				}
				return new Uint8Array();
			default:
				return value;
		}
	}
}
