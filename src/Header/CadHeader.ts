import { ACadVersion } from '../ACadVersion.js';
import { CadUtils } from '../CadUtils.js';
import { Color } from '../Color.js';
import { DxfCode } from '../DxfCode.js';
import { LineWeightType } from '../Types/LineWeightType.js';
import { AngularDirection } from '../Types/Units/AngularDirection.js';
import { AngularUnitFormat } from '../Types/Units/AngularUnitFormat.js';
import { LinearUnitFormat } from '../Types/Units/LinearUnitFormat.js';
import { UnitsType } from '../Types/Units/UnitsType.js';
import { ArcLengthSymbolPosition } from '../Tables/ArcLengthSymbolPosition.js';
import { DimensionStyle } from '../Tables/DimensionStyle.js';
import { DimensionTextBackgroundFillMode } from '../Tables/DimensionTextBackgroundFillMode.js';
import { DimensionTextHorizontalAlignment } from '../Tables/DimensionTextHorizontalAlignment.js';
import { DimensionTextVerticalAlignment } from '../Tables/DimensionTextVerticalAlignment.js';
import { FractionFormat } from '../Tables/FractionFormat.js';
import { Layer } from '../Tables/Layer.js';
import { LineType } from '../Tables/LineType.js';
import { TextArrowFitType } from '../Tables/TextArrowFitType.js';
import { TextDirection } from '../Tables/TextDirection.js';
import { TextMovement } from '../Tables/TextMovement.js';
import { TextStyle } from '../Tables/TextStyle.js';
import { ToleranceAlignment } from '../Tables/ToleranceAlignment.js';
import { UCS } from '../Tables/UCS.js';
import { ZeroHandling, AngularZeroHandling } from '../Tables/ZeroHandling.js';
import { AttributeVisibilityMode } from './AttributeVisibilityMode.js';
import { DimensionAssociation } from './DimensionAssociation.js';
import { EntityPlotStyleType } from './EntityPlotStyleType.js';
import { IndexCreationFlags } from './IndexCreationFlags.js';
import { MeasurementUnits } from './MeasurementUnits.js';
import { ObjectSnapMode } from './ObjectSnapMode.js';
import { ObjectSortingFlags } from './ObjectSortingFlags.js';
import { SpaceLineTypeScaling } from './SpaceLineTypeScaling.js';
import { SplineType } from './SplineType.js';
import { XClipFrameType } from './XClipFrameType.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
import { CadSystemVariable } from '../CadSystemVariable.js';
import { getSystemVariableMetadataMap } from '../Metadata/MetadataStore.js';

export enum VerticalAlignmentType {
	Top = 0,
	Middle = 1,
	Bottom = 2,
}

export class CadHeader {
	private static _headerMapCache: Map<string, CadSystemVariable> | null = null;

	// --- Simple properties ---

	public angleBase: number = 0.0;
	public angularDirection: AngularDirection = AngularDirection.ClockWise;
	public angularUnit: AngularUnitFormat = AngularUnitFormat.DecimalDegrees;

	public get angularUnitPrecision(): number {
		return this._angularUnitPrecision;
	}
	public set angularUnitPrecision(value: number) {
		if (value < 0 || value > 8) {
			throw new Error('AUPREC valid values are from 0 to 8');
		}
		this._angularUnitPrecision = value;
	}

	public arrowBlockName: string = '';
	public associatedDimensions: boolean = true;
	public attributeVisibility: AttributeVisibilityMode = AttributeVisibilityMode.Normal;
	public blipMode: boolean = false;
	public cameraDisplayObjects: boolean = false;
	public cameraHeight: number = 0;
	public chamferAngle: number = 0.0;
	public chamferDistance1: number = 0.0;
	public chamferDistance2: number = 0.0;
	public chamferLength: number = 0.0;
	public codePage: string = 'ANSI_1252';
	public createDateTime: Date = new Date();
	public createEllipseAsPolyline: boolean = false;
	public currentEntityColor: Color = Color.ByLayer;
	public currentEntityLinetypeScale: number = 1.0;
	public currentEntityLineWeight: LineWeightType = LineWeightType.ByLayer;
	public currentEntityPlotStyle: EntityPlotStyleType = EntityPlotStyleType.ByLayer;

	public get currentLayer(): Layer {
		if (this.document == null) {
			return this._currentLayer;
		} else {
			return this.document.layers.get(this.currentLayerName);
		}
	}

	public get currentLayerName(): string {
		return this._currentLayer.name;
	}
	public set currentLayerName(value: string) {
		if (this.document != null) {
			this._currentLayer = this.document.layers.get(value);
		} else {
			this._currentLayer = new Layer(value);
		}
	}

	public get currentLineType(): LineType {
		if (this.document == null) {
			return this._currentLineType;
		} else {
			return this.document.lineTypes.get(this.currentLineTypeName);
		}
	}

	public get currentLineTypeName(): string {
		return this._currentLineType.name;
	}
	public set currentLineTypeName(value: string) {
		if (this.document != null) {
			this._currentLineType = this.document.lineTypes.get(value);
		} else {
			this._currentLineType = new LineType(value);
		}
	}

