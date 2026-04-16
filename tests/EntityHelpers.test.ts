import { describe, expect, it } from 'vitest';
import { CadDocument } from '../src/CadDocument.js';
import { HookLineDirection, Leader, LeaderCreationType } from '../src/Entities/Leader.js';
import { Line } from '../src/Entities/Line.js';
import { MText, AttachmentPointType } from '../src/Entities/MText.js';
import { Mesh } from '../src/Entities/Mesh.js';
import { MLine, MLineSegment, MLineVertex } from '../src/Entities/MLine.js';
import { MultiLeader } from '../src/Entities/MultiLeader.js';
import { PolygonMesh } from '../src/Entities/PolygonMesh.js';
import { PolyfaceMesh } from '../src/Entities/PolyfaceMesh.js';
import { Ole2Frame } from '../src/Entities/Ole2Frame.js';
import { PdfUnderlay } from '../src/Entities/PdfUnderlay.js';
import { Ray } from '../src/Entities/Ray.js';
import { Shape } from '../src/Entities/Shape.js';
import { Tolerance } from '../src/Entities/Tolerance.js';
import { VertexFaceMesh } from '../src/Entities/VertexFaceMesh.js';
import { Viewport } from '../src/Entities/Viewport.js';
import { Wipeout } from '../src/Entities/Wipeout.js';
import { XLine } from '../src/Entities/XLine.js';
import { XYZ } from '../src/Math/XYZ.js';
import { LeaderLine, LeaderRoot } from '../src/Objects/MultiLeaderObjectContextData.js';
import { XY } from '../src/Math/XY.js';
import { DimensionStyle } from '../src/Tables/DimensionStyle.js';

