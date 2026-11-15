import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

import { FormattedTableData } from './LinkedData.js';
import { TableStyle } from './TableStyle.js';
import type { CadDocument } from '../CadDocument.js';

export class TableContent extends FormattedTableData {
	override clone(): this {
		const copy = super.clone() as this;
		copy.style = this.style?.clone() as TableStyle | null ?? null;
		copy.styleOverride = this.styleOverride instanceof TableStyle ? this.styleOverride.clone() : null;
		return copy;
	}
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get objectName(): string { return DxfFileToken.objectTableContent; }
	override get subclassMarker(): string { return DxfSubclassMarker.tableContent; }

	private _style: TableStyle | null = TableStyle.default_;
	get style(): TableStyle | null { return this._style; }
	set style(value: TableStyle | null) {
		this._style = value && !value.name ? value : this.updateCollectionEntry(value, style => this._style = style, this.document?.tableStyles ?? null);
	}
	override assignDocument(document: CadDocument): void { super.assignDocument(document); this.style = this._style; }
	override unassignDocument(): void { super.unassignDocument(); this._style = this._style?.clone() as TableStyle | null ?? null; }
	styleOverride: unknown = null;
}
