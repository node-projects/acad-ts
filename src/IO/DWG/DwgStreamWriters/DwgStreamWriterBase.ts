import { XY, XYZ } from '../../../Math/index.js';
import { Color } from '../../../Color.js';
import { Transparency } from '../../../Transparency.js';
import { ObjectType } from '../../../Types/ObjectType.js';
import { ACadVersion } from '../../../ACadVersion.js';
import { CadUtils } from '../../../CadUtils.js';
import { DwgReferenceType } from '../../../Types/DwgReferenceType.js';
import { IHandledCadObject } from '../../../IHandledCadObject.js';
import { IDwgStreamWriter } from './IDwgStreamWriter.js';
import { encodeCadString } from '../../TextEncoding.js';

// Factory registration for breaking circular dependency
type WriterFactory = new (stream: Uint8Array, encoding: string) => IDwgStreamWriter;
type MergedWriterFactory = new (...args: unknown[]) => IDwgStreamWriter;
const _writerFactories: Map<string, WriterFactory> = new Map();
const _mergedWriterFactories: Map<string, MergedWriterFactory> = new Map();

export function registerStreamWriter(key: string, factory: WriterFactory): void {
	_writerFactories.set(key, factory);
}

export function registerMergedWriter(key: string, factory: MergedWriterFactory): void {
	_mergedWriterFactories.set(key, factory);
}

export abstract class DwgStreamWriterBase implements IDwgStreamWriter {
	get main(): IDwgStreamWriter { return this; }

	get positionInBits(): number { return this._position * 8 + this.bitShift; }

	readonly savedPositionInBits: number = 0;

	bitShift: number = 0;

	encoding: string;

	get stream(): ArrayBuffer { return this._buffer.buffer as ArrayBuffer; }

	protected _buffer: Uint8Array;
	protected _view: DataView;
	protected _position: number = 0;
	private _lastByte: number = 0;

	constructor(stream: Uint8Array, encoding: string) {
		this._buffer = stream;
		this._view = new DataView(stream.buffer, stream.byteOffset, stream.byteLength);
		this.encoding = encoding;
	}

	static getStreamWriter(version: ACadVersion, stream: Uint8Array, encoding: string): IDwgStreamWriter {
		let key: string;
		switch (version) {
			case ACadVersion.Unknown:
				throw new Error('Unknown version');
			case ACadVersion.MC0_0:
			case ACadVersion.AC1_2:
			case ACadVersion.AC1_4:
			case ACadVersion.AC1_50:
			case ACadVersion.AC2_10:
			case ACadVersion.AC1002:
			case ACadVersion.AC1003:
			case ACadVersion.AC1004:
			case ACadVersion.AC1006:
			case ACadVersion.AC1009:
				throw new Error(`Dwg version not supported: ${version}`);
			case ACadVersion.AC1012:
			case ACadVersion.AC1014:
				key = 'AC12'; break;
			case ACadVersion.AC1015:
				key = 'AC15'; break;
			case ACadVersion.AC1018:
				key = 'AC18'; break;
			case ACadVersion.AC1021:
				key = 'AC21'; break;
			case ACadVersion.AC1024:
			case ACadVersion.AC1027:
			case ACadVersion.AC1032:
				key = 'AC24'; break;
			default:
				throw new Error(`Dwg version not supported: ${version}`);
		}
		const Factory = _writerFactories.get(key);
		if (!Factory) {
			throw new Error(`DwgStreamWriter factory for ${key} not registered. Import DwgStreamWriterFactory first.`);
		}
		return new Factory(stream, encoding);
	}

