import { XY, XYZ } from '../../../Math/index.js';
import { Color } from '../../../Color.js';
import { Transparency } from '../../../Transparency.js';
import { ObjectType } from '../../../Types/ObjectType.js';
import { DwgReferenceType } from '../../../Types/DwgReferenceType.js';
import { IDwgStreamReader } from './IDwgStreamReader.js';
import { DwgStreamReaderAC18 } from './DwgStreamReaderAC18.js';

export class DwgMergedReader implements IDwgStreamReader {
	get encoding(): string {
		return this._mainReader.encoding;
	}
	set encoding(value: string) {
		this._mainReader.encoding = value;
		this._textReader.encoding = value;
		this._handleReader.encoding = value;
	}

	get stream(): Uint8Array {
		throw new Error('InvalidOperation');
	}

	get bitShift(): number {
		throw new Error('InvalidOperation');
	}
	set bitShift(_value: number) {
		throw new Error('InvalidOperation');
	}

	get position(): number {
		return this._mainReader.position;
	}
	set position(_value: number) {
		throw new Error('InvalidOperation');
	}

	public readonly isEmpty: boolean = false;

	private _mainReader: IDwgStreamReader;
	private _textReader: IDwgStreamReader;
	private _handleReader: IDwgStreamReader;

	constructor(manReader: IDwgStreamReader, textReader: IDwgStreamReader, handleReader: IDwgStreamReader) {
		this._mainReader = manReader;
		this._textReader = textReader;
		this._handleReader = handleReader;
	}

	advance(offset: number): void {
		this._mainReader.advance(offset);
	}

	advanceByte(): void {
		throw new Error('InvalidOperation');
	}

	handleReference(): number {
		return this._handleReader.handleReference();
	}

	handleReferenceWithRef(referenceHandle: number): number {
		return this._handleReader.handleReferenceWithRef(referenceHandle);
	}

	handleReferenceWithRefAndType(referenceHandle: number): { handle: number; reference: DwgReferenceType } {
		return this._handleReader.handleReferenceWithRefAndType(referenceHandle);
	}

	positionInBits(): number {
		return this._mainReader.positionInBits();
	}

	read2Bits(): number {
		return this._mainReader.read2Bits();
	}

	read2RawDouble(): XY {
		return this._mainReader.read2RawDouble();
	}

	read3RawDouble(): XYZ {
		return this._mainReader.read3RawDouble();
	}

	read3BitDouble(): XYZ {
		return this._mainReader.read3BitDouble();
	}

	readBit(): boolean {
		return this._mainReader.readBit();
	}

	readBitAsShort(): number {
		return this._mainReader.readBitAsShort();
	}

	readBitDouble(): number {
		return this._mainReader.readBitDouble();
	}

	read2BitDouble(): XY {
		return this._mainReader.read2BitDouble();
	}

	readBitLong(): number {
		return this._mainReader.readBitLong();
	}

	readBitLongLong(): number {
		return this._mainReader.readBitLongLong();
	}

	readBitShort(): number {
		return this._mainReader.readBitShort();
	}

	readBitShortAsBool(): boolean {
		return this._mainReader.readBitShortAsBool();
	}

	readByte(): number {
		return this._mainReader.readByte();
	}

	readBytes(length: number): Uint8Array {
		return this._mainReader.readBytes(length);
	}

	read2BitDoubleWithDefault(defValues: XY): XY {
		return this._mainReader.read2BitDoubleWithDefault(defValues);
	}

	read3BitDoubleWithDefault(defValues: XYZ): XYZ {
		return this._mainReader.read3BitDoubleWithDefault(defValues);
	}

	readCmColor(useTextStream: boolean = false): Color {
		if (!(this._mainReader instanceof DwgStreamReaderAC18) && !useTextStream) {
			return this._mainReader.readCmColor();
		}

		// CMC:
		// BS: color index (always 0)
		const colorIndex: number = this.readBitShort();
		// BL: RGB value - always negative
		const rgb: number = this.readBitLong() >>> 0;
		const arr = new Uint8Array(4);
		arr[0] = rgb & 0xFF;
		arr[1] = (rgb >>> 8) & 0xFF;
		arr[2] = (rgb >>> 16) & 0xFF;
		arr[3] = (rgb >>> 24) & 0xFF;

		let color: Color;
		if (rgb === 0xC0000000) {
			color = Color.ByLayer;
		} else if ((rgb & 0b0000_0001_0000_0000_0000_0000_0000_0000) !== 0) {
			// Indexed color
			color = new Color(arr[0]);
		} else {
			// True color
			color = Color.fromTrueColor((arr[2] << 16) | (arr[1] << 8) | arr[0]);
		}

		// RC: Color Byte
		const id: number = this.readByte();

		let colorName: string = '';
		// RC: Color Byte(&1 => color name follows(TV))
		if ((id & 1) === 1) {
			colorName = this.readVariableText();
		}

		let bookName: string = '';
		// &2 => book name follows(TV))
		if ((id & 2) === 2) {
			bookName = this.readVariableText();
		}

		return color;
	}

	readEnColor(): { color: Color; transparency: Transparency; flag: boolean } {
		return this._mainReader.readEnColor();
	}

	read8BitJulianDate(): Date {
		return this._mainReader.read8BitJulianDate();
	}

	readDateTime(): Date {
		return this._mainReader.readDateTime();
	}

	readDouble(): number {
		return this._mainReader.readDouble();
	}

	readInt(): number {
		return this._mainReader.readInt();
	}

	readModularChar(): number {
		return this._mainReader.readModularChar();
	}

	readSignedModularChar(): number {
		return this._mainReader.readSignedModularChar();
	}

	readModularShort(): number {
		return this._mainReader.readModularShort();
	}

	readColorByIndex(): Color {
		return new Color(this.readBitShort());
	}

	readObjectType(): ObjectType {
		return this._mainReader.readObjectType();
	}

	readBitExtrusion(): XYZ {
		return this._mainReader.readBitExtrusion();
	}

	readBitDoubleWithDefault(def: number): number {
		return this._mainReader.readBitDoubleWithDefault(def);
	}

	readBitThickness(): number {
		return this._mainReader.readBitThickness();
	}

	readRawChar(): number {
		return this._mainReader.readRawChar();
	}

	readRawLong(): number {
		return this._mainReader.readRawLong();
	}

	readRawULong(): number {
		return this._mainReader.readRawULong();
	}

	readSentinel(): Uint8Array {
		return this._mainReader.readSentinel();
	}

	readShort(): number {
		return this._mainReader.readShort();
	}

	readShortBigEndian(): number {
		return this._mainReader.readShortBigEndian();
	}

	readTextUnicode(): string {
		// Handle the text section if is empty
		if (this._textReader.isEmpty) {
			return '';
		}

		return this._textReader.readTextUnicode();
	}

	readTimeSpan(): number {
		return this._mainReader.readTimeSpan();
	}

	readUInt(): number {
		return this._mainReader.readUInt();
	}

	readVariableText(): string {
		// Handle the text section if is empty
		if (this._textReader.isEmpty) {
			return '';
		}

		return this._textReader.readVariableText();
	}

	resetShift(): number {
		return this._mainReader.resetShift();
	}

	setPositionInBits(position: number): void {
		this._mainReader.setPositionInBits(position);
	}

	setPositionByFlag(position: number): number {
		throw new Error('InvalidOperation');
	}
}
