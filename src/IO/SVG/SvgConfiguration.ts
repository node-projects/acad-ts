import { CadWriterConfiguration } from '../CadWriterConfiguration.js';
import { LineWeightType } from '../../Types/LineWeightType.js';
import { LineWeightTypeExtensions } from '../../Extensions/LineWeightTypeExtensions.js';
import { UnitsType } from '../../Types/Units/UnitsType.js';

export class SvgConfiguration extends CadWriterConfiguration {
  LineWeightRatio: number = 100;

  DefaultLineWeight: number = 0.01;

  PointRadius: number = 0.1;

  ArcPoints: number = 256;

  GetLineWeightValue(lineWeight: LineWeightType, units: UnitsType): number {
    const value = Math.abs(lineWeight as number);

    if (units === UnitsType.Unitless) {
      return value / this.LineWeightRatio;
    }

    switch (lineWeight) {
      case LineWeightType.Default:
        return this.DefaultLineWeight;
      case LineWeightType.W0:
        return 0.001;
    }

    return LineWeightTypeExtensions.getLineWeightValue(lineWeight);
  }
}
