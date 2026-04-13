import { Color } from '../Color.js';

export class GradientColor {
	value: number = 0;
	color: Color = Color.ByLayer;

	clone(): GradientColor {
		const c = new GradientColor();
		c.value = this.value;
		c.color = this.color;
		return c;
	}
}
