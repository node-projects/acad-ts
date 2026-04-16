import { CadDocument } from '../../../CadDocument.js';
import { CadHeader, SpaceLineTypeScaling, EntityPlotStyleType } from '../../../Header/CadHeader.js';
import { ACadVersion } from '../../../ACadVersion.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { DwgReferenceType } from '../../../Types/DwgReferenceType.js';
import { CRC8StreamHandler } from '../CRC8StreamHandler.js';
import { DwgStreamWriterBase } from './DwgStreamWriterBase.js';
import { IDwgStreamWriter } from './IDwgStreamWriter.js';

export class DwgHeaderWriter extends DwgSectionIO {
	override get sectionName(): string { return DwgSectionDefinition.header; }

	get bytesWritten(): number { return Math.ceil(this._startWriter.positionInBits / 8); }
	get startWriterStream(): ArrayBuffer { return this._startWriter.main.stream; }

	private _msmain: Uint8Array;

	private _startWriter: IDwgStreamWriter;
	private _writer: IDwgStreamWriter;

	private _document: CadDocument;
	private _header: CadHeader;
	private _encoding: string;

	constructor(stream: Uint8Array, document: CadDocument, encoding: string) {
		super(document.header.version);

		this._document = document;
		this._header = document.header;
		this._encoding = encoding;

		this._startWriter = DwgStreamWriterBase.getStreamWriter(this._version, stream, this._encoding);

		this._msmain = new Uint8Array(8192);
		this._writer = DwgStreamWriterBase.getStreamWriter(this._version, this._msmain, this._encoding);
	}

