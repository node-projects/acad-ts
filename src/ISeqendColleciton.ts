import { CollectionChangedEventArgs } from './CollectionChangedEventArgs.js';
import { Seqend } from './Entities/Seqend.js';

export interface ISeqendCollection extends Iterable<any> {
	onSeqendAdded: ((sender: any, args: CollectionChangedEventArgs) => void) | null;
	onSeqendRemoved: ((sender: any, args: CollectionChangedEventArgs) => void) | null;
	readonly seqend: Seqend | null;
}
