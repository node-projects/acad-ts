import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { PlotFlags } from './PlotFlags.js';
import { PlotPaperUnits } from './PlotPaperUnits.js';
import { PlotRotation } from './PlotRotation.js';
import { ShadePlotMode } from './ShadePlotMode.js';
import { ShadePlotResolutionMode } from './ShadePlotResolutionMode.js';
import { PaperMargin } from './PaperMargin.js';
import { XY } from '../Math/XY.js';

export enum PlotType {
	DrawingExtents = 0,
	Limits = 1,
	View = 2,
	Window = 3,
	Layout = 4,
	Display = 5,
}

export enum ScaledType {
	ScaleToFit = 0,
	UserDefined = 1,
}

export class PlotSettings extends NonGraphicalObject {
	private _denominatorScale: number = 1.0;
	private _numeratorScale: number = 1.0;
	private _shadePlotDPI: number = 300;

	get denominatorScale(): number {
		return this._denominatorScale;
	}

	set denominatorScale(value: number) {
		if (value <= 0.0) {
			throw new Error('Value must be greater than zero');
		}
		this._denominatorScale = value;
	}

	flags: PlotFlags = PlotFlags.DrawViewportsFirst | PlotFlags.PrintLineweights | PlotFlags.PlotPlotStyles | PlotFlags.UseStandardScale;

	get numeratorScale(): number {
		return this._numeratorScale;
	}

	set numeratorScale(value: number) {
		if (value <= 0.0) {
			throw new Error('Value must be greater than zero');
		}
		this._numeratorScale = value;
	}

	override get objectName(): string { return DxfFileToken.objectPlotSettings; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }

	pageName: string = 'none_device';
	paperHeight: number = 0;
	paperImageOrigin: XY = new XY(0, 0);
	paperImageOriginX: number = 0;
	paperImageOriginY: number = 0;
	paperRotation: PlotRotation = PlotRotation.NoRotation;
	paperSize: string = 'ISO_A4_(210.00_x_297.00_MM)';
	paperUnits: PlotPaperUnits = PlotPaperUnits.Millimeters;
	paperWidth: number = 0;
	plotOriginX: number = 0;
	plotOriginY: number = 0;
	plotType: PlotType = PlotType.DrawingExtents;
	plotViewName: string = '';

	get printScale(): number {
		return this.numeratorScale / this.denominatorScale;
	}

	scaledFit: ScaledType = ScaledType.ScaleToFit;

	get shadePlotDPI(): number {
		return this._shadePlotDPI;
	}

	set shadePlotDPI(value: number) {
		if (value < 100 || value > 32767) {
			throw new Error('The valid shade plot DPI values range from 100 to 32767.');
		}
		this._shadePlotDPI = value;
	}

	shadePlotIDHandle: number = 0;
	shadePlotMode: ShadePlotMode = ShadePlotMode.AsDisplayed;
	shadePlotResolutionMode: ShadePlotResolutionMode = ShadePlotResolutionMode.Draft;
	standardScale: number = 1.0;
	styleSheet: string = '';

	override get subclassMarker(): string { return DxfSubclassMarker.plotSettings; }

	systemPrinterName: string = '';
	unprintableMargin: PaperMargin = new PaperMargin();
	windowLowerLeftX: number = 0;
	windowLowerLeftY: number = 0;
	windowUpperLeftX: number = 0;
	windowUpperLeftY: number = 0;

	constructor(name?: string) {
		super(name);
	}
}

export { PlotFlags } from './PlotFlags.js';

export { PlotPaperUnits } from './PlotPaperUnits.js';

export { PlotRotation } from './PlotRotation.js';

export { ShadePlotMode } from './ShadePlotMode.js';

export { ShadePlotResolutionMode } from './ShadePlotResolutionMode.js';

export { PaperMargin } from './PaperMargin.js';
