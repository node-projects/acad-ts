export class AcdsRecordColumn {
	dataType: number = 0;
	name: string = '';
	code: number = 0;
	value: unknown = null;

	toString(): string {
		return `${this.name} : ${this.dataType} : ${this.code}=${String(this.value)}`;
	}
}
