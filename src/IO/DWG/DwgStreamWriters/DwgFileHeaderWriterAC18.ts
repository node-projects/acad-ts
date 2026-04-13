import { CadDocument } from '../../../CadDocument.js';
import { DwgFileHeaderAC18 } from '../FileHeaders/DwgFileHeaderAC18.js';
import { DwgSectionDescriptor } from '../FileHeaders/DwgSectionDescriptor.js';
import { DwgLocalSectionMap } from '../FileHeaders/DwgLocalSectionMap.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { DwgCheckSumCalculator } from '../DwgCheckSumCalculator.js';
import { CRC32StreamHandler } from '../CRC32StreamHandler.js';
import { CRC } from '../CRC.js';
import { DwgStreamWriterBase } from './DwgStreamWriterBase.js';
import { ICompressor } from './ICompressor.js';
import { DwgLZ77AC18Compressor } from './DwgLZ77AC18Compressor.js';
import { DwgFileHeaderWriterBase } from './DwgFileHeaderWriterBase.js';

export class DwgFileHeaderWriterAC18 extends DwgFileHeaderWriterBase<DwgFileHeaderAC18> {
	override get FileHeaderSize(): number { return 0x100; }

	override get HandleSectionOffset(): number { return 0; }

	protected get compressor(): ICompressor { return new DwgLZ77AC18Compressor(); }

	private get _descriptors(): Map<string, DwgSectionDescriptor> { return this.FileHeader.Descriptors; }

	private _localSectionsMaps: DwgLocalSectionMap[] = [];

	constructor(stream: Uint8Array, encoding: string, document: CadDocument) {
		super(stream, encoding, document, new DwgFileHeaderAC18());

		// Fill file header area with zeros
		for (let i = 0; i < this.FileHeaderSize; i++) {
			this._stream[this._streamPosition++] = 0;
		}
	}

	override addSection(name: string, stream: Uint8Array, isCompressed: boolean, decompsize: number = 0x7400): void {
		const descriptor = new DwgSectionDescriptor(name);
		this.FileHeader.AddSectionDescriptor(descriptor);
		descriptor.DecompressedSize = decompsize;

		descriptor.CompressedSize = stream.length;
		descriptor.CompressedCode = !isCompressed ? 1 : 2;

		const nlocalSections = Math.floor(stream.length / descriptor.DecompressedSize);

		let offset = 0;
		for (let i = 0; i < nlocalSections; i++) {
			this.createLocalSection(
				descriptor,
				stream,
				descriptor.DecompressedSize,
				offset,
				descriptor.DecompressedSize,
				isCompressed);
			offset += descriptor.DecompressedSize;
		}

		const spearBytes = stream.length % descriptor.DecompressedSize;
		if (spearBytes > 0 && !this.checkEmptyBytes(stream, offset, spearBytes)) {
			this.createLocalSection(
				descriptor,
				stream,
				descriptor.DecompressedSize,
				offset,
				spearBytes,
				isCompressed);
		}
	}

	override writeFile(): void {
		this.FileHeader.SectionArrayPageSize = this._localSectionsMaps.length + 2;
		this.FileHeader.SectionPageMapId = this.FileHeader.SectionArrayPageSize;
		this.FileHeader.SectionMapId = this.FileHeader.SectionArrayPageSize - 1;

		this.writeDescriptors();

		this.writeRecords();

		this.writeFileMetaData();
	}

	protected applyCompression(buffer: Uint8Array, decompressedSize: number, offset: number, totalSize: number, isCompressed: boolean): Uint8Array {
		if (isCompressed) {
			const holder = new Uint8Array(decompressedSize);
			for (let i = 0; i < totalSize; i++) {
				holder[i] = buffer[offset + i];
			}
			// remaining bytes are already 0

			const result: number[] = [];
			this.compressor.compress(holder, 0, decompressedSize, result);
			return new Uint8Array(result);
		} else {
			const result = new Uint8Array(decompressedSize);
			for (let i = 0; i < totalSize; i++) {
				result[i] = buffer[offset + i];
			}
			// remaining are 0
			return result;
		}
	}

