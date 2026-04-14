import { describe, expect, it } from 'vitest';
import { CadHeader } from '../src/Header/CadHeader.js';
import { CadUtils } from '../src/CadUtils.js';
import { DxfMap } from '../src/DxfMap.js';
import { DxfClassMap } from '../src/DxfClassMap.js';
import { DxfProperty } from '../src/DxfProperty.js';
import { CadSystemVariable } from '../src/CadSystemVariable.js';
import { DxfReferenceType } from '../src/Types/DxfReferenceType.js';
import { getClassPropertyMetadata } from '../src/Metadata/MetadataStore.js';
import { Circle } from '../src/Entities/Circle.js';
import { DictionaryVariable } from '../src/Objects/DictionaryVariable.js';

describe('MetadataMappingTests', () => {
	it('BuildsHeaderSystemVariableMap', () => {
		const headerMap = CadHeader.GetHeaderMap();

		expect(headerMap.has('$CLAYER')).toBe(true);
		expect(headerMap.get('$CLAYER')?.DxfCodes).toEqual([8]);
		expect(headerMap.get('$EXTMAX')?.DxfCodes).toEqual([10, 20, 30]);
		expect(headerMap.get('$TDCREATE')?.DxfCodes).toEqual([40]);
	});

	it('AppliesHeaderSystemVariableValues', () => {
		const header = new CadHeader();

		header.SetValue('$CLAYER', ['Layer-A']);
		expect(header.currentLayerName).toBe('Layer-A');

		header.SetValue('$CLAYER', ['']);
		expect(header.currentLayerName).toBe('Layer-A');

		header.SetValue('$EXTMAX', [1.25, 2.5, 3.75]);
		expect(header.modelSpaceExtMax.x).toBe(1.25);
		expect(header.modelSpaceExtMax.y).toBe(2.5);
		expect(header.modelSpaceExtMax.z).toBe(3.75);

		const julianDate = CadUtils.toJulianCalendar(new Date(2024, 0, 2, 3, 4, 5, 0));
		header.SetValue('$TDCREATE', [julianDate]);
		expect(CadUtils.toJulianCalendar(header.createDateTime)).toBeCloseTo(julianDate, 5);

		header.SetValue('$TDINDWG', [2.5]);
		expect(header.totalEditingTime).toBe(2.5 * 86400000);

		expect(Array.from(header.GetValues('$EXTMAX').entries())).toEqual([
			[10, 1.25],
			[20, 2.5],
			[30, 3.75],
		]);
	});

	it('BuildsMetadataBackedEntityAndClassMaps', () => {
		const circleMap = DxfMap.create(Circle);
		expect(circleMap.name).toBe('CIRCLE');
		expect(circleMap.subClasses.has('AcDbEntity')).toBe(true);
		expect(circleMap.subClasses.has('AcDbCircle')).toBe(true);

		const circle = new Circle();
		circleMap.subClasses.get('AcDbCircle')?.dxfProperties.get(40)?.setValue(40, circle, 12.5);
		circleMap.subClasses.get('AcDbCircle')?.dxfProperties.get(10)?.setValue(10, circle, 7);

		expect(circle.radius).toBe(12.5);
		expect(circle.center.x).toBe(7);

		const classMap = DxfClassMap.Create(DictionaryVariable);
		expect(classMap.name).toBe('DictionaryVariables');

		const variable = new DictionaryVariable('TEST');
		classMap.dxfProperties.get(1)?.setValue(1, variable, 'VALUE');
		expect(variable.value).toBe('VALUE');
	});

	it('ReturnsClonedMapsFromCache', () => {
		const first = DxfMap.create(Circle);
		first.subClasses.set('Temp', new DxfClassMap('Temp'));

		const second = DxfMap.create(Circle);
		expect(second.subClasses.has('Temp')).toBe(false);
	});

	it('ExposesLookupTableCollectionCodesAndReferenceTypes', () => {
		const clipVertices = getClassPropertyMetadata('CadWipeoutBase').find(m => m.propertyName === 'clipBoundaryVertices');
		expect(clipVertices?.collectionCodes).toEqual([14, 24]);
		expect(new DxfProperty(clipVertices!).getCollectionCodes()).toEqual([14, 24]);

		const defaultEntry = getClassPropertyMetadata('CadDictionaryWithDefault').find(m => m.propertyName === 'defaultEntry');
		expect(defaultEntry?.referenceType).toBe(DxfReferenceType.Handle);

		const blockActionEntities = getClassPropertyMetadata('BlockAction').find(m => m.propertyName === 'entities');
		expect(blockActionEntities?.referenceType).toBe(DxfReferenceType.Count);
		expect(blockActionEntities?.collectionCodes).toEqual([330]);
	});

	it('AppliesSystemVariableReferenceSemantics', () => {
		const handled = new CadSystemVariable({
			name: '$HANDLETEST',
			isName: false,
			propertyName: 'target',
			valueCodes: [5],
			referenceType: DxfReferenceType.Handle,
		});
		const named = new CadSystemVariable({
			name: '$NAMETEST',
			isName: false,
			propertyName: 'target',
			valueCodes: [2],
			referenceType: DxfReferenceType.Name,
		});
		const counted = new CadSystemVariable({
			name: '$COUNTTEST',
			isName: false,
			propertyName: 'items',
			valueCodes: [70],
			referenceType: DxfReferenceType.Count,
		});
		const unprocessed = new CadSystemVariable({
			name: '$RAWTEST',
			isName: false,
			propertyName: 'raw',
			valueCodes: [40],
			referenceType: DxfReferenceType.Unprocess,
		});

		const headerLike = {
			target: { handle: 42, name: 'Layer-A' },
			items: [1, 2, 3],
			raw: 12.5,
		};

		expect(handled.getSystemValue(5, headerLike)).toBe(42);
		expect(named.getSystemValue(2, headerLike)).toBe('Layer-A');
		expect(counted.getSystemValue(70, headerLike)).toBe(3);
		expect(unprocessed.getSystemValue(40, headerLike)).toBe(12.5);
	});
});