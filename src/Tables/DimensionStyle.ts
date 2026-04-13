import { CadObject } from '../CadObject.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { LineWeightType } from '../Types/LineWeightType.js';
import { AngularUnitFormat } from '../Types/Units/AngularUnitFormat.js';
import { LinearUnitFormat } from '../Types/Units/LinearUnitFormat.js';
import { UnitStyleFormat } from '../Types/Units/UnitStyleFormat.js';
import { ArcLengthSymbolPosition } from './ArcLengthSymbolPosition.js';
import { BlockRecord } from './BlockRecord.js';
import { DimensionTextBackgroundFillMode } from './DimensionTextBackgroundFillMode.js';
import { DimensionTextHorizontalAlignment } from './DimensionTextHorizontalAlignment.js';
import { DimensionTextVerticalAlignment } from './DimensionTextVerticalAlignment.js';
import { FractionFormat } from './FractionFormat.js';
import { LineType } from './LineType.js';
import { TableEntry } from './TableEntry.js';
import { TextArrowFitType } from './TextArrowFitType.js';
import { TextDirection } from './TextDirection.js';
import { TextMovement } from './TextMovement.js';
import { TextStyle } from './TextStyle.js';
import { ToleranceAlignment } from './ToleranceAlignment.js';
import { ZeroHandling, AngularZeroHandling } from './ZeroHandling.js';

export class DimensionStyle extends TableEntry {
	public static get Default(): DimensionStyle {
		return new DimensionStyle(DimensionStyle.DefaultName);
	}

	public alternateDimensioningSuffix: string = '[]';
	public alternateUnitDecimalPlaces: number = 3;
	public alternateUnitDimensioning: boolean = false;
	public alternateUnitFormat: LinearUnitFormat = LinearUnitFormat.Decimal;
	public alternateUnitRounding: number = 0.0;
	public alternateUnitScaleFactor: number = 25.4;
	public alternateUnitToleranceDecimalPlaces: number = 3;
	public alternateUnitToleranceZeroHandling: ZeroHandling = ZeroHandling.SuppressZeroFeetAndInches;
	public alternateUnitZeroHandling: ZeroHandling = ZeroHandling.SuppressZeroFeetAndInches;
	public angularDecimalPlaces: number = 0;
	public angularUnit: AngularUnitFormat = AngularUnitFormat.DecimalDegrees;
	public angularZeroHandling: AngularZeroHandling = AngularZeroHandling.DisplayAll;
	public arcLengthSymbolPosition: ArcLengthSymbolPosition = ArcLengthSymbolPosition.BeforeDimensionText;

	public get arrowBlock(): BlockRecord | null {
		return this._dimArrowBlock;
	}
	public set arrowBlock(value: BlockRecord | null) {
		this._dimArrowBlock = value;
	}

	public get arrowSize(): number {
		return this._arrowSize;
	}
	public set arrowSize(value: number) {
		if (value < 0) {
			throw new Error(`The arrowSize must be equals or greater than zero.`);
		}
		this._arrowSize = value;
	}

	public centerMarkSize: number = 0.0900;
	public cursorUpdate: boolean = false;
	public decimalPlaces: number = 2;
	public decimalSeparator: string = '.';

	public get dimArrow1(): BlockRecord | null {
		return this._dimArrow1;
	}
	public set dimArrow1(value: BlockRecord | null) {
		this._dimArrow1 = value;
	}

	public get dimArrow2(): BlockRecord | null {
		return this._dimArrow2;
	}
	public set dimArrow2(value: BlockRecord | null) {
		this._dimArrow2 = value;
	}

	public dimensionFit: number = 0;
	public dimensionLineColor: Color = Color.ByBlock;
	public dimensionLineExtension: number = 0.0;
	public dimensionLineGap: number = 0.6250;
	public dimensionLineIncrement: number = 3.75;
	public dimensionLineWeight: LineWeightType = LineWeightType.ByBlock;
	public dimensionTextArrowFit: TextArrowFitType = TextArrowFitType.BestFit;
	public dimensionUnit: number = 2;
	public extensionLineColor: Color = Color.ByBlock;
	public extensionLineExtension: number = 1.2500;
	public extensionLineOffset: number = 0.6250;
	public extensionLineWeight: LineWeightType = LineWeightType.ByBlock;
	public fixedExtensionLineLength: number = 1.0;
	public fractionFormat: FractionFormat = FractionFormat.Horizontal;
	public generateTolerances: boolean = false;
	public isExtensionLineLengthFixed: boolean = false;

