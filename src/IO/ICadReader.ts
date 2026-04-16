import { CadDocument } from '../CadDocument.js';
import { CadHeader } from '../Header/CadHeader.js';
import { NotificationEventHandler } from './NotificationEventHandler.js';

export interface ICadReader {
	onNotification: NotificationEventHandler | null;
	readHeader(): CadHeader;
	read(): CadDocument;
	dispose(): void;
}
