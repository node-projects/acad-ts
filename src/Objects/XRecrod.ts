import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DictionaryCloningFlags } from './DictionaryCloningFlags.js';
import { GroupCodeValue } from '../GroupCodeValue.js';

export class XRecordEntry {
	readonly code: number;
	value: any;
	owner: XRecord;

	get groupCode(): number {
		return GroupCodeValue.transformValue(this.code);
	}

	get hasLinkedObject(): boolean {
		const gc = this.groupCode;
		// Handle, ObjectId, ExtendedDataHandle
		return gc === 5 || gc === 105;
	}

	constructor(code: number, value: any, owner: XRecord) {
		this.code = code;
		this.value = value;
		this.owner = owner;
	}

	getReference(): CadObject | null {
		if (!this.hasLinkedObject) return null;
		if (this.value instanceof CadObject) {
			if ((this.value as CadObject).document !== this.owner.document) {
				return null;
			}
			return this.value as CadObject;
		}
		return null;
	}

	toString(): string {
		return `${this.code}:${this.value}`;
	}
}

export class XRecord extends NonGraphicalObject {
	cloningFlags: DictionaryCloningFlags = DictionaryCloningFlags.NotApplicable;

	get entries(): readonly XRecordEntry[] { return this._entries; }

	override get objectName(): string {
		return DxfFileToken.ObjectXRecord;
	}

	override get objectType(): ObjectType {
		return ObjectType.XRECORD;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.XRecord;
	}

	private _entries: XRecordEntry[] = [];

	constructor(name?: string) {
		super(name);
	}

	createEntry(code: number, value: any): void {
		this._entries.push(new XRecordEntry(code, value, this));
	}

	CreateEntry(code: number, value: any): void {
		this.createEntry(code, value);
	}
}
