import { MLineStyle , MLineStyleElement} from '../../Objects/MLineStyle.js';
import { LineType } from '../../Tables/LineType.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadMLineStyleTemplate extends CadTemplateT<MLineStyle> {
	ElementTemplates: CadMLineStyleTemplate.ElementTemplate[] = [];

	constructor(mlStyle?: MLineStyle) {
		super(mlStyle ?? new MLineStyle());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		for (const item of this.ElementTemplates) {
			item.Build(builder);
		}
	}
}

export namespace CadMLineStyleTemplate {
	export class ElementTemplate {
		Element: MLineStyleElement;

		LineTypeHandle: number | null = null;

		LinetypeIndex: number | null = null;

		LineTypeName: string | null = null;

		constructor(element: MLineStyleElement) {
			this.Element = element;
		}

		Build(builder: CadDocumentBuilder): void {
			let lt = builder.TryGetCadObject<LineType>(this.LineTypeHandle);
			if (lt) {
				this.Element.lineType = lt;
			} else {
				lt = builder.TryGetTableEntry<LineType>(this.LineTypeName ?? '');
				if (lt) {
					this.Element.lineType = lt;
				} else if (this.LinetypeIndex != null) {
					if (this.LinetypeIndex === 0x7FFF) {
						const bylayer = builder.TryGetTableEntry<LineType>(LineType.ByLayerName);
						if (bylayer) {
							this.Element.lineType = bylayer;
						}
					} else if (this.LinetypeIndex === 0x7FFE) {
						const byblock = builder.TryGetTableEntry<LineType>(LineType.ByBlockName);
						if (byblock) {
							this.Element.lineType = byblock;
						}
					} else {
						try {
							const lineTypes = builder.LineTypesTable;
							if (lineTypes) {
								const arr = Array.from(lineTypes);
								if (this.LinetypeIndex < arr.length) {
									this.Element.lineType = arr[this.LinetypeIndex];
								}
							}
						} catch (ex: any) {
							builder.Notify(`Linetype not assigned, index ${this.LinetypeIndex}`, NotificationType.Error, ex);
						}
					}
				}
			}
		}
	}
}