	protected createLocalSection(descriptor: DwgSectionDescriptor, buffer: Uint8Array, decompressedSize: number, offset: number, totalSize: number, isCompressed: boolean): void {
		const descriptorStream = this.applyCompression(buffer, decompressedSize, offset, totalSize, isCompressed);

		this.writeMagicNumber();

		// Save position for the local section
		const position = this._streamPosition;

		const localMap = new DwgLocalSectionMap();
		localMap.Offset = offset;
		localMap.Seeker = position;
		localMap.PageNumber = this._localSectionsMaps.length + 1;
		localMap.ODA = DwgCheckSumCalculator.Calculate(0, descriptorStream, 0, descriptorStream.length);

		const compressDiff = DwgCheckSumCalculator.CompressionCalculator(descriptorStream.length);
		localMap.CompressedSize = descriptorStream.length;
		localMap.DecompressedSize = totalSize;
		localMap.PageSize = localMap.CompressedSize + 32 + compressDiff;
		localMap.Checksum = 0;

		let checkSumData = this.buildDataSection(descriptor, localMap, descriptor.PageType);
		localMap.Checksum = DwgCheckSumCalculator.Calculate(localMap.ODA, checkSumData, 0, checkSumData.length);
		checkSumData = this.buildDataSection(descriptor, localMap, descriptor.PageType);

		this.applyMask(checkSumData, 0, checkSumData.length);

		this.writeToStream(checkSumData);
		this.writeToStream(descriptorStream);

		if (isCompressed) {
			this.writeToStream(DwgCheckSumCalculator.MagicSequence, 0, compressDiff);
		} else if (compressDiff !== 0) {
			throw new Error('Compression diff should be 0 for uncompressed data');
		}

		if (localMap.PageNumber > 0) {
			descriptor.PageCount++;
		}

		localMap.Size = this._streamPosition - position;
		descriptor.LocalSections.push(localMap);
		this._localSectionsMaps.push(localMap);
	}

	protected writeFileMetaData(): void {
		this.FileHeader.SecondHeaderAddr = this._streamPosition;

		const fileHeaderData = this.buildFileHeader();
		this.writeToStream(fileHeaderData);

		// Write at position 0
		const savedPos = this._streamPosition;
		this._streamPosition = 0;

		// 0x00  6  "ACXXXX" version string
		const versionBytes = new TextEncoder().encode(this._document.header.versionString);
		this.writeToStream(versionBytes, 0, 6);

		// 5 bytes of 0x00
		this.writeToStream(new Uint8Array(5));

		// 0x0B  Maintenance release version
		this.writeByteToStream(this._document.header.maintenanceVersion);

		// 0x0C  Byte 0x00, 0x01, or 0x03
		this.writeByteToStream(3);

		// 0x0D  Preview address
		const previewDesc = this._descriptors.get(DwgSectionDefinition.Preview);
		this.writeUint32ToStream(previewDesc?.LocalSections?.[0] ? previewDesc.LocalSections[0].Seeker + 0x20 : 0);

		// 0x11  Dwg version
		this.writeByteToStream(33);
		// 0x12  App maintenance version
		this.writeByteToStream(this._document.header.maintenanceVersion);

		// 0x13  Codepage
		this.writeUint16ToStream(this.getFileCodePage());
		// 0x15  3 zero bytes
		this.writeToStream(new Uint8Array(3));

		// 0x18  SecurityType
		this.writeInt32ToStream(0);
		// 0x1C  Unknown
		this.writeInt32ToStream(0);

		// 0x20  Summary info address
		const summaryDesc = this._descriptors.get(DwgSectionDefinition.SummaryInfo);
		this.writeUint32ToStream(summaryDesc?.LocalSections?.[0] ? summaryDesc.LocalSections[0].Seeker + 0x20 : 0);

		// 0x24  VBA Project Addr
		this.writeUint32ToStream(0);

		// 0x28  0x00000080
		this.writeUint32ToStream(0x00000080);

		// 0x2C  App info address
		const appInfoDesc = this._descriptors.get(DwgSectionDefinition.AppInfo);
		this.writeUint32ToStream(appInfoDesc?.LocalSections?.[0] ? appInfoDesc.LocalSections[0].Seeker + 0x20 : 0);

		// 0x30  0x80 zero bytes
		this.writeToStream(new Uint8Array(80));

		// Write file header again
		this.writeToStream(fileHeaderData);

		// Write magic sequence tail
		this.writeToStream(DwgCheckSumCalculator.MagicSequence, 236, 20);

		this._streamPosition = savedPos;
	}

