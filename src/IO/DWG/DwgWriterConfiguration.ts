import { CadWriterConfiguration } from '../CadWriterConfiguration.js';

export class DwgWriterConfiguration extends CadWriterConfiguration {
	/** Preserve original ASM bytes inline in DWG 2004–2010 without kernel conversion. */
	writeLegacyAsmData: boolean = false;
}
