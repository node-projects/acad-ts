import { describe, expect, it } from 'vitest';
import { Block } from '../src/Blocks/Block.js';
import { BlockEnd } from '../src/Blocks/BlockEnd.js';
import { BlockTypeFlags } from '../src/Blocks/BlockTypeFlags.js';
import { AttributeDefinition } from '../src/Entities/AttributeDefinition.js';
import { Line } from '../src/Entities/Line.js';
import { Viewport } from '../src/Entities/Viewport.js';
import { XYZ } from '../src/Math/XYZ.js';
import { CadDictionary } from '../src/Objects/CadDictionary.js';
import { EvaluationGraph } from '../src/Objects/Evaluations/EvaluationGraph.js';
import { Layout } from '../src/Objects/Layout.js';
import { BlockRecord } from '../src/Tables/BlockRecord.js';

describe('BlockRecordTests', () => {
	it('CreatesModelAndPaperSpaceLayouts', () => {
		const model = BlockRecord.modelSpace;
		const paper = BlockRecord.paperSpace;

		expect(model.layout).toBeInstanceOf(Layout);
		expect(model.layout?.name).toBe(Layout.modelLayoutName);
		expect(model.layout?.associatedBlock).toBe(model);

		expect(paper.layout).toBeInstanceOf(Layout);
		expect(paper.layout?.name).toBe(Layout.paperLayoutName);
		expect(paper.layout?.associatedBlock).toBe(paper);
	});

	it('ExposesTypedBlockHelpers', () => {
		const record = new BlockRecord('Test');
		const dictionary = new CadDictionary();
		const evaluationGraph = new EvaluationGraph();
		const attribute = new AttributeDefinition();
		const viewport = new Viewport();

		dictionary.addByKey(EvaluationGraph.dictionaryEntryName, evaluationGraph);
		record.xDictionary = dictionary;
		record.entities.add(attribute);
		record.entities.add(viewport);

		expect(record.evaluationGraph).toBe(evaluationGraph);
		expect(record.isDynamic).toBe(true);
		expect(record.attributeDefinitions).toEqual([attribute]);
		expect(record.viewports).toEqual([viewport]);
	});

	it('CreatesSortTablesAndPreservesOrderOnClone', () => {
		const record = new BlockRecord('Test');
		const first = new Line(new XYZ(0, 0, 0), new XYZ(1, 1, 0));
		const second = new Line(new XYZ(10, 10, 0), new XYZ(12, 14, 0));

		record.entities.add(first);
		record.entities.add(second);

		const sortTable = record.createSortEntitiesTable();
		sortTable.add(second, 1);
		sortTable.add(first, 2);

		expect(record.getSortedEntities()).toEqual([second, first]);

		const bounds = record.getBoundingBox();
		expect(bounds).not.toBeNull();
		expect(bounds?.min.x).toBe(0);
		expect(bounds?.min.y).toBe(0);
		expect(bounds?.max.x).toBe(12);
		expect(bounds?.max.y).toBe(14);

		const clone = record.clone() as BlockRecord;
		const clonedFirst = clone.entities.getAt(0);
		const clonedSecond = clone.entities.getAt(1);

		expect(clone.sortEntitiesTable).not.toBeNull();
		expect(clone.sortEntitiesTable?.blockOwner).toBe(clone);
		expect(clone.getSortedEntities()).toEqual([clonedSecond, clonedFirst]);
		expect(clone.blockEntity.owner).toBe(clone);
		expect(clone.blockEnd.owner).toBe(clone);
	});

	it('SupportsXrefConstructionAndStandaloneBlockMarkerClones', () => {
		const xref = new BlockRecord('xref-block', 'xref.dwg', true);
		const blockClone = new Block(xref).clone() as Block;
		const blockEndClone = new BlockEnd(xref).clone() as BlockEnd;

		expect(xref.blockEntity.xRefPath).toBe('xref.dwg');
		expect((xref.blockFlags & BlockTypeFlags.XRefOverlay) !== 0).toBe(true);
		expect(blockClone.blockOwner?.blockEntity).toBe(blockClone);
		expect((blockEndClone.owner as BlockRecord | null)?.blockEnd).toBe(blockEndClone);
	});
});