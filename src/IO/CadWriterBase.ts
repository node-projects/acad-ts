import { CadDocument } from '../CadDocument.js';
import { CadUtils } from '../CadUtils.js';
import { Dimension } from '../Entities/Dimension.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { CadWriterConfiguration } from './CadWriterConfiguration.js';
import { ICadWriter } from './ICadWriter.js';
import { NotificationEventHandler, NotificationEventArgs, NotificationType } from './NotificationEventHandler.js';

export abstract class CadWriterBase<T extends CadWriterConfiguration, TStream = ArrayBuffer | Uint8Array> implements ICadWriter {
	OnNotification: NotificationEventHandler | null = null;

	Configuration: T;

	protected _document: CadDocument;

	protected _encoding: string = 'utf-8';

	protected _stream: TStream;

	protected constructor(stream: TStream, document: CadDocument) {
		this._stream = stream;
		this._document = document;
		this.Configuration = this.createDefaultConfiguration();
	}

	protected abstract createDefaultConfiguration(): T;

	abstract Dispose(): void;

	Write(): void {
		this._document.updateImageReactors();

		this._document.updateDxfClasses(this.Configuration.ResetDxfClasses);

		if (this.Configuration.UpdateDimensionsInModel) {
			this.updateDimensions(this._document.modelSpace);
		}

		if (this.Configuration.UpdateDimensionsInBlocks) {
			for (const item of this._document.blockRecords) {
				if (item.Name.toLowerCase() === BlockRecord.ModelSpaceName.toLowerCase()) {
					continue;
				}
				this.updateDimensions(item);
			}
		}

		this._encoding = this.getListedEncoding(this._document.header.CodePage);
	}

	protected getListedEncoding(codePage: string): string {
		const code = CadUtils.getCodePage(codePage);
		// Simplified encoding lookup for TypeScript
		return 'utf-8';
	}

	protected triggerNotification(message: string, notificationType: NotificationType, ex?: Error | null): void;
	protected triggerNotification(sender: object, e: NotificationEventArgs): void;
	protected triggerNotification(messageOrSender: string | object, notificationTypeOrArgs: NotificationType | NotificationEventArgs, ex?: Error | null): void {
		if (typeof messageOrSender === 'string') {
			this.OnNotification?.(this, new NotificationEventArgs(messageOrSender, notificationTypeOrArgs as NotificationType, ex ?? null));
		} else {
			this.OnNotification?.(messageOrSender, notificationTypeOrArgs as NotificationEventArgs);
		}
	}

	private updateDimensions(record: BlockRecord): void {
		for (const item of record.entities) {
			if (item instanceof Dimension) {
				item.updateBlock();
			}
		}
	}
}