	public currentMultiLineJustification: VerticalAlignmentType = VerticalAlignmentType.Top;
	public currentMultilineScale: number = 20.0;

	public currentMLineStyleName: string = 'Standard';

	public get currentTextStyle(): TextStyle {
		if (this.document == null) {
			return this._currentTextStyle;
		} else {
			return this.document.textStyles.get(this.currentTextStyleName);
		}
	}

	public get currentTextStyleName(): string {
		return this._currentTextStyle.name;
	}
	public set currentTextStyleName(value: string) {
		if (this.document != null) {
			this._currentTextStyle = this.document.textStyles.get(value);
		} else {
			this._currentTextStyle = new TextStyle(value);
		}
	}

	public dgnUnderlayFramesVisibility: string = '';

	// --- Dimension style overrides (delegate to _dimensionStyleOverrides) ---

	public get dimensionAlternateDimensioningSuffix(): string { return this._dimensionStyleOverrides.alternateDimensioningSuffix; }
	public set dimensionAlternateDimensioningSuffix(v: string) { this._dimensionStyleOverrides.alternateDimensioningSuffix = v; }

	public get dimensionAlternateUnitDecimalPlaces(): number { return this._dimensionStyleOverrides.alternateUnitDecimalPlaces; }
	public set dimensionAlternateUnitDecimalPlaces(v: number) { this._dimensionStyleOverrides.alternateUnitDecimalPlaces = v; }

	public get dimensionAlternateUnitDimensioning(): boolean { return this._dimensionStyleOverrides.alternateUnitDimensioning; }
	public set dimensionAlternateUnitDimensioning(v: boolean) { this._dimensionStyleOverrides.alternateUnitDimensioning = v; }

	public get dimensionAlternateUnitFormat(): LinearUnitFormat { return this._dimensionStyleOverrides.alternateUnitFormat; }
	public set dimensionAlternateUnitFormat(v: LinearUnitFormat) { this._dimensionStyleOverrides.alternateUnitFormat = v; }

	public get dimensionAlternateUnitRounding(): number { return this._dimensionStyleOverrides.alternateUnitRounding; }
	public set dimensionAlternateUnitRounding(v: number) { this._dimensionStyleOverrides.alternateUnitRounding = v; }

	public get dimensionAlternateUnitScaleFactor(): number { return this._dimensionStyleOverrides.alternateUnitScaleFactor; }
	public set dimensionAlternateUnitScaleFactor(v: number) { this._dimensionStyleOverrides.alternateUnitScaleFactor = v; }

	public get dimensionAlternateUnitToleranceDecimalPlaces(): number { return this._dimensionStyleOverrides.alternateUnitToleranceDecimalPlaces; }
	public set dimensionAlternateUnitToleranceDecimalPlaces(v: number) { this._dimensionStyleOverrides.alternateUnitToleranceDecimalPlaces = v; }

	public get dimensionAlternateUnitToleranceZeroHandling(): ZeroHandling { return this._dimensionStyleOverrides.alternateUnitToleranceZeroHandling; }
	public set dimensionAlternateUnitToleranceZeroHandling(v: ZeroHandling) { this._dimensionStyleOverrides.alternateUnitToleranceZeroHandling = v; }

	public get dimensionAlternateUnitZeroHandling(): ZeroHandling { return this._dimensionStyleOverrides.alternateUnitZeroHandling; }
	public set dimensionAlternateUnitZeroHandling(v: ZeroHandling) { this._dimensionStyleOverrides.alternateUnitZeroHandling = v; }

	public get dimensionAngularDimensionDecimalPlaces(): number { return this._dimensionStyleOverrides.angularDecimalPlaces; }
	public set dimensionAngularDimensionDecimalPlaces(v: number) { this._dimensionStyleOverrides.angularDecimalPlaces = v; }

	public get dimensionAngularUnit(): AngularUnitFormat { return this._dimensionStyleOverrides.angularUnit; }
	public set dimensionAngularUnit(v: AngularUnitFormat) { this._dimensionStyleOverrides.angularUnit = v; }

	public get dimensionAngularZeroHandling(): AngularZeroHandling { return this._dimensionStyleOverrides.angularZeroHandling; }
	public set dimensionAngularZeroHandling(v: AngularZeroHandling) { this._dimensionStyleOverrides.angularZeroHandling = v; }

	public get dimensionArcLengthSymbolPosition(): ArcLengthSymbolPosition { return this._dimensionStyleOverrides.arcLengthSymbolPosition; }
	public set dimensionArcLengthSymbolPosition(v: ArcLengthSymbolPosition) { this._dimensionStyleOverrides.arcLengthSymbolPosition = v; }

	public get dimensionArrowSize(): number { return this._dimensionStyleOverrides.arrowSize; }
	public set dimensionArrowSize(v: number) { this._dimensionStyleOverrides.arrowSize = v; }

