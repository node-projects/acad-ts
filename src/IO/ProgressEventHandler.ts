import type { CadObject } from '../CadObject.js';

export enum ReadStage {
	Read,
	Build,
}

export class CadObjectData {
	readonly handle: number;
	readonly type: string;

	constructor(cadObject: CadObject) {
		this.handle = cadObject.handle;
		this.type = cadObject.objectName;
	}
}

export class ProgressEventArgs {
	readonly stage: ReadStage;
	readonly current: CadObjectData;

	constructor(stage: ReadStage, current: CadObjectData) {
		this.stage = stage;
		this.current = current;
	}
}

export type ProgressEventHandler = (sender: object, e: ProgressEventArgs) => void;
