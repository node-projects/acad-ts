export class StretchNode {
	readonly nodeId: number;
	readonly pointIndexes: number[];

	constructor(nodeId: number = 0, pointIndexes: number[] = []) {
		this.nodeId = nodeId;
		this.pointIndexes = pointIndexes;
	}
}
