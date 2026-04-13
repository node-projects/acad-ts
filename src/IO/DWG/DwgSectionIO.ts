import { ACadVersion } from '../../ACadVersion.js';
import { NotificationEventHandler, NotificationEventArgs, NotificationType } from '../NotificationEventHandler.js';
import { IDwgStreamReader } from './DwgStreamReaders/IDwgStreamReader.js';

export abstract class DwgSectionIO {
	OnNotification: NotificationEventHandler | null = null;

	abstract get SectionName(): string;

	protected R13_14Only: boolean;
	protected R13_15Only: boolean;
	protected R2000Plus: boolean;
	protected R2004Pre: boolean;
	protected R2007Pre: boolean;
	protected R2004Plus: boolean;
	protected R2007Plus: boolean;
	protected R2010Plus: boolean;
	protected R2013Plus: boolean;
	protected R2018Plus: boolean;

	protected readonly _version: ACadVersion;

	constructor(version: ACadVersion) {
		this._version = version;

		this.R13_14Only = version === ACadVersion.AC1014 || version === ACadVersion.AC1012;
		this.R13_15Only = version >= ACadVersion.AC1012 && version <= ACadVersion.AC1015;
		this.R2000Plus = version >= ACadVersion.AC1015;
		this.R2004Pre = version < ACadVersion.AC1018;
		this.R2007Pre = version <= ACadVersion.AC1021;
		this.R2004Plus = version >= ACadVersion.AC1018;
		this.R2007Plus = version >= ACadVersion.AC1021;
		this.R2010Plus = version >= ACadVersion.AC1024;
		this.R2013Plus = version >= ACadVersion.AC1027;
		this.R2018Plus = version >= ACadVersion.AC1032;
	}

	static CheckSentinel(actual: Uint8Array, expected: Uint8Array): boolean {
		if (expected.length !== actual.length) {
			return false;
		}

		for (let i = 0; i < expected.length; i++) {
			if (actual[i] !== expected[i]) {
				return false;
			}
		}

		return true;
	}

	protected checkSentinel(sreader: IDwgStreamReader, expected: Uint8Array): void {
		const sn = sreader.readSentinel();

		if (!DwgSectionIO.CheckSentinel(sn, expected)) {
			this.notify(`Invalid section sentinel found in ${this.SectionName}`, NotificationType.Warning);
		}
	}

	protected notify(message: string, type: NotificationType, ex: Error | null = null): void {
		this.OnNotification?.(this, new NotificationEventArgs(message, type, ex));
	}
}
