import { DimensionAligned } from './DimensionAligned.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DimensionType } from './DimensionType.js';
import { XYZ } from '../Math/XYZ.js';

export class DimensionLinear extends DimensionAligned {
	override get measurement(): number {
		const angle = new XYZ(Math.cos(this.rotation), Math.sin(this.rotation), 0);
		const diff = new XYZ(this.secondPoint.x - this.firstPoint.x, this.secondPoint.y - this.firstPoint.y, this.secondPoint.z - this.firstPoint.z,);
		const len = Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z);
		if (len === 0) return 0;
		const norm = new XYZ(diff.x / len, diff.y / len, diff.z / len);
		const dot = Math.abs(angle.x * norm.x + angle.y * norm.y + angle.z * norm.z);
		return super.measurement * dot;
	}

	override get objectName(): string {
		return DxfFileToken.entityDimension;
	}

	override get objectType(): ObjectType {
		return ObjectType.DIMENSION_LINEAR;
	}

	override get offset(): number {
		return super.offset;
	}
	override set offset(value: number) {
		const direction = new XYZ(Math.cos(this.rotation), Math.sin(this.rotation), 0);
		const perpendicular = this.normal.cross(direction).normalize();
		this.definitionPoint = new XYZ(
			this.secondPoint.x + perpendicular.x * value,
			this.secondPoint.y + perpendicular.y * value,
			this.secondPoint.z + perpendicular.z * value,
		);
	}

	rotation: number = 0;

	override get subclassMarker(): string {
		return DxfSubclassMarker.linearDimension;
	}

	constructor() {
		super();
		this._flags = DimensionType.Linear | DimensionType.BlockReference;
	}

	override updateBlock(): void {
		const direction = new XYZ(Math.cos(this.rotation), Math.sin(this.rotation), 0);
		const end = new XYZ(
			this.firstPoint.x + direction.x * this.measurement,
			this.firstPoint.y + direction.y * this.measurement,
			this.firstPoint.z + direction.z * this.measurement,
		);

		this.populateBlock(
			[[this.firstPoint, end]],
			[this.firstPoint, this.secondPoint, this.definitionPoint],
		);
	}
}
