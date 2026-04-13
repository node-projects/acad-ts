import { ProxyObject } from '../../Objects/ProxyObject.js';
import { CadTemplate } from './CadTemplate.js';

export class CadProxyObjectTemplate extends CadTemplate<ProxyObject> {
	Entries: number[] = [];

	constructor(obj?: ProxyObject) {
		super(obj ?? new ProxyObject());
	}
}
