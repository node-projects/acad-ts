import { XY, XYZ } from '../../../Math/index.js';
import { Color } from '../../../Color.js';
import { Transparency } from '../../../Transparency.js';
import { ObjectType } from '../../../Types/ObjectType.js';
import { DwgReferenceType } from '../../../Types/DwgReferenceType.js';

/*
 NOTE: Unless otherwise stated, all data in this manual is in little-endian order,
		with the least significant byte first.

	B : bit (1 or 0)
	BB : special 2 bit code (entmode in entities, for instance)
	3B : bit triplet (1-3 bits) (R24)
	BS : bitshort (16 bits)
	BL : bitlong (32 bits)
	BLL : bitlonglong (64 bits) (R24)
	BD : bitdouble
	2BD : 2D point (2 bitdoubles)
	3BD : 3D point (3 bitdoubles)
	RC : raw char (not compressed)
	RS : raw short (not compressed)
	RD : raw double (not compressed)
	RL : raw long (not compressed)
	2RD : 2 raw doubles
	3RD : 3 raw doubles
	MC : modular char
	MS : modular short
	H : handle reference (see the HANDLE REFERENCES section)
	T : text (bitshort length, followed by the string).
	TU : Unicode text (bitshort character length, followed by Unicode string,
		2 bytes per character). Unicode text is read from the "string stream"
		within the object data, see the main Object description section for details.
	TV : Variable text, T for 2004 and earlier files, TU for 2007+ files.
	X : special form
	U : unknown
	SN : 16 byte sentinel
	BE : BitExtrusion
	DD : BitDouble With Default
	BT : BitThickness
	3DD : 3D point as 3 DD, needing 3 default values
	CMC : CmColor value
	TC : True Color: this is the same format as CMC in R2004+.
	OT : Object type
 */

export interface IDwgStreamReader {
	bitShift: number;
	encoding: string;
	isEmpty: boolean;
	position: number;
	stream: Uint8Array;

	advance(offset: number): void;
	advanceByte(): void;
	handleReference(): number;
	handleReferenceWithRef(referenceHandle: number): number;
	handleReferenceWithRefAndType(referenceHandle: number): { handle: number; reference: DwgReferenceType };
	positionInBits(): number;
	read2BitDouble(): XY;
	read2BitDoubleWithDefault(defValues: XY): XY;
	read2Bits(): number;
	read2RawDouble(): XY;
	read3BitDouble(): XYZ;
	read3BitDoubleWithDefault(defValues: XYZ): XYZ;
	read3RawDouble(): XYZ;
	read8BitJulianDate(): Date;
	readBit(): boolean;
	readBitAsShort(): number;
	readBitDouble(): number;
	readBitDoubleWithDefault(def: number): number;
	readBitExtrusion(): XYZ;
	readBitLong(): number;
	readBitLongLong(): number;
	readBitShort(): number;
	readBitShortAsBool(): boolean;
	readBitThickness(): number;
	readByte(): number;
	readBytes(length: number): Uint8Array;
	readCmColor(useTextStream?: boolean): Color;
	readColorByIndex(): Color;
	readDateTime(): Date;
	readDouble(): number;
	readEnColor(): { color: Color; transparency: Transparency; flag: boolean };
	readInt(): number;
	readModularChar(): number;
	readModularShort(): number;
	readObjectType(): ObjectType;
	readRawChar(): number;
	readRawLong(): number;
	readRawULong(): number;
	readSentinel(): Uint8Array;
	readShort(): number;
	readShortBigEndian(): number;
	readSignedModularChar(): number;
	readTextUnicode(): string;
	readTimeSpan(): number;
	readUInt(): number;
	readVariableText(): string;
	resetShift(): number;
	setPositionByFlag(position: number): number;
	setPositionInBits(position: number): void;
}
