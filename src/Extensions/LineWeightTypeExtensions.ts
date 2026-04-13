import { LineWeightType } from '../Types/LineWeightType.js';

export class LineWeightTypeExtensions {
	public static getLineWeightValue(lineWeight: LineWeightType): number {
		const value = Math.abs(lineWeight as number);

		switch (lineWeight) {
			case LineWeightType.W0:
				return 0.001;
		}

		return value / 100;
	}
}
