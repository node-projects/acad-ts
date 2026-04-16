import { Block1PtParameter } from './Block1PtParameter.js';
import { CadObject } from '../../CadObject.js';
import { Entity } from '../../Entities/Entity.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { EvaluationExpression } from './EvaluationExpression.js';

export class BlockVisibilityState {
	name: string = '';
	entities: Entity[] = [];
	expressions: EvaluationExpression[] = [];

	clone(): BlockVisibilityState {
		const clone = new BlockVisibilityState();
		clone.name = this.name;
		clone.entities = this.entities.map(e => e.clone() as Entity);
		clone.expressions = this.expressions.map(e => e.clone() as EvaluationExpression);
		return clone;
	}
}

export class BlockVisibilityParameter extends Block1PtParameter {
	description: string = '';
	entities: Entity[] = [];
	name: string = '';

	override get objectName(): string { return DxfFileToken.objectBlockVisibilityParameter; }

	private _states: Map<string, BlockVisibilityState> = new Map();

	get states(): ReadonlyMap<string, BlockVisibilityState> {
		return this._states;
	}

	override get subclassMarker(): string { return DxfSubclassMarker.blockVisibilityParameter; }

	value91: boolean = false;

	addState(state: BlockVisibilityState): void {
		this._states.set(state.name, state);
	}

	override clone(): CadObject {
		const clone = super.clone() as BlockVisibilityParameter;
		clone.entities = this.entities.map(e => e.clone() as Entity);
		clone._states = new Map();
		for (const [key, state] of this._states) {
			const clonedState = state.clone();
			clone._states.set(clonedState.name, clonedState);
		}
		return clone;
	}
}
