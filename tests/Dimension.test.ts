import { describe, expect, it } from 'vitest';
import { DxfFileToken } from '../src/DxfFileToken.js';
import { Dimension } from '../src/Entities/Dimension.js';
import { AttachmentPointType } from '../src/Entities/AttachmentPointType.js';
import { DimensionType } from '../src/Entities/DimensionType.js';
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
		return DxfFileToken.EntityDimension;
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
		expect(point.layer.name.toLowerCase()).toBe(Layer.DefpointsName);
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
});