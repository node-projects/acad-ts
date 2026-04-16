import { CadWipeoutBase } from './CadWipeoutBase.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { ImageDisplayFlags } from './ImageDisplayFlags.js';

export class Wipeout extends CadWipeoutBase {
	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	override get objectName(): string {
		return DxfFileToken.entityWipeout;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.wipeout;
	}

	constructor() {
		super();
		this.flags = ImageDisplayFlags.ShowImage | ImageDisplayFlags.ShowNotAlignedImage | ImageDisplayFlags.UseClippingBoundary;
	}
}