	static getMergedWriter(version: ACadVersion, stream: Uint8Array, encoding: string): IDwgStreamWriter {
		let key: string;
		switch (version) {
			case ACadVersion.Unknown:
				throw new Error('Unknown version');
			case ACadVersion.MC0_0:
			case ACadVersion.AC1_2:
			case ACadVersion.AC1_4:
			case ACadVersion.AC1_50:
			case ACadVersion.AC2_10:
			case ACadVersion.AC1002:
			case ACadVersion.AC1003:
			case ACadVersion.AC1004:
			case ACadVersion.AC1006:
			case ACadVersion.AC1009:
				throw new Error(`Dwg version not supported: ${version}`);
			case ACadVersion.AC1012:
			case ACadVersion.AC1014:
				key = 'AC12'; break;
			case ACadVersion.AC1015:
				key = 'AC15'; break;
			case ACadVersion.AC1018:
				key = 'AC18'; break;
			case ACadVersion.AC1021:
				key = 'AC21'; break;
			case ACadVersion.AC1024:
			case ACadVersion.AC1027:
			case ACadVersion.AC1032:
				key = 'AC24'; break;
			default:
				throw new Error(`Dwg version not supported: ${version}`);
		}

		const WriterFactory = _writerFactories.get(key);
		if (!WriterFactory) {
			throw new Error(`DwgStreamWriter factory for ${key} not registered. Import DwgStreamWriterFactory first.`);
		}

		let mergedKey: string;
		switch (version) {
			case ACadVersion.AC1012:
			case ACadVersion.AC1014:
			case ACadVersion.AC1015:
			case ACadVersion.AC1018:
				mergedKey = 'MergedAC14';
				break;
			default:
				mergedKey = 'Merged';
				break;
		}

		const MergedFactory = _mergedWriterFactories.get(mergedKey);
		if (!MergedFactory) {
			throw new Error(`Merged writer factory for ${mergedKey} not registered. Import DwgStreamWriterFactory first.`);
		}

		if (mergedKey === 'MergedAC14') {
			return new MergedFactory(
				stream,
				new WriterFactory(stream, encoding),
				new WriterFactory(new Uint8Array(0), encoding));
		} else {
			return new MergedFactory(
				stream,
				new WriterFactory(stream, encoding),
				new WriterFactory(new Uint8Array(0), encoding),
				new WriterFactory(new Uint8Array(0), encoding));
		}
	}

	writeInt(value: number): void {
		this.ensureCapacity(4);
		const bytes = new Uint8Array(4);
		const view = new DataView(bytes.buffer);
		view.setInt32(0, value, true);
		this.writeBytes(bytes);
	}

	writeObjectType(value: number): void {
		this.writeBitShort(value);
	}

	writeObjectTypeEnum(value: ObjectType): void {
		this.writeObjectType(value as number);
	}

	writeRawLong(value: number): void {
		const bytes = new Uint8Array(4);
		const view = new DataView(bytes.buffer);
		view.setInt32(0, value, true);
		this.writeBytes(bytes);
	}

	writeBytes(arr: Uint8Array): void {
		if (this.bitShift === 0) {
			this.ensureCapacity(arr.length);
			for (let i = 0; i < arr.length; i++) {
				this._buffer[this._position++] = arr[i];
			}
			return;
		}

		const num = 8 - this.bitShift;
		this.ensureCapacity(arr.length + 1);
		for (const b of arr) {
			this._buffer[this._position++] = (this._lastByte | (b >>> this.bitShift)) & 0xFF;
			this._lastByte = (b << num) & 0xFF;
		}
	}

	writeBytesOffset(arr: Uint8Array, initialIndex: number, length: number): void {
		if (this.bitShift === 0) {
			this.ensureCapacity(length);
			for (let i = 0, j = initialIndex; i < length; i++, j++) {
				this._buffer[this._position++] = arr[j];
			}
			return;
		}

		const num = 8 - this.bitShift;
		this.ensureCapacity(length + 1);
		for (let i = 0, j = initialIndex; i < length; i++, j++) {
			const b = arr[j];
			this._buffer[this._position++] = (this._lastByte | (b >>> this.bitShift)) & 0xFF;
			this._lastByte = (b << num) & 0xFF;
		}
	}

	writeBitShort(value: number): void {
		if (value === 0) {
			this.write2Bits(2);
		} else if (value > 0 && value < 256) {
			this.write2Bits(1);
			this.writeByte(value);
		} else if (value === 256) {
			this.write2Bits(3);
		} else {
			this.write2Bits(0);
			this.writeByte(value & 0xFF);
			this.writeByte((value >>> 8) & 0xFF);
		}
	}

	writeBitDouble(value: number): void {
		if (value === 0.0) {
			this.write2Bits(2);
			return;
		}

		if (value === 1.0) {
			this.write2Bits(1);
			return;
		}

		this.write2Bits(0);
		const bytes = new Uint8Array(8);
		const view = new DataView(bytes.buffer);
		view.setFloat64(0, value, true);
		this.writeBytes(bytes);
	}

	writeBitLong(value: number): void {
		if (value === 0) {
			this.write2Bits(2);
			return;
		}

		if (value > 0 && value < 256) {
			this.write2Bits(1);
			this.writeByte(value);
			return;
		}

		this.write2Bits(0);
		this.writeByte(value & 0xFF);
		this.writeByte((value >>> 8) & 0xFF);
		this.writeByte((value >>> 16) & 0xFF);
		this.writeByte((value >>> 24) & 0xFF);
	}

