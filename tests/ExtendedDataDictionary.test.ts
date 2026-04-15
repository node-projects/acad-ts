import { describe, expect, it } from 'vitest';
import { CadDocument } from '../src/CadDocument.js';
import { Line } from '../src/Entities/Line.js';

describe('ExtendedDataDictionaryTests', () => {
	it('RegistersNamedAppIdsWithTheDocument', () => {
		const doc = new CadDocument();
		const line = new Line();

		doc.entities.add(line);
		line.extendedData.addByName('MY_APP');

		const appId = doc.appIds.get('MY_APP');
		expect(appId.name).toBe('MY_APP');
		expect(line.extendedData.containsKey(appId)).toBe(true);
		expect(line.extendedData.getByName('MY_APP')).toBe(line.extendedData.get(appId));
	});
});