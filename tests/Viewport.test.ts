import { describe, expect, it } from 'vitest';
import { ACadVersion } from '../src/ACadVersion.js';
import { CadDocument } from '../src/CadDocument.js';
import { Viewport } from '../src/Entities/Viewport.js';
import { CadDocumentBuilder } from '../src/IO/CadDocumentBuilder.js';
import { CadViewportTemplate } from '../src/IO/Templates/CadViewportTemplate.js';
import { BlockRecord } from '../src/Tables/BlockRecord.js';
import { CadObject } from '../src/CadObject.js';
import { UCS } from '../src/Tables/UCS.js';
import { VisualStyle } from '../src/Objects/VisualStyle.js';
import { XYZ } from '../src/Math/XYZ.js';

class TestCadDocumentBuilder extends CadDocumentBuilder {
	override get keepUnknownEntities(): boolean {
		return true;
	}

	override get keepUnknownNonGraphicalObjects(): boolean {
		return true;
	}

	registerObject(object: CadObject): void {
		this.cadObjects.set(object.handle, object);
	}
}

describe('ViewportTests', () => {
	it('CalculatesIdsFromOwnerOrder', () => {
		const record = new BlockRecord('Test');
		const first = new Viewport();
		const second = new Viewport();

		record.entities.add(first);
		record.entities.add(second);

		expect(first.id).toBe(1);
		expect(first.representsPaper).toBe(true);
		expect(second.id).toBe(2);
		expect(second.representsPaper).toBe(false);
	});

	it('AppliesViewportIdsFromTemplates', () => {
		const viewport = new Viewport();
		const template = new CadViewportTemplate(viewport);
		const builder = new TestCadDocumentBuilder(ACadVersion.AC1018, new CadDocument());

		template.viewportId = 7;
		template.build(builder);

		expect(viewport.id).toBe(7);
		expect(viewport.representsPaper).toBe(false);
	});

	it('ResolvesViewportUcsAndVisualStyleHandles', () => {
		const viewport = new Viewport();
		const template = new CadViewportTemplate(viewport);
		const builder = new TestCadDocumentBuilder(ACadVersion.AC1018, new CadDocument());
		const baseUcs = new UCS('Base');
		const namedUcs = new UCS('Named');
		const visualStyle = new VisualStyle();
		baseUcs.handle = 10;
		namedUcs.handle = 11;
		visualStyle.handle = 12;
		baseUcs.origin = new XYZ(1, 2, 3);
		namedUcs.origin = new XYZ(4, 5, 6);
		namedUcs.elevation = 2;
		namedUcs.xAxis = new XYZ(0, 1, 0);
		namedUcs.yAxis = new XYZ(-1, 0, 0);
		builder.registerObject(baseUcs);
		builder.registerObject(namedUcs);
		builder.registerObject(visualStyle);
		template.baseUcsHandle = baseUcs.handle;
		template.namedUcsHandle = namedUcs.handle;
		template.visualStyleHandle = visualStyle.handle;

		template.build(builder);

		expect(viewport.ucsPerViewport).toBe(true);
		expect(viewport.ucsOrigin).toEqual(new XYZ(4, 5, 6));
		expect(viewport.ucsXAxis).toEqual(new XYZ(0, 1, 0));
		expect(viewport.ucsYAxis).toEqual(new XYZ(-1, 0, 0));
		expect(viewport.elevation).toBe(2);
		expect(viewport.visualStyle).toBe(visualStyle);
	});
});
