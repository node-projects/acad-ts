import { BlockAction } from './BlockAction.js';
import { StretchEntityBind } from './StretchEntityBind.js';
import { StretchNode } from './StretchNode.js';
import { XY } from '../../Math/XY.js';

export abstract class StretchActionBase extends BlockAction {
	angleOffset: number = 0;
	boundary: XY[] = [];
	distanceMultiplier: number = 0;
	stretchBindings: StretchEntityBind[] = [];
	stretchNodes: StretchNode[] = [];
}
