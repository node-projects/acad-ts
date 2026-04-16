import { describe, expect, it } from 'vitest';
import { DxfFileToken } from '../src/DxfFileToken.js';
import { Dimension } from '../src/Entities/Dimension.js';
import { DimensionAligned } from '../src/Entities/DimensionAligned.js';
import { DimensionDiameter } from '../src/Entities/DimensionDiameter.js';
import { DimensionLinear } from '../src/Entities/DimensionLinear.js';
import { DimensionOrdinate } from '../src/Entities/DimensionOrdinate.js';
import { DimensionRadius } from '../src/Entities/DimensionRadius.js';
import { AttachmentPointType } from '../src/Entities/AttachmentPointType.js';
import { DimensionType } from '../src/Entities/DimensionType.js';
import { Line } from '../src/Entities/Line.js';
import { MText } from '../src/Entities/MText.js';
import { Point } from '../src/Entities/Point.js';
import { Layer } from '../src/Tables/Layer.js';
import { DimensionStyle } from '../src/Tables/DimensionStyle.js';
import { TextStyle } from '../src/Tables/TextStyle.js';
import { XYZ } from '../src/Math/XYZ.js';
import { ObjectType } from '../src/Types/ObjectType.js';

class TestDimension extends Dimension {
	override get measurement(): number {
		return 12.3456;
	}

	override get objectName(): string {
		return DxfFileToken.entityDimension;
	}

	override get objectType(): ObjectType {
		return ObjectType.DIMENSION_LINEAR;
	}

	override getBoundingBox(): null {
		return null;
	}

	constructor() {
		super(DimensionType.Linear);
	}

	createDefinitionPointForTest(location: XYZ) {
		return this.createDefinitionPoint(location);
	}

	createTextEntityForTest(insertPoint: XYZ, text: string) {
		return this.createTextEntity(insertPoint, text);
	}
}

describe('DimensionTests', () => {
	it('FormatsMeasurementTextUsingStyleRoundingAndOverrides', () => {
		const dimension = new TestDimension();
		const style = new DimensionStyle();
		style.decimalPlaces = 2;
		style.rounding = 0.25;
		style.postFix = '<> mm';

		dimension.style = style;

		expect(dimension.getMeasurementText()).toBe('12.25 mm');

		dimension.text = 'R <>';

		expect(dimension.getMeasurementText()).toBe('R 12.25');
	});

	it('CreatesDefinitionPointsOnTheDefpointsLayer', () => {
		const dimension = new TestDimension();
		const point = dimension.createDefinitionPointForTest(new XYZ(1, 2, 3));

		expect(point.location).toEqual(new XYZ(1, 2, 3));
		expect(point.layer.name.toLowerCase()).toBe(Layer.defpointsName);
	});

	it('CreatesTextEntitiesUsingTheActiveDimensionStyle', () => {
		const dimension = new TestDimension();
		const style = new DimensionStyle();
		style.textHeight = 2.5;
		style.style = new TextStyle('DimText');

		dimension.style = style;
		dimension.layer = new Layer('Dims');
		dimension.lineSpacingFactor = 1.25;
		dimension.textRotation = Math.PI / 2;
		dimension.attachmentPoint = AttachmentPointType.MiddleCenter;

		const text = dimension.createTextEntityForTest(new XYZ(4, 5, 0), 'DIM');

		expect(text.value).toBe('DIM');
		expect(text.insertPoint).toEqual(new XYZ(4, 5, 0));
		expect(text.height).toBe(2.5);
		expect(text.layer.name).toBe('Dims');
		expect(text.lineSpacing).toBe(1.25);
		expect(text.attachmentPoint).toBe(AttachmentPointType.MiddleCenter);
		expect(text.style.name).toBe('DimText');
	});

	it('AppliesStyleOverrideMapsToTheActiveDimensionStyle', () => {
		const dimension = new TestDimension();
		const style = new DimensionStyle();
		style.textHeight = 2;
		style.decimalPlaces = 2;
		dimension.style = style;

		const override = style.clone() as DimensionStyle;
		override.textHeight = 3.5;
		override.decimalPlaces = 4;

		dimension.setDimensionOverride(override);

		const map = dimension.getStyleOverrideMap();
		const active = dimension.getActiveDimensionStyle();

		expect(dimension.hasStyleOverride).toBe(true);
		expect(map).not.toBeNull();
		expect(active.textHeight).toBe(3.5);
		expect(active.decimalPlaces).toBe(4);

		dimension.setStyleOverrideMap(new Map());

		expect(dimension.hasStyleOverride).toBe(false);
	});

	it('UpdatesAlignedOffsetBoundsAndTransforms', () => {
		const dimension = new DimensionAligned(new XYZ(0, 0, 0), new XYZ(10, 0, 0));
		dimension.normal = XYZ.axisZ;

		dimension.offset = 3;

		expect(dimension.definitionPoint.x).toBeCloseTo(10);
		expect(dimension.definitionPoint.y).toBeCloseTo(3);
		expect(dimension.offset).toBeCloseTo(3);

		dimension.applyTranslation(new XYZ(1, 2, 0));
		const bounds = dimension.getBoundingBox();

		expect(dimension.firstPoint).toEqual(new XYZ(1, 2, 0));
		expect(dimension.secondPoint).toEqual(new XYZ(11, 2, 0));
		expect(dimension.definitionPoint).toEqual(new XYZ(11, 5, 0));
		expect(bounds.min.x).toBe(1);
		expect(bounds.min.y).toBe(2);
		expect(bounds.max.x).toBe(11);
		expect(bounds.max.y).toBe(5);
	});

	it('GeneratesMinimalAnonymousBlocksForConcreteDimensionSubtypes', () => {
		const aligned = new DimensionAligned(new XYZ(0, 0, 0), new XYZ(10, 0, 0));
		aligned.definitionPoint = new XYZ(10, 3, 0);
		aligned.textMiddlePoint = new XYZ(5, 3, 0);

		const linear = new DimensionLinear();
		linear.firstPoint = new XYZ(0, 0, 0);
		linear.secondPoint = new XYZ(8, 4, 0);
		linear.definitionPoint = new XYZ(8, 6, 0);
		linear.textMiddlePoint = new XYZ(4, 6, 0);
		linear.rotation = Math.PI / 4;

		const diameter = new DimensionDiameter();
		diameter.angleVertex = new XYZ(-4, 0, 0);
		diameter.definitionPoint = new XYZ(4, 0, 0);
		diameter.textMiddlePoint = new XYZ(0, 2, 0);

		const ordinate = new DimensionOrdinate();
		ordinate.featureLocation = new XYZ(1, 1, 0);
		ordinate.definitionPoint = new XYZ(4, 1, 0);
		ordinate.leaderEndpoint = new XYZ(4, 5, 0);
		ordinate.textMiddlePoint = new XYZ(4, 3, 0);

		const radius = new DimensionRadius();
		radius.angleVertex = new XYZ(0, 0, 0);
		radius.definitionPoint = new XYZ(3, 4, 0);
		radius.textMiddlePoint = new XYZ(1.5, 2, 0);

		const dimensions = [aligned, linear, diameter, ordinate, radius];
		for (const dimension of dimensions) {
			dimension.updateBlock();
			const entities = Array.from(dimension.block?.entities ?? []);

			expect(dimension.block?.isAnonymous).toBe(true);
			expect(entities.some((entity) => entity instanceof Line)).toBe(true);
			expect(entities.some((entity) => entity instanceof MText)).toBe(true);
			expect(entities.some((entity) => entity instanceof Point)).toBe(true);
		}
	});
});