	private addSectionMap(section: DwgLocalSectionMap): void {
		section.PageNumber = this._localSectionsMaps.length + 1;
		this._localSectionsMaps.push(section);
	}

	private compressChecksum(section: DwgLocalSectionMap, stream: Uint8Array): void {
		section.DecompressedSize = stream.length;

		const compressed: number[] = [];
		this.compressor.compress(stream, 0, stream.length, compressed);
		const compressedArr = new Uint8Array(compressed);

		section.CompressedSize = compressedArr.length;

		let checkSumData = this.buildPageHeaderData(section);
		section.Checksum = DwgCheckSumCalculator.Calculate(0, checkSumData, 0, checkSumData.length);
		section.Checksum = DwgCheckSumCalculator.Calculate(section.Checksum, compressedArr, 0, compressedArr.length);

		const headerData = this.buildPageHeaderData(section);
		this.writeToStream(headerData);
		this.writeToStream(compressedArr);
	}

	private setSeeker(mapValue: number, stream: Uint8Array): DwgLocalSectionMap {
		const holder = new DwgLocalSectionMap();
		holder.SectionMap = mapValue;

		this.writeMagicNumber();

		holder.Seeker = this._streamPosition;

		this.compressChecksum(holder, stream);

		return holder;
	}

	private buildDataSection(descriptor: DwgSectionDescriptor, map: DwgLocalSectionMap, size: number): Uint8Array {
		const data = new Uint8Array(32);
		const view = new DataView(data.buffer);

		// 0x00  Section page type
		view.setInt32(0, size, true);
		// 0x04  Section number
		view.setInt32(4, descriptor.SectionId, true);
		// 0x08  Data size (compressed)
		view.setInt32(8, map.CompressedSize, true);
		// 0x0C  Page Size (decompressed)
		view.setInt32(12, map.PageSize, true);
		// 0x10  Start Offset (as 64-bit, low 32 bits)
		view.setInt32(16, map.Offset & 0xFFFFFFFF, true);
		view.setInt32(20, 0, true); // high 32 bits
		// 0x18  Data Checksum
		view.setUint32(24, map.Checksum >>> 0, true);
		// 0x1C  ODA
		view.setUint32(28, map.ODA >>> 0, true);

		return data;
	}

