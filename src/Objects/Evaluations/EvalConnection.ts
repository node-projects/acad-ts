export class EvalConnection {
	static readonly displacementX = 'DisplacementX';
	static readonly displacementY = 'DisplacementY';
	static readonly scale = 'Scale';
	static readonly xScale = 'XScale';
	static readonly yScale = 'YScale';

	id: number = 0;
	name: string = '';

	constructor(id: number = 0, name: string = '') {
		this.id = id;
		this.name = name;
	}

	toString(): string { return `${this.id}:${this.name}`; }
}
