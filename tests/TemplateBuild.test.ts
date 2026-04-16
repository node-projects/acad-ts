import { describe, expect, it } from 'vitest';
import { ACadVersion } from '../src/ACadVersion.js';
import { CadDocument } from '../src/CadDocument.js';
import { CadObject } from '../src/CadObject.js';
import { MultiLeader } from '../src/Entities/MultiLeader.js';
import { View } from '../src/Tables/View.js';
import { BlockRecord } from '../src/Tables/BlockRecord.js';
import { UCS } from '../src/Tables/UCS.js';
import { VisualStyle } from '../src/Objects/VisualStyle.js';
import { CadDocumentBuilder } from '../src/IO/CadDocumentBuilder.js';
import { CadMLeaderTemplate } from '../src/IO/Templates/CadMLeaderTemplate.js';
import { CadViewTemplate } from '../src/IO/Templates/CadViewTemplate.js';
import { LeaderLine, LeaderRoot } from '../src/Objects/MultiLeaderObjectContextData.js';
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

describe('TemplateBuildTests', () => {
	it('BuildsViewTemplatesFromResolvedVisualStyleAndUcsHandles', () => {
		const view = new View('Named');
		const template = new CadViewTemplate(view);
		const builder = new TestCadDocumentBuilder(ACadVersion.AC1018, new CadDocument());
		const visualStyle = new VisualStyle();
		const baseUcs = new UCS('Base');
		const namedUcs = new UCS('Named');

		view.handle = 10;
		visualStyle.handle = 11;
		baseUcs.handle = 12;
		namedUcs.handle = 13;
		baseUcs.origin = new XYZ(1, 2, 3);
		namedUcs.origin = new XYZ(4, 5, 6);
		namedUcs.xAxis = new XYZ(0, 1, 0);
		namedUcs.yAxis = new XYZ(-1, 0, 0);
		namedUcs.elevation = 7;

		builder.registerObject(visualStyle);
		builder.registerObject(baseUcs);
		builder.registerObject(namedUcs);
		template.visualStyleHandle = visualStyle.handle;
		template.ucsHandle = baseUcs.handle;
		template.namedUcsHandle = namedUcs.handle;

		template.build(builder);

		expect(view.visualStyle).toBe(visualStyle);
		expect(view.isUcsAssociated).toBe(true);
		expect(view.ucsOrigin).toEqual(new XYZ(4, 5, 6));
		expect(view.ucsXAxis).toEqual(new XYZ(0, 1, 0));
		expect(view.ucsYAxis).toEqual(new XYZ(-1, 0, 0));
		expect(view.ucsElevation).toBe(7);
	});

	it('BuildsMLeaderArrowheadHandlesIntoLeaderLines', () => {
		const multiLeader = new MultiLeader();
		const template = new CadMLeaderTemplate(multiLeader);
		const builder = new TestCadDocumentBuilder(ACadVersion.AC1018, new CadDocument());
		const defaultArrowhead = new BlockRecord('default-arrow');
		const lineArrowhead = new BlockRecord('line-arrow');
		const root = new LeaderRoot();
		const line = new LeaderLine();

		multiLeader.handle = 20;
		defaultArrowhead.handle = 21;
		lineArrowhead.handle = 22;
		root.lines = [line];
		multiLeader.contextData.leaderRoots = [root];

		builder.registerObject(defaultArrowhead);
		builder.registerObject(lineArrowhead);
		template.arrowheadHandle = defaultArrowhead.handle;
		template.arrowheadHandles.set(lineArrowhead.handle, false);

		template.build(builder);

		expect(multiLeader.arrowhead).toBe(defaultArrowhead);
		expect(multiLeader.contextData.leaderRoots[0].lines[0].arrowhead).toBe(lineArrowhead);
	});
});