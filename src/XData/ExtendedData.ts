import { ExtendedDataRecord } from './ExtendedDataRecord.js';

export class ExtendedData {
	public records: ExtendedDataRecord[] = [];

	public constructor(records?: ExtendedDataRecord[]) {
		if (records) {
			this.records.push(...records);
		}
	}

	public addControlStrings(): void {
		if (this.records.length === 0) {
			this.records.push(ExtendedDataControlString.open);
			this.records.push(ExtendedDataControlString.close);
			return;
		}

		const first = this.records[0];
		if (!(first instanceof ExtendedDataControlString)) {
			this.records.unshift(ExtendedDataControlString.open);
		} else if (first.isClosing) {
			this.records.unshift(ExtendedDataControlString.open);
		}

		const last = this.records[this.records.length - 1];
		if (!(last instanceof ExtendedDataControlString)) {
			this.records.push(ExtendedDataControlString.close);
		} else if (!last.isClosing) {
			this.records.push(ExtendedDataControlString.close);
		}
	}
}

// Import here to avoid circular dependency issues with the inline usage
import { ExtendedDataControlString } from './ExtendedDataControlString.js';