	write(): void {
		//+R2007 Only:
		if (this.r2007Plus) {
			//Setup the writers
			this._writer = DwgStreamWriterBase.getMergedWriter(this._version, this._msmain, this._encoding);
			this._writer.savePositonForSize();
		}

		//R2013+:
		if (this.r2013Plus) {
			//BLL : Variable REQUIREDVERSIONS
			this._writer.writeBitLongLong(0);
		}

		//Common:
		//BD : Unknown, default value 412148564080.0
		this._writer.writeBitDouble(412148564080.0);
		//BD: Unknown, default value 1.0
		this._writer.writeBitDouble(1.0);
		//BD: Unknown, default value 1.0
		this._writer.writeBitDouble(1.0);
		//BD: Unknown, default value 1.0
		this._writer.writeBitDouble(1.0);

		//TV: Unknown text string, default "m"
		this._writer.writeVariableText('m');
		//TV: Unknown text string, default ""
		this._writer.writeVariableText('');
		//TV: Unknown text string, default ""
		this._writer.writeVariableText('');
		//TV: Unknown text string, default ""
		this._writer.writeVariableText('');

		//BL : Unknown long, default value 24L
		this._writer.writeBitLong(24);
		//BL: Unknown long, default value 0L;
		this._writer.writeBitLong(0);

		//R13-R14 Only:
		if (this.r13_14Only) {
			//BS : Unknown short, default value 0
			this._writer.writeBitShort(0);
		}

		//Pre-2004 Only:
		if (this.r2004Pre) {
			//H : Handle of the current viewport entity header (hard pointer)
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
		}

		//Common:
		//B: DIMASO
		this._writer.writeBit(this._header.associatedDimensions);
		//B: DIMSHO
		this._writer.writeBit(this._header.updateDimensionsWhileDragging);

		//R13-R14 Only:
		if (this.r13_14Only) {
			//B : DIMSAV
			this._writer.writeBit(this._header.dimsav !== 0);
		}

		//Common:
		//B: PLINEGEN
		this._writer.writeBit(this._header.polylineLineTypeGeneration);
		//B : ORTHOMODE
		this._writer.writeBit(this._header.orthoMode);
		//B: REGENMODE
		this._writer.writeBit(this._header.regenerationMode !== 0);
		//B : FILLMODE
		this._writer.writeBit(this._header.fillMode);
		//B : QTEXTMODE
		this._writer.writeBit(this._header.quickTextMode);
		//B : PSLTSCALE
		this._writer.writeBit(this._header.paperSpaceLineTypeScaling === SpaceLineTypeScaling.Normal);
		//B : LIMCHECK
		this._writer.writeBit(this._header.limitCheckingOn);

		//R13-R14 Only:
		if (this.r13_14Only) {
			//B : BLIPMODE
			this._writer.writeBit(this._header.blipMode);
		}

		//R2004+:
		if (this.r2004Plus) {
			//B : Undocumented
			this._writer.writeBit(false);
		}

		//Common:
		//B: USRTIMER
		this._writer.writeBit(this._header.userTimer);
		//B : SKPOLY
		this._writer.writeBit(this._header.sketchPolylineType !== 0);
		//B : ANGDIR
		this._writer.writeBit(this._header.angularDirection !== 0);
		//B : SPLFRAME
		this._writer.writeBit(this._header.showSplineControlPoints);

		//R13-R14 Only:
		if (this.r13_14Only) {
			//B : ATTREQ
			this._writer.writeBit(false);
			//B : ATTDIA
			this._writer.writeBit(false);
		}

		//Common:
		//B: MIRRTEXT
		this._writer.writeBit(this._header.mirrorText);
		//B : WORLDVIEW
		this._writer.writeBit(this._header.worldView);

		//R13 - R14 Only:
		if (this.r13_14Only) {
			//B: WIREFRAME
			this._writer.writeBit(false);
		}

		//Common:
		//B: TILEMODE
		this._writer.writeBit(this._header.showModelSpace);
		//B : PLIMCHECK
		this._writer.writeBit(this._header.paperSpaceLimitsChecking);
		//B : VISRETAIN
		this._writer.writeBit(this._header.retainXRefDependentVisibilitySettings);

		//R13 - R14 Only:
		if (this.r13_14Only) {
			//B : DELOBJ
			this._writer.writeBit(false);
		}

		//Common:
		//B: DISPSILH
		this._writer.writeBit(this._header.displaySilhouetteCurves);
		//B : PELLIPSE
		this._writer.writeBit(this._header.createEllipseAsPolyline);
		//BS: PROXYGRAPHICS
		this._writer.writeBitShort(this._header.proxyGraphics ? 1 : 0);

		//R13-R14 Only:
		if (this.r13_14Only) {
			//BS : DRAGMODE
			this._writer.writeBitShort(0);
		}

		//Common:
		//BS: TREEDEPTH
		this._writer.writeBitShort(this._header.spatialIndexMaxTreeDepth);
		//BS : LUNITS
		this._writer.writeBitShort(this._header.linearUnitFormat);
		//BS : LUPREC
		this._writer.writeBitShort(this._header.linearUnitPrecision);
		//BS : AUNITS
		this._writer.writeBitShort(this._header.angularUnit);
		//BS : AUPREC
		this._writer.writeBitShort(this._header.angularUnitPrecision);

		//R13 - R14 Only:
		if (this.r13_14Only) {
			//BS: OSMODE
			this._writer.writeBitShort(this._header.objectSnapMode);
		}

		//Common:
		//BS: ATTMODE
		this._writer.writeBitShort(this._header.attributeVisibility);

		//R13 - R14 Only:
		if (this.r13_14Only) {
			//BS: COORDS
			this._writer.writeBitShort(0);
		}

		//Common:
		//BS: PDMODE
		this._writer.writeBitShort(this._header.pointDisplayMode);

		//R13 - R14 Only:
		if (this.r13_14Only) {
			//BS: PICKSTYLE
			this._writer.writeBitShort(0);
		}

		//R2004 +:
		if (this.r2004Plus) {
			//BL: Unknown
			this._writer.writeBitLong(0);
			//BL: Unknown
			this._writer.writeBitLong(0);
			//BL: Unknown
			this._writer.writeBitLong(0);
		}

		//Common:
		//BS : USERI1-5
		this._writer.writeBitShort(this._header.userShort1);
		this._writer.writeBitShort(this._header.userShort2);
		this._writer.writeBitShort(this._header.userShort3);
		this._writer.writeBitShort(this._header.userShort4);
		this._writer.writeBitShort(this._header.userShort5);

		//BS: SPLINESEGS
		this._writer.writeBitShort(this._header.numberOfSplineSegments);
		//BS : SURFU
		this._writer.writeBitShort(this._header.surfaceDensityM);
		//BS : SURFV
		this._writer.writeBitShort(this._header.surfaceDensityN);
		//BS : SURFTYPE
		this._writer.writeBitShort(this._header.surfaceType);
		//BS : SURFTAB1
		this._writer.writeBitShort(this._header.surfaceTabulation1);
		//BS : SURFTAB2
		this._writer.writeBitShort(this._header.surfaceTabulation2);
		//BS : SPLINETYPE
		this._writer.writeBitShort(this._header.splineType);
		//BS : SHADEDGE
		this._writer.writeBitShort(this._header.shadeEdge);
		//BS : SHADEDIF
		this._writer.writeBitShort(this._header.shadeDiffuseToAmbientPercentage);
		//BS: UNITMODE
		this._writer.writeBitShort(this._header.unitMode);
		//BS : MAXACTVP
		this._writer.writeBitShort(this._header.maxViewportCount);
		//BS : ISOLINES
		this._writer.writeBitShort(this._header.surfaceIsolineCount);
		//BS : CMLJUST
		this._writer.writeBitShort(this._header.currentMultiLineJustification);
		//BS : TEXTQLTY
		this._writer.writeBitShort(this._header.textQuality);
		//BD : LTSCALE
		this._writer.writeBitDouble(this._header.lineTypeScale);
		//BD : TEXTSIZE
		this._writer.writeBitDouble(this._header.textHeightDefault);
		//BD : TRACEWID
		this._writer.writeBitDouble(this._header.traceWidthDefault);
		//BD : SKETCHINC
		this._writer.writeBitDouble(this._header.sketchIncrement);
		//BD : FILLETRAD
		this._writer.writeBitDouble(this._header.filletRadius);
		//BD : THICKNESS
		this._writer.writeBitDouble(this._header.thicknessDefault);
		//BD : ANGBASE
		this._writer.writeBitDouble(this._header.angleBase);
		//BD : PDSIZE
		this._writer.writeBitDouble(this._header.pointDisplaySize);
		//BD : PLINEWID
		this._writer.writeBitDouble(this._header.polylineWidthDefault);
		//BD : USERR1-5
		this._writer.writeBitDouble(this._header.userDouble1);
		this._writer.writeBitDouble(this._header.userDouble2);
		this._writer.writeBitDouble(this._header.userDouble3);
		this._writer.writeBitDouble(this._header.userDouble4);
		this._writer.writeBitDouble(this._header.userDouble5);
		//BD : CHAMFERA
		this._writer.writeBitDouble(this._header.chamferDistance1);
		//BD : CHAMFERB
		this._writer.writeBitDouble(this._header.chamferDistance2);
		//BD : CHAMFERC
		this._writer.writeBitDouble(this._header.chamferLength);
		//BD : CHAMFERD
		this._writer.writeBitDouble(this._header.chamferAngle);
		//BD : FACETRES
		this._writer.writeBitDouble(this._header.facetResolution);
		//BD : CMLSCALE
		this._writer.writeBitDouble(this._header.currentMultilineScale);
		//BD : CELTSCALE
		this._writer.writeBitDouble(this._header.currentEntityLinetypeScale);

		//TV: MENUNAME
		this._writer.writeVariableText(this._header.menuFileName);

		//Common:
		//BL: TDCREATE
		this._writer.writeDateTime(this._header.createDateTime);
		//BL: TDUPDATE
		this._writer.writeDateTime(this._header.updateDateTime);

		//R2004 +:
		if (this.r2004Plus) {
			//BL : Unknown
			this._writer.writeBitLong(0);
			//BL : Unknown
			this._writer.writeBitLong(0);
			//BL : Unknown
			this._writer.writeBitLong(0);
		}

		//Common:
		//BL: TDINDWG
		this._writer.writeTimeSpan(this._header.totalEditingTime);
		//BL: TDUSRTIMER
		this._writer.writeTimeSpan(this._header.userElapsedTimeSpan);

		//CMC : CECOLOR
		this._writer.writeCmColor(this._header.currentEntityColor);

		//H : HANDSEED
		this._writer.main.handleReferenceHandle(this._header.handleSeed);

		//H : CLAYER (hard pointer)
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._header.currentLayer);
		//H: TEXTSTYLE(hard pointer)
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._header.currentTextStyle);
		//H: CELTYPE(hard pointer)
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._header.currentLineType);

		//R2007 + Only:
		if (this.r2007Plus) {
			//H: CMATERIAL(hard pointer)
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
		}

		//Common:
		//H: DIMSTYLE (hard pointer)
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._header.currentDimensionStyle);
		//H: CMLSTYLE (hard pointer)
		this._writer.handleReferenceTyped(
			DwgReferenceType.HardPointer,
			this._document.mLineStyles?.get(this._header.currentMLineStyleName) ?? null,
		);

		//R2000+ Only:
		if (this.r2000Plus) {
			//BD: PSVPSCALE
			this._writer.writeBitDouble(this._header.viewportDefaultViewScaleFactor);
		}

		//Common:
		//3BD: INSBASE(PSPACE)
		this._writer.write3BitDouble(this._header.paperSpaceInsertionBase);
		//3BD: EXTMIN(PSPACE)
		this._writer.write3BitDouble(this._header.paperSpaceExtMin);
		//3BD: EXTMAX(PSPACE)
		this._writer.write3BitDouble(this._header.paperSpaceExtMax);
		//2RD: LIMMIN(PSPACE)
		this._writer.write2RawDouble(this._header.paperSpaceLimitsMin);
		//2RD: LIMMAX(PSPACE)
		this._writer.write2RawDouble(this._header.paperSpaceLimitsMax);
		//BD: ELEVATION(PSPACE)
		this._writer.writeBitDouble(this._header.paperSpaceElevation);
		//3BD: UCSORG(PSPACE)
		this._writer.write3BitDouble(this._header.paperSpaceUcs.origin);
		//3BD: UCSXDIR(PSPACE)
		this._writer.write3BitDouble(this._header.paperSpaceXAxis);
		//3BD: UCSYDIR(PSPACE)
		this._writer.write3BitDouble(this._header.paperSpaceYAxis);

		//H: UCSNAME (PSPACE) (hard pointer)
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._header.paperSpaceUcs);

		//R2000+ Only:
		if (this.r2000Plus) {
			//H : PUCSORTHOREF (hard pointer)
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
			//BS : PUCSORTHOVIEW
			this._writer.writeBitShort(0);
			//H: PUCSBASE(hard pointer)
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);

			//3BD: PUCSORGTOP
			this._writer.write3BitDouble(this._header.paperSpaceOrthographicTopDOrigin);
			//3BD: PUCSORGBOTTOM
			this._writer.write3BitDouble(this._header.paperSpaceOrthographicBottomDOrigin);
			//3BD: PUCSORGLEFT
			this._writer.write3BitDouble(this._header.paperSpaceOrthographicLeftDOrigin);
			//3BD: PUCSORGRIGHT
			this._writer.write3BitDouble(this._header.paperSpaceOrthographicRightDOrigin);
			//3BD: PUCSORGFRONT
			this._writer.write3BitDouble(this._header.paperSpaceOrthographicFrontDOrigin);
			//3BD: PUCSORGBACK
			this._writer.write3BitDouble(this._header.paperSpaceOrthographicBackDOrigin);
		}

		//Common:
		//3BD: INSBASE(MSPACE)
		this._writer.write3BitDouble(this._header.modelSpaceInsertionBase);
		//3BD: EXTMIN(MSPACE)
		this._writer.write3BitDouble(this._header.modelSpaceExtMin);
		//3BD: EXTMAX(MSPACE)
		this._writer.write3BitDouble(this._header.modelSpaceExtMax);
		//2RD: LIMMIN(MSPACE)
		this._writer.write2RawDouble(this._header.modelSpaceLimitsMin);
		//2RD: LIMMAX(MSPACE)
		this._writer.write2RawDouble(this._header.modelSpaceLimitsMax);
		//BD: ELEVATION(MSPACE)
		this._writer.writeBitDouble(this._header.elevation);
		//3BD: UCSORG(MSPACE)
		this._writer.write3BitDouble(this._header.modelSpaceOrigin);
		//3BD: UCSXDIR(MSPACE)
		this._writer.write3BitDouble(this._header.modelSpaceXAxis);
		//3BD: UCSYDIR(MSPACE)
		this._writer.write3BitDouble(this._header.modelSpaceYAxis);

		//H: UCSNAME(MSPACE)(hard pointer)
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._header.modelSpaceUcs);

		//R2000 + Only:
		if (this.r2000Plus) {
			//H: UCSORTHOREF(hard pointer)
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
			//BS: UCSORTHOVIEW
			this._writer.writeBitShort(0);
			//H : UCSBASE(hard pointer)
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);

			//3BD: UCSORGTOP
			this._writer.write3BitDouble(this._header.modelSpaceOrthographicTopDOrigin);
			//3BD: UCSORGBOTTOM
			this._writer.write3BitDouble(this._header.modelSpaceOrthographicBottomDOrigin);
			//3BD: UCSORGLEFT
			this._writer.write3BitDouble(this._header.modelSpaceOrthographicLeftDOrigin);
			//3BD: UCSORGRIGHT
			this._writer.write3BitDouble(this._header.modelSpaceOrthographicRightDOrigin);
			//3BD: UCSORGFRONT
			this._writer.write3BitDouble(this._header.modelSpaceOrthographicFrontDOrigin);
			//3BD: UCSORGBACK
			this._writer.write3BitDouble(this._header.modelSpaceOrthographicBackDOrigin);

			//TV : DIMPOST
			this._writer.writeVariableText(this._header.dimensionPostFix);
			//TV : DIMAPOST
			this._writer.writeVariableText(this._header.dimensionAlternateDimensioningSuffix);
		}

		//R13-R14 Only:
		if (this.r13_14Only) {
			this._writer.writeBit(this._header.dimensionGenerateTolerances);
			this._writer.writeBit(this._header.dimensionLimitsGeneration);
			this._writer.writeBit(this._header.dimensionTextInsideHorizontal);
			this._writer.writeBit(this._header.dimensionTextOutsideHorizontal);
			this._writer.writeBit(this._header.dimensionSuppressFirstExtensionLine);
			this._writer.writeBit(this._header.dimensionSuppressSecondExtensionLine);
			this._writer.writeBit(this._header.dimensionAlternateUnitDimensioning);
			this._writer.writeBit(this._header.dimensionTextOutsideExtensions);
			this._writer.writeBit(this._header.dimensionSeparateArrowBlocks);
			this._writer.writeBit(this._header.dimensionTextInsideExtensions);
			this._writer.writeBit(this._header.dimensionSuppressOutsideExtensions);
			this._writer.writeByte(this._header.dimensionAlternateUnitDecimalPlaces);
			this._writer.writeByte(this._header.dimensionZeroHandling);
			this._writer.writeBit(this._header.dimensionSuppressFirstDimensionLine);
			this._writer.writeBit(this._header.dimensionSuppressSecondDimensionLine);
			this._writer.writeByte(this._header.dimensionToleranceAlignment);
			this._writer.writeByte(this._header.dimensionTextHorizontalAlignment);
			this._writer.writeByte(this._header.dimensionFit);
			this._writer.writeBit(this._header.dimensionCursorUpdate);
			this._writer.writeByte(this._header.dimensionToleranceZeroHandling);
			this._writer.writeByte(this._header.dimensionAlternateUnitZeroHandling);
			this._writer.writeByte(this._header.dimensionAlternateUnitToleranceZeroHandling);
			this._writer.writeByte(this._header.dimensionTextVerticalAlignment);
			this._writer.writeBitShort(this._header.dimensionUnit);
			this._writer.writeBitShort(this._header.dimensionAngularDimensionDecimalPlaces);
			this._writer.writeBitShort(this._header.dimensionDecimalPlaces);
			this._writer.writeBitShort(this._header.dimensionToleranceDecimalPlaces);
			this._writer.writeBitShort(this._header.dimensionAlternateUnitFormat);
			this._writer.writeBitShort(this._header.dimensionAlternateUnitToleranceDecimalPlaces);

			//H : DIMTXSTY(hard pointer)
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._header.dimensionTextStyle);
		}

		//Common:
		this._writer.writeBitDouble(this._header.dimensionScaleFactor);
		this._writer.writeBitDouble(this._header.dimensionArrowSize);
		this._writer.writeBitDouble(this._header.dimensionExtensionLineOffset);
		this._writer.writeBitDouble(this._header.dimensionLineIncrement);
		this._writer.writeBitDouble(this._header.dimensionExtensionLineExtension);
		this._writer.writeBitDouble(this._header.dimensionRounding);
		this._writer.writeBitDouble(this._header.dimensionLineExtension);
		this._writer.writeBitDouble(this._header.dimensionPlusTolerance);
		this._writer.writeBitDouble(this._header.dimensionMinusTolerance);

		//R2007 + Only:
		if (this.r2007Plus) {
			this._writer.writeBitDouble(this._header.dimensionFixedExtensionLineLength);
			this._writer.writeBitDouble(this._header.dimensionJoggedRadiusDimensionTransverseSegmentAngle);
			this._writer.writeBitShort(this._header.dimensionTextBackgroundFillMode);
			this._writer.writeCmColor(this._header.dimensionTextBackgroundColor);
		}

		//R2000 + Only:
		if (this.r2000Plus) {
			this._writer.writeBit(this._header.dimensionGenerateTolerances);
			this._writer.writeBit(this._header.dimensionLimitsGeneration);
			this._writer.writeBit(this._header.dimensionTextInsideHorizontal);
			this._writer.writeBit(this._header.dimensionTextOutsideHorizontal);
			this._writer.writeBit(this._header.dimensionSuppressFirstExtensionLine);
			this._writer.writeBit(this._header.dimensionSuppressSecondExtensionLine);
			this._writer.writeBitShort(this._header.dimensionTextVerticalAlignment);
			this._writer.writeBitShort(this._header.dimensionZeroHandling);
			this._writer.writeBitShort(this._header.dimensionAngularZeroHandling);
		}

		//R2007 + Only:
		if (this.r2007Plus) {
			this._writer.writeBitShort(this._header.dimensionArcLengthSymbolPosition);
		}

		//Common:
		this._writer.writeBitDouble(this._header.dimensionTextHeight);
		this._writer.writeBitDouble(this._header.dimensionCenterMarkSize);
		this._writer.writeBitDouble(this._header.dimensionTickSize);
		this._writer.writeBitDouble(this._header.dimensionAlternateUnitScaleFactor);
		this._writer.writeBitDouble(this._header.dimensionLinearScaleFactor);
		this._writer.writeBitDouble(this._header.dimensionTextVerticalPosition);
		this._writer.writeBitDouble(this._header.dimensionToleranceScaleFactor);
		this._writer.writeBitDouble(this._header.dimensionLineGap);

		//R13 - R14 Only:
		if (this.r13_14Only) {
			this._writer.writeVariableText(this._header.dimensionPostFix);
			this._writer.writeVariableText(this._header.dimensionAlternateDimensioningSuffix);
			this._writer.writeVariableText(this._header.dimensionBlockName);
			this._writer.writeVariableText(this._header.dimensionBlockNameFirst);
			this._writer.writeVariableText(this._header.dimensionBlockNameSecond);
		}

		//R2000 + Only:
		if (this.r2000Plus) {
			this._writer.writeBitDouble(this._header.dimensionAlternateUnitRounding);
			this._writer.writeBit(this._header.dimensionAlternateUnitDimensioning);
			this._writer.writeBitShort(this._header.dimensionAlternateUnitDecimalPlaces);
			this._writer.writeBit(this._header.dimensionTextOutsideExtensions);
			this._writer.writeBit(this._header.dimensionSeparateArrowBlocks);
			this._writer.writeBit(this._header.dimensionTextInsideExtensions);
			this._writer.writeBit(this._header.dimensionSuppressOutsideExtensions);
		}

		//Common:
		this._writer.writeCmColor(this._header.dimensionLineColor);
		this._writer.writeCmColor(this._header.dimensionExtensionLineColor);
		this._writer.writeCmColor(this._header.dimensionTextColor);

		//R2000 + Only:
		if (this.r2000Plus) {
			this._writer.writeBitShort(this._header.dimensionAngularDimensionDecimalPlaces);
			this._writer.writeBitShort(this._header.dimensionDecimalPlaces);
			this._writer.writeBitShort(this._header.dimensionToleranceDecimalPlaces);
			this._writer.writeBitShort(this._header.dimensionAlternateUnitFormat);
			this._writer.writeBitShort(this._header.dimensionAlternateUnitToleranceDecimalPlaces);
			this._writer.writeBitShort(this._header.dimensionAngularUnit);
			this._writer.writeBitShort(this._header.dimensionFractionFormat);
			this._writer.writeBitShort(this._header.dimensionLinearUnitFormat);
			this._writer.writeBitShort(this._header.dimensionDecimalSeparator.charCodeAt(0) || 0);
			this._writer.writeBitShort(this._header.dimensionTextMovement);
			this._writer.writeBitShort(this._header.dimensionTextHorizontalAlignment);
			this._writer.writeBit(this._header.dimensionSuppressFirstDimensionLine);
			this._writer.writeBit(this._header.dimensionSuppressSecondDimensionLine);
			this._writer.writeBitShort(this._header.dimensionToleranceAlignment);
			this._writer.writeBitShort(this._header.dimensionToleranceZeroHandling);
			this._writer.writeBitShort(this._header.dimensionAlternateUnitZeroHandling);
			this._writer.writeBitShort(this._header.dimensionAlternateUnitToleranceZeroHandling);
			this._writer.writeBit(this._header.dimensionCursorUpdate);
			this._writer.writeBitShort(this._header.dimensionDimensionTextArrowFit);
		}

		//R2007 + Only:
		if (this.r2007Plus) {
			this._writer.writeBit(this._header.dimensionIsExtensionLineLengthFixed);
		}

		//R2010 + Only:
		if (this.r2010Plus) {
			this._writer.writeBit(this._header.dimensionTextDirection === 1);
			this._writer.writeBitDouble(this._header.dimensionAltMzf);
			this._writer.writeVariableText(this._header.dimensionAltMzs);
			this._writer.writeBitDouble(this._header.dimensionFit);
			this._writer.writeVariableText(this._header.dimensionMzs);
		}

		//R2000 + Only:
		if (this.r2000Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._header.dimensionTextStyle);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
		}

		//R2007+ Only:
		if (this.r2007Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
		}

		//R2000+ Only:
		if (this.r2000Plus) {
			this._writer.writeBitShort(this._header.dimensionLineWeight);
			this._writer.writeBitShort(this._header.extensionLineWeight);
		}

		//H: BLOCK CONTROL OBJECT(hard owner)
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.blockRecords);
		//H: LAYER CONTROL OBJECT(hard owner)
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.layers);
		//H: STYLE CONTROL OBJECT(hard owner)
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.textStyles);
		//H: LINETYPE CONTROL OBJECT(hard owner)
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.lineTypes);
		//H: VIEW CONTROL OBJECT(hard owner)
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.views);
		//H: UCS CONTROL OBJECT(hard owner)
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.uCSs);
		//H: VPORT CONTROL OBJECT(hard owner)
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.vPorts);
		//H: APPID CONTROL OBJECT(hard owner)
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.appIds);
		//H: DIMSTYLE CONTROL OBJECT(hard owner)
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.dimensionStyles);

		//R13 - R15 Only:
		if (this.r13_15Only) {
			//H: VIEWPORT ENTITY HEADER CONTROL OBJECT(hard owner)
			this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.vEntityControl);
		}

		//Common:
		//H: DICTIONARY(ACAD_GROUP)(hard pointer)
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._document.groups);
		//H: DICTIONARY(ACAD_MLINESTYLE)(hard pointer)
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._document.mLineStyles);
		//H : DICTIONARY (NAMED OBJECTS) (hard owner)
		this._writer.handleReferenceTyped(DwgReferenceType.HardOwnership, this._document.rootDictionary);

		//R2000+ Only:
		if (this.r2000Plus) {
			this._writer.writeBitShort(this._header.stackedTextAlignment);
			this._writer.writeBitShort(this._header.stackedTextSizePercentage);

			this._writer.writeVariableText(this._header.hyperLinkBase);
			this._writer.writeVariableText(this._header.styleSheetName);

			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._document.layouts);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
		}

		//R2004 +:
		if (this.r2004Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._document.materials);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._document.colors);
		}

		//R2007 +:
		if (this.r2007Plus) {
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
			if (this.r2013Plus) {
				this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
			}
		}

		//R2000 +:
		if (this.r2000Plus) {
			let flags = ((this._header.currentEntityLineWeight as number) & 0x1F) |
						(this._header.endCaps << 0x5) |
						(this._header.joinStyle << 0x7);

			if (!this._header.displayLineWeight) {
				flags |= 0x200;
			}
			if (!this._header.xEdit) {
				flags |= 0x400;
			}
			if (this._header.extendedNames) {
				flags |= 0x800;
			}
			if (this._header.plotStyleMode === 1) {
				flags |= 0x2000;
			}
			if (this._header.loadOLEObject) {
				flags |= 0x4000;
			}

			this._writer.writeBitLong(flags);

			this._writer.writeBitShort(this._header.insUnits);
			this._writer.writeBitShort(this._header.currentEntityPlotStyle);

			if (this._header.currentEntityPlotStyle === EntityPlotStyleType.ByObjectId) {
				this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
			}

			this._writer.writeVariableText(this._header.fingerPrintGuid);
			this._writer.writeVariableText(this._header.versionGuid);
		}

		//R2004 +:
		if (this.r2004Plus) {
			this._writer.writeByte(this._header.entitySortingFlags);
			this._writer.writeByte(this._header.indexCreationFlags);
			this._writer.writeByte(this._header.hideText);
			this._writer.writeByte(this._header.externalReferenceClippingBoundaryType);
			this._writer.writeByte(this._header.dimensionAssociativity);
			this._writer.writeByte(this._header.haloGapPercentage);
			this._writer.writeBitShort(this._header.obscuredColor.index);
			this._writer.writeBitShort(this._header.interfereColor.index);
			this._writer.writeByte(this._header.obscuredType);
			this._writer.writeByte(this._header.intersectionDisplay);

			this._writer.writeVariableText(this._header.projectName);
		}

		//Common:
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._document.paperSpace);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._document.modelSpace);
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._document.lineTypes.get('ByLayer'));
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._document.lineTypes.get('ByBlock'));
		this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, this._document.lineTypes.get('Continuous'));

		//R2007 +:
		if (this.r2007Plus) {
			this._writer.writeBit(this._header.cameraDisplayObjects);
			this._writer.writeBitLong(0);
			this._writer.writeBitLong(0);
			this._writer.writeBitDouble(0);

			this._writer.writeBitDouble(this._header.stepsPerSecond);
			this._writer.writeBitDouble(this._header.stepSize);
			this._writer.writeBitDouble(this._header.dw3DPrecision);
			this._writer.writeBitDouble(this._header.lensLength);
			this._writer.writeBitDouble(this._header.cameraHeight);
			this._writer.writeByte(this._header.solidsRetainHistory ? 1 : 0);
			this._writer.writeByte(this._header.showSolidsHistory ? 1 : 0);
			this._writer.writeBitDouble(this._header.sweptSolidWidth);
			this._writer.writeBitDouble(this._header.sweptSolidHeight);
			this._writer.writeBitDouble(this._header.draftAngleFirstCrossSection);
			this._writer.writeBitDouble(this._header.draftAngleSecondCrossSection);
			this._writer.writeBitDouble(this._header.draftMagnitudeFirstCrossSection);
			this._writer.writeBitDouble(this._header.draftMagnitudeSecondCrossSection);
			this._writer.writeBitShort(this._header.solidLoftedShape);
			this._writer.writeByte(this._header.loftedObjectNormals.charCodeAt(0) || 0);
			this._writer.writeBitDouble(this._header.latitude);
			this._writer.writeBitDouble(this._header.longitude);
			this._writer.writeBitDouble(this._header.northDirection);
			this._writer.writeBitLong(this._header.timeZone);
			this._writer.writeByte(this._header.displayLightGlyphs.charCodeAt(0) || 0);
			this._writer.writeByte(0x30); // '0'
			this._writer.writeByte(this._header.dwgUnderlayFramesVisibility.charCodeAt(0) || 0);
			this._writer.writeByte(this._header.dgnUnderlayFramesVisibility.charCodeAt(0) || 0);

			this._writer.writeBit(false);
			this._writer.writeCmColor(this._header.interfereColor);

			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);
			this._writer.handleReferenceTyped(DwgReferenceType.HardPointer, null!);

			this._writer.writeByte(this._header.shadowMode);
			this._writer.writeBitDouble(this._header.shadowPlaneLocation);
		}

		//R14 +:
		if (this._header.version >= ACadVersion.AC1014) {
			this._writer.writeBitShort(-1);
			this._writer.writeBitShort(-1);
			this._writer.writeBitShort(-1);
			this._writer.writeBitShort(-1);

			if (this.r2004Plus) {
				this._writer.writeBitLong(0);
				this._writer.writeBitLong(0);
				this._writer.writeBit(false);
			}
		}

		this._writer.writeSpearShift();

		//Write the size and merge the streams
		this._writeSizeAndCrc();
	}

	private _writeSizeAndCrc(): void {
		//Start sentinel
		this._startWriter.writeBytes(DwgSectionDefinition.startSentinels.get(this.sectionName)!);

		const writtenByteCount = Math.ceil(this._writer.main.positionInBits / 8);
		const sectionData = new Uint8Array(this._writer.main.stream).slice(0, writtenByteCount);
		const sectionLength = sectionData.length;

		const sizeBytes = new Uint8Array(4);
		const sizeView = new DataView(sizeBytes.buffer);
		sizeView.setInt32(0, sectionLength, true);

		// Build data for CRC: size + optional extra + section
		const crcData: number[] = [];
		for (let i = 0; i < 4; i++) crcData.push(sizeBytes[i]);

		if (this.r2010Plus && this._header.maintenanceVersion > 3 || this.r2018Plus) {
			for (let i = 0; i < 4; i++) crcData.push(0);
		}

		for (let i = 0; i < sectionLength; i++) crcData.push(sectionData[i]);

		const crcVal = CRC8StreamHandler.getCRCValue(0xC0C1, new Uint8Array(crcData), 0, crcData.length);

		// Write size
		this._startWriter.writeBytes(sizeBytes);

		if (this.r2010Plus && this._header.maintenanceVersion > 3 || this.r2018Plus) {
			this._startWriter.writeRawLong(0);
		}

		// Write section data
		this._startWriter.writeBytes(sectionData);

		//RS : CRC
		this._startWriter.writeRawShort(crcVal);

		//Ending sentinel
		this._startWriter.writeBytes(DwgSectionDefinition.endSentinels.get(this.sectionName)!);
	}
}
