import { ACadVersion } from '../../../ACadVersion.js';
import { Color } from '../../../Color.js';
import { CadHeader } from '../../../Header/CadHeader.js';
import { AngularDirection } from '../../../Types/Units/AngularDirection.js';
import { AttributeVisibilityMode } from '../../../Header/AttributeVisibilityMode.js';
import { ObjectSnapMode } from '../../../Header/ObjectSnapMode.js';
import { SpaceLineTypeScaling } from '../../../Header/SpaceLineTypeScaling.js';
import { EntityPlotStyleType } from '../../../Header/EntityPlotStyleType.js';
import { ObjectSortingFlags } from '../../../Header/ObjectSortingFlags.js';
import { IndexCreationFlags } from '../../../Header/IndexCreationFlags.js';
import { DimensionAssociation } from '../../../Header/DimensionAssociation.js';
import { ShadowMode } from '../../../Header/ShadowMode.js';
import { XClipFrameType } from '../../../Header/XClipFrameType.js';
import { SplineType } from '../../../Header/SplineType.js';
import { ShadeEdgeType } from '../../../Header/ShadeEdgeType.js';
import { LinearUnitFormat } from '../../../Types/Units/LinearUnitFormat.js';
import { AngularUnitFormat } from '../../../Types/Units/AngularUnitFormat.js';
import { UnitsType } from '../../../Types/Units/UnitsType.js';
import { LineWeightType } from '../../../Types/LineWeightType.js';
import { NotificationType } from '../../NotificationEventHandler.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { DwgHeaderHandlesCollection } from '../DwgHeaderHandlesCollection.js';
import { IDwgStreamReader } from './IDwgStreamReader.js';
import { DwgStreamReaderBase } from './DwgStreamReaderBase.js';
import { DwgMergedReader } from './DwgMergedReader.js';

export class DwgHeaderReader extends DwgSectionIO {
	override get sectionName(): string {
		return DwgSectionDefinition.header;
	}

	private _reader: IDwgStreamReader;
	private _header: CadHeader;

	constructor(version: ACadVersion, reader: IDwgStreamReader, header: CadHeader) {
		super(version);
		this._reader = reader;
		this._header = header;
		this._header.version = version;
	}

