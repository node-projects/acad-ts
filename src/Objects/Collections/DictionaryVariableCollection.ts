import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { CadDictionary } from '../CadDictionary.js';
import { DictionaryVariable } from '../DictionaryVariable.js';
import { MultiLeaderStyle } from '../MultiLeaderStyle.js';
import { Scale } from '../Scale.js';
import { TableStyle } from '../TableStyle.js';

export class DictionaryVariableCollection extends ObjectDictionaryCollection<DictionaryVariable> {
	constructor(dictionary: CadDictionary) {
		super(dictionary);
	}

	addOrUpdateVariable(name: string, value: string): void {
		const v = this.tryGet(name);
		if (v) {
			v.value = value;
		} else {
			this.add(new DictionaryVariable(name, value));
		}
	}

	addVariable(name: string, value: string): void {
		if (!this.containsKey(name)) {
			this.add(new DictionaryVariable(name, value));
		}
	}

	createDefaults(): void {
		this.addVariable(DictionaryVariable.CurrentMultiLeaderStyle, MultiLeaderStyle.DefaultName);
		this.addVariable(DictionaryVariable.CurrentAnnotationScale, Scale.DefaultName);
		this.addVariable(DictionaryVariable.CurrentTableStyle, TableStyle.DefaultName);
		this.addVariable(DictionaryVariable.WipeoutFrame, '0');
		this.addVariable('CVIEWDETAILSTYLE', 'Metric50');
		this.addVariable('CVIEWSECTIONSTYLE', 'Metric50');
	}

	getValue(name: string): string | null {
		const v = this.tryGet(name);
		return v ? v.value : null;
	}
}
