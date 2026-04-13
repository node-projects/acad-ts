import { ACadVersion } from '../ACadVersion.js';
import { ProxyFlags } from './ProxyFlags.js';

export class DxfClass {
	public applicationName: string = 'ObjectDBX Classes';

	public classNumber: number = 0;

	public cppClassName: string = '';

	public dwgVersion: ACadVersion = 0 as ACadVersion;

	public dxfName: string = '';

	public instanceCount: number = 0;

	public get isAnEntity(): boolean {
		return this._isAnEntity;
	}
	public set isAnEntity(value: boolean) {
		if (value) {
			this._itemClassId = 0x1F2;
		} else {
			this._itemClassId = 0x1F3;
		}
		this._isAnEntity = value;
	}

	public get itemClassId(): number {
		return this._itemClassId;
	}
	public set itemClassId(value: number) {
		if (value === 0x1F2) {
			this._isAnEntity = true;
		} else {
			this._isAnEntity = false;
		}
		this._itemClassId = value;
	}

	public proxyFlags: ProxyFlags = ProxyFlags.None;

	public wasZombie: boolean = false;

	public maintenanceVersion: number = 0;

	private _isAnEntity: boolean = false;
	private _itemClassId: number = 0;

	public toString(): string {
		return `${this.dxfName}:${this.classNumber}`;
	}
}
