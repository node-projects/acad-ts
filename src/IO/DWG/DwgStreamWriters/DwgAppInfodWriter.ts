import { ACadVersion } from '../../../ACadVersion.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { DwgStreamWriterBase } from './DwgStreamWriterBase.js';
import { IDwgStreamWriter } from './IDwgStreamWriter.js';

export class DwgAppInfoWriter extends DwgSectionIO {
	override get SectionName(): string { return DwgSectionDefinition.AppInfo; }

	get bytesWritten(): number { return Math.ceil(this._writer.positionInBits / 8); }
	get writerStream(): ArrayBuffer { return this._writer.main.stream; }

	private _writer: IDwgStreamWriter;

	private _emptyArr: Uint8Array = new Uint8Array(16);

	constructor(version: ACadVersion, stream: Uint8Array) {
		super(version);
		this._writer = DwgStreamWriterBase.getStreamWriter(version, stream, 'utf-16le');
	}

	write(): void {
		const version = '1.0.0.0';

		//UInt32	4	class_version (default: 3)
		this._writer.writeInt(3);
		//String	2 + 2 * n + 2	App info name, ODA writes "AppInfoDataList"
		this._writer.writeTextUnicode('AppInfoDataList');
		//UInt32	4	num strings (default: 3)
		this._writer.writeInt(3);
		//Byte[]	16	Version data(checksum, ODA writes zeroes)
		this._writer.writeBytes(this._emptyArr);
		//String	2 + 2 * n + 2	Version
		this._writer.writeTextUnicode(version);
		//Byte[]	16	Comment data(checksum, ODA writes zeroes)
		this._writer.writeBytes(this._emptyArr);
		//String	2 + 2 * n + 2	Comment
		this._writer.writeTextUnicode('This is a comment from ACadSharp');
		//Byte[]	16	Product data(checksum, ODA writes zeroes)
		this._writer.writeBytes(this._emptyArr);
		//String	2 + 2 * n + 2	Product
		this._writer.writeTextUnicode(`<ProductInformation name ="ACadSharp" build_version="${version}" registry_version="${version}" install_id_string="ACadSharp" registry_localeID="1033"/>`);
	}
}
