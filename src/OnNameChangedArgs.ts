export class OnNameChangedArgs {
	public readonly oldName: string;
	public readonly newName: string;

	constructor(oldName: string, newName: string) {
		this.oldName = oldName;
		this.newName = newName;
	}
}
