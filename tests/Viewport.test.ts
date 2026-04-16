import { describe, expect, it } from 'vitest';
import { ACadVersion } from '../src/ACadVersion.js';
import { CadDocument } from '../src/CadDocument.js';
import { Viewport } from '../src/Entities/Viewport.js';
import { CadDocumentBuilder } from '../src/IO/CadDocumentBuilder.js';
import { CadViewportTemplate } from '../src/IO/Templates/CadViewportTemplate.js';
import { BlockRecord } from '../src/Tables/BlockRecord.js';

class TestCadDocumentBuilder extends CadDocumentBuilder {
	override get keepUnknownEntities(): boolean {
		return true;
	}

	override get keepUnknownNonGraphicalObjects(): boolean {
		return true;
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
});