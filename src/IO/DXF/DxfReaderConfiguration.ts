import { CadReaderConfiguration } from '../CadReaderConfiguration.js';

export class DxfReaderConfiguration extends CadReaderConfiguration {
  public clearCache: boolean = true;

  public createDefaults: boolean = false;
}
