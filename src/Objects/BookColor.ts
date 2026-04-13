import { NonGraphicalObject } from './NonGraphicalObject.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';

export class BookColor extends NonGraphicalObject {
	override get objectName(): string {
		return DxfFileToken.ObjectDBColor;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.DbColor;
	}

	override get name(): string {
		if (!this.colorName) {
			return '';
		}
		return `${this.bookName}$${this.colorName}`;
	}
	override set name(value: string) {
		if (value.includes('$')) {
			const parts = value.split('$');
			this.bookName = parts[0];
			this.colorName = parts[parts.length - 1];
		} else {
			this.colorName = value;
		}
	}

	colorName: string = '';
	bookName: string = '';
	color: Color = Color.ByBlock;

	constructor(name?: string, bookName?: string) {
		super(name);
		if (bookName) {
			this.bookName = bookName;
		}
	}
}
