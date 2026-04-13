import { PlotSettings } from '../../Objects/PlotSettings.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadPlotSettingsTemplate extends CadTemplateT<PlotSettings> {
	constructor(layout: PlotSettings) {
		super(layout);
	}
}
