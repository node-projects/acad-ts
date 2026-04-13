export class DxfException extends Error {
	public constructor(codeOrMessage: number | string, line?: number) {
		if (typeof codeOrMessage === 'number' && line !== undefined) {
			super(`Invalid dxf code with value ${codeOrMessage}, at line ${line}.`);
		} else if (typeof codeOrMessage === 'string' && line !== undefined) {
			super(`${codeOrMessage}, at line ${line}.`);
		} else {
			super(codeOrMessage as string);
		}
		this.name = 'DxfException';
	}
}
