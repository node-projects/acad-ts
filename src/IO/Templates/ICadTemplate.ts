import { CadDocumentBuilder } from '../CadDocumentBuilder.js';

export interface ICadTemplate {
	Build(builder: CadDocumentBuilder): void;
}