	public dimensionAssociativity: DimensionAssociation = DimensionAssociation.CreateAssociativeDimensions;
	public dimensionBlockName: string = '';
	public dimensionBlockNameFirst: string | null = null;
	public dimensionBlockNameSecond: string | null = null;

	public get dimensionCenterMarkSize(): number { return this._dimensionStyleOverrides.centerMarkSize; }
	public set dimensionCenterMarkSize(v: number) { this._dimensionStyleOverrides.centerMarkSize = v; }

	public get dimensionCursorUpdate(): boolean { return this._dimensionStyleOverrides.cursorUpdate; }
	public set dimensionCursorUpdate(v: boolean) { this._dimensionStyleOverrides.cursorUpdate = v; }

	public get dimensionDecimalPlaces(): number { return this._dimensionStyleOverrides.decimalPlaces; }
	public set dimensionDecimalPlaces(v: number) { this._dimensionStyleOverrides.decimalPlaces = v; }

	public get dimensionDecimalSeparator(): string { return this._dimensionStyleOverrides.decimalSeparator; }
	public set dimensionDecimalSeparator(v: string) { this._dimensionStyleOverrides.decimalSeparator = v; }

	public get dimensionDimensionTextArrowFit(): TextArrowFitType { return this._dimensionStyleOverrides.dimensionTextArrowFit; }
	public set dimensionDimensionTextArrowFit(v: TextArrowFitType) { this._dimensionStyleOverrides.dimensionTextArrowFit = v; }

	public get dimensionExtensionLineColor(): Color { return this._dimensionStyleOverrides.extensionLineColor; }
	public set dimensionExtensionLineColor(v: Color) { this._dimensionStyleOverrides.extensionLineColor = v; }

	public get dimensionExtensionLineExtension(): number { return this._dimensionStyleOverrides.extensionLineExtension; }
	public set dimensionExtensionLineExtension(v: number) { this._dimensionStyleOverrides.extensionLineExtension = v; }

	public get dimensionExtensionLineOffset(): number { return this._dimensionStyleOverrides.extensionLineOffset; }
	public set dimensionExtensionLineOffset(v: number) { this._dimensionStyleOverrides.extensionLineOffset = v; }

	public get dimensionFit(): number { return this._dimensionStyleOverrides.dimensionFit; }
	public set dimensionFit(v: number) { this._dimensionStyleOverrides.dimensionFit = v; }

	public get dimensionFixedExtensionLineLength(): number { return this._dimensionStyleOverrides.fixedExtensionLineLength; }
	public set dimensionFixedExtensionLineLength(v: number) { this._dimensionStyleOverrides.fixedExtensionLineLength = v; }

	public get dimensionFractionFormat(): FractionFormat { return this._dimensionStyleOverrides.fractionFormat; }
	public set dimensionFractionFormat(v: FractionFormat) { this._dimensionStyleOverrides.fractionFormat = v; }

	public get dimensionGenerateTolerances(): boolean { return this._dimensionStyleOverrides.generateTolerances; }
	public set dimensionGenerateTolerances(v: boolean) { this._dimensionStyleOverrides.generateTolerances = v; }

	public get dimensionIsExtensionLineLengthFixed(): boolean { return this._dimensionStyleOverrides.isExtensionLineLengthFixed; }
	public set dimensionIsExtensionLineLengthFixed(v: boolean) { this._dimensionStyleOverrides.isExtensionLineLengthFixed = v; }

	public get dimensionJoggedRadiusDimensionTransverseSegmentAngle(): number { return this._dimensionStyleOverrides.joggedRadiusDimensionTransverseSegmentAngle; }
	public set dimensionJoggedRadiusDimensionTransverseSegmentAngle(v: number) { this._dimensionStyleOverrides.joggedRadiusDimensionTransverseSegmentAngle = v; }

	public get dimensionLimitsGeneration(): boolean { return this._dimensionStyleOverrides.limitsGeneration; }
	public set dimensionLimitsGeneration(v: boolean) { this._dimensionStyleOverrides.limitsGeneration = v; }

	public get dimensionLinearScaleFactor(): number { return this._dimensionStyleOverrides.linearScaleFactor; }
	public set dimensionLinearScaleFactor(v: number) { this._dimensionStyleOverrides.linearScaleFactor = v; }

	public get dimensionLinearUnitFormat(): LinearUnitFormat { return this._dimensionStyleOverrides.linearUnitFormat; }
	public set dimensionLinearUnitFormat(v: LinearUnitFormat) { this._dimensionStyleOverrides.linearUnitFormat = v; }

	public get dimensionLineColor(): Color { return this._dimensionStyleOverrides.dimensionLineColor; }
	public set dimensionLineColor(v: Color) { this._dimensionStyleOverrides.dimensionLineColor = v; }

	public get dimensionLineExtension(): number { return this._dimensionStyleOverrides.dimensionLineExtension; }
	public set dimensionLineExtension(v: number) { this._dimensionStyleOverrides.dimensionLineExtension = v; }

	public get dimensionLineGap(): number { return this._dimensionStyleOverrides.dimensionLineGap; }
	public set dimensionLineGap(v: number) { this._dimensionStyleOverrides.dimensionLineGap = v; }