	writeBitLongLong(value: number): void {
		let size = 0;
		let hold = value < 0 ? value + 0x10000000000000000 : value;

		let tmp = hold;
		while (tmp !== 0) {
			tmp = Math.floor(tmp / 256);
			size++;
		}

		this.write3Bits(size);

		tmp = hold;
		for (let i = 0; i < size; i++) {
			this.writeByte(tmp & 0xFF);
			tmp = Math.floor(tmp / 256);
		}
	}

	writeVariableText(value: string): void {
		if (!value || value.length === 0) {
			this.writeBitShort(0);
			return;
		}

		const bytes = encodeCadString(value, this.encoding);
		this.writeBitShort(bytes.length);
		this.writeBytes(bytes);
	}

	writeTextUnicode(value: string): void {
		const text = value ?? '';
		const bytes = encodeCadString(text, this.encoding);
		this.writeRawShort(bytes.length + 1);
		this.ensureCapacity(bytes.length + 1);
		for (let i = 0; i < bytes.length; i++) {
			this._buffer[this._position++] = bytes[i];
		}
		this._buffer[this._position++] = 0;
	}

	write2Bits(value: number): void {
		if (this.bitShift < 6) {
			this._lastByte |= (value << (6 - this.bitShift)) & 0xFF;
			this.bitShift += 2;
		} else if (this.bitShift === 6) {
			this._lastByte |= value;
			this.ensureCapacity(1);
			this._buffer[this._position++] = this._lastByte & 0xFF;
			this.resetShift();
		} else {
			this._lastByte |= (value >>> 1) & 0xFF;
			this.ensureCapacity(1);
			this._buffer[this._position++] = this._lastByte & 0xFF;
			this._lastByte = (value << 7) & 0xFF;
			this.bitShift = 1;
		}
	}

	writeBit(value: boolean): void {
		if (this.bitShift < 7) {
			if (value) {
				this._lastByte |= (1 << (7 - this.bitShift)) & 0xFF;
			}
			this.bitShift++;
			return;
		}

		if (value) {
			this._lastByte |= 1;
		}

		this.ensureCapacity(1);
		this._buffer[this._position++] = this._lastByte & 0xFF;
		this.resetShift();
	}

	writeByte(value: number): void {
		if (this.bitShift === 0) {
			this.ensureCapacity(1);
			this._buffer[this._position++] = value & 0xFF;
			return;
		}

		const shift = 8 - this.bitShift;
		this.ensureCapacity(1);
		this._buffer[this._position++] = (this._lastByte | (value >>> this.bitShift)) & 0xFF;
		this._lastByte = (value << shift) & 0xFF;
	}

	private resetShift(): void {
		this.bitShift = 0;
		this._lastByte = 0;
	}

	writeDateTime(value: Date): void {
		const { jdate, milliseconds } = CadUtils.dateToJulian(value);
		this.writeBitLong(jdate);
		this.writeBitLong(milliseconds);
	}

	writeTimeSpan(value: number): void {
		const days = Math.floor(value / 86400000);
		const ms = ((value % 1000) + 1000) % 1000;
		this.writeBitLong(days);
		this.writeBitLong(ms);
	}

	write8BitJulianDate(value: Date): void {
		const { jdate, milliseconds } = CadUtils.dateToJulian(value);
		this.writeRawLong(jdate);
		this.writeRawLong(milliseconds);
	}

	writeCmColor(value: Color): void {
		//R15 and earlier: BS color index
		let index = 0;
		if (value.isTrueColor) {
			index = value.getApproxIndex();
		} else {
			index = value.index;
		}

		this.writeBitShort(index);
	}

	writeEnColor(color: Color, transparency: Transparency): void {
		this.writeCmColor(color);
	}

	writeEnColorBook(color: Color, transparency: Transparency, isBookColor: boolean): void {
		this.writeCmColor(color);
	}

	write2BitDouble(value: XY): void {
		this.writeBitDouble(value.X);
		this.writeBitDouble(value.Y);
	}

	write3BitDouble(value: XYZ): void {
		this.writeBitDouble(value.X);
		this.writeBitDouble(value.Y);
		this.writeBitDouble(value.Z);
	}

	write2RawDouble(value: XY): void {
		this.writeRawDouble(value.X);
		this.writeRawDouble(value.Y);
	}

	writeRawShort(value: number): void {
		const bytes = new Uint8Array(2);
		const view = new DataView(bytes.buffer);
		view.setInt16(0, value, true);
		this.writeBytes(bytes);
	}

