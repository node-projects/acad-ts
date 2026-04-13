import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { CadDictionary } from '../CadDictionary.js';
import { Scale } from '../Scale.js';

export class ScaleCollection extends ObjectDictionaryCollection<Scale> {
	constructor(dictionary: CadDictionary) {
		super(dictionary);
	}

	createDefaults(): void {
		const scales = [
			{ name: '1:1', paper: 1.0, drawing: 1.0, isUnit: true },
			{ name: '1:2', paper: 1.0, drawing: 2.0, isUnit: false },
			{ name: '1:4', paper: 1.0, drawing: 4.0, isUnit: false },
			{ name: '1:5', paper: 1.0, drawing: 5.0, isUnit: false },
			{ name: '1:8', paper: 1.0, drawing: 8.0, isUnit: false },
			{ name: '1:10', paper: 1.0, drawing: 10.0, isUnit: false },
			{ name: '1:16', paper: 1.0, drawing: 16.0, isUnit: false },
			{ name: '1:20', paper: 1.0, drawing: 20.0, isUnit: false },
			{ name: '1:30', paper: 1.0, drawing: 30.0, isUnit: false },
			{ name: '1:40', paper: 1.0, drawing: 40.0, isUnit: false },
			{ name: '1:50', paper: 1.0, drawing: 50.0, isUnit: false },
			{ name: '1:100', paper: 1.0, drawing: 100.0, isUnit: false },
			{ name: '2:1', paper: 2.0, drawing: 1.0, isUnit: false },
			{ name: '4:1', paper: 4.0, drawing: 1.0, isUnit: false },
			{ name: '8:1', paper: 8.0, drawing: 1.0, isUnit: false },
			{ name: '10:1', paper: 10.0, drawing: 1.0, isUnit: false },
			{ name: '100:1', paper: 100.0, drawing: 1.0, isUnit: false },
		];

		for (const s of scales) {
			const scale = new Scale();
			scale.name = s.name;
			scale.paperUnits = s.paper;
			scale.drawingUnits = s.drawing;
			scale.isUnitScale = s.isUnit;
			this._dictionary.tryAdd(scale);
		}
	}
}
