import { MLine , MLineVertex, MLineSegment} from '../../Entities/MLine.js';
import { MLineStyle } from '../../Objects/MLineStyle.js';
import { XYZ } from '../../Math/XYZ.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';

export class CadMLineTemplate extends CadEntityTemplateT<MLine> {
	mLineStyleHandle: number | null = null;

	mLineStyleName: string | null = null;

	nVertex: number | null = null;

	nElements: number | null = null;

	private _currVertex: MLineVertex | null = null;

	private _currSegmentElement: MLineSegment | null = null;

	constructor(mline?: MLine) {
		super(mline ?? new MLine());
	}

	tryReadVertex(dxfcode: number, value: unknown): boolean {
		const mline = this.cadObject as MLine;

		switch (dxfcode) {
			case 11:
				this._currVertex = new MLineVertex();
				mline.vertices.push(this._currVertex);
				this._currVertex.position = new XYZ(
					value as number,
					this._currVertex.position.y,
					this._currVertex.position.z
				);
				return true;
			case 21:
				if (this._currVertex) {
					this._currVertex.position = new XYZ(
						this._currVertex.position.x,
						value as number,
						this._currVertex.position.z
					);
				}
				return true;
			case 31:
				if (this._currVertex) {
					this._currVertex.position = new XYZ(
						this._currVertex.position.x,
						this._currVertex.position.y,
						value as number
					);
				}
				return true;
			case 12:
				if (this._currVertex) {
					this._currVertex.direction = new XYZ(
						value as number,
						this._currVertex.direction.y,
						this._currVertex.direction.z
					);
				}
				return true;
			case 22:
				if (this._currVertex) {
					this._currVertex.direction = new XYZ(
						this._currVertex.direction.x,
						value as number,
						this._currVertex.direction.z
					);
				}
				return true;
			case 32:
				if (this._currVertex) {
					this._currVertex.direction = new XYZ(
						this._currVertex.direction.x,
						this._currVertex.direction.y,
						value as number
					);
				}
				return true;
			case 13:
				if (this._currVertex) {
					this._currVertex.miter = new XYZ(
						value as number,
						this._currVertex.miter.y,
						this._currVertex.miter.z
					);
				}
				return true;
			case 23:
				if (this._currVertex) {
					this._currVertex.miter = new XYZ(
						this._currVertex.miter.x,
						value as number,
						this._currVertex.miter.z
					);
				}
				return true;
			case 33:
				if (this._currVertex) {
					this._currVertex.miter = new XYZ(
						this._currVertex.miter.x,
						this._currVertex.miter.y,
						value as number
					);
				}
				return true;
			case 74:
				this._currSegmentElement = new MLineSegment();
				if (this._currVertex) {
					this._currVertex.segments.push(this._currSegmentElement);
				}
				return true;
			case 41:
				this._currSegmentElement?.parameters.push(value as number);
				return true;
			case 42:
				this._currSegmentElement?.areaFillParameters.push(value as number);
				return true;
			case 75:
				return true;
			default:
				return false;
		}
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const mLine = this.cadObject as MLine;

		const style = builder.tryGetCadObject<MLineStyle>(this.mLineStyleHandle);
		if (style) {
			mLine.style = style;
		}
	}
}
