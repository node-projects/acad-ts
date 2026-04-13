import { CadDocument } from '../CadDocument.js';
import { CadHeader } from '../Header/CadHeader.js';
import { NotificationEventHandler } from './NotificationEventHandler.js';

export interface ICadReader {
	OnNotification: NotificationEventHandler | null;
	ReadHeader(): CadHeader;
	Read(): CadDocument;
	Dispose(): void;
}
