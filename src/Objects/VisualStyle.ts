import { NonGraphicalObject } from './NonGraphicalObject.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { EdgeStyleModel } from './EdgeStyleModel.js';
import { FaceColorMode } from './FaceColorMode.js';
import { FaceLightingModelType } from './FaceLightingModelType.js';
import { FaceLightingQualityType } from './FaceLightingQualityType.js';
import { FaceModifierType } from './FaceModifierType.js';
import { WiggleAmount } from './WiggleAmount.js';

export class VisualStyle extends NonGraphicalObject {
	constructor(name?: string) {
		super(name);
	}

	brightness: number = 0;
	description: string = '';
	displaySettings: number = 0;

	edgeApplyStyleFlag: number = 0;
	private _edgeColorValue: Color = Color.byBlock;
	get edgeColor(): number { return this._edgeColorValue.getApproxIndex(); }
	set edgeColor(value: number) { this._edgeColorValue = new Color(value); }
	get edgeColorValue(): Color { return this._edgeColorValue; }
	set edgeColorValue(value: Color) { this._edgeColorValue = value; }
	edgeCreaseAngle: number = 0;
	edgeIntersectionColor: Color = Color.byLayer;
	edgeIntersectionLineType: number = 0;
	edgeIsolineCount: number = 0;
	edgeJitter: number = 0;
	edgeModifiers: number = 0;
	edgeObscuredColor: Color = Color.byLayer;
	edgeObscuredLineType: number = 0;
	edgeOverhang: number = 0;
	edgeSilhouetteColor: Color = Color.byLayer;
	edgeSilhouetteWidth: number = 0;
	edgeStyle: number = 0;
	edgeStyleModel: EdgeStyleModel = EdgeStyleModel.NoEdges;
	edgeWidth: number = 0;

	faceColorMode: FaceColorMode = FaceColorMode.NoColor;
	faceLightingModel: FaceLightingModelType = FaceLightingModelType.Invisible;
	faceLightingQuality: FaceLightingQualityType = FaceLightingQualityType.NoLighting;
	faceModifiers: FaceModifierType = FaceModifierType.None;
	faceOpacityLevel: number = 0;
	faceSpecularLevel: number = 0;
	faceStyleMonoColor: Color = Color.byLayer;

	haloGap: number = 0;
	internalFlag: boolean = false;

	override get objectName(): string { return DxfFileToken.objectVisualStyle; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }

	opacityLevel: number = 0;
	precisionFlag: boolean = false;
	rasterFile: string = '';
	shadowType: number = 0;

	override get subclassMarker(): string { return DxfSubclassMarker.visualStyle; }

	type: number = 0;