	private writeDescriptors(): void {
		const streamArr: number[] = [];

		const writeInt = (value: number) => {
			streamArr.push(value & 0xFF);
			streamArr.push((value >>> 8) & 0xFF);
			streamArr.push((value >>> 16) & 0xFF);
			streamArr.push((value >>> 24) & 0xFF);
		};
		const writeInt64 = (value: number) => {
			writeInt(value);
			writeInt(0); // high 32 bits
		};
		const writeBytes = (arr: Uint8Array, offset: number = 0, length?: number) => {
			const len = length ?? arr.length;
			for (let i = 0; i < len; i++) streamArr.push(arr[offset + i]);
		};

		// 0x00  Number of section descriptions
		writeInt(this._descriptors.size);
		// 0x04  0x02
		writeInt(2);
		// 0x08  0x00007400
		writeInt(0x7400);
		// 0x0C  0x00
		writeInt(0);
		// 0x10  NumDescriptions
		writeInt(this._descriptors.size);

		for (const descriptor of this._descriptors.values()) {
			// 0x00  Size of section (64-bit)
			writeInt64(descriptor.CompressedSize);
			// 0x08  Page count
			writeInt(descriptor.PageCount);
			// 0x0C  Max Decompressed Size
			writeInt(descriptor.DecompressedSize);
			// 0x10  Unknown
			writeInt(1);
			// 0x14  Compressed (1=no, 2=yes)
			writeInt(descriptor.CompressedCode);
			// 0x18  Section Id
			writeInt(descriptor.SectionId);
			// 0x1C  Encrypted
			writeInt(descriptor.Encrypted);

			// 0x20  Section Name (64 bytes)
			const nameArr = new Uint8Array(64);
			if (descriptor.Name) {
				const nameBytes = new TextEncoder().encode(descriptor.Name);
				const length = Math.min(nameBytes.length, nameArr.length);
				for (let i = 0; i < length; i++) {
					nameArr[i] = nameBytes[i];
				}
			}
			writeBytes(nameArr);

			for (const localMap of descriptor.LocalSections) {
				if (localMap.PageNumber > 0) {
					// Page number
					writeInt(localMap.PageNumber);
					// Compressed size
					writeInt(localMap.CompressedSize);
					// Start offset (64-bit)
					writeInt64(localMap.Offset);
				}
			}
		}

		const streamData = new Uint8Array(streamArr);

		// Section map: 0x4163003b
		const sectionHolder = this.setSeeker(0x4163003B, streamData);
		const count = DwgCheckSumCalculator.CompressionCalculator(this._streamPosition - sectionHolder.Seeker);
		this.writeToStream(DwgCheckSumCalculator.MagicSequence, 0, count);
		sectionHolder.Size = this._streamPosition - sectionHolder.Seeker;

		this.addSectionMap(sectionHolder);
	}

	private buildFileHeader(): Uint8Array {
		const buffer = new Uint8Array(0x6C);
		let pos = 0;

		// We need CRC32 calculation over the buffer
		// Write data first, then compute CRC

		const writeInt = (value: number) => {
			buffer[pos++] = value & 0xFF;
			buffer[pos++] = (value >>> 8) & 0xFF;
			buffer[pos++] = (value >>> 16) & 0xFF;
			buffer[pos++] = (value >>> 24) & 0xFF;
		};

		const writeInt64 = (value: number) => {
			writeInt(value);
			writeInt(0); // high 32
		};

		// 0x00  12  "AcFssFcAJMB\0"
		const magic = new TextEncoder().encode('AcFssFcAJMB');
		for (let i = 0; i < 11; i++) buffer[pos++] = magic[i];
		buffer[pos++] = 0;

		// 0x0C  0x00
		writeInt(0);
		// 0x10  0x6c
		writeInt(0x6C);
		// 0x14  0x04
		writeInt(0x04);
		// 0x18  Root tree node gap
		writeInt(this.FileHeader.RootTreeNodeGap);
		// 0x1C  Left gap
		writeInt(this.FileHeader.LeftGap);
		// 0x20  Right gap
		writeInt(this.FileHeader.RigthGap);
		// 0x24  Unknown (1)
		writeInt(1);
		// 0x28  Last section page Id
		writeInt(this.FileHeader.LastPageId);

		// 0x2C  Last section page end address (64-bit)
		writeInt64(this.FileHeader.LastSectionAddr);
		// 0x34  Second header data address (64-bit)
		writeInt64(this.FileHeader.SecondHeaderAddr);

		// 0x3C  Gap amount
		writeInt(this.FileHeader.GapAmount);
		// 0x40  Section page amount
		writeInt(this.FileHeader.SectionAmount);

		// 0x44  0x20
		writeInt(0x20);
		// 0x48  0x80
		writeInt(0x80);
		// 0x4C  0x40
		writeInt(0x40);

		// 0x50  Section Page Map Id
		writeInt(this.FileHeader.SectionPageMapId);
		// 0x54  Section Page Map address (64-bit) - subtract 256
		writeInt64(this.FileHeader.PageMapAddress - 256);
		// 0x5C  Section Map Id
		writeInt(this.FileHeader.SectionMapId);
		// 0x60  Section page array size
		writeInt(this.FileHeader.SectionArrayPageSize);
		// 0x64  Gap array size
		writeInt(this.FileHeader.GapArraySize);

		// 0x68  CRC32 - initially zero, then compute and fill
		// pos should be at 0x68 now
		writeInt(0);

		// Compute CRC32 over the entire 0x6C bytes
		let crc = 0xFFFFFFFF;
		for (let i = 0; i < 0x6C; i++) {
			crc = ((crc >>> 8) ^ CRC.Crc32Table[(crc ^ buffer[i]) & 0xFF]) >>> 0;
		}
		crc = (~crc) >>> 0;

		// Write CRC at offset 0x68
		buffer[0x68] = crc & 0xFF;
		buffer[0x69] = (crc >>> 8) & 0xFF;
		buffer[0x6A] = (crc >>> 16) & 0xFF;
		buffer[0x6B] = (crc >>> 24) & 0xFF;

		// Apply magic sequence
		this.applyMagicSequence(buffer, buffer.length);

		return buffer;
	}