	public get joggedRadiusDimensionTransverseSegmentAngle(): number {
		return this._joggedRadiusDimensionTransverseSegmentAngle;
	}
	public set joggedRadiusDimensionTransverseSegmentAngle(value: number) {
		const rounded = Math.round(value * 1e6) / 1e6;
		const deg5Rad = (5 * Math.PI) / 180;
		const halfPI = Math.PI / 2;
		if (rounded <= deg5Rad || rounded >= halfPI) {
			throw new Error(`The joggedRadiusDimensionTransverseSegmentAngle must be in range of 5 to 90 degrees.`);
		}
		this._joggedRadiusDimensionTransverseSegmentAngle = value;
	}

	public get leaderArrow(): BlockRecord | null {
		return this._leaderArrow;
	}
	public set leaderArrow(value: BlockRecord | null) {
		this._leaderArrow = value;
	}

	public limitsGeneration: boolean = false;
	public linearScaleFactor: number = 1.0;
	public linearUnitFormat: LinearUnitFormat = LinearUnitFormat.Decimal;

	public get lineType(): LineType | null {
		return this._lineType;
	}
	public set lineType(value: LineType | null) {
		this._lineType = value;
	}

	public get lineTypeExt1(): LineType | null {
		return this._lineTypeExt1;
	}
	public set lineTypeExt1(value: LineType | null) {
		this._lineTypeExt1 = value;
	}

	public get lineTypeExt2(): LineType | null {
		return this._lineTypeExt2;
	}
	public set lineTypeExt2(value: LineType | null) {
		this._lineTypeExt2 = value;
	}

	public minusTolerance: number = 0.0;

	public override get objectName(): string {
		return DxfFileToken.TableDimstyle;
	}

	public override get objectType(): ObjectType {
		return ObjectType.DIMSTYLE;
	}

	public plusTolerance: number = 0.0;
	public postFix: string = '<>';

	public get prefix(): string {
		const { prefix } = this.getDimStylePrefixAndSuffix(this.postFix, '<', '>');
		return prefix;
	}
	public set prefix(value: string) {
		const { suffix } = this.getDimStylePrefixAndSuffix(this.postFix, '<', '>');
		this.postFix = `${value}${this.postFix}${suffix}`;
	}

	public rounding: number = 0.0;

	public get scaleFactor(): number {
		return this._scaleFactor;
	}
	public set scaleFactor(value: number) {
		if (value < 0) {
			throw new Error(`The scaleFactor must be equals or greater than zero.`);
		}
		this._scaleFactor = value;
	}

	public separateArrowBlocks: boolean = true;

	public get style(): TextStyle {
		return this._style;
	}
	public set style(value: TextStyle) {
		if (value == null) {
			throw new Error('Style cannot be null.');
		}
		this._style = value;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.DimensionStyle;
	}

	public get suffix(): string {
		const { suffix } = this.getDimStylePrefixAndSuffix(this.postFix, '<', '>');
		return suffix;
	}
	public set suffix(value: string) {
		const { prefix } = this.getDimStylePrefixAndSuffix(this.postFix, '<', '>');
		this.postFix = `${prefix}${this.postFix}${value}`;
	}

	public suppressFirstDimensionLine: boolean = false;
	public suppressFirstExtensionLine: boolean = false;
	public suppressOutsideExtensions: boolean = false;
	public suppressSecondDimensionLine: boolean = false;
	public suppressSecondExtensionLine: boolean = false;
	public textBackgroundColor: Color = Color.ByBlock;
	public textBackgroundFillMode: DimensionTextBackgroundFillMode = DimensionTextBackgroundFillMode.NoBackground;
	public textColor: Color = Color.ByBlock;
	public textDirection: TextDirection = TextDirection.LeftToRight;

	public get textHeight(): number {
		return this._textHeight;
	}
	public set textHeight(value: number) {
		if (value <= 0) {
			throw new Error(`The textHeight must be greater than zero.`);
		}
		this._textHeight = value;
	}

	public textHorizontalAlignment: DimensionTextHorizontalAlignment = DimensionTextHorizontalAlignment.Centered;
	public textInsideExtensions: boolean = false;
	public textInsideHorizontal: boolean = false;
	public textMovement: TextMovement = TextMovement.MoveLineWithText;
	public textOutsideExtensions: boolean = false;
	public textOutsideHorizontal: boolean = false;
	public textVerticalAlignment: DimensionTextVerticalAlignment = DimensionTextVerticalAlignment.Above;
	public textVerticalPosition: number = 0.0;
	public tickSize: number = 0.0;
	public toleranceAlignment: ToleranceAlignment = ToleranceAlignment.Bottom;
	public toleranceDecimalPlaces: number = 2;
	public toleranceScaleFactor: number = 1.0;
	public toleranceZeroHandling: ZeroHandling = ZeroHandling.SuppressDecimalTrailingZeroes;
	public zeroHandling: ZeroHandling = ZeroHandling.SuppressDecimalTrailingZeroes;

