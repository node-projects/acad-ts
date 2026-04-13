import { DxfCode } from '../DxfCode.js';
import { GroupCodeValueType } from '../GroupCodeValue.js';

export abstract class ExtendedDataRecord {
	public get code(): DxfCode {
		return this._code;
	}

	public get rawValue(): unknown {
		return this._value;
	}

	private _code: DxfCode;
	protected _value: unknown;

	protected constructor(code: DxfCode, value: unknown) {
		this._code = code;
		this._value = value;
	}

	public toString(): string {
		return `${this.code}:${this._value}`;
	}

	public static create(_groupCode: GroupCodeValueType, _value: unknown): ExtendedDataRecord {
		throw new Error('ExtendedDataRecord factory not initialized');
	}
}

export abstract class ExtendedDataRecordT<T> extends ExtendedDataRecord {
	public get value(): T {
		return this._value as T;
	}
	public set value(v: T) {
		this._value = v;
	}

	protected constructor(code: DxfCode, value: T) {
		super(code, value);
	}
}