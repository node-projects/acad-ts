import { DwgReader } from './DWG/DwgReader.js';
import { DxfReader } from './DXF/DxfReader.js';
import type { ICadReader } from './ICadReader.js';
import type { NotificationEventHandler } from './NotificationEventHandler.js';
import { CadFileFormat } from './CadFileFormat.js';

export { CadFileFormat } from './CadFileFormat.js';

export class CadReader {
	static getFileFormat(filename: string): CadFileFormat {
		const extension = /(?:^|[/\\])[^/\\]*?(\.[^.\\/]*)$/.exec(filename)?.[1]?.toLowerCase();
		switch (extension) {
			case '.dwg': return CadFileFormat.DWG;
			case '.dxf': return CadFileFormat.DXF;
			default: return CadFileFormat.Unknown;
		}
	}

	static createReader(
		filename: string,
		stream: ArrayBuffer | Uint8Array,
		notification: NotificationEventHandler | null = null,
	): ICadReader {
		switch (CadReader.getFileFormat(filename)) {
			case CadFileFormat.DWG: {
				const buffer = stream instanceof Uint8Array
					? stream.buffer.slice(stream.byteOffset, stream.byteOffset + stream.byteLength) as ArrayBuffer
					: stream;
				return new DwgReader(buffer, notification);
			}
			case CadFileFormat.DXF:
				return new DxfReader(stream instanceof Uint8Array ? stream : new Uint8Array(stream), notification ?? undefined);
			default:
				throw new Error(`Extension for ${filename} is not supported.`);
		}
	}
}