	public get dimensionLineIncrement(): number { return this._dimensionStyleOverrides.dimensionLineIncrement; }
	public set dimensionLineIncrement(v: number) { this._dimensionStyleOverrides.dimensionLineIncrement = v; }

	public dimensionLineType: string = 'ByBlock';

	public get dimensionLineWeight(): LineWeightType { return this._dimensionStyleOverrides.dimensionLineWeight; }
	public set dimensionLineWeight(v: LineWeightType) { this._dimensionStyleOverrides.dimensionLineWeight = v; }

	public get dimensionMinusTolerance(): number { return this._dimensionStyleOverrides.minusTolerance; }
	public set dimensionMinusTolerance(v: number) { this._dimensionStyleOverrides.minusTolerance = v; }

	public get dimensionPlusTolerance(): number { return this._dimensionStyleOverrides.plusTolerance; }
	public set dimensionPlusTolerance(v: number) { this._dimensionStyleOverrides.plusTolerance = v; }

	public get dimensionPostFix(): string { return this._dimensionStyleOverrides.postFix; }
	public set dimensionPostFix(v: string) { this._dimensionStyleOverrides.postFix = v; }

	public get dimensionRounding(): number { return this._dimensionStyleOverrides.rounding; }
	public set dimensionRounding(v: number) { this._dimensionStyleOverrides.rounding = v; }

	public get dimensionScaleFactor(): number { return this._dimensionStyleOverrides.scaleFactor; }
	public set dimensionScaleFactor(v: number) { this._dimensionStyleOverrides.scaleFactor = v; }

	public get dimensionSeparateArrowBlocks(): boolean { return this._dimensionStyleOverrides.separateArrowBlocks; }
	public set dimensionSeparateArrowBlocks(v: boolean) { this._dimensionStyleOverrides.separateArrowBlocks = v; }

	public get currentDimensionStyle(): DimensionStyle {
		if (this.document == null) {
			return this._currentDimensionStyle;
		} else {
			return this.document.dimensionStyles.get(this.currentDimensionStyleName);
		}
	}

	public get currentDimensionStyleName(): string {
		return this._currentDimensionStyle.name;
	}
	public set currentDimensionStyleName(value: string) {
		if (this.document != null) {
			this._currentDimensionStyle = this.document.dimensionStyles.get(value);
		} else {
			this._currentDimensionStyle = new DimensionStyle(value);
		}
	}

	public get dimensionSuppressFirstDimensionLine(): boolean { return this._dimensionStyleOverrides.suppressFirstDimensionLine; }
	public set dimensionSuppressFirstDimensionLine(v: boolean) { this._dimensionStyleOverrides.suppressFirstDimensionLine = v; }

	public get dimensionSuppressFirstExtensionLine(): boolean { return this._dimensionStyleOverrides.suppressFirstExtensionLine; }
	public set dimensionSuppressFirstExtensionLine(v: boolean) { this._dimensionStyleOverrides.suppressFirstExtensionLine = v; }

	public get dimensionSuppressOutsideExtensions(): boolean { return this._dimensionStyleOverrides.suppressOutsideExtensions; }
	public set dimensionSuppressOutsideExtensions(v: boolean) { this._dimensionStyleOverrides.suppressOutsideExtensions = v; }

	public get dimensionSuppressSecondDimensionLine(): boolean { return this._dimensionStyleOverrides.suppressSecondDimensionLine; }
	public set dimensionSuppressSecondDimensionLine(v: boolean) { this._dimensionStyleOverrides.suppressSecondDimensionLine = v; }

	public get dimensionSuppressSecondExtensionLine(): boolean { return this._dimensionStyleOverrides.suppressSecondExtensionLine; }
	public set dimensionSuppressSecondExtensionLine(v: boolean) { this._dimensionStyleOverrides.suppressSecondExtensionLine = v; }

	public dimensionTex1: string = 'ByBlock';
	public dimensionTex2: string = 'ByBlock';

	public get dimensionTextBackgroundColor(): Color { return this._dimensionStyleOverrides.textBackgroundColor; }
	public set dimensionTextBackgroundColor(v: Color) { this._dimensionStyleOverrides.textBackgroundColor = v; }

	public get dimensionTextBackgroundFillMode(): DimensionTextBackgroundFillMode { return this._dimensionStyleOverrides.textBackgroundFillMode; }
	public set dimensionTextBackgroundFillMode(v: DimensionTextBackgroundFillMode) { this._dimensionStyleOverrides.textBackgroundFillMode = v; }

	public get dimensionTextColor(): Color { return this._dimensionStyleOverrides.textColor; }
	public set dimensionTextColor(v: Color) { this._dimensionStyleOverrides.textColor = v; }

	public get dimensionTextDirection(): TextDirection { return this._dimensionStyleOverrides.textDirection; }
	public set dimensionTextDirection(v: TextDirection) { this._dimensionStyleOverrides.textDirection = v; }

