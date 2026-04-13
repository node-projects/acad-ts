export type NotificationEventHandler = (sender: object, e: NotificationEventArgs) => void;

export enum NotificationType {
	NotImplemented = -1,
	None = 0,
	NotSupported = 1,
	Warning = 2,
	Error = 3,
}

export class NotificationEventArgs {
	readonly message: string;
	readonly notificationType: NotificationType;
	readonly exception: Error | null;

	get Message(): string { return this.message; }
	get NotificationType(): NotificationType { return this.notificationType; }
	get Exception(): Error | null { return this.exception; }

	constructor(message: string, notificationType: NotificationType = NotificationType.None, exception: Error | null = null) {
		this.message = message;
		this.notificationType = notificationType;
		this.exception = exception;
	}
}
