export class DwgOutputBufferTooSmallError extends RangeError {
	constructor(
		public readonly requiredLength: number,
		public readonly bufferLength: number,
	) {
		super(`DWG output buffer is too small: ${requiredLength} bytes are required, but only ${bufferLength} are available.`);
		this.name = 'DwgOutputBufferTooSmallError';
	}
}