	private buildPageHeaderData(section: DwgLocalSectionMap): Uint8Array {
		const data = new Uint8Array(20);
		const view = new DataView(data.buffer);

		// 0x00  Section page type
		view.setInt32(0, section.SectionMap, true);
		// 0x04  Decompressed size
		view.setInt32(4, section.DecompressedSize, true);
		// 0x08  Compressed size
		view.setInt32(8, section.CompressedSize, true);
		// 0x0C  Compression type (0x02)
		view.setInt32(12, section.Compression, true);
		// 0x10  Checksum
		view.setUint32(16, section.Checksum >>> 0, true);

		return data;
	}

	private writeRecords(): void {
		this.writeMagicNumber();

		// Section page map: 0x41630e3b
		const section = new DwgLocalSectionMap();
		section.SectionMap = 0x41630E3B;

		this.addSectionMap(section);

		const counter = this._localSectionsMaps.length * 8;
		section.Seeker = this._streamPosition;
		const size = counter + DwgCheckSumCalculator.CompressionCalculator(counter);
		section.Size = size;

		const streamArr: number[] = [];
		for (const item of this._localSectionsMaps) {
			if (item != null) {
				// Page number
				streamArr.push(item.PageNumber & 0xFF);
				streamArr.push((item.PageNumber >>> 8) & 0xFF);
				streamArr.push((item.PageNumber >>> 16) & 0xFF);
				streamArr.push((item.PageNumber >>> 24) & 0xFF);
				// Size
				const sz = item.Size;
				streamArr.push(sz & 0xFF);
				streamArr.push((sz >>> 8) & 0xFF);
				streamArr.push((sz >>> 16) & 0xFF);
				streamArr.push((sz >>> 24) & 0xFF);
			}
		}

		const streamData = new Uint8Array(streamArr);
		this.compressChecksum(section, streamData);

		const last = this._localSectionsMaps[this._localSectionsMaps.length - 1];
		this.FileHeader.GapAmount = 0;
		this.FileHeader.LastPageId = last.PageNumber;
		this.FileHeader.LastSectionAddr = last.Seeker + size - 256;
		this.FileHeader.SectionAmount = this._localSectionsMaps.length - 1;
		this.FileHeader.PageMapAddress = section.Seeker;
	}
}
