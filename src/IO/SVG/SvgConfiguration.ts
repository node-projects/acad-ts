import { CadWriterConfiguration } from '../CadWriterConfiguration.js';
import { LineWeightType } from '../../Types/LineWeightType.js';
import { LineWeightTypeExtensions } from '../../Extensions/LineWeightTypeExtensions.js';
import { UnitsType } from '../../Types/Units/UnitsType.js';

export class SvgConfiguration extends CadWriterConfiguration {
  lineWeightRatio: number = 100;

  defaultLineWeight: number = 0.01;

  pointRadius: number = 0.1;

  arcPoints: number = 256;

  getLineWeightValue(lineWeight: LineWeightType, units: UnitsType): number {
    const value = Math.abs(lineWeight as number);

    if (units === UnitsType.Unitless) {
      return value / this.lineWeightRatio;
    }

    switch (lineWeight) {
      case LineWeightType.Default:
        return this.defaultLineWeight;
      case LineWeightType.W0:
        return 0.001;
    }

    return LineWeightTypeExtensions.getLineWeightValue(lineWeight);
  }
}
