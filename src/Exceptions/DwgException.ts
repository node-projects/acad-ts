export class DwgException extends Error {
	public innerError: Error | null;

	public constructor(message: string, inner?: Error) {
		super(message);
		this.name = 'DwgException';
		this.innerError = inner ?? null;
	}
}
