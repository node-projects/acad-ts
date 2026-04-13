import { CadReaderConfiguration } from '../CadReaderConfiguration.js';

export class DxfReaderConfiguration extends CadReaderConfiguration {
  public ClearCache: boolean = true;

  public CreateDefaults: boolean = false;
}
