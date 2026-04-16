import { AnnotScaleObjectContextData } from './AnnotScaleObjectContextData.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { XYZ } from '../Math/XYZ.js';

export class BlockReferenceObjectContextData extends AnnotScaleObjectContextData {
	insertionPoint: XYZ = new XYZ(0, 0, 0);

	override get objectName(): string {
		return DxfFileToken.blkRefObjectContextData;
	}

	rotation: number = 0;

	get xScale(): number { return this._xscale; }
	set xScale(value: number) {
		if (value === 0) throw new Error('XScale value must be non-zero.');
		this._xscale = value;
	}

	get yScale(): number { return this._yscale; }
	set yScale(value: number) {
		if (value === 0) throw new Error('YScale value must be non-zero.');
		this._yscale = value;
	}

	get zScale(): number { return this._zscale; }
	set zScale(value: number) {
		if (value === 0) throw new Error('ZScale value must be non-zero.');
		this._zscale = value;
	}

	private _xscale: number = 1;
	private _yscale: number = 1;
	private _zscale: number = 1;
}
