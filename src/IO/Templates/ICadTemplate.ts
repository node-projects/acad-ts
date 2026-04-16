import { CadDocumentBuilder } from '../CadDocumentBuilder.js';

export interface ICadTemplate {
	build(builder: CadDocumentBuilder): void;
}
