import { AnnotScaleObjectContextData } from './AnnotScaleObjectContextData.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { AttachmentPointType } from '../Entities/AttachmentPointType.js';
import { XYZ } from '../Math/XYZ.js';

export class MTextAttributeObjectContextData extends AnnotScaleObjectContextData {
	alignmentPoint: XYZ = new XYZ(1, 0, 0);
	attachmentPoint: AttachmentPointType = AttachmentPointType.TopLeft;
	insertPoint: XYZ = new XYZ(0, 0, 0);

	override get objectName(): string {
		return DxfFileToken.mTextAttributeObjectContextData;
	}

	rotation: number = 0;
	value290: boolean = false;
}