	writeRawDouble(value: number): void {
		const bytes = new Uint8Array(8);
		const view = new DataView(bytes.buffer);
		view.setFloat64(0, value, true);
		this.writeBytes(bytes);
	}

	handleReference(cadObject: IHandledCadObject | number): void {
		this.handleReferenceTyped(DwgReferenceType.Undefined, cadObject);
	}

	handleReferenceTyped(type: DwgReferenceType, cadObject: IHandledCadObject | number): void {
		if (cadObject == null) {
			this.handleReferenceTypedHandle(type, 0);
		} else if (typeof cadObject === 'number') {
			this.handleReferenceTypedHandle(type, cadObject);
		} else {
			this.handleReferenceTypedHandle(type, cadObject.handle);
		}
	}

	handleReferenceHandle(handle: number): void {
		this.handleReferenceTypedHandle(DwgReferenceType.Undefined, handle);
	}

	handleReferenceTypedHandle(type: DwgReferenceType, handle: number): void {
		const b = (type << 4) & 0xFF;

		if (handle === 0) {
			this.writeByte(b);
		} else if (handle < 0x100) {
			this.writeByte(b | 1);
			this.writeByte(handle);
		} else if (handle < 0x10000) {
			this.writeByte(b | 2);
			this.writeByte((handle >>> 8) & 0xFF);
			this.writeByte(handle & 0xFF);
		} else if (handle < 0x1000000) {
			this.writeByte(b | 3);
			this.writeByte((handle >>> 16) & 0xFF);
			this.writeByte((handle >>> 8) & 0xFF);
			this.writeByte(handle & 0xFF);
		} else if (handle < 0x100000000) {
			this.writeByte(b | 4);
			this.writeByte((handle >>> 24) & 0xFF);
			this.writeByte((handle >>> 16) & 0xFF);
			this.writeByte((handle >>> 8) & 0xFF);
			this.writeByte(handle & 0xFF);
		} else if (handle < 0x10000000000) {
			this.writeByte(b | 5);
			this.writeByte(Math.floor(handle / 0x100000000) & 0xFF);
			this.writeByte((handle >>> 24) & 0xFF);
			this.writeByte((handle >>> 16) & 0xFF);
			this.writeByte((handle >>> 8) & 0xFF);
			this.writeByte(handle & 0xFF);
		} else if (handle < 0x1000000000000) {
			this.writeByte(b | 6);
			this.writeByte(Math.floor(handle / 0x10000000000) & 0xFF);
			this.writeByte(Math.floor(handle / 0x100000000) & 0xFF);
			this.writeByte((handle >>> 24) & 0xFF);
			this.writeByte((handle >>> 16) & 0xFF);
			this.writeByte((handle >>> 8) & 0xFF);
			this.writeByte(handle & 0xFF);
		} else if (handle < 0x100000000000000) {
			this.writeByte(b | 7);
			this.writeByte(Math.floor(handle / 0x1000000000000) & 0xFF);
			this.writeByte(Math.floor(handle / 0x10000000000) & 0xFF);
			this.writeByte(Math.floor(handle / 0x100000000) & 0xFF);
			this.writeByte((handle >>> 24) & 0xFF);
			this.writeByte((handle >>> 16) & 0xFF);
			this.writeByte((handle >>> 8) & 0xFF);
			this.writeByte(handle & 0xFF);
		} else {
			this.writeByte(b | 8);
			this.writeByte(Math.floor(handle / 0x100000000000000) & 0xFF);
			this.writeByte(Math.floor(handle / 0x1000000000000) & 0xFF);
			this.writeByte(Math.floor(handle / 0x10000000000) & 0xFF);
			this.writeByte(Math.floor(handle / 0x100000000) & 0xFF);
			this.writeByte((handle >>> 24) & 0xFF);
			this.writeByte((handle >>> 16) & 0xFF);
			this.writeByte((handle >>> 8) & 0xFF);
			this.writeByte(handle & 0xFF);
		}
	}

	writeSpearShift(): void {
		if (this.bitShift > 0) {
			for (let i = this.bitShift; i < 8; i++) {
				this.writeBit(false);
			}
		}
	}

	writeBitThickness(thickness: number): void {
		//For R13-R14, this is a BD.
		this.writeBitDouble(thickness);
	}

	writeBitExtrusion(normal: XYZ): void {
		//For R13-R14 this is 3BD.
		this.write3BitDouble(normal);
	}

