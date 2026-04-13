import { XY, XYZ } from '../../../Math/index.js';
import { Color } from '../../../Color.js';
import { Transparency } from '../../../Transparency.js';
import { ObjectType } from '../../../Types/ObjectType.js';
import { DwgReferenceType } from '../../../Types/DwgReferenceType.js';
import { IHandledCadObject } from '../../../IHandledCadObject.js';

export interface IDwgStreamWriter {
	encoding: string;

	main: IDwgStreamWriter;

	stream: ArrayBuffer;

	positionInBits: number;

	savedPositionInBits: number;

	writeBytes(bytes: Uint8Array): void;

	writeBytesOffset(bytes: Uint8Array, offset: number, length: number): void;

	writeInt(value: number): void;

	writeObjectType(value: number): void;

	writeObjectTypeEnum(value: ObjectType): void;

	writeRawLong(value: number): void;

	writeBitDouble(value: number): void;

	writeBitLong(value: number): void;

	writeBitLongLong(value: number): void;

	writeVariableText(value: string): void;

	writeTextUnicode(value: string): void;

	writeBit(value: boolean): void;

	write2Bits(value: number): void;

	writeBitShort(value: number): void;

	writeDateTime(value: Date): void;

	write8BitJulianDate(value: Date): void;

	writeTimeSpan(value: number): void;

	writeCmColor(value: Color): void;

	writeEnColor(color: Color, transparency: Transparency): void;

	writeEnColorBook(color: Color, transparency: Transparency, isBookColor: boolean): void;

	write2BitDouble(value: XY): void;

	write3BitDouble(value: XYZ): void;

	write2RawDouble(value: XY): void;

	writeByte(value: number): void;

	handleReference(cadObject: IHandledCadObject | number): void;

	handleReferenceTyped(type: DwgReferenceType, cadObject: IHandledCadObject | number): void;

	handleReferenceHandle(handle: number): void;

	handleReferenceTypedHandle(type: DwgReferenceType, handle: number): void;

	writeSpearShift(): void;

	writeRawShort(value: number): void;

	writeRawDouble(value: number): void;

	writeBitThickness(thickness: number): void;

	writeBitExtrusion(normal: XYZ): void;

	writeBitDoubleWithDefault(def: number, value: number): void;

	write2BitDoubleWithDefault(def: XY, value: XY): void;

	write3BitDoubleWithDefault(def: XYZ, value: XYZ): void;

	resetStream(): void;

	savePositonForSize(): void;

	setPositionInBits(posInBits: number): void;

	setPositionByFlag(pos: number): void;

	writeShiftValue(): void;
}
