import { CadDocument } from '../CadDocument.js';
import { CadHeader } from '../Header/CadHeader.js';
import { CadReaderConfiguration } from './CadReaderConfiguration.js';
import { ICadReader } from './ICadReader.js';
import { NotificationEventHandler, NotificationEventArgs, NotificationType } from './NotificationEventHandler.js';

export abstract class CadReaderBase<T extends CadReaderConfiguration> implements ICadReader {
	OnNotification: NotificationEventHandler | null = null;

	Configuration: T;

	protected _document: CadDocument = new CadDocument();

	protected _encoding: string = 'utf-8';

	protected _fileStream: ArrayBuffer | Uint8Array;

	protected constructor(stream: ArrayBuffer | Uint8Array, notification: NotificationEventHandler | null = null) {
		if (notification) {
			this.OnNotification = notification;
		}
		this._fileStream = stream;
		this.Configuration = this.createDefaultConfiguration();
	}

	protected abstract createDefaultConfiguration(): T;

	abstract Read(): CadDocument;

	abstract ReadHeader(): CadHeader;

	Dispose(): void {
		// No-op in TS; ArrayBuffer doesn't need disposal
	}

	protected getListedEncoding(code: number): string {
		// In TypeScript/browser, use TextDecoder encoding labels
		// Simplified: return a label or default
		return 'utf-8';
	}

	protected triggerNotification(message: string, notificationType: NotificationType, ex: Error | null = null): void {
		this.onNotificationEvent(null, new NotificationEventArgs(message, notificationType, ex));
	}

	protected onNotificationEvent(sender: object | null, e: NotificationEventArgs): void {
		this.OnNotification?.(this, e);
	}
}
