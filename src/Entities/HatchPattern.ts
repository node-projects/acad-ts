import { XY } from '../Math/XY.js';
export class HatchPatternLine {
	angle: number = 0;
	basePoint: XY = new XY(0, 0);
	dashLengths: number[] = [];

	get lineOffset(): number {
		const cos = Math.cos(-this.angle);
		const sin = Math.sin(-this.angle);
		return this.offset.x * sin + this.offset.y * cos;
	}

	offset: XY = new XY(0, 0);

	get shift(): number {
		const cos = Math.cos(-this.angle);
		const sin = Math.sin(-this.angle);
		return this.offset.x * cos - this.offset.y * sin;
	}

	clone(): HatchPatternLine {
		const c = new HatchPatternLine();
		c.angle = this.angle;
		c.basePoint = new XY(this.basePoint.x, this.basePoint.y);
		c.offset = new XY(this.offset.x, this.offset.y);
		c.dashLengths = [...this.dashLengths];
		return c;
	}
}

export class HatchPattern {
	static get Solid(): HatchPattern {
		return new HatchPattern('SOLID');
	}

	description: string = '';

	lines: HatchPatternLine[] = [];

	name: string;

	constructor(name: string) {
		this.name = name;
	}

	clone(): HatchPattern {
		const c = new HatchPattern(this.name);
		c.description = this.description;
		c.lines = this.lines.map(l => l.clone());
		return c;
	}

	toString(): string {
		return this.name;
	}

	update(translation: XY, rotation: number, scale: number): void {
		for (const line of this.lines) {
			line.angle += rotation;
			// TODO: Apply transform to basePoint and offset
			line.dashLengths = line.dashLengths.map(d => d * scale);
		}
	}
}