	write2BitDoubleWithDefault(def: XY, value: XY): void {
		this.writeBitDoubleWithDefault(def.X, value.X);
		this.writeBitDoubleWithDefault(def.Y, value.Y);
	}

	write3BitDoubleWithDefault(def: XYZ, value: XYZ): void {
		this.writeBitDoubleWithDefault(def.X, value.X);
		this.writeBitDoubleWithDefault(def.Y, value.Y);
		this.writeBitDoubleWithDefault(def.Z, value.Z);
	}

	writeBitDoubleWithDefault(def: number, value: number): void {
		if (def === value) {
			//00 No more data present, use the value of the default double.
			this.write2Bits(0);
			return;
		}

		const defBytes = new Uint8Array(8);
		const defView = new DataView(defBytes.buffer);
		defView.setFloat64(0, def, true);

		const valueBytes = new Uint8Array(8);
		const valueView = new DataView(valueBytes.buffer);
		valueView.setFloat64(0, value, true);

		//Compare the 2 sets of bytes by it's simetry
		let first = 0;
		let last = 7;
		while (last >= 0 && defBytes[last] === valueBytes[last]) {
			first++;
			last--;
		}

		if (first >= 4) {
			//01 4 bytes of data are present.
			this.write2Bits(1);
			this.writeBytesOffset(defBytes, 0, 4);
		} else if (first >= 2) {
			//10 6 bytes of data are present.
			this.write2Bits(2);
			this.writeByte(defBytes[4]);
			this.writeByte(defBytes[5]);
			this.writeByte(defBytes[0]);
			this.writeByte(defBytes[1]);
			this.writeByte(defBytes[2]);
			this.writeByte(defBytes[3]);
		} else {
			//11 A full RD follows.
			this.write2Bits(3);
			this.writeBytes(defBytes);
		}
	}

	resetStream(): void {
		this._position = 0;
		this.bitShift = 0;
		this._lastByte = 0;
	}

	savePositonForSize(): void {
		this.writeRawLong(0);
	}

	setPositionByFlag(pos: number): void {
		if (pos >= 0x8000) {
			if (pos >= 0x40000000) {
				const bytes1 = new Uint8Array(2);
				new DataView(bytes1.buffer).setUint16(0, (pos >>> 30) & 0xFFFF, true);
				this.writeBytes(bytes1);
				const bytes2 = new Uint8Array(2);
				new DataView(bytes2.buffer).setUint16(0, ((pos >>> 15) & 0x7FFF) | 0x8000, true);
				this.writeBytes(bytes2);
			} else {
				const bytes1 = new Uint8Array(2);
				new DataView(bytes1.buffer).setUint16(0, (pos >>> 15) & 0xFFFF, true);
				this.writeBytes(bytes1);
			}

			const bytes3 = new Uint8Array(2);
			new DataView(bytes3.buffer).setUint16(0, (pos & 0x7FFF) | 0x8000, true);
			this.writeBytes(bytes3);
		} else {
			const bytes = new Uint8Array(2);
			new DataView(bytes.buffer).setUint16(0, pos & 0xFFFF, true);
			this.writeBytes(bytes);
		}
	}

	setPositionInBits(posInBits: number): void {
		const position = Math.floor(posInBits / 8);
		this.bitShift = posInBits % 8;
		this._position = position;

		if (this.bitShift > 0) {
			if (position >= this._buffer.length) {
				throw new Error('EndOfStreamException');
			}
			this._lastByte = this._buffer[position];
		} else {
			this._lastByte = 0;
		}
	}

	writeShiftValue(): void {
		if (this.bitShift > 0) {
			const position = this._position;
			if (position < this._buffer.length) {
				const lastValue = this._buffer[position];
				const currValue = (this._lastByte | (lastValue & (0xFF >>> this.bitShift))) & 0xFF;
				this._buffer[position] = currValue;
			}
		}
	}

	private write3Bits(value: number): void {
		this.writeBit((value & 4) !== 0);
		this.writeBit((value & 2) !== 0);
		this.writeBit((value & 1) !== 0);
	}

	private ensureCapacity(additionalBytes: number): void {
		const needed = this._position + additionalBytes;
		if (needed > this._buffer.length) {
			const newSize = Math.max(needed, this._buffer.length * 2);
			const newBuffer = new Uint8Array(newSize);
			newBuffer.set(this._buffer);
			this._buffer = newBuffer;
			this._view = new DataView(newBuffer.buffer, newBuffer.byteOffset, newBuffer.byteLength);
		}
	}
}
