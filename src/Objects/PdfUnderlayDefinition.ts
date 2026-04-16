import { UnderlayDefinition } from './UnderlayDefinition.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';

export class PdfUnderlayDefinition extends UnderlayDefinition {
	override get objectName(): string { return DxfFileToken.objectPdfDefinition; }

	private _page: string = '';
	get page(): string { return this._page; }
	set page(value: string) {
		this._page = value || '';
	}
}
