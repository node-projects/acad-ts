import { XY } from '../Math/XY.js';
export class PaperMargin {
	left: number;
	bottom: number;
	right: number;
	top: number;

	get bottomLeftCorner(): XY { return new XY(this.left, this.bottom); }
	get topCorner(): XY { return new XY(this.right, this.top); }

	constructor(left: number = 0, bottom: number = 0, right: number = 0, top: number = 0) {
		this.left = left;
		this.bottom = bottom;
		this.right = right;
		this.top = top;
	}
}
