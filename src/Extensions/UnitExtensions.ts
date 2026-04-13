import { UnitsType } from '../Types/Units/UnitsType.js';

// TODO: PlotPaperUnits from Objects not yet converted
export enum PlotPaperUnits {
	Inches = 0,
	Millimeters = 1,
	Pixels = 2,
}

export class UnitExtensions {
	public static toUnits(units: PlotPaperUnits): UnitsType {
		switch (units) {
			case PlotPaperUnits.Inches:
				return UnitsType.Inches;
			case PlotPaperUnits.Millimeters:
				return UnitsType.Millimeters;
			case PlotPaperUnits.Pixels:
			default:
				return UnitsType.Unitless;
		}
	}
}