	public get dimensionTextHeight(): number { return this._dimensionStyleOverrides.textHeight; }
	public set dimensionTextHeight(v: number) { this._dimensionStyleOverrides.textHeight = v; }

	public get dimensionTextHorizontalAlignment(): DimensionTextHorizontalAlignment { return this._dimensionStyleOverrides.textHorizontalAlignment; }
	public set dimensionTextHorizontalAlignment(v: DimensionTextHorizontalAlignment) { this._dimensionStyleOverrides.textHorizontalAlignment = v; }

	public get dimensionTextInsideExtensions(): boolean { return this._dimensionStyleOverrides.textInsideExtensions; }
	public set dimensionTextInsideExtensions(v: boolean) { this._dimensionStyleOverrides.textInsideExtensions = v; }

	public get dimensionTextInsideHorizontal(): boolean { return this._dimensionStyleOverrides.textInsideHorizontal; }
	public set dimensionTextInsideHorizontal(v: boolean) { this._dimensionStyleOverrides.textInsideHorizontal = v; }

	public get dimensionTextMovement(): TextMovement { return this._dimensionStyleOverrides.textMovement; }
	public set dimensionTextMovement(v: TextMovement) { this._dimensionStyleOverrides.textMovement = v; }

	public get dimensionTextOutsideExtensions(): boolean { return this._dimensionStyleOverrides.textOutsideExtensions; }
	public set dimensionTextOutsideExtensions(v: boolean) { this._dimensionStyleOverrides.textOutsideExtensions = v; }

	public get dimensionTextOutsideHorizontal(): boolean { return this._dimensionStyleOverrides.textOutsideHorizontal; }
	public set dimensionTextOutsideHorizontal(v: boolean) { this._dimensionStyleOverrides.textOutsideHorizontal = v; }

	public get dimensionTextStyle(): TextStyle {
		if (this.document == null) {
			return this._dimensionTextStyle;
		} else {
			return this.document.textStyles.get(this.dimensionTextStyleName);
		}
	}

	public get dimensionTextStyleName(): string {
		return this._dimensionTextStyle.name;
	}
	public set dimensionTextStyleName(value: string) {
		if (this.document != null) {
			this._dimensionTextStyle = this.document.textStyles.get(value);
		} else {
			this._dimensionTextStyle = new TextStyle(value);
		}
	}

	public get dimensionTextVerticalAlignment(): DimensionTextVerticalAlignment { return this._dimensionStyleOverrides.textVerticalAlignment; }
	public set dimensionTextVerticalAlignment(v: DimensionTextVerticalAlignment) { this._dimensionStyleOverrides.textVerticalAlignment = v; }

	public get dimensionTextVerticalPosition(): number { return this._dimensionStyleOverrides.textVerticalPosition; }
	public set dimensionTextVerticalPosition(v: number) { this._dimensionStyleOverrides.textVerticalPosition = v; }

	public get dimensionTickSize(): number { return this._dimensionStyleOverrides.tickSize; }
	public set dimensionTickSize(v: number) { this._dimensionStyleOverrides.tickSize = v; }

	public get dimensionToleranceAlignment(): ToleranceAlignment { return this._dimensionStyleOverrides.toleranceAlignment; }
	public set dimensionToleranceAlignment(v: ToleranceAlignment) { this._dimensionStyleOverrides.toleranceAlignment = v; }

	public get dimensionToleranceDecimalPlaces(): number { return this._dimensionStyleOverrides.toleranceDecimalPlaces; }
	public set dimensionToleranceDecimalPlaces(v: number) { this._dimensionStyleOverrides.toleranceDecimalPlaces = v; }

	public get dimensionToleranceScaleFactor(): number { return this._dimensionStyleOverrides.toleranceScaleFactor; }
	public set dimensionToleranceScaleFactor(v: number) { this._dimensionStyleOverrides.toleranceScaleFactor = v; }

	public get dimensionToleranceZeroHandling(): ZeroHandling { return this._dimensionStyleOverrides.toleranceZeroHandling; }
	public set dimensionToleranceZeroHandling(v: ZeroHandling) { this._dimensionStyleOverrides.toleranceZeroHandling = v; }

	public get dimensionUnit(): number { return this._dimensionStyleOverrides.dimensionUnit; }
	public set dimensionUnit(v: number) { this._dimensionStyleOverrides.dimensionUnit = v; }

	public get dimensionZeroHandling(): ZeroHandling { return this._dimensionStyleOverrides.zeroHandling; }
	public set dimensionZeroHandling(v: ZeroHandling) { this._dimensionStyleOverrides.zeroHandling = v; }

	public get dimensionstyleOverrides(): DimensionStyle { return this._dimensionStyleOverrides; }

	public displayLightGlyphs: string = '';
	public displayLineWeight: boolean = false;
	public displaySilhouetteCurves: boolean = false;

	public document: any /* CadDocument */ = null;
	public get Document(): any {
		return this.document;
	}
	public set Document(value: any) {
		this.document = value;
	}

