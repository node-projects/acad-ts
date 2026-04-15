import { describe, expect, it } from 'vitest';
import { Viewport } from '../src/Entities/Viewport.js';
import { Layout } from '../src/Objects/Layout.js';
import { BlockRecord } from '../src/Tables/BlockRecord.js';

describe('LayoutTests', () => {
	it('AddsViewportsThroughTheOwnedCollection', () => {
		const record = BlockRecord.PaperSpace;
		const layout = record.layout!;
		const viewport = new Viewport();

		layout.addViewport(viewport);

		expect(record.viewports).toContain(viewport);
		expect(viewport.owner).toBe(record);
	});

	it('CreatesAndReusesThePaperViewport', () => {
		const record = new BlockRecord(BlockRecord.PaperSpaceName);
		const layout = new Layout(Layout.PaperLayoutName);
		layout.associatedBlock = record;

		layout.updatePaperViewport();

		expect(record.viewports).toHaveLength(1);
		expect(record.viewports[0].id).toBe(Viewport.PaperViewId);
		expect(layout.lastActiveViewport).toBe(record.viewports[0]);

		layout.updatePaperViewport();

		expect(record.viewports).toHaveLength(1);
		expect(layout.lastActiveViewport).toBe(record.viewports[0]);
	});
});