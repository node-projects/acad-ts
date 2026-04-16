export class HugeMemoryStream {
	private static readonly _maxChunkSize: number = 1048576 * 1024;
	private static readonly _maxChunkShift: number = 30;
	private static readonly _maxChunkMask: number = (1048576 * 1024) - 1;
	private _currentChunk!: Uint8Array;
	private _currentInChunk: number = 0;
	private readonly _length: number;
	private _position: number = 0;
	private readonly _chunks: Uint8Array[];

	static create(length: number): Uint8Array | HugeMemoryStream {
		if (length <= 0x7FFFFFFF) {
			return new Uint8Array(length);
		} else {
			return new HugeMemoryStream(length);
		}
	}

	constructor(length: number);
	constructor(chunks: Uint8Array[]);
	constructor(arg: number | Uint8Array[]) {
		if (typeof arg === 'number') {
			const length = arg;
			this._length = length;
			this._position = 0;
			this._chunks = [];
			let lengthLeft = length;
			while (lengthLeft > 0) {
				const chunkSize = Math.min(lengthLeft, HugeMemoryStream._maxChunkSize);
				this._chunks.push(new Uint8Array(chunkSize));
				lengthLeft -= chunkSize;
			}
			this.position = 0;
		} else {
			this._chunks = arg;
			this._length = arg.reduce((sum, x) => sum + x.length, 0);
			this.position = 0;
		}
	}

	get canRead(): boolean { return true; }
	get canSeek(): boolean { return true; }
	get canWrite(): boolean { return true; }
	get length(): number { return this._length; }

	get position(): number { return this._position; }
	set position(value: number) {
		this._position = value;
		this._currentChunk = this._chunks[value >> HugeMemoryStream._maxChunkShift];
		this._currentInChunk = value & HugeMemoryStream._maxChunkMask;
	}

	read(buffer: Uint8Array, offset: number, count: number): number {
		if (count === 1) {
			buffer[offset] = this._currentChunk[this._currentInChunk];
			this.position++;
			return 1;
		}
		if (this._currentInChunk + count > HugeMemoryStream._maxChunkSize) {
			const toRead = HugeMemoryStream._maxChunkSize - this._currentInChunk;
			buffer.set(this._currentChunk.subarray(this._currentInChunk, this._currentInChunk + toRead), offset);
			this.position += toRead;
			return toRead + this.read(buffer, offset + toRead, count - toRead);
		} else {
			buffer.set(this._currentChunk.subarray(this._currentInChunk, this._currentInChunk + count), offset);
			this.position += count;
			return count;
		}
	}

	readByte(): number {
		const value = this._currentChunk[this._currentInChunk];
		this.position++;
		return value;
	}

	write(buffer: Uint8Array, offset: number, count: number): void {
		if (count === 1) {
			this._currentChunk[this._currentInChunk] = buffer[offset];
			this.position++;
			return;
		}

		if (this._currentInChunk + count > HugeMemoryStream._maxChunkSize) {
			const toWrite = HugeMemoryStream._maxChunkSize - this._currentInChunk;
			this._currentChunk.set(buffer.subarray(offset, offset + toWrite), this._currentInChunk);
			this.position += toWrite;
			this.write(buffer, offset + toWrite, count - toWrite);
		} else {
			this._currentChunk.set(buffer.subarray(offset, offset + count), this._currentInChunk);
			this.position += count;
		}
	}

	writeByte(value: number): void {
		this._currentChunk[this._currentInChunk] = value;
		this.position++;
	}

	clone(): HugeMemoryStream {
		return new HugeMemoryStream(this._chunks);
	}

	static cloneStream(stream: Uint8Array | HugeMemoryStream): Uint8Array | HugeMemoryStream {
		if (stream instanceof HugeMemoryStream) {
			return stream.clone();
		} else if (stream instanceof Uint8Array) {
			return new Uint8Array(stream);
		} else {
			throw new Error('The provided stream type is not supported for cloning.');
		}
	}
}
