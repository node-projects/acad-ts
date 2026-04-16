import { MLineStyle , MLineStyleElement} from '../../Objects/MLineStyle.js';
import { LineType } from '../../Tables/LineType.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadMLineStyleTemplate extends CadTemplateT<MLineStyle> {
	elementTemplates: CadMLineStyleTemplate.ElementTemplate[] = [];

	constructor(mlStyle?: MLineStyle) {
		super(mlStyle ?? new MLineStyle());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		for (const item of this.elementTemplates) {
			item.build(builder);
		}
	}
}

export namespace CadMLineStyleTemplate {
	export class ElementTemplate {
		element: MLineStyleElement;

		lineTypeHandle: number | null = null;

		linetypeIndex: number | null = null;

		lineTypeName: string | null = null;

		constructor(element: MLineStyleElement) {
			this.element = element;
		}

		build(builder: CadDocumentBuilder): void {
			let lt = builder.tryGetCadObject<LineType>(this.lineTypeHandle);
			if (lt) {
				this.element.lineType = lt;
			} else {
				lt = builder.tryGetTableEntry<LineType>(this.lineTypeName ?? '');
				if (lt) {
					this.element.lineType = lt;
				} else if (this.linetypeIndex != null) {
					if (this.linetypeIndex === 0x7FFF) {
						const bylayer = builder.tryGetTableEntry<LineType>(LineType.byLayerName);
						if (bylayer) {
							this.element.lineType = bylayer;
						}
					} else if (this.linetypeIndex === 0x7FFE) {
						const byblock = builder.tryGetTableEntry<LineType>(LineType.byBlockName);
						if (byblock) {
							this.element.lineType = byblock;
						}
					} else {
						try {
							const lineTypes = builder.lineTypesTable;
							if (lineTypes) {
								const arr = Array.from(lineTypes);
								if (this.linetypeIndex < arr.length) {
									this.element.lineType = arr[this.linetypeIndex];
								}
							}
						} catch (ex: unknown) {
							builder.notify(`Linetype not assigned, index ${this.linetypeIndex}`, NotificationType.Error, ex instanceof Error ? ex : null);
						}
					}
				}
			}
		}
	}
}
