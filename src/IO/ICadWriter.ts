import { NotificationEventHandler } from './NotificationEventHandler.js';

export interface ICadWriter {
	onNotification: NotificationEventHandler | null;
	write(): void;
	dispose(): void;
}