describe('EntityHelpersTests', () => {
	it('ComputesLeaderHooklineAndTransformsVertices', () => {
		const leader = new Leader();
		leader.creationType = LeaderCreationType.CreatedWithTextAnnotation;
		leader.hookLineDirection = HookLineDirection.Same;
		leader.horizontalDirection = new XYZ(1, 0, 0);
		leader.vertices = [new XYZ(0, 0, 0), new XYZ(2, 3, 0)];

		expect(leader.hasHookline).toBe(true);

		leader.applyTranslation(new XYZ(4, -1, 0));

		expect(leader.vertices[0]).toEqual(new XYZ(4, -1, 0));
		expect(leader.vertices[1]).toEqual(new XYZ(6, 2, 0));
	});

	it('ParsesMTextPlainTextAndReturnsBounds', () => {
		const text = new MText();
		text.insertPoint = new XYZ(10, 20, 0);
		text.value = 'Top\\PBottom';
		text.height = 2;
		text.rectangleWidth = 12;
		text.attachmentPoint = AttachmentPointType.MiddleCenter;

		const bounds = text.getBoundingBox();

		expect(text.plainText).toBe('Top\nBottom');
		expect(text.getPlainTextLines()).toEqual(['Top', 'Bottom']);
		expect(bounds.min.x).toBeCloseTo(4);
		expect(bounds.max.x).toBeCloseTo(16);
		expect(bounds.min.y).toBeLessThan(20);
		expect(bounds.max.y).toBeGreaterThan(20);
	});

	it('TransformsAndSelectsViewportEntitiesByModelBounds', () => {
		const doc = new CadDocument();
		const inside = new Line(new XYZ(1, 1, 0), new XYZ(2, 2, 0));
		const partial = new Line(new XYZ(4, 4, 0), new XYZ(7, 7, 0));
		const outside = new Line(new XYZ(20, 20, 0), new XYZ(22, 22, 0));
		const viewport = new Viewport();
		viewport.center = new XYZ(0, 0, 0);
		viewport.width = 4;
		viewport.height = 4;
		viewport.viewCenter = new XYZ(2.5, 2.5, 0);
		viewport.viewHeight = 5;

		doc.entities?.add(inside);
		doc.entities?.add(partial);
		doc.entities?.add(outside);
		doc.entities?.add(viewport);

		expect(viewport.selectEntities(true)).toEqual([inside, partial]);
		expect(viewport.selectEntities(false)).toEqual([inside]);

		viewport.applyTranslation(new XYZ(3, 2, 0));

		expect(viewport.center).toEqual(new XYZ(3, 2, 0));
		expect(viewport.getBoundingBox().min.x).toBeCloseTo(1);
		expect(viewport.getBoundingBox().max.y).toBeCloseTo(4);
	});

	it('TransformsInfiniteLineEntitiesAndReturnsInfiniteBounds', () => {
		const ray = new Ray();
		ray.startPoint = new XYZ(1, 2, 0);
		ray.direction = new XYZ(3, 0, 0);

		const xline = new XLine();
		xline.firstPoint = new XYZ(-2, 1, 0);
		xline.direction = new XYZ(0, 4, 0);

		ray.applyTranslation(new XYZ(5, -1, 0));
		xline.applyScaling(new XYZ(2, 2, 1));

		expect(ray.startPoint).toEqual(new XYZ(6, 1, 0));
		expect(ray.direction).toEqual(new XYZ(1, 0, 0));
		expect(ray.getBoundingBox().min.x).toBe(-Infinity);
		expect(xline.firstPoint).toEqual(new XYZ(-4, 2, 0));
		expect(xline.direction).toEqual(new XYZ(0, 1, 0));
		expect(xline.getBoundingBox().max.y).toBe(Infinity);
	});

	it('ReturnsConcreteBoundsForShapeAndTolerance', () => {
		const shape = new Shape();
		shape.insertionPoint = new XYZ(3, 4, 0);
		shape.size = 2;
		shape.relativeXScale = 1.5;

		const tolerance = new Tolerance();
		const style = DimensionStyle.default;
		style.textHeight = 2;
		tolerance.style = style;
		tolerance.insertionPoint = new XYZ(10, 1, 0);
		tolerance.direction = new XYZ(1, 0, 0);
		tolerance.text = 'ABC';

		shape.applyTranslation(new XYZ(1, -2, 0));
		const shapeBounds = shape.getBoundingBox();
		const toleranceBounds = tolerance.getBoundingBox();

		expect(shape.insertionPoint).toEqual(new XYZ(4, 2, 0));
		expect(shapeBounds.min.x).toBeCloseTo(4);
		expect(shapeBounds.max.x).toBeCloseTo(7);
		expect(shapeBounds.max.y).toBeCloseTo(4);
		expect(toleranceBounds.min.x).toBeCloseTo(10);
		expect(toleranceBounds.max.x).toBeCloseTo(13.6);
		expect(toleranceBounds.max.y).toBeCloseTo(3);
	});

	it('TransformsMeshVerticesAndDelegatesMeshPolylineBounds', () => {
		const mesh = new Mesh();
		mesh.vertices = [new XYZ(0, 0, 0), new XYZ(2, 3, 0)];

		mesh.applyTranslation(new XYZ(4, -1, 0));
		const meshBounds = mesh.getBoundingBox();

		expect(mesh.vertices[0]).toEqual(new XYZ(4, -1, 0));
		expect(mesh.vertices[1]).toEqual(new XYZ(6, 2, 0));
		expect(meshBounds?.min.x).toBeCloseTo(4);
		expect(meshBounds?.max.y).toBeCloseTo(2);

		const polyface = new PolyfaceMesh();
		polyface.vertices.push(new VertexFaceMesh(new XYZ(0, 0, 0)));
		polyface.vertices.push(new VertexFaceMesh(new XYZ(5, 2, 0)));

		const polygon = new PolygonMesh();
		polygon.vertices.push(new VertexFaceMesh(new XYZ(-1, -2, 0)));
		polygon.vertices.push(new VertexFaceMesh(new XYZ(3, 4, 0)));

		expect(polyface.getBoundingBox()?.max.x).toBeCloseTo(5);
		expect(polyface.getBoundingBox()?.max.y).toBeCloseTo(2);
		expect(polygon.getBoundingBox()?.min.x).toBeCloseTo(-1);
		expect(polygon.getBoundingBox()?.max.y).toBeCloseTo(4);
	});

	it('TransformsWipeoutUnderlayAndOleFramesInTheirLocalCoordinateModels', () => {
		const wipeout = new Wipeout();
		wipeout.insertPoint = new XYZ(10, 5, 0);
		wipeout.uVector = new XYZ(2, 0, 0);
		wipeout.vVector = new XYZ(0, 3, 0);
		wipeout.clipBoundaryVertices = [new XY(0, 0), new XY(1, 0), new XY(1, 1), new XY(0, 1)];

		const wipeoutBounds = wipeout.getBoundingBox();
		wipeout.applyTranslation(new XYZ(4, -2, 0));

		expect(wipeoutBounds?.min.x).toBeCloseTo(10);
		expect(wipeoutBounds?.max.y).toBeCloseTo(8);
		expect(wipeout.insertPoint).toEqual(new XYZ(14, 3, 0));
		expect(wipeout.getBoundingBox()?.min.x).toBeCloseTo(14);
		expect(wipeout.getBoundingBox()?.max.y).toBeCloseTo(6);

		const underlay = new PdfUnderlay();
		underlay.insertPoint = new XYZ(1, 1, 0);
		underlay.xScale = 2;
		underlay.yScale = 3;
		underlay.clipBoundaryVertices = [new XY(0, 0), new XY(1, 0), new XY(1, 1), new XY(0, 1)];

		const underlayBounds = underlay.getBoundingBox();
		underlay.applyTranslation(new XYZ(-1, 2, 0));

		expect(underlayBounds?.min.x).toBeCloseTo(1);
		expect(underlayBounds?.max.y).toBeCloseTo(4);
		expect(underlay.getBoundingBox()?.min.x).toBeCloseTo(0);
		expect(underlay.getBoundingBox()?.max.y).toBeCloseTo(6);

		const frame = new Ole2Frame();
		frame.upperLeftCorner = new XYZ(-2, 9, 1);
		frame.lowerRightCorner = new XYZ(6, 3, 4);
		frame.applyTranslation(new XYZ(1, -1, 2));

		expect(frame.upperLeftCorner).toEqual(new XYZ(-1, 8, 3));
		expect(frame.lowerRightCorner).toEqual(new XYZ(7, 2, 6));
	});

	it('TransformsMLineVerticesAndReturnsBounds', () => {
		const segment = new MLineSegment();
		segment.parameters = [1, 2];
		segment.areaFillParameters = [0.5];

		const vertex = new MLineVertex();
		vertex.position = new XYZ(2, 3, 0);
		vertex.direction = new XYZ(1, 0, 0);
		vertex.miter = new XYZ(0, 1, 0);
		vertex.segments = [segment];

		const mline = new MLine();
		mline.startPoint = new XYZ(0, 0, 0);
		mline.scaleFactor = 1;
		mline.vertices = [vertex];

		const bounds = mline.getBoundingBox();
		mline.applyScaling(new XYZ(2, 2, 1));

		expect(bounds.min.x).toBeCloseTo(0);
		expect(bounds.max.y).toBeCloseTo(3);
		expect(mline.vertices[0].position).toEqual(new XYZ(4, 6, 0));
		expect(mline.vertices[0].miter).toEqual(new XYZ(0, 2, 0));
		expect(mline.vertices[0].segments[0].parameters).toEqual([2, 4]);
		expect(mline.vertices[0].segments[0].areaFillParameters).toEqual([1]);
		expect(mline.scaleFactor).toBeCloseTo(5 / 3);
	});

	it('ClonesMultiLeaderContextDataAndAggregatesBounds', () => {
		const leaderLine = new LeaderLine();
		leaderLine.points = [new XYZ(-1, 3, 0), new XYZ(2, 8, 0)];

		const root = new LeaderRoot();
		root.connectionPoint = new XYZ(1, 2, 0);
		root.direction = new XYZ(3, 4, 0);
		root.lines = [leaderLine];

		const multiLeader = new MultiLeader();
		multiLeader.contextData.basePoint = new XYZ(5, 6, 0);
		multiLeader.contextData.textLocation = new XYZ(7, 1, 0);
		multiLeader.contextData.leaderRoots = [root];

		const clone = multiLeader.clone() as MultiLeader;
		multiLeader.contextData.textLocation = new XYZ(100, 100, 0);

		const bounds = clone.getBoundingBox();

		expect(clone.contextData).not.toBe(multiLeader.contextData);
		expect(clone.contextData.textLocation).toEqual(new XYZ(7, 1, 0));
		expect(bounds?.min.x).toBeCloseTo(-1);
		expect(bounds?.min.y).toBeCloseTo(0);
		expect(bounds?.max.x).toBeCloseTo(7);
		expect(bounds?.max.y).toBeCloseTo(8);
	});
});