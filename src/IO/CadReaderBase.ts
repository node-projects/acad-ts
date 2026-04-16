import { CadDocument } from '../CadDocument.js';
import { CadHeader } from '../Header/CadHeader.js';
import { CadReaderConfiguration } from './CadReaderConfiguration.js';
import { ICadReader } from './ICadReader.js';
import { NotificationEventHandler, NotificationEventArgs, NotificationType } from './NotificationEventHandler.js';
import { getDecoderEncodingLabel } from './TextEncoding.js';

export abstract class CadReaderBase<T extends CadReaderConfiguration> implements ICadReader {
	onNotification: NotificationEventHandler | null = null;

	configuration: T;

	protected _document: CadDocument = new CadDocument();

	protected _encoding: string = 'utf-8';

	protected _fileStream: ArrayBuffer | Uint8Array;

	protected constructor(stream: ArrayBuffer | Uint8Array, notification: NotificationEventHandler | null = null) {
		if (notification) {
			this.onNotification = notification;
		}
		this._fileStream = stream;
		this.configuration = this.createDefaultConfiguration();
	}

	protected abstract createDefaultConfiguration(): T;

	abstract read(): CadDocument;

	abstract readHeader(): CadHeader;

	dispose(): void {
		// No-op in TS; ArrayBuffer doesn't need disposal
	}

	protected getListedEncoding(code: number): string {
		return getDecoderEncodingLabel(code);
	}

	protected triggerNotification(message: string, notificationType: NotificationType, ex: Error | null = null): void {
		this.onNotificationEvent(null, new NotificationEventArgs(message, notificationType, ex));
	}

	protected onNotificationEvent(sender: object | null, e: NotificationEventArgs): void {
		this.onNotification?.(this, e);
	}
}
