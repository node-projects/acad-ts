import { CadDocument } from '../CadDocument.js';
import { CadUtils } from '../CadUtils.js';
import { Dimension } from '../Entities/Dimension.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { CadWriterConfiguration } from './CadWriterConfiguration.js';
import { ICadWriter } from './ICadWriter.js';
import { NotificationEventHandler, NotificationEventArgs, NotificationType } from './NotificationEventHandler.js';
import { getDocumentCodePageName } from './TextEncoding.js';

export abstract class CadWriterBase<T extends CadWriterConfiguration, TStream = ArrayBuffer | Uint8Array> implements ICadWriter {
	onNotification: NotificationEventHandler | null = null;

	configuration: T;

	protected _document: CadDocument;

	protected _encoding: string = 'utf-8';

	protected _stream: TStream;

	protected constructor(stream: TStream, document: CadDocument) {
		this._stream = stream;
		this._document = document;
		this.configuration = this.createDefaultConfiguration();
	}

	protected abstract createDefaultConfiguration(): T;

	abstract dispose(): void;

	write(): void {
		this._document.updateImageReactors();

		this._document.updateDxfClasses(this.configuration.resetDxfClasses);

		if (this.configuration.updateDimensionsInModel) {
			this._updateDimensions(this._document.modelSpace);
		}

		if (this.configuration.updateDimensionsInBlocks) {
			for (const item of this._document.blockRecords) {
				if (item.name.toLowerCase() === BlockRecord.modelSpaceName.toLowerCase()) {
					continue;
				}
				this._updateDimensions(item);
			}
		}

			this._encoding = this.getListedEncoding(this._document.header.codePage);
	}

	protected getListedEncoding(codePage: string | null | undefined): string {
			return getDocumentCodePageName(codePage);
	}

	protected triggerNotification(message: string, notificationType: NotificationType, ex?: Error | null): void;
	protected triggerNotification(sender: object, e: NotificationEventArgs): void;
	protected triggerNotification(messageOrSender: string | object, notificationTypeOrArgs: NotificationType | NotificationEventArgs, ex?: Error | null): void {
		if (typeof messageOrSender === 'string') {
			this.onNotification?.(this, new NotificationEventArgs(messageOrSender, notificationTypeOrArgs as NotificationType, ex ?? null));
		} else {
			this.onNotification?.(messageOrSender, notificationTypeOrArgs as NotificationEventArgs);
		}
	}

	private _updateDimensions(record: BlockRecord): void {
		for (const item of record.entities) {
			if (item instanceof Dimension) {
				item.updateBlock();
			}
		}
	}
}
