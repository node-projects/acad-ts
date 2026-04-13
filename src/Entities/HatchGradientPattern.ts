import { GradientColor } from './GradientColor.js';

export class HatchGradientPattern {
	enabled: boolean = false;
	reserved: number = 0;
	angle: number = 0;
	shift: number = 0;
	isSingleColorGradient: boolean = false;
	colorTint: number = 0;
	colors: GradientColor[] = [];
	name: string = '';

	constructor(name?: string) {
		if (name) {
			this.name = name;
		}
	}

	clone(): HatchGradientPattern {
		const c = new HatchGradientPattern();
		c.enabled = this.enabled;
		c.reserved = this.reserved;
		c.angle = this.angle;
		c.shift = this.shift;
		c.isSingleColorGradient = this.isSingleColorGradient;
		c.colorTint = this.colorTint;
		c.name = this.name;
		c.colors = this.colors.map(gc => gc.clone());
		return c;
	}
}