	public draftAngleFirstCrossSection: number = 0;
	public draftAngleSecondCrossSection: number = 0;
	public draftMagnitudeFirstCrossSection: number = 0;
	public draftMagnitudeSecondCrossSection: number = 0;
	public dw3DPrecision: number = 0;
	public dwgUnderlayFramesVisibility: string = '';

	public get elevation(): number { return this.modelSpaceUcs.elevation; }
	public set elevation(v: number) { this.modelSpaceUcs.elevation = v; }

	public endCaps: number = 0;
	public entitySortingFlags: ObjectSortingFlags = ObjectSortingFlags.Disabled;
	public extendedNames: boolean = true;

	public get extensionLineWeight(): LineWeightType { return this._dimensionStyleOverrides.extensionLineWeight; }
	public set extensionLineWeight(v: LineWeightType) { this._dimensionStyleOverrides.extensionLineWeight = v; }

	public externalReferenceClippingBoundaryType: XClipFrameType = XClipFrameType.DisplayNotPlot;

	public get facetResolution(): number { return this._facetResolution; }
	public set facetResolution(value: number) {
		if (value < 0.01 || value > 10) {
			throw new Error('FACETRES valid values are from 0.01 to 10.0');
		}
		this._facetResolution = value;
	}

	public filletRadius: number = 0.0;
	public fillMode: boolean = true;
	public fingerPrintGuid: string = crypto.randomUUID?.() ?? '';
	public haloGapPercentage: number = 0;
	public handleSeed: number = 0x01;
	public get HandleSeed(): number {
		return this.handleSeed;
	}
	public set HandleSeed(value: number) {
		this.handleSeed = value;
	}
	public hideText: number = 0;
	public hyperLinkBase: string | null = null;
	public indexCreationFlags: IndexCreationFlags = IndexCreationFlags.NoIndex;
	public insUnits: UnitsType = UnitsType.Unitless;
	public interfereColor: Color = new Color(1);
	public intersectionDisplay: number = 0;
	public joinStyle: number = 0;
	public lastSavedBy: string = 'ACadSharp';
	public latitude: number = 37.7950;
	public lensLength: number = 0;
	public limitCheckingOn: boolean = false;
	public linearUnitFormat: LinearUnitFormat = LinearUnitFormat.Decimal;

	public get linearUnitPrecision(): number { return this._linearUnitPrecision; }
	public set linearUnitPrecision(value: number) {
		if (value < 0 || value > 8) {
			throw new Error('LUPREC valid values are from 0 to 8');
		}
		this._linearUnitPrecision = value;
	}

	public lineTypeScale: number = 1.0;
	public loadOLEObject: boolean = false;
	public loftedObjectNormals: string = '';
	public longitude: number = -122.394;
	public maintenanceVersion: number = 0;
	public maxViewportCount: number = 64;
	public measurementUnits: MeasurementUnits = MeasurementUnits.Metric;
	public menuFileName: string = '.';
	public mirrorText: boolean = false;
	public modelSpaceExtMax: XYZ = new XYZ(0, 0, 0);
	public modelSpaceExtMin: XYZ = new XYZ(0, 0, 0);
	public modelSpaceInsertionBase: XYZ = new XYZ(0, 0, 0);
	public modelSpaceLimitsMax: XY = new XY(0, 0);
	public modelSpaceLimitsMin: XY = new XY(0, 0);

	public get modelSpaceOrigin(): XYZ { return this.modelSpaceUcs.origin; }
	public set modelSpaceOrigin(v: XYZ) { this.modelSpaceUcs.origin = v; }

	public modelSpaceOrthographicBackDOrigin: XYZ = new XYZ(0, 0, 0);
	public modelSpaceOrthographicBottomDOrigin: XYZ = new XYZ(0, 0, 0);
	public modelSpaceOrthographicFrontDOrigin: XYZ = new XYZ(0, 0, 0);
	public modelSpaceOrthographicLeftDOrigin: XYZ = new XYZ(0, 0, 0);
	public modelSpaceOrthographicRightDOrigin: XYZ = new XYZ(0, 0, 0);
	public modelSpaceOrthographicTopDOrigin: XYZ = new XYZ(0, 0, 0);

	public modelSpaceUcs: UCS = new UCS();
	public modelSpaceUcsBase: UCS = new UCS();

	public get modelSpaceXAxis(): XYZ { return this.modelSpaceUcs.xAxis; }
	public set modelSpaceXAxis(v: XYZ) { this.modelSpaceUcs.xAxis = v; }

	public get modelSpaceYAxis(): XYZ { return this.modelSpaceUcs.yAxis; }
	public set modelSpaceYAxis(v: XYZ) { this.modelSpaceUcs.yAxis = v; }

	public northDirection: number = 0;
	public numberOfSplineSegments: number = 8;
	public objectSnapMode: ObjectSnapMode = 4133 as ObjectSnapMode;
	public obscuredColor: Color = new Color(0);
	public obscuredType: number = 0;
	public orthoMode: boolean = false;

	public get paperSpaceBaseName(): string { return this.paperSpaceUcsBase.name; }
	public set paperSpaceBaseName(v: string) { this.paperSpaceUcsBase.name = v; }