	/** DWG operation codes and version-specific properties retained during rewrites. */
	dwgLightingModel: number = 2;
	dwgLegacyUnknown: number = 0;
	dwgPropertyOperations: number[] = [];
	dwgExtendedProperties: { value: number | boolean | string | Color; operation: number }[] = [];
	private setExtendedValue(index: number, value: number | boolean | string | Color): void {
		this.dwgExtendedProperties[index] = { value, operation: this.dwgExtendedProperties[index]?.operation ?? 1 };
	}
	get internalUseOnlyFlag(): boolean { return this.internalFlag; }
	set internalUseOnlyFlag(value: boolean) { this.internalFlag = value; }
	get drawOrderEnabled(): boolean { return (this.dwgExtendedProperties[0]?.value as boolean | undefined) ?? false; }
	set drawOrderEnabled(value: boolean) { this.setExtendedValue(0, value); }
	get viewportTransparencyEnabled(): boolean { return (this.dwgExtendedProperties[1]?.value as boolean | undefined) ?? false; }
	set viewportTransparencyEnabled(value: boolean) { this.setExtendedValue(1, value); }
	get lightingEnabled(): boolean { return (this.dwgExtendedProperties[2]?.value as boolean | undefined) ?? false; }
	set lightingEnabled(value: boolean) { this.setExtendedValue(2, value); }
	get posterEffectEnabled(): boolean { return (this.dwgExtendedProperties[3]?.value as boolean | undefined) ?? false; }
	set posterEffectEnabled(value: boolean) { this.setExtendedValue(3, value); }
	get monoEffectEnabled(): boolean { return (this.dwgExtendedProperties[4]?.value as boolean | undefined) ?? false; }
	set monoEffectEnabled(value: boolean) { this.setExtendedValue(4, value); }
	get blurEffectEnabled(): boolean { return (this.dwgExtendedProperties[5]?.value as boolean | undefined) ?? false; }
	set blurEffectEnabled(value: boolean) { this.setExtendedValue(5, value); }
	get pencilEffectEnabled(): boolean { return (this.dwgExtendedProperties[6]?.value as boolean | undefined) ?? false; }
	set pencilEffectEnabled(value: boolean) { this.setExtendedValue(6, value); }
	get bloomEffectEnabled(): boolean { return (this.dwgExtendedProperties[7]?.value as boolean | undefined) ?? false; }
	set bloomEffectEnabled(value: boolean) { this.setExtendedValue(7, value); }
	get pastelEffectEnabled(): boolean { return (this.dwgExtendedProperties[8]?.value as boolean | undefined) ?? false; }
	set pastelEffectEnabled(value: boolean) { this.setExtendedValue(8, value); }
	get blurAmount(): number { return (this.dwgExtendedProperties[9]?.value as number | undefined) ?? 0; }
	set blurAmount(value: number) { this.setExtendedValue(9, value); }
	get pencilAngle(): number { return (this.dwgExtendedProperties[10]?.value as number | undefined) ?? 0; }
	set pencilAngle(value: number) { this.setExtendedValue(10, value); }
	get pencilScale(): number { return (this.dwgExtendedProperties[11]?.value as number | undefined) ?? 0; }
	set pencilScale(value: number) { this.setExtendedValue(11, value); }
	get pencilPattern(): number { return (this.dwgExtendedProperties[12]?.value as number | undefined) ?? 0; }
	set pencilPattern(value: number) { this.setExtendedValue(12, value); }
	get pencilColor(): Color { return (this.dwgExtendedProperties[13]?.value as Color | undefined) ?? Color.byLayer; }
	set pencilColor(value: Color) { this.setExtendedValue(13, value); }
	get bloomThreshold(): number { return (this.dwgExtendedProperties[14]?.value as number | undefined) ?? 0; }
	set bloomThreshold(value: number) { this.setExtendedValue(14, value); }
	get bloomRadius(): number { return (this.dwgExtendedProperties[15]?.value as number | undefined) ?? 0; }
	set bloomRadius(value: number) { this.setExtendedValue(15, value); }
	get tintColor(): Color { return (this.dwgExtendedProperties[16]?.value as Color | undefined) ?? Color.byLayer; }
	set tintColor(value: Color) { this.setExtendedValue(16, value); }
	get faceAdjustmentEnabled(): boolean { return (this.dwgExtendedProperties[17]?.value as boolean | undefined) ?? false; }
	set faceAdjustmentEnabled(value: boolean) { this.setExtendedValue(17, value); }
	get postContrast(): number { return (this.dwgExtendedProperties[18]?.value as number | undefined) ?? 0; }
	set postContrast(value: number) { this.setExtendedValue(18, value); }
	get postBrightness(): number { return (this.dwgExtendedProperties[19]?.value as number | undefined) ?? 0; }
	set postBrightness(value: number) { this.setExtendedValue(19, value); }
	get postPower(): number { return (this.dwgExtendedProperties[20]?.value as number | undefined) ?? 0; }
	set postPower(value: number) { this.setExtendedValue(20, value); }
	get tintEffectEnabled(): boolean { return (this.dwgExtendedProperties[21]?.value as boolean | undefined) ?? false; }
	set tintEffectEnabled(value: boolean) { this.setExtendedValue(21, value); }
	get bloomIntensity(): number { return (this.dwgExtendedProperties[22]?.value as number | undefined) ?? 0; }
	set bloomIntensity(value: number) { this.setExtendedValue(22, value); }
	get color(): Color { return (this.dwgExtendedProperties[23]?.value as Color | undefined) ?? Color.byLayer; }
	set color(value: Color) { this.setExtendedValue(23, value); }
	get transparency(): number { return (this.dwgExtendedProperties[24]?.value as number | undefined) ?? 0; }
	set transparency(value: number) { this.setExtendedValue(24, value); }
	get edgeWiggleAmount(): WiggleAmount { return (this.dwgExtendedProperties[25]?.value as WiggleAmount | undefined) ?? WiggleAmount.None; }
	set edgeWiggleAmount(value: WiggleAmount) { this.setExtendedValue(25, value); }
	get edgeTexturePath(): string { return (this.dwgExtendedProperties[26]?.value as string | undefined) ?? ''; }
	set edgeTexturePath(value: string) { this.setExtendedValue(26, value); }
	get depthOfFieldEnabled(): boolean { return (this.dwgExtendedProperties[27]?.value as boolean | undefined) ?? false; }
	set depthOfFieldEnabled(value: boolean) { this.setExtendedValue(27, value); }
	get focusDistance(): number { return (this.dwgExtendedProperties[28]?.value as number | undefined) ?? 0; }
	set focusDistance(value: number) { this.setExtendedValue(28, value); }
	get focusWidth(): number { return (this.dwgExtendedProperties[29]?.value as number | undefined) ?? 0; }
	set focusWidth(value: number) { this.setExtendedValue(29, value); }

	override clone(): VisualStyle {
		const clone = super.clone() as VisualStyle;
		clone.dwgPropertyOperations = [...this.dwgPropertyOperations];
		clone.dwgExtendedProperties = this.dwgExtendedProperties.map(property => ({ ...property }));
		return clone;
	}

	static readonly defaultName = '2dWireframe';
}
