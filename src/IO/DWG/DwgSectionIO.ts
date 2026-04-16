import { ACadVersion } from '../../ACadVersion.js';
import { NotificationEventHandler, NotificationEventArgs, NotificationType } from '../NotificationEventHandler.js';
import { IDwgStreamReader } from './DwgStreamReaders/IDwgStreamReader.js';

export abstract class DwgSectionIO {
	onNotification: NotificationEventHandler | null = null;

	abstract get sectionName(): string;

	protected r13_14Only: boolean;
	protected r13_15Only: boolean;
	protected r2000Plus: boolean;
	protected r2004Pre: boolean;
	protected r2007Pre: boolean;
	protected r2004Plus: boolean;
	protected r2007Plus: boolean;
	protected r2010Plus: boolean;
	protected r2013Plus: boolean;
	protected r2018Plus: boolean;

	protected readonly _version: ACadVersion;

	constructor(version: ACadVersion) {
		this._version = version;

		this.r13_14Only = version === ACadVersion.AC1014 || version === ACadVersion.AC1012;
		this.r13_15Only = version >= ACadVersion.AC1012 && version <= ACadVersion.AC1015;
		this.r2000Plus = version >= ACadVersion.AC1015;
		this.r2004Pre = version < ACadVersion.AC1018;
		this.r2007Pre = version <= ACadVersion.AC1021;
		this.r2004Plus = version >= ACadVersion.AC1018;
		this.r2007Plus = version >= ACadVersion.AC1021;
		this.r2010Plus = version >= ACadVersion.AC1024;
		this.r2013Plus = version >= ACadVersion.AC1027;
		this.r2018Plus = version >= ACadVersion.AC1032;
	}

	static checkSentinel(actual: Uint8Array, expected: Uint8Array): boolean {
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

		if (!DwgSectionIO.checkSentinel(sn, expected)) {
			this.notify(`Invalid section sentinel found in ${this.sectionName}`, NotificationType.Warning);
		}
	}

	protected notify(message: string, type: NotificationType, ex: Error | null = null): void {
		this.onNotification?.(this, new NotificationEventArgs(message, type, ex));
	}
}