	public get paperSpaceElevation(): number { return this.paperSpaceUcs.elevation; }
	public set paperSpaceElevation(v: number) { this.paperSpaceUcs.elevation = v; }

	public paperSpaceExtMax: XYZ = new XYZ(0, 0, 0);
	public paperSpaceExtMin: XYZ = new XYZ(0, 0, 0);
	public paperSpaceInsertionBase: XYZ = new XYZ(0, 0, 0);
	public paperSpaceLimitsChecking: boolean = false;
	public paperSpaceLimitsMax: XY = new XY(0, 0);
	public paperSpaceLimitsMin: XY = new XY(0, 0);
	public paperSpaceLineTypeScaling: SpaceLineTypeScaling = SpaceLineTypeScaling.Normal;

	public get paperSpaceName(): string { return this.paperSpaceUcs.name; }
	public set paperSpaceName(v: string) { this.paperSpaceUcs.name = v; }

	public paperSpaceOrthographicBackDOrigin: XYZ = new XYZ(0, 0, 0);
	public paperSpaceOrthographicBottomDOrigin: XYZ = new XYZ(0, 0, 0);
	public paperSpaceOrthographicFrontDOrigin: XYZ = new XYZ(0, 0, 0);
	public paperSpaceOrthographicLeftDOrigin: XYZ = new XYZ(0, 0, 0);
	public paperSpaceOrthographicRightDOrigin: XYZ = new XYZ(0, 0, 0);
	public paperSpaceOrthographicTopDOrigin: XYZ = new XYZ(0, 0, 0);

	public paperSpaceUcs: UCS = new UCS();
	public paperSpaceUcsBase: UCS = new UCS();

	public get paperSpaceXAxis(): XYZ { return this.paperSpaceUcs.xAxis; }
	public set paperSpaceXAxis(v: XYZ) { this.paperSpaceUcs.xAxis = v; }

	public get paperSpaceYAxis(): XYZ { return this.paperSpaceUcs.yAxis; }
	public set paperSpaceYAxis(v: XYZ) { this.paperSpaceUcs.yAxis = v; }

	public peditType: number = 0;
	public pickStyle: number = 1;
	public pointDisplayMode: number = 0;
	public pointDisplaySize: number = 0.0;
	public proxyGraphics: boolean = true;
	public regenMode: boolean = true;

	public get shadeEdge(): number { return this._shadeEdge; }
	public set shadeEdge(v: number) { this._shadeEdge = v; }

	public shadeDiffuse: number = 70;
	public showModelSpaceInPaperSpace: boolean = false;
	public sketchIncrement: number = 0.1;
	public sketchPolylineType: SplineType = SplineType.None;
	public solidVisualStyleObjectType: number = 0;
	public splineDegreeCurves: number = 3;
	public stackedTextAlignment: number = 1;
	public stackedTextSizePercentage: number = 70;

	public get stepsPerSecond(): number { return this._stepsPerSecond; }
	public set stepsPerSecond(v: number) { this._stepsPerSecond = v; }

	public get surfaceIsolineCount(): number { return this._surfaceIsolineCount; }
	public set surfaceIsolineCount(v: number) { this._surfaceIsolineCount = v; }

	public surfaceDensityM: number = 6;
	public surfaceDensityN: number = 6;
	public surfaceType: number = 6;
	public surfaceTabulation1: number = 6;
	public surfaceTabulation2: number = 6;

	public get textQuality(): number { return this._textQuality; }
	public set textQuality(v: number) { this._textQuality = v; }

	public textSize: number = 2.5;
	public thickness: number = 0.0;
	public tileModeEnabled: boolean = true;
	public timeZone: number = 0;
	public totalEditingTime: number = 0; // TimeSpan as milliseconds
	public traceWidthDefault: number = 0;

	public get ucsBaseName(): string { return this.modelSpaceUcsBase.name; }
	public set ucsBaseName(v: string) { this.modelSpaceUcsBase.name = v; }

	public get ucsName(): string { return this.modelSpaceUcs.name; }
	public set ucsName(v: string) { this.modelSpaceUcs.name = v; }

	public unitMode: number = 0;
	public universalCreateDateTime: Date = new Date();
	public universalUpdateDateTime: Date = new Date();
	public updateDateTime: Date = new Date();
	public updateDimensionsWhileDragging: boolean = true;
	public userDouble1: number = 0;
	public userDouble2: number = 0;
	public userDouble3: number = 0;
	public userDouble4: number = 0;
	public userDouble5: number = 0;
	public userElapsedTimeSpan: number = 0;
	public userShort1: number = 0;
	public userShort2: number = 0;
	public userShort3: number = 0;
	public userShort4: number = 0;
	public userShort5: number = 0;
	public userTimer: boolean = false;

