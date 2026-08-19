import { CadDocument } from '../CadDocument.js';
import { CadHeader } from '../Header/CadHeader.js';
import { NotificationEventHandler } from './NotificationEventHandler.js';
import { ProgressEventHandler } from './ProgressEventHandler.js';

export interface ICadReader {
	onNotification: NotificationEventHandler | null;
	onProgress: ProgressEventHandler | null;
	readHeader(): CadHeader;
	read(): CadDocument;
	dispose(): void;
}