	public static readonly DefaultName: string = 'Standard';
	public static readonly StyleOverrideEntryName: string = 'DSTYLE';

	private _arrowSize: number = 0.18;
	private _dimArrow1: BlockRecord | null = null;
	private _dimArrow2: BlockRecord | null = null;
	private _dimArrowBlock: BlockRecord | null = null;
	private _joggedRadiusDimensionTransverseSegmentAngle: number = Math.PI / 4.0;
	private _leaderArrow: BlockRecord | null = null;
	private _lineType: LineType | null = null;
	private _lineTypeExt1: LineType | null = null;
	private _lineTypeExt2: LineType | null = null;
	private _scaleFactor: number = 1.0;
	private _style: TextStyle = TextStyle.Default;
	private _textHeight: number = 0.18;

	public constructor(name?: string) {
		super(name);
	}

	public applyRounding(value: number, isAlternate: boolean = false): number {
		const rounding = isAlternate ? this.alternateUnitRounding : this.rounding;
		if (rounding !== 0.0) {
			value = rounding * Math.round(value / rounding);
		}
		return value;
	}

	public override clone(): CadObject {
		const clone = super.clone() as DimensionStyle;

		clone.style = this.style?.clone() as TextStyle;
		clone.leaderArrow = this.leaderArrow?.clone() as BlockRecord ?? null;
		clone.arrowBlock = this.arrowBlock?.clone() as BlockRecord ?? null;
		clone.dimArrow1 = this.dimArrow1?.clone() as BlockRecord ?? null;
		clone.dimArrow2 = this.dimArrow2?.clone() as BlockRecord ?? null;
		clone.lineType = this.lineType?.clone() as LineType ?? null;
		clone.lineTypeExt1 = this.lineTypeExt1?.clone() as LineType ?? null;
		clone.lineTypeExt2 = this.lineTypeExt2?.clone() as LineType ?? null;

		return clone;
	}

	public getAlternateUnitStyleFormat(): UnitStyleFormat {
		const format = new UnitStyleFormat();
		format.linearDecimalPlaces = this.alternateUnitDecimalPlaces;
		format.angularDecimalPlaces = this.alternateUnitDecimalPlaces;
		format.decimalSeparator = this.decimalSeparator;
		format.fractionHeightScale = this.toleranceScaleFactor;
		format.fractionType = this.fractionFormat;
		format.linearZeroHandling = this.alternateUnitZeroHandling;
		format.angularZeroHandling = this.angularZeroHandling;
		return format;
	}

	public getUnitStyleFormat(): UnitStyleFormat {
		const format = new UnitStyleFormat();
		format.linearDecimalPlaces = this.decimalPlaces;
		format.angularDecimalPlaces = this.angularDecimalPlaces === -1 ? this.decimalPlaces : this.angularDecimalPlaces;
		format.decimalSeparator = this.decimalSeparator;
		format.fractionHeightScale = this.toleranceScaleFactor;
		format.fractionType = this.fractionFormat;
		format.linearZeroHandling = this.zeroHandling;
		format.angularZeroHandling = this.angularZeroHandling;
		return format;
	}

	private getDimStylePrefixAndSuffix(text: string, start: string, end: string): { prefix: string; suffix: string } {
		let index = -1;
		for (let i = 0; i < text.length; i++) {
			if (text[i] === start) {
				if (i + 1 < text.length && text[i + 1] === end) {
					index = i;
					break;
				}
			}
		}

		if (index < 0) {
			return { prefix: '', suffix: text };
		} else {
			return {
				prefix: text.substring(0, index),
				suffix: text.substring(index + 2),
			};
		}
	}

	altMzf: number = 0;
	altMzs: string = "";
	mzf: number = 0;
	mzs: string = "";
}

export { ZeroHandling } from './ZeroHandling.js';

export { ToleranceAlignment } from './ToleranceAlignment.js';

export { DimensionTextHorizontalAlignment } from './DimensionTextHorizontalAlignment.js';

export { DimensionTextVerticalAlignment } from './DimensionTextVerticalAlignment.js';

export { AngularZeroHandling } from './ZeroHandling.js';

export { ArcLengthSymbolPosition } from './ArcLengthSymbolPosition.js';

export { DimensionTextBackgroundFillMode } from './DimensionTextBackgroundFillMode.js';

export { FractionFormat } from './FractionFormat.js';

export { TextMovement } from './TextMovement.js';

export { TextDirection } from './TextDirection.js';