	public get version(): ACadVersion {
		return this._version;
	}
	public set version(value: ACadVersion) {
		this._version = value;
		switch (value) {
			case ACadVersion.AC1015: this.maintenanceVersion = 20; break;
			case ACadVersion.AC1018: this.maintenanceVersion = 104; break;
			case ACadVersion.AC1021: this.maintenanceVersion = 50; break;
			case ACadVersion.AC1024: this.maintenanceVersion = 226; break;
			case ACadVersion.AC1027: this.maintenanceVersion = 125; break;
			case ACadVersion.AC1032: this.maintenanceVersion = 228; break;
			default: this.maintenanceVersion = 0; break;
		}
	}
	public get Version(): ACadVersion {
		return this.version;
	}
	public set Version(value: ACadVersion) {
		this.version = value;
	}

	public versionGuid: string = crypto.randomUUID?.() ?? '';

	public get versionString(): string {
		return CadUtils.getNameFromVersion(this.version);
	}
	public set versionString(value: string) {
		this.version = CadUtils.getVersionFromName(value);
	}
	public get VersionString(): string {
		return this.versionString;
	}
	public set VersionString(value: string) {
		this.versionString = value;
	}

	public viewportDefaultViewScaleFactor: number = 0;
	public worldView: boolean = true;
	public xEdit: boolean = false;

	// --- Private fields ---

	private _angularUnitPrecision: number = 0;
	private _currentLayer: Layer = Layer.Default;
	private _currentLineType: LineType = LineType.ByLayer;
	private _currentTextStyle: TextStyle = TextStyle.Default;
	private _dimensionStyleOverrides: DimensionStyle = new DimensionStyle('override');
	private _currentDimensionStyle: DimensionStyle = DimensionStyle.Default;
	private _dimensionTextStyle: TextStyle = TextStyle.Default;
	private _facetResolution: number = 0.5;
	private _linearUnitPrecision: number = 4;
	private _stepsPerSecond: number = 2.0;
	private _surfaceIsolineCount: number = 4;
	private _textQuality: number = 50;
	private _version: ACadVersion = ACadVersion.AC1032;
	private _shadeEdge: number = 0;

	public constructor(versionOrDocument?: ACadVersion | any) {
		if (typeof versionOrDocument === 'number') {
			this.version = versionOrDocument;
		} else if (versionOrDocument && typeof versionOrDocument === 'object') {
			this.version = ACadVersion.AC1032;
			this.document = versionOrDocument;
		} else {
			this.version = ACadVersion.AC1032;
		}
	}

	requiredVersions: number = 0;
	DIMSAV: number = 0;
	polylineLineTypeGeneration: boolean = false;
	regenerationMode: number = 0;
	quickTextMode: boolean = false;
	showSplineControlPoints: boolean = false;
	showModelSpace: boolean = false;
	retainXRefDependentVisibilitySettings: boolean = false;
	spatialIndexMaxTreeDepth: number = 0;
	splineType: number = 0;
	shadeDiffuseToAmbientPercentage: number = 70;
	textHeightDefault: number = 0.2;
	thicknessDefault: number = 0;
	polylineWidthDefault: number = 0;
	dimensionAltMzf: number = 0;
	dimensionAltMzs: string = "";
	dimensionMzs: string = "";
	styleSheetName: string = "";
	plotStyleMode: number = 0;
	projectName: string = "";
	stepSize: number = 0;
	solidsRetainHistory: boolean = false;
	showSolidsHistory: boolean = false;
	sweptSolidWidth: number = 0;
	sweptSolidHeight: number = 0;
	solidLoftedShape: number = 0;
	shadowMode: number = 0;
	shadowPlaneLocation: number = 0;
	dimensionMzf: number = 0;

	public GetValue(systemvar: string): any {
		return CadHeader.GetHeaderMap().get(systemvar)?.getValue(this);
	}

	public GetValues(systemvar: string): Map<number, any> {
		const values = new Map<number, any>();
		const metadata = CadHeader.GetHeaderMap().get(systemvar);
		if (!metadata) {
			return values;
		}

		for (const code of metadata.DxfCodes) {
			const value = metadata.getSystemValue(code, this);
			if (value !== null && value !== undefined) {
				values.set(code, value);
			}
		}

		return values;
	}

	static GetHeaderMap(): Map<string, CadSystemVariable> {
		if (!CadHeader._headerMapCache) {
			CadHeader._headerMapCache = new Map<string, CadSystemVariable>();
			for (const metadata of getSystemVariableMetadataMap(CadHeader).values()) {
				CadHeader._headerMapCache.set(metadata.name, new CadSystemVariable(metadata));
			}
		}

		return new Map(CadHeader._headerMapCache);
	}

	SetValue(variable: any, parameters: any[]): void {
		const property = CadHeader.GetHeaderMap().get(String(variable));
		if (!property) {
			return;
		}

		const values = Array.isArray(parameters) ? parameters : [parameters];
		if (values.length === 0) {
			return;
		}

		if (property.isName && typeof values[0] === 'string' && values[0].length === 0) {
			return;
		}

		property.applyValues(this, values);
	}

	public toString(): string {
		return `${this.version}`;
	}
}

export { SpaceLineTypeScaling } from './SpaceLineTypeScaling.js';

export { EntityPlotStyleType } from './EntityPlotStyleType.js';
