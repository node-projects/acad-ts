import { describe, expect, it } from 'vitest';
import { CadDocument } from '../../src/CadDocument.js';
import { DxfFileToken } from '../../src/DxfFileToken.js';
import { CadDictionary } from '../../src/Objects/CadDictionary.js';
import { Material } from '../../src/Objects/Material.js';
import { BlockXYParameter } from '../../src/Objects/Evaluations/BlockXYParameter.js';
import { EvaluationGraph } from '../../src/Objects/Evaluations/EvaluationGraph.js';

describe('DxfClassCollection', () => {
	it('collects class metadata from document objects and resets class numbers', () => {
		const document = new CadDocument();
		const materials = document.rootDictionary!.getEntry<CadDictionary>(CadDictionary.acadMaterial)!;
		materials.add(new Material('First'));
		materials.add(new Material('Second'));

		document.updateDxfClasses(true);

		const materialClass = document.classes!.getByName(DxfFileToken.objectMaterial);
		expect(document.classes!.count).toBe(1);
		expect(materialClass?.classNumber).toBe(500);
		expect(materialClass?.instanceCount).toBe(2);
	});

	it('does not replace the first class definition when reading duplicates', () => {
		const document = new CadDocument();
		const first = new Material('First').getDxfClass()!;
		const duplicate = new Material('Second').getDxfClass()!;
		first.classNumber = 712;
		duplicate.classNumber = 900;

		expect(document.classes!.tryAdd(first)).toBe(true);
		expect(document.classes!.tryAdd(duplicate)).toBe(false);
		expect(document.classes!.getByName(first.dxfName)).toBe(first);
	});

	it('provides class metadata for dynamic block and evaluation graph objects', () => {
		const parameterClass = new BlockXYParameter().getDxfClass();
		const graphClass = new EvaluationGraph().getDxfClass();

		expect(parameterClass?.dxfName).toBe(DxfFileToken.objectBlockXYParameter);
		expect(parameterClass?.maintenanceVersion).toBe(55);
		expect(graphClass?.dxfName).toBe(DxfFileToken.objectEvalGraph);
	});
});
