import { CadReaderConfiguration } from '../CadReaderConfiguration.js';

export class DwgReaderConfiguration extends CadReaderConfiguration {
	CrcCheck: boolean = false;
	ReadSummaryInfo: boolean = true;
}
