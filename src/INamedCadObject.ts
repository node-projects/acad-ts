import { OnNameChangedArgs } from './OnNameChangedArgs.js';

export interface INamedCadObject {
	onNameChanged: ((sender: any, args: OnNameChangedArgs) => void) | null;
	name: string;
}
