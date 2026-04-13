import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecord } from './ExtendedDataRecordBase.js';

export class ExtendedDataControlString extends ExtendedDataRecord {
	public static get open(): ExtendedDataControlString {
		return new ExtendedDataControlString(false);
	}

	public static get close(): ExtendedDataControlString {
		return new ExtendedDataControlString(true);
	}

	public isClosing: boolean;

	public get value(): string {
		return this.isClosing ? '}' : '{';
	}

	public constructor(isClosing: boolean) {
		super(DxfCode.ExtendedDataControlString, isClosing ? '}' : '{');
		this.isClosing = isClosing;
	}
}