	public read(acadMaintenanceVersion: number): { objectPointers: DwgHeaderHandlesCollection } {
		const mainreader = this._reader;
		const objectPointers = new DwgHeaderHandlesCollection();

		this.checkSentinel(this._reader, DwgSectionDefinition.startSentinels.get(this.sectionName)!);

		const size: number = this._reader.readRawLong();

		if (this.r2010Plus && acadMaintenanceVersion > 3 || this.r2018Plus) {
			const unknown: number = this._reader.readRawLong();
		}

		const initialPos: number = this._reader.positionInBits();

		if (this.r2007Plus) {
			const sizeInBits: number = this._reader.readRawLong();
			const lastPositionInBits: number = initialPos + sizeInBits - 1;

			const textReader: IDwgStreamReader = DwgStreamReaderBase.getStreamHandler(
				this._version, new Uint8Array(this._reader.stream));
			textReader.setPositionByFlag(lastPositionInBits);

			const referenceReader: IDwgStreamReader = DwgStreamReaderBase.getStreamHandler(
				this._version, new Uint8Array(this._reader.stream));
			referenceReader.setPositionInBits(lastPositionInBits + 1);

			this._reader = new DwgMergedReader(this._reader, textReader, referenceReader);
		}

		if (this.r2013Plus) {
			this._header.requiredVersions = this._reader.readBitLongLong();
		}

		// Common: Unknown values
		this._reader.readBitDouble();
		this._reader.readBitDouble();
		this._reader.readBitDouble();
		this._reader.readBitDouble();
		this._reader.readVariableText();
		this._reader.readVariableText();
		this._reader.readVariableText();
		this._reader.readVariableText();
		this._reader.readBitLong();
		this._reader.readBitLong();

		if (this.r13_14Only) {
			this._reader.readBitShort();
		}

		if (this.r2004Pre) {
			this._reader.handleReference();
		}

		// Common
		this._header.associatedDimensions = this._reader.readBit();
		this._header.updateDimensionsWhileDragging = this._reader.readBit();

		if (this.r13_14Only) {
			this._header.dimsav = this._reader.readBit() ? 1 : 0;
		}

		this._header.polylineLineTypeGeneration = this._reader.readBit();
		this._header.orthoMode = this._reader.readBit();
		this._header.regenerationMode = this._reader.readBit() ? 1 : 0;
		this._header.fillMode = this._reader.readBit();
		this._header.quickTextMode = this._reader.readBit();
		this._header.paperSpaceLineTypeScaling = this._reader.readBit() ? SpaceLineTypeScaling.Normal : SpaceLineTypeScaling.Viewport;
		this._header.limitCheckingOn = this._reader.readBit();

		if (this.r13_14Only) {
			this._header.blipMode = this._reader.readBit();
		}

		if (this.r2004Plus) {
			this._reader.readBit();
		}

		this._header.userTimer = this._reader.readBit();
		this._header.sketchPolylineType = (this._reader.readBit() ? 1 : 0) as SplineType;
		this._header.angularDirection = this._reader.readBitAsShort() as AngularDirection;
		this._header.showSplineControlPoints = this._reader.readBit();

		if (this.r13_14Only) {
			this._reader.readBit();
			this._reader.readBit();
		}

		this._header.mirrorText = this._reader.readBit();
		this._header.worldView = this._reader.readBit();

		if (this.r13_14Only) {
			this._reader.readBit();
		}

		this._header.showModelSpace = this._reader.readBit();
		this._header.paperSpaceLimitsChecking = this._reader.readBit();
		this._header.retainXRefDependentVisibilitySettings = this._reader.readBit();

		if (this.r13_14Only) {
			this._reader.readBit();
		}

		this._header.displaySilhouetteCurves = this._reader.readBit();
		this._header.createEllipseAsPolyline = this._reader.readBit();
		this._header.proxyGraphics = this._reader.readBitShortAsBool();

		if (this.r13_14Only) {
			this._reader.readBitShort();
		}

		this._header.spatialIndexMaxTreeDepth = this._reader.readBitShort();
		this._header.linearUnitFormat = this._reader.readBitShort() as LinearUnitFormat;
		const linearUnitPrecision = this._reader.readBitShort();
		if (linearUnitPrecision >= 0 && linearUnitPrecision <= 8) {
			this._header.linearUnitPrecision = linearUnitPrecision;
		}
		this._header.angularUnit = this._reader.readBitShort() as AngularUnitFormat;
		const angularUnitPrecision = this._reader.readBitShort();
		if (angularUnitPrecision >= 0 && angularUnitPrecision <= 8) {
			this._header.angularUnitPrecision = angularUnitPrecision;
		}

		if (this.r13_14Only) {
			this._header.objectSnapMode = this._reader.readBitShort() as ObjectSnapMode;
		}

		this._header.attributeVisibility = this._reader.readBitShort() as AttributeVisibilityMode;

		if (this.r13_14Only) {
			this._reader.readBitShort();
		}

		this._header.pointDisplayMode = this._reader.readBitShort();

		if (this.r13_14Only) {
			this._reader.readBitShort();
		}

		if (this.r2004Plus) {
			this._reader.readBitLong();
			this._reader.readBitLong();
			this._reader.readBitLong();
		}

		this._header.userShort1 = this._reader.readBitShort();
		this._header.userShort2 = this._reader.readBitShort();
		this._header.userShort3 = this._reader.readBitShort();
		this._header.userShort4 = this._reader.readBitShort();
		this._header.userShort5 = this._reader.readBitShort();

		this._header.numberOfSplineSegments = this._reader.readBitShort();
		this._header.surfaceDensityM = this._reader.readBitShort();
		this._header.surfaceDensityM = this._reader.readBitShort();
		this._header.surfaceType = this._reader.readBitShort();
		this._header.surfaceTabulation1 = this._reader.readBitShort();
		this._header.surfaceTabulation2 = this._reader.readBitShort();
		this._header.splineType = this._reader.readBitShort() as SplineType;
		this._header.shadeEdge = this._reader.readBitShort() as ShadeEdgeType;
		this._header.shadeDiffuseToAmbientPercentage = this._reader.readBitShort();
		this._header.unitMode = this._reader.readBitShort();
		this._header.maxViewportCount = this._reader.readBitShort();
		const surfaceIsoLineCount = this._reader.readBitShort();
		if (surfaceIsoLineCount >= 0 && surfaceIsoLineCount <= 2047) {
			this._header.surfaceIsolineCount = surfaceIsoLineCount;
		}
		this._header.currentMultiLineJustification = this._reader.readBitShort();
		const textQuality = this._reader.readBitShort();
		if (textQuality >= 0 && textQuality <= 100) {
			this._header.textQuality = textQuality;
		}
		this._header.lineTypeScale = this._reader.readBitDouble();
		this._header.textHeightDefault = this._reader.readBitDouble();
		this._header.traceWidthDefault = this._reader.readBitDouble();
		this._header.sketchIncrement = this._reader.readBitDouble();
		this._header.filletRadius = this._reader.readBitDouble();
		this._header.thicknessDefault = this._reader.readBitDouble();
		this._header.angleBase = this._reader.readBitDouble();
		this._header.pointDisplaySize = this._reader.readBitDouble();
		this._header.polylineWidthDefault = this._reader.readBitDouble();
		this._header.userDouble1 = this._reader.readBitDouble();
		this._header.userDouble2 = this._reader.readBitDouble();
		this._header.userDouble3 = this._reader.readBitDouble();
		this._header.userDouble4 = this._reader.readBitDouble();
		this._header.userDouble5 = this._reader.readBitDouble();
		this._header.chamferDistance1 = this._reader.readBitDouble();
		this._header.chamferDistance2 = this._reader.readBitDouble();
		this._header.chamferLength = this._reader.readBitDouble();
		this._header.chamferAngle = this._reader.readBitDouble();
		const facetResolution = this._reader.readBitDouble();
		if (facetResolution > 0 && facetResolution <= 10) {
			this._header.facetResolution = facetResolution;
		}
		this._header.currentMultilineScale = this._reader.readBitDouble();
		this._header.currentEntityLinetypeScale = this._reader.readBitDouble();

		this._header.menuFileName = this._reader.readVariableText();

		this._header.createDateTime = this._reader.readDateTime();
		this._header.updateDateTime = this._reader.readDateTime();

		if (this.r2004Plus) {
			this._reader.readBitLong();
			this._reader.readBitLong();
			this._reader.readBitLong();
		}

		this._header.totalEditingTime = this._reader.readTimeSpan();
		this._header.userElapsedTimeSpan = this._reader.readTimeSpan();

		this._header.currentEntityColor = this._reader.readCmColor();

		this._header.handleSeed = mainreader.handleReference();

		objectPointers.clayer = this._reader.handleReference();
		objectPointers.textstyle = this._reader.handleReference();
		objectPointers.celtype = this._reader.handleReference();

		if (this.r2007Plus) {
			objectPointers.cmaterial = this._reader.handleReference();
		}

		objectPointers.dimstyle = this._reader.handleReference();
		objectPointers.cmlstyle = this._reader.handleReference();

		if (this.r2000Plus) {
			this._header.viewportDefaultViewScaleFactor = this._reader.readBitDouble();
		}

		this._header.paperSpaceInsertionBase = this._reader.read3BitDouble();
		this._header.paperSpaceExtMin = this._reader.read3BitDouble();
		this._header.paperSpaceExtMax = this._reader.read3BitDouble();
		this._header.paperSpaceLimitsMin = this._reader.read2RawDouble();
		this._header.paperSpaceLimitsMax = this._reader.read2RawDouble();
		this._header.paperSpaceElevation = this._reader.readBitDouble();
		this._header.paperSpaceUcs.origin = this._reader.read3BitDouble();
		this._header.paperSpaceXAxis = this._reader.read3BitDouble();
		this._header.paperSpaceYAxis = this._reader.read3BitDouble();

		objectPointers.ucsname_pspace = this._reader.handleReference();

		if (this.r2000Plus) {
			objectPointers.pucsorthoref = this._reader.handleReference();
			this._reader.readBitShort(); // PUCSORTHOVIEW
			objectPointers.pucsbase = this._reader.handleReference();

			this._header.paperSpaceOrthographicTopDOrigin = this._reader.read3BitDouble();
			this._header.paperSpaceOrthographicBottomDOrigin = this._reader.read3BitDouble();
			this._header.paperSpaceOrthographicLeftDOrigin = this._reader.read3BitDouble();
			this._header.paperSpaceOrthographicRightDOrigin = this._reader.read3BitDouble();
			this._header.paperSpaceOrthographicFrontDOrigin = this._reader.read3BitDouble();
			this._header.paperSpaceOrthographicBackDOrigin = this._reader.read3BitDouble();
		}

		this._header.modelSpaceInsertionBase = this._reader.read3BitDouble();
		this._header.modelSpaceExtMin = this._reader.read3BitDouble();
		this._header.modelSpaceExtMax = this._reader.read3BitDouble();
		this._header.modelSpaceLimitsMin = this._reader.read2RawDouble();
		this._header.modelSpaceLimitsMax = this._reader.read2RawDouble();
		this._header.elevation = this._reader.readBitDouble();
		this._header.modelSpaceOrigin = this._reader.read3BitDouble();
		this._header.modelSpaceXAxis = this._reader.read3BitDouble();
		this._header.modelSpaceYAxis = this._reader.read3BitDouble();

		objectPointers.ucsname_mspace = this._reader.handleReference();

		if (this.r2000Plus) {
			objectPointers.ucsorthoref = this._reader.handleReference();
			this._reader.readBitShort(); // UCSORTHOVIEW
			objectPointers.ucsbase = this._reader.handleReference();

			this._header.modelSpaceOrthographicTopDOrigin = this._reader.read3BitDouble();
			this._header.modelSpaceOrthographicBottomDOrigin = this._reader.read3BitDouble();
			this._header.modelSpaceOrthographicLeftDOrigin = this._reader.read3BitDouble();
			this._header.modelSpaceOrthographicRightDOrigin = this._reader.read3BitDouble();
			this._header.modelSpaceOrthographicFrontDOrigin = this._reader.read3BitDouble();
			this._header.modelSpaceOrthographicBackDOrigin = this._reader.read3BitDouble();

			this._header.dimensionPostFix = this._reader.readVariableText();
			this._header.dimensionAlternateDimensioningSuffix = this._reader.readVariableText();
		}

		if (this.r13_14Only) {
			this._header.dimensionGenerateTolerances = this._reader.readBit();
			this._header.dimensionLimitsGeneration = this._reader.readBit();
			this._header.dimensionTextInsideHorizontal = this._reader.readBit();
			this._header.dimensionTextOutsideHorizontal = this._reader.readBit();
			this._header.dimensionSuppressFirstExtensionLine = this._reader.readBit();
			this._header.dimensionSuppressSecondExtensionLine = this._reader.readBit();
			this._header.dimensionAlternateUnitDimensioning = this._reader.readBit();
			this._header.dimensionTextOutsideExtensions = this._reader.readBit();
			this._header.dimensionSeparateArrowBlocks = this._reader.readBit();
			this._header.dimensionTextInsideExtensions = this._reader.readBit();
			this._header.dimensionSuppressOutsideExtensions = this._reader.readBit();
			this._header.dimensionAlternateUnitDecimalPlaces = this._reader.readRawChar();
			this._header.dimensionZeroHandling = this._reader.readRawChar();
			this._header.dimensionSuppressFirstDimensionLine = this._reader.readBit();
			this._header.dimensionSuppressSecondDimensionLine = this._reader.readBit();
			this._header.dimensionToleranceAlignment = this._reader.readRawChar();
			this._header.dimensionTextHorizontalAlignment = this._reader.readRawChar();
			this._header.dimensionFit = this._reader.readRawChar();
			this._header.dimensionCursorUpdate = this._reader.readBit();
			this._header.dimensionToleranceZeroHandling = this._reader.readRawChar();
			this._header.dimensionAlternateUnitZeroHandling = this._reader.readRawChar();
			this._header.dimensionAlternateUnitToleranceZeroHandling = this._reader.readRawChar();
			this._header.dimensionTextVerticalAlignment = this._reader.readRawChar();
			this._header.dimensionUnit = this._reader.readBitShort();
			this._header.dimensionAngularDimensionDecimalPlaces = this._reader.readBitShort();
			this._header.dimensionDecimalPlaces = this._reader.readBitShort();
			this._header.dimensionToleranceDecimalPlaces = this._reader.readBitShort();
			this._header.dimensionAlternateUnitFormat = this._reader.readBitShort() as LinearUnitFormat;
			this._header.dimensionAlternateUnitToleranceDecimalPlaces = this._reader.readBitShort();
			objectPointers.dimtxsty = this._reader.handleReference();
		}

		// Common dimension variables
		this._header.dimensionScaleFactor = this._reader.readBitDouble();
		this._header.dimensionArrowSize = this._reader.readBitDouble();
		this._header.dimensionExtensionLineOffset = this._reader.readBitDouble();
		this._header.dimensionLineIncrement = this._reader.readBitDouble();
		this._header.dimensionExtensionLineExtension = this._reader.readBitDouble();
		this._header.dimensionRounding = this._reader.readBitDouble();
		this._header.dimensionLineExtension = this._reader.readBitDouble();
		this._header.dimensionPlusTolerance = this._reader.readBitDouble();
		this._header.dimensionMinusTolerance = this._reader.readBitDouble();

		if (this.r2007Plus) {
			this._header.dimensionFixedExtensionLineLength = this._reader.readBitDouble();
			const dimJogAngle = this._reader.readBitDouble();
			const rounded = Math.round(dimJogAngle * 1000000) / 1000000;
			const degToRad5 = 5 * Math.PI / 180;
			if (rounded > degToRad5 && rounded < Math.PI / 2) {
				this._header.dimensionJoggedRadiusDimensionTransverseSegmentAngle = dimJogAngle;
			}
			this._header.dimensionTextBackgroundFillMode = this._reader.readBitShort();
			this._header.dimensionTextBackgroundColor = this._reader.readCmColor();
		}

		if (this.r2000Plus) {
			this._header.dimensionGenerateTolerances = this._reader.readBit();
			this._header.dimensionLimitsGeneration = this._reader.readBit();
			this._header.dimensionTextInsideHorizontal = this._reader.readBit();
			this._header.dimensionTextOutsideHorizontal = this._reader.readBit();
			this._header.dimensionSuppressFirstExtensionLine = this._reader.readBit();
			this._header.dimensionSuppressSecondExtensionLine = this._reader.readBit();
			this._header.dimensionTextVerticalAlignment = this._reader.readBitShort();
			this._header.dimensionZeroHandling = this._reader.readBitShort();
			this._header.dimensionAngularZeroHandling = this._reader.readBitShort();
		}

		if (this.r2007Plus) {
			this._header.dimensionArcLengthSymbolPosition = this._reader.readBitShort();
		}

		this._header.dimensionTextHeight = this._reader.readBitDouble();
		this._header.dimensionCenterMarkSize = this._reader.readBitDouble();
		this._header.dimensionTickSize = this._reader.readBitDouble();
		this._header.dimensionAlternateUnitScaleFactor = this._reader.readBitDouble();
		this._header.dimensionLinearScaleFactor = this._reader.readBitDouble();
		this._header.dimensionTextVerticalPosition = this._reader.readBitDouble();
		this._header.dimensionToleranceScaleFactor = this._reader.readBitDouble();
		this._header.dimensionLineGap = this._reader.readBitDouble();

		if (this.r13_14Only) {
			this._header.dimensionPostFix = this._reader.readVariableText();
			this._header.dimensionAlternateDimensioningSuffix = this._reader.readVariableText();
			this._header.dimensionBlockName = this._reader.readVariableText();
			this._header.dimensionBlockNameFirst = this._reader.readVariableText();
			this._header.dimensionBlockNameSecond = this._reader.readVariableText();
		}

		if (this.r2000Plus) {
			this._header.dimensionAlternateUnitRounding = this._reader.readBitDouble();
			this._header.dimensionAlternateUnitDimensioning = this._reader.readBit();
			this._header.dimensionAlternateUnitDecimalPlaces = this._reader.readBitShort() & 0xFF;
			this._header.dimensionTextOutsideExtensions = this._reader.readBit();
			this._header.dimensionSeparateArrowBlocks = this._reader.readBit();
			this._header.dimensionTextInsideExtensions = this._reader.readBit();
			this._header.dimensionSuppressOutsideExtensions = this._reader.readBit();
		}

		this._header.dimensionLineColor = this._reader.readCmColor();
		this._header.dimensionExtensionLineColor = this._reader.readCmColor();
		this._header.dimensionTextColor = this._reader.readCmColor();

		if (this.r2000Plus) {
			this._header.dimensionAngularDimensionDecimalPlaces = this._reader.readBitShort();
			this._header.dimensionDecimalPlaces = this._reader.readBitShort();
			this._header.dimensionToleranceDecimalPlaces = this._reader.readBitShort();
			this._header.dimensionAlternateUnitFormat = this._reader.readBitShort() as LinearUnitFormat;
			this._header.dimensionAlternateUnitToleranceDecimalPlaces = this._reader.readBitShort();
			this._header.dimensionAngularUnit = this._reader.readBitShort() as AngularUnitFormat;
			this._header.dimensionFractionFormat = this._reader.readBitShort();
			this._header.dimensionLinearUnitFormat = this._reader.readBitShort() as LinearUnitFormat;
			this._header.dimensionDecimalSeparator = String.fromCharCode(this._reader.readBitShort());
			this._header.dimensionTextMovement = this._reader.readBitShort();
			this._header.dimensionTextHorizontalAlignment = this._reader.readBitShort() & 0xFF;
			this._header.dimensionSuppressFirstDimensionLine = this._reader.readBit();
			this._header.dimensionSuppressSecondDimensionLine = this._reader.readBit();
			this._header.dimensionToleranceAlignment = this._reader.readBitShort() & 0xFF;
			this._header.dimensionToleranceZeroHandling = this._reader.readBitShort() & 0xFF;
			this._header.dimensionAlternateUnitZeroHandling = this._reader.readBitShort() & 0xFF;
			this._header.dimensionAlternateUnitToleranceZeroHandling = this._reader.readBitShort() & 0xFF;
			this._header.dimensionCursorUpdate = this._reader.readBit();
			this._header.dimensionDimensionTextArrowFit = this._reader.readBitShort();
		}

		if (this.r2007Plus) {
			this._header.dimensionIsExtensionLineLengthFixed = this._reader.readBit();
		}

		if (this.r2010Plus) {
			this._header.dimensionTextDirection = this._reader.readBit() ? 1 : 0;
			this._header.dimensionAltMzf = this._reader.readBitDouble();
			this._header.dimensionAltMzs = this._reader.readVariableText();
			this._header.dimensionFit = this._reader.readBitDouble();
			this._header.dimensionMzs = this._reader.readVariableText();
		}

		if (this.r2000Plus) {
			objectPointers.dimtxsty = this._reader.handleReference();
			objectPointers.dimldrblk = this._reader.handleReference();
			objectPointers.dimblk = this._reader.handleReference();
			objectPointers.dimblk1 = this._reader.handleReference();
			objectPointers.dimblk2 = this._reader.handleReference();
		}

		if (this.r2007Plus) {
			objectPointers.dimltype = this._reader.handleReference();
			objectPointers.dimltex1 = this._reader.handleReference();
			objectPointers.dimltex2 = this._reader.handleReference();
		}

		if (this.r2000Plus) {
			this._header.dimensionLineWeight = this._reader.readBitShort() as LineWeightType;
			this._header.extensionLineWeight = this._reader.readBitShort() as LineWeightType;
		}

		// Table control object handles
		objectPointers.block_control_object = this._reader.handleReference();
		objectPointers.layer_control_object = this._reader.handleReference();
		objectPointers.style_control_object = this._reader.handleReference();
		objectPointers.linetype_control_object = this._reader.handleReference();
		objectPointers.view_control_object = this._reader.handleReference();
		objectPointers.ucs_control_object = this._reader.handleReference();
		objectPointers.vport_control_object = this._reader.handleReference();
		objectPointers.appid_control_object = this._reader.handleReference();
		objectPointers.dimstyle_control_object = this._reader.handleReference();

		if (this.r13_15Only) {
			objectPointers.viewport_entity_header_control_object = this._reader.handleReference();
		}

		objectPointers.dictionary_acad_group = this._reader.handleReference();
		objectPointers.dictionary_acad_mlinestyle = this._reader.handleReference();
		objectPointers.dictionary_named_objects = this._reader.handleReference();

		if (this.r2000Plus) {
			this._header.stackedTextAlignment = this._reader.readBitShort();
			this._header.stackedTextSizePercentage = this._reader.readBitShort();
			this._header.hyperLinkBase = this._reader.readVariableText();
			this._header.styleSheetName = this._reader.readVariableText();

			objectPointers.dictionary_layouts = this._reader.handleReference();
			objectPointers.dictionary_plotsettings = this._reader.handleReference();
			objectPointers.dictionary_plotstyles = this._reader.handleReference();
		}

		if (this.r2004Plus) {
			objectPointers.dictionary_materials = this._reader.handleReference();
			objectPointers.dictionary_colors = this._reader.handleReference();
		}

		if (this.r2007Plus) {
			objectPointers.dictionary_visualstyle = this._reader.handleReference();

			if (this.r2013Plus) {
				objectPointers.dictionary_visualstyle = this._reader.handleReference();
			}
		}

		if (this.r2000Plus) {
			const flags: number = this._reader.readBitLong();
			this._header.currentEntityLineWeight = (flags & 0x1F) as LineWeightType;
			this._header.endCaps = flags & 0x60;
			this._header.joinStyle = flags & 0x180;
			this._header.displayLineWeight = (flags & 0x200) === 1;
			this._header.xEdit = (flags & 0x400) === 1;
			this._header.extendedNames = (flags & 0x800) === 1;
			this._header.plotStyleMode = flags & 0x2000;
			this._header.loadOLEObject = (flags & 0x4000) === 1;

			this._header.insUnits = this._reader.readBitShort() as UnitsType;
			this._header.currentEntityPlotStyle = this._reader.readBitShort() as EntityPlotStyleType;

			if (this._header.currentEntityPlotStyle === EntityPlotStyleType.ByObjectId) {
				objectPointers.cpsnid = this._reader.handleReference();
			}

			this._header.fingerPrintGuid = this._reader.readVariableText();
			this._header.versionGuid = this._reader.readVariableText();
		}

		if (this.r2004Plus) {
			this._header.entitySortingFlags = this._reader.readByte() as ObjectSortingFlags;
			this._header.indexCreationFlags = this._reader.readByte() as IndexCreationFlags;
			this._header.hideText = this._reader.readByte();
			this._header.externalReferenceClippingBoundaryType = this._reader.readByte() as XClipFrameType;
			this._header.dimensionAssociativity = this._reader.readByte() as DimensionAssociation;
			this._header.haloGapPercentage = this._reader.readByte();
			this._header.obscuredColor = new Color(this._reader.readBitShort());
			this._header.interfereColor = new Color(this._reader.readBitShort());
			this._header.obscuredType = this._reader.readByte();
			this._header.intersectionDisplay = this._reader.readByte();
			this._header.projectName = this._reader.readVariableText();
		}

		objectPointers.paper_space = this._reader.handleReference();
		objectPointers.model_space = this._reader.handleReference();
		objectPointers.bylayer = this._reader.handleReference();
		objectPointers.byblock = this._reader.handleReference();
		objectPointers.continuous = this._reader.handleReference();

		if (this.r2007Plus) {
			this._header.cameraDisplayObjects = this._reader.readBit();
			this._reader.readBitLong();
			this._reader.readBitLong();
			this._reader.readBitDouble();

			const stepsPerSecond = this._reader.readBitDouble();
			if (stepsPerSecond >= 1 && stepsPerSecond <= 30) {
				this._header.stepsPerSecond = stepsPerSecond;
			}
			this._header.stepSize = this._reader.readBitDouble();
			this._header.dw3DPrecision = this._reader.readBitDouble();
			this._header.lensLength = this._reader.readBitDouble();
			this._header.cameraHeight = this._reader.readBitDouble();
			this._header.solidsRetainHistory = this._reader.readRawChar() !== 0;
			this._header.showSolidsHistory = this._reader.readRawChar() !== 0;
			this._header.sweptSolidWidth = this._reader.readBitDouble();
			this._header.sweptSolidHeight = this._reader.readBitDouble();
			this._header.draftAngleFirstCrossSection = this._reader.readBitDouble();
			this._header.draftAngleSecondCrossSection = this._reader.readBitDouble();
			this._header.draftMagnitudeFirstCrossSection = this._reader.readBitDouble();
			this._header.draftMagnitudeSecondCrossSection = this._reader.readBitDouble();
			this._header.solidLoftedShape = this._reader.readBitShort();
			this._header.loftedObjectNormals = String.fromCharCode(this._reader.readRawChar());
			this._header.latitude = this._reader.readBitDouble();
			this._header.longitude = this._reader.readBitDouble();
			this._header.northDirection = this._reader.readBitDouble();
			this._header.timeZone = this._reader.readBitLong();
			this._header.displayLightGlyphs = String.fromCharCode(this._reader.readRawChar());
			this._reader.readRawChar(); // TILEMODELIGHTSYNCH
			this._header.dwgUnderlayFramesVisibility = String.fromCharCode(this._reader.readRawChar());
			this._header.dgnUnderlayFramesVisibility = String.fromCharCode(this._reader.readRawChar());
			this._reader.readBit(); // unknown

			this._header.interfereColor = this._reader.readCmColor();

			objectPointers.interfereobjvs = this._reader.handleReference();
			objectPointers.interferevpvs = this._reader.handleReference();
			objectPointers.dragvs = this._reader.handleReference();

			this._header.shadowMode = this._reader.readByte() as ShadowMode;
			this._header.shadowPlaneLocation = this._reader.readBitDouble();
		}

		try {
			mainreader.setPositionInBits(initialPos + size * 8);
			mainreader.resetShift();
			this.checkSentinel(this._reader, DwgSectionDefinition.endSentinels.get(this.sectionName)!);
		} catch (ex) {
			this.notify('An error ocurred at the end of the Header reading',
				NotificationType.Error, ex instanceof Error ? ex : undefined);
		}

		return { objectPointers };
	}
}
