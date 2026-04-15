import { MLine , MLineVertex, MLineSegment} from '../../Entities/MLine.js';
import { MLineStyle } from '../../Objects/MLineStyle.js';
import { XYZ } from '../../Math/XYZ.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';

export class CadMLineTemplate extends CadEntityTemplateT<MLine> {
	MLineStyleHandle: number | null = null;

	MLineStyleName: string | null = null;

	NVertex: number | null = null;

	NElements: number | null = null;

	private _currVertex: MLineVertex | null = null;

	private _currSegmentElement: MLineSegment | null = null;

	constructor(mline?: MLine) {
		super(mline ?? new MLine());
	}

	TryReadVertex(dxfcode: number, value: unknown): boolean {
		const mline = this.CadObject as MLine;

		switch (dxfcode) {
			case 11:
				this._currVertex = new MLineVertex();
				mline.vertices.push(this._currVertex);
				this._currVertex.position = new XYZ(
					value as number,
					this._currVertex.position.Y,
					this._currVertex.position.Z
				);
				return true;
			case 21:
				if (this._currVertex) {
					this._currVertex.position = new XYZ(
						this._currVertex.position.X,
						value as number,
						this._currVertex.position.Z
					);
				}
				return true;
			case 31:
				if (this._currVertex) {
					this._currVertex.position = new XYZ(
						this._currVertex.position.X,
						this._currVertex.position.Y,
						value as number
					);
				}
				return true;
			case 12:
				if (this._currVertex) {
					this._currVertex.direction = new XYZ(
						value as number,
						this._currVertex.direction.Y,
						this._currVertex.direction.Z
					);
				}
				return true;
			case 22:
				if (this._currVertex) {
					this._currVertex.direction = new XYZ(
						this._currVertex.direction.X,
						value as number,
						this._currVertex.direction.Z
					);
				}
				return true;
			case 32:
				if (this._currVertex) {
					this._currVertex.direction = new XYZ(
						this._currVertex.direction.X,
						this._currVertex.direction.Y,
						value as number
					);
				}
				return true;
			case 13:
				if (this._currVertex) {
					this._currVertex.miter = new XYZ(
						value as number,
						this._currVertex.miter.Y,
						this._currVertex.miter.Z
					);
				}
				return true;
			case 23:
				if (this._currVertex) {
					this._currVertex.miter = new XYZ(
						this._currVertex.miter.X,
						value as number,
						this._currVertex.miter.Z
					);
				}
				return true;
			case 33:
				if (this._currVertex) {
					this._currVertex.miter = new XYZ(
						this._currVertex.miter.X,
						this._currVertex.miter.Y,
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

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const mLine = this.CadObject as MLine;

		const style = builder.TryGetCadObject<MLineStyle>(this.MLineStyleHandle);
		if (style) {
			mLine.style = style;
		}
	}
}
