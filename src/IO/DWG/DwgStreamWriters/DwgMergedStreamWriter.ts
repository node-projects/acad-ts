import { XY, XYZ } from '../../../Math/index.js';
import { Color } from '../../../Color.js';
import { Transparency } from '../../../Transparency.js';
import { ObjectType } from '../../../Types/ObjectType.js';
import { DwgReferenceType } from '../../../Types/DwgReferenceType.js';
import { IHandledCadObject } from '../../../IHandledCadObject.js';
import { IDwgStreamWriter } from './IDwgStreamWriter.js';

export class DwgMergedStreamWriter implements IDwgStreamWriter {
	get encoding(): string { return this.main.encoding; }

	main: IDwgStreamWriter;

	textWriter: IDwgStreamWriter;

	handleWriter: IDwgStreamWriter;

	stream: ArrayBuffer;

	savedPositionInBits: number = 0;

	positionInBits: number = 0;

	protected _savedPosition: boolean = false;

	constructor(stream: Uint8Array, main: IDwgStreamWriter, textwriter: IDwgStreamWriter, handlewriter: IDwgStreamWriter) {
		this.stream = stream.buffer as ArrayBuffer;
		this.main = main;
		this.textWriter = textwriter;
		this.handleWriter = handlewriter;
	}

	handleReference(cadObject: IHandledCadObject): void {
		this.handleWriter.handleReference(cadObject);
	}

	handleReferenceTyped(type: DwgReferenceType, cadObject: IHandledCadObject): void {
		this.handleWriter.handleReferenceTyped(type, cadObject);
	}

	handleReferenceHandle(handle: number): void {
		this.handleWriter.handleReferenceHandle(handle);
	}

	handleReferenceTypedHandle(type: DwgReferenceType, handle: number): void {
		this.handleWriter.handleReferenceTypedHandle(type, handle);
	}

	resetStream(): void {
		this.main.resetStream();
		this.textWriter.resetStream();
		this.handleWriter.resetStream();
	}

	savePositonForSize(): void {
		this._savedPosition = true;
		this.positionInBits = this.main.positionInBits;
		//Save this position for the size in bits
		this.main.writeRawLong(0);
	}

	write2RawDouble(value: XY): void {
		this.main.write2RawDouble(value);
	}

	write2BitDouble(value: XY): void {
		this.main.write2BitDouble(value);
	}

	write3BitDouble(value: XYZ): void {
		this.main.write3BitDouble(value);
	}

	writeBit(value: boolean): void {
		this.main.writeBit(value);
	}

	write2Bits(value: number): void {
		this.main.write2Bits(value);
	}

	writeBitDouble(value: number): void {
		this.main.writeBitDouble(value);
	}

	write2BitDoubleWithDefault(def: XY, value: XY): void {
		this.main.write2BitDoubleWithDefault(def, value);
	}

	write3BitDoubleWithDefault(def: XYZ, value: XYZ): void {
		this.main.write3BitDoubleWithDefault(def, value);
	}

	writeBitDoubleWithDefault(def: number, value: number): void {
		this.main.writeBitDoubleWithDefault(def, value);
	}

	writeBitExtrusion(value: XYZ): void {
		this.main.writeBitExtrusion(value);
	}

	writeBitLong(value: number): void {
		this.main.writeBitLong(value);
	}

	writeBitLongLong(value: number): void {
		this.main.writeBitLongLong(value);
	}

	writeBitShort(value: number): void {
		this.main.writeBitShort(value);
	}

	writeBitThickness(value: number): void {
		this.main.writeBitThickness(value);
	}

	writeByte(value: number): void {
		this.main.writeByte(value);
	}

	writeBytes(bytes: Uint8Array): void {
		this.main.writeBytes(bytes);
	}

	writeBytesOffset(bytes: Uint8Array, offset: number, length: number): void {
		this.main.writeBytesOffset(bytes, offset, length);
	}

	writeCmColor(value: Color): void {
		this.main.writeCmColor(value);
	}

	writeEnColor(color: Color, transparency: Transparency): void {
		this.main.writeEnColor(color, transparency);
	}

	writeEnColorBook(color: Color, transparency: Transparency, isBookColor: boolean): void {
		this.main.writeEnColorBook(color, transparency, isBookColor);
	}

	writeDateTime(value: Date): void {
		this.main.writeDateTime(value);
	}

	write8BitJulianDate(value: Date): void {
		this.main.write8BitJulianDate(value);
	}

	writeInt(value: number): void {
		this.main.writeInt(value);
	}

	writeObjectType(value: number): void {
		this.main.writeObjectType(value);
	}

	writeObjectTypeEnum(value: ObjectType): void {
		this.main.writeObjectTypeEnum(value);
	}

	writeRawDouble(value: number): void {
		this.main.writeRawDouble(value);
	}

	writeRawLong(value: number): void {
		this.main.writeRawLong(value);
	}

	writeRawShort(value: number): void {
		this.main.writeRawShort(value);
	}

	writeSpearShift(): void {
		const mainSizeBits = this.main.positionInBits;
		const textSizeBits = this.textWriter.positionInBits;

		this.main.writeSpearShift();

		if (this._savedPosition) {
			let mainTextTotalBits = mainSizeBits + textSizeBits + 1;
			if (textSizeBits > 0) {
				mainTextTotalBits += 16;
				if (textSizeBits >= 0x8000) {
					mainTextTotalBits += 16;
					if (textSizeBits >= 0x40000000) {
						mainTextTotalBits += 16;
					}
				}
			}

			this.main.setPositionInBits(this.positionInBits);
			//Write the total size in bits
			this.main.writeRawLong(mainTextTotalBits);
			this.main.writeShiftValue();
		}

		this.main.setPositionInBits(mainSizeBits);

		if (textSizeBits > 0) {
			this.textWriter.writeSpearShift();
			const textWrittenBytes = Math.ceil(this.textWriter.positionInBits / 8);
			const textBuffer = new Uint8Array(this.textWriter.stream).slice(0, textWrittenBytes);
			this.main.writeBytes(textBuffer);
			this.main.writeSpearShift();
			this.main.setPositionInBits(mainSizeBits + textSizeBits);
			this.main.setPositionByFlag(textSizeBits);
			this.main.writeBit(true);
		} else {
			this.main.writeBit(false);
		}

		this.handleWriter.writeSpearShift();
		this.savedPositionInBits = this.main.positionInBits;
		const handleWrittenBytes = Math.ceil(this.handleWriter.positionInBits / 8);
		const handleBuffer = new Uint8Array(this.handleWriter.stream).slice(0, handleWrittenBytes);
		this.main.writeBytes(handleBuffer);
		this.main.writeSpearShift();
	}

	writeTimeSpan(value: number): void {
		this.main.writeTimeSpan(value);
	}

	writeVariableText(value: string): void {
		this.textWriter.writeVariableText(value);
	}

	writeTextUnicode(value: string): void {
		this.textWriter.writeTextUnicode(value);
	}

	setPositionInBits(posInBits: number): void {
		this.main.setPositionInBits(posInBits);
	}

	setPositionByFlag(pos: number): void {
		this.main.setPositionByFlag(pos);
	}

	writeShiftValue(): void {
		this.main.writeShiftValue();
	}
}
