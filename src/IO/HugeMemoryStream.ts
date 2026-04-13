export class HugeMemoryStream {
	private static readonly _maxChunkSize: number = 1048576 * 1024;
	private static readonly _maxChunkShift: number = 30;
	private static readonly _maxChunkMask: number = (1048576 * 1024) - 1;
	private _currentChunk!: Uint8Array;
	private _currentInChunk: number = 0;
	private readonly _length: number;
	private _position: number = 0;
	private readonly _chunks: Uint8Array[];

	static Create(length: number): Uint8Array | HugeMemoryStream {
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
			this.Position = 0;
		} else {
			this._chunks = arg;
			this._length = arg.reduce((sum, x) => sum + x.length, 0);
			this.Position = 0;
		}
	}

	get CanRead(): boolean { return true; }
	get CanSeek(): boolean { return true; }
	get CanWrite(): boolean { return true; }
	get Length(): number { return this._length; }

	get Position(): number { return this._position; }
	set Position(value: number) {
		this._position = value;
		this._currentChunk = this._chunks[value >> HugeMemoryStream._maxChunkShift];
		this._currentInChunk = value & HugeMemoryStream._maxChunkMask;
	}

	Read(buffer: Uint8Array, offset: number, count: number): number {
		if (count === 1) {
			buffer[offset] = this._currentChunk[this._currentInChunk];
			this.Position++;
			return 1;
		}
		if (this._currentInChunk + count > HugeMemoryStream._maxChunkSize) {
			const toRead = HugeMemoryStream._maxChunkSize - this._currentInChunk;
			buffer.set(this._currentChunk.subarray(this._currentInChunk, this._currentInChunk + toRead), offset);
			this.Position += toRead;
			return toRead + this.Read(buffer, offset + toRead, count - toRead);
		} else {
			buffer.set(this._currentChunk.subarray(this._currentInChunk, this._currentInChunk + count), offset);
			this.Position += count;
			return count;
		}
	}

	ReadByte(): number {
		const value = this._currentChunk[this._currentInChunk];
		this.Position++;
		return value;
	}

	Write(buffer: Uint8Array, offset: number, count: number): void {
		if (count === 1) {
			this._currentChunk[this._currentInChunk] = buffer[offset];
			this.Position++;
			return;
		}

		if (this._currentInChunk + count > HugeMemoryStream._maxChunkSize) {
			const toWrite = HugeMemoryStream._maxChunkSize - this._currentInChunk;
			this._currentChunk.set(buffer.subarray(offset, offset + toWrite), this._currentInChunk);
			this.Position += toWrite;
			this.Write(buffer, offset + toWrite, count - toWrite);
		} else {
			this._currentChunk.set(buffer.subarray(offset, offset + count), this._currentInChunk);
			this.Position += count;
		}
	}

	WriteByte(value: number): void {
		this._currentChunk[this._currentInChunk] = value;
		this.Position++;
	}

	Clone(): HugeMemoryStream {
		return new HugeMemoryStream(this._chunks);
	}

	static CloneStream(stream: Uint8Array | HugeMemoryStream): Uint8Array | HugeMemoryStream {
		if (stream instanceof HugeMemoryStream) {
			return stream.Clone();
		} else if (stream instanceof Uint8Array) {
			return new Uint8Array(stream);
		} else {
			throw new Error('The provided stream type is not supported for cloning.');
		}
	}
}
