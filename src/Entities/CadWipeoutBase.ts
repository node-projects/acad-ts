import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { CadDocument } from '../CadDocument.js';
import { ClipMode } from './ClipMode.js';
import { ClipType } from './ClipType.js';
import { ImageDisplayFlags } from './ImageDisplayFlags.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
import type { ImageDefinition } from '../Objects/ImageDefinition.js';
import type { ImageDefinitionReactor } from '../Objects/ImageDefinitionReactor.js';

export abstract class CadWipeoutBase extends Entity {
	get brightness(): number {
		return this._brightness;
	}
	set brightness(value: number) {
		if (value < 0 || value > 100) {
			throw new Error(`Invalid Brightness value: ${value}, must be in range 0-100`);
		}
		this._brightness = value;
	}

	classVersion: number = 0;

	clipBoundaryVertices: XY[] = [];

	clipMode: ClipMode = ClipMode.Outside;

	clippingState: boolean = false;

	clipType: ClipType = ClipType.Rectangular;

	get contrast(): number {
		return this._contrast;
	}
	set contrast(value: number) {
		if (value < 0 || value > 100) {
			throw new Error(`Invalid Contrast value: ${value}, must be in range 0-100`);
		}
		this._contrast = value;
	}

	get definition(): ImageDefinition | null {
		return this._definition;
	}
	set definition(value: ImageDefinition | null) {
		if (this.document != null) {
			this._definition = CadObject.updateCollection(value, this.document.imageDefinitions);
		} else {
			this._definition = value;
		}
	}

	get fade(): number {
		return this._fade;
	}
	set fade(value: number) {
		if (value < 0 || value > 100) {
			throw new Error(`Invalid Fade value: ${value}, must be in range 0-100`);
		}
		this._fade = value;
	}

	get flags(): ImageDisplayFlags {
		return this._flags;
	}
	set flags(value: ImageDisplayFlags) {
		this._flags = value;
	}

	insertPoint: XYZ = new XYZ(0, 0, 0);

	get showImage(): boolean {
		return (this._flags & ImageDisplayFlags.ShowImage) !== 0;
	}
	set showImage(value: boolean) {
		if (value) {
			this._flags = this._flags | ImageDisplayFlags.ShowImage;
		} else {
			this._flags = this._flags & ~ImageDisplayFlags.ShowImage;
		}
	}

	size: XY = new XY(0, 0);

	uVector: XYZ = new XYZ(1, 0, 0);

	vVector: XYZ = new XYZ(0, 1, 0);

	/** @internal */
	definitionReactor: ImageDefinitionReactor | null = null;

	private _brightness: number = 50;
	private _contrast: number = 50;
	private _definition: ImageDefinition | null = null;
	private _fade: number = 0;
	private _flags: ImageDisplayFlags = ImageDisplayFlags.None;

	override applyTransform(transform: unknown): void {
		this.insertPoint = this.applyTransformToPoint(transform, this.insertPoint);
		this.uVector = this.applyTransformToVector(transform, this.uVector);
		this.vVector = this.applyTransformToVector(transform, this.vVector);
	}

	override clone(): CadObject {
		const clone = super.clone() as CadWipeoutBase;
		clone._definition = this._definition?.clone() as ImageDefinition | null ?? null;
		return clone;
	}

	override getBoundingBox(): BoundingBox | null {
		if (this.clipBoundaryVertices.length === 0) {
			return null;
		}

		const points = this.clipBoundaryVertices.map((vertex) => new XYZ(
			this.insertPoint.x + this.uVector.x * vertex.x + this.vVector.x * vertex.y,
			this.insertPoint.y + this.uVector.y * vertex.x + this.vVector.y * vertex.y,
			this.insertPoint.z + this.uVector.z * vertex.x + this.vVector.z * vertex.y,
		));

		return BoundingBox.fromPoints(points);
	}

	/** @internal */
	assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
		this._definition = CadObject.updateCollection(this._definition, doc.imageDefinitions);
	}

	/** @internal */
	unassignDocument(): void {
		super.unassignDocument();
		this._definition = this._definition?.clone() as ImageDefinition | null ?? null;
	}

	private _imageDefinitionsOnRemove(sender: unknown, e: CollectionChangedEventArgs): void {
		if (e.item === this._definition) {
			this._definition = null;
		}
	}
}

export { ImageDisplayFlags } from './ImageDisplayFlags.js';

export { ClipMode } from './ClipMode.js';

export { ClipType } from './ClipType.js';

export type CadImage = CadWipeoutBase;
