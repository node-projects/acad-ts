import { NotificationEventHandler } from './NotificationEventHandler.js';

export interface ICadWriter {
	OnNotification: NotificationEventHandler | null;
	Write(): void;
	Dispose(): void;
}
