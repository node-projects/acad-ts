import { NonGraphicalObject } from '../NonGraphicalObject.js';
import { CadObject } from '../../CadObject.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { ObjectType } from '../../Types/ObjectType.js';
import { EvaluationExpression } from './EvaluationExpression.js';

export class EvaluationGraphEdge {
	index: number = 0;
	flags: number = 0;
	trackedCount: number = 0;
	fromNodeIndex: number = 0;
	toNodeIndex: number = 0;
	data1: number = 0;
	data2: number = 0;
	data3: number = 0;
	data4: number = 0;
	data5: number = 0;

	clone(): EvaluationGraphEdge {
		return Object.assign(new EvaluationGraphEdge(), this);
	}
}

export class EvaluationGraphNode {
	index: number = 0;
	nextNodeIndex: number = 0;
	next: EvaluationGraphNode | null = null;
	flags: number = 0;
	data1: number = 0;
	data2: number = 0;
	data3: number = 0;
	data4: number = 0;
	expression: EvaluationExpression | null = null;

	clone(): EvaluationGraphNode {
		const clone = new EvaluationGraphNode();
		clone.index = this.index;
		clone.nextNodeIndex = this.nextNodeIndex;
		clone.flags = this.flags;
		clone.data1 = this.data1;
		clone.data2 = this.data2;
		clone.data3 = this.data3;
		clone.data4 = this.data4;
		clone.next = this.next?.clone() ?? null;
		clone.expression = this.expression?.clone() as EvaluationExpression ?? null;
		return clone;
	}
}

export class EvaluationGraph extends NonGraphicalObject {
	edges: EvaluationGraphEdge[] = [];
	nodes: EvaluationGraphNode[] = [];

	override get objectName(): string { return DxfFileToken.objectEvalGraph; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get subclassMarker(): string { return DxfSubclassMarker.evalGraph; }

	value96: number = 0;
	value97: number = 0;

	static readonly dictionaryEntryName = 'ACAD_ENHANCEDBLOCK';

	override clone(): CadObject {
		const clone = super.clone() as EvaluationGraph;
		clone.nodes = this.nodes.map(n => n.clone());
		clone.edges = this.edges.map(e => e.clone());
		return clone;
	}
}
