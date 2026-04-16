import { SvgConfiguration } from './SvgConfiguration.js';
import { SvgConverter } from './SvgConverter.js';
import { Layout } from '../../Objects/Layout.js';
import { PlotRotation } from '../../Objects/PlotRotation.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { LineType } from '../../Tables/LineType.js';
import { Entity } from '../../Entities/Entity.js';
import { Arc } from '../../Entities/Arc.js';
import { Circle } from '../../Entities/Circle.js';
import { Dimension } from '../../Entities/Dimension.js';
import { Ellipse } from '../../Entities/Ellipse.js';
import { Hatch } from '../../Entities/Hatch.js';
import { Insert } from '../../Entities/Insert.js';
import { Line } from '../../Entities/Line.js';
import { MText, AttachmentPointType } from '../../Entities/MText.js';
import { Point } from '../../Entities/Point.js';
import { Solid } from '../../Entities/Solid.js';
import { Spline } from '../../Entities/Spline.js';
import { TextEntity, TextHorizontalAlignment, TextVerticalAlignmentType } from '../../Entities/TextEntity.js';
import { IPolyline } from '../../Entities/IPolyline.js';
import { Polyline3D } from '../../Entities/Polyline3D.js';
import { Color } from '../../Color.js';
import { UnitsType } from '../../Types/Units/UnitsType.js';
import { LineWeightType } from '../../Types/LineWeightType.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { NotificationEventArgs, NotificationEventHandler } from '../NotificationEventHandler.js';
import { UnitExtensions } from '../../Extensions/UnitExtensions.js';
import { FontFlags } from '../../Tables/FontFlags.js';
import { XYZ } from '../../Math/XYZ.js';
import { XY } from '../../Math/XY.js';

interface BoundingBox { min: XYZ; max: XYZ; width: number; height: number; }
type BoundingBoxLike = {
  min?: { x?: number; y?: number; z?: number } | null;
  max?: { x?: number; y?: number; z?: number } | null;
};
type PolylineVertexLike = {
  getLocation3D?: () => XYZ;
  location?: unknown;
};
type StyledSvgEntity = {
  color?: Color;
  getActiveColor?: () => Color;
  getActiveLineType?: () => LineType;
  getActiveLineWeightType?: () => LineWeightType;
};

class Transform {
  translation: XYZ = new XYZ(0, 0, 0);
  scale: XYZ = new XYZ(1, 1, 1);
  eulerRotation: XYZ = new XYZ(0, 0, 0);
  matrix: number[][] | null = null;

  constructor(translation?: XYZ, scale?: XYZ, rotation?: XYZ) {
    if (translation) this.translation = translation;
    if (scale) this.scale = scale;
    if (rotation) this.eulerRotation = rotation;
  }

  applyTransform(point: XYZ): XYZ {
    return new XYZ(point.x + this.translation.x, point.y + this.translation.y, point.z + this.translation.z,);
  }
}

export class SvgXmlWriter {
  onNotification: NotificationEventHandler | null = null;

  configuration: SvgConfiguration;

  layout: Layout | null = null;

  units: UnitsType = UnitsType.Unitless;

  formatting: string = 'Indented';

  private _output: string = '';
  private _indent: number = 0;
  private _elementStack: string[] = [];
  private _inAttribute: boolean = false;
  private _attrName: string = '';
  private _attrValue: string = '';
  private _currentElementOpen: boolean = false;
  private _stream: ArrayBuffer | Uint8Array;
  private _encoding: string | null;

  constructor(stream: ArrayBuffer | Uint8Array, configuration: SvgConfiguration);
  constructor(stream: ArrayBuffer | Uint8Array, encoding: string | null, configuration: SvgConfiguration);
  constructor(stream: ArrayBuffer | Uint8Array, configOrEncoding: SvgConfiguration | string | null, configuration?: SvgConfiguration) {
    this._stream = stream;
    if (configuration !== undefined) {
      this._encoding = configOrEncoding as string | null;
      this.configuration = configuration;
    } else {
      this._encoding = null;
      this.configuration = configOrEncoding as SvgConfiguration;
    }
  }

  writeBlock(record: BlockRecord): void {
    this.units = record.units;

    const box = this._getBlockBoundingBox(record);

    this._startDocument(box, box, this.units);

    for (const e of record.entities) {
      this.writeEntity(e as Entity);
    }

    this._endDocument();
  }

  writeLayout(layout: Layout): void {
    this.layout = layout;
    this.units = UnitExtensions.toUnits(layout.paperUnits);

    let paperWidth = layout.paperWidth;
    let paperHeight = layout.paperHeight;

    switch (layout.paperRotation) {
      case PlotRotation.Degrees90:
      case PlotRotation.Degrees270:
        paperWidth = layout.paperHeight;
        paperHeight = layout.paperWidth;
        break;
    }

    const lowerCorner: XYZ = new XYZ(0, 0, 0);
    const upperCorner: XYZ = new XYZ(paperWidth, paperHeight, 0);
    const paper: BoundingBox = { min: lowerCorner, max: upperCorner, width: paperWidth, height: paperHeight };

    const lowerMargin: XYZ = new XYZ(layout.unprintableMargin?.bottomLeftCorner?.x ?? 0, layout.unprintableMargin?.bottomLeftCorner?.y ?? 0, 0,);

    this._startDocument(paper, null, UnitsType.Millimeters);

    const transform = new Transform(
      SvgConverter.vectorToPixelSize(lowerMargin, UnitsType.Millimeters),
      new XYZ(layout.printScale, layout.printScale, layout.printScale),
      new XYZ(0, 0, 0)
    );

    for (const e of layout.associatedBlock.entities) {
      this.writeEntity(e as Entity, transform);
    }

    this._endDocument();
  }

  // ========== XML Writing Methods ==========

  writeStartDocument(): void {
    this._output += '<?xml version="1.0" encoding="utf-8"?>\n';
  }

  writeEndDocument(): void {
    // no-op
  }

  writeStartElement(localName: string): void {
    this._closeOpenElement();
    this._output += `${this._getIndent()}<${localName}`;
    this._elementStack.push(localName);
    this._currentElementOpen = true;
    this._indent++;
  }

  writeEndElement(): void {
    this._indent--;
    if (this._currentElementOpen) {
      this._output += ' />\n';
      this._currentElementOpen = false;
      this._elementStack.pop();
    } else {
      this._elementStack.pop();
      this._output += `${this._getIndent()}</${this._elementStack.length >= 0 ? '' : ''}`;
      // Re-get the element name before it was popped
      this._output = this._output.slice(0, this._output.lastIndexOf(`${this._getIndent()}<`));
      // Actually let's redo this
      const name = this._elementStack.length >= 0 ? '' : '';
      this._output += `${this._getIndent()}</${this._getClosingTag()}>\n`;
    }
  }

  writeAttributeString(localName: string, value: string | number): void {
    if (typeof value === 'number') {
      this._output += ` ${localName}="${SvgConverter.toSvgWithUnits(value, this.units)}"`;
    } else {
      this._output += ` ${localName}="${this._escapeXml(value)}"`;
    }
  }

  writeStartAttribute(localName: string): void {
    this._inAttribute = true;
    this._attrName = localName;
    this._attrValue = '';
  }

  writeEndAttribute(): void {
    this._output += ` ${this._attrName}="${this._escapeXml(this._attrValue)}"`;
    this._inAttribute = false;
  }

  writeValue(value: string | number): void {
    if (this._inAttribute) {
      this._attrValue += typeof value === 'number' ? value.toString() : value;
    } else {
      this._closeOpenElement();
      this._output += this._escapeXml(typeof value === 'number' ? value.toString() : value);
    }
  }

  writeComment(comment: string): void {
    this._closeOpenElement();
    this._output += `${this._getIndent()}<!-- ${comment} -->\n`;
  }

  writeString(text: string): void {
    this._closeOpenElement();
    this._output += this._escapeXml(text);
  }

  close(): void {
    // Write output to stream
    const encoder = new TextEncoder();
    const bytes = encoder.encode(this._output);
    if (this._stream instanceof Uint8Array) {
      this._stream.set(bytes);
    }
  }

  getOutput(): string {
    return this._output;
  }

  // ========== Protected methods ==========

  protected notify(message: string, type: NotificationType, ex: Error | null = null): void {
    if (this.onNotification) {
      this.onNotification(this, new NotificationEventArgs(message, type, ex));
    }
  }

  protected triggerNotification(sender: object, e: NotificationEventArgs): void {
    if (this.onNotification) {
      this.onNotification(sender, e);
    }
  }

  protected writeEntity(entity: Entity, transform?: Transform): void {
    if (!transform) {
      transform = new Transform();
    }

    this.writeComment(`${entity.objectName} | ${entity.handle}`);

    if (entity instanceof Arc) {
      this._writeArc(entity as Arc, transform);
    } else if (entity instanceof Dimension) {
      this._writeDimension(entity as Dimension, transform);
    } else if (entity instanceof Line) {
      this._writeLine(entity as Line, transform);
    } else if (entity instanceof Point) {
      this._writePoint(entity as Point, transform);
    } else if (entity instanceof Circle) {
      this._writeCircle(entity as Circle, transform);
    } else if (entity instanceof Ellipse) {
      this._writeEllipse(entity as Ellipse, transform);
    } else if (entity instanceof Hatch) {
      this._writeHatch(entity as Hatch, transform);
    } else if (entity instanceof Insert) {
      this._writeInsert(entity as Insert, transform);
    } else if ('isClosed' in entity && 'vertices' in entity) {
      this._writePolyline(entity as unknown as IPolyline, transform);
    } else if (entity instanceof TextEntity || entity instanceof MText) {
      this._writeText(entity, transform);
    } else if (entity instanceof Solid) {
      this._writeSolid(entity as Solid, transform);
    } else {
      this.notify(`[${entity.objectName}] Entity not implemented.`, NotificationType.NotImplemented);
    }
  }

  // ========== Private helper methods ==========

  private _closeOpenElement(): void {
    if (this._currentElementOpen) {
      this._output += '>\n';
      this._currentElementOpen = false;
    }
  }

  private _getIndent(): string {
    return '  '.repeat(this._indent);
  }

  private _getClosingTag(): string {
    // We need to track this differently
    return '';
  }

  private _escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private _colorSvg(color: Color): string {
    if (this.layout !== null && color.equals(Color.default)) {
      color = Color.black;
    }
    return `rgb(${color.r},${color.g},${color.b})`;
  }

  private _getBlockBoundingBox(record: BlockRecord): BoundingBox {
    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;

    for (const item of record.entities) {
      if (!(item instanceof Entity)) {
        continue;
      }

      const box = this._normalizeBoundingBox(item.getBoundingBox());
      if (!box) {
        continue;
      }

      minX = Math.min(minX, box.min.x);
      minY = Math.min(minY, box.min.y);
      minZ = Math.min(minZ, box.min.z);
      maxX = Math.max(maxX, box.max.x);
      maxY = Math.max(maxY, box.max.y);
      maxZ = Math.max(maxZ, box.max.z);
    }

    if (!Number.isFinite(minX) || !Number.isFinite(maxX)) {
      return { min: new XYZ(0, 0, 0), max: new XYZ(0, 0, 0), width: 0, height: 0 };
    }

    const min = new XYZ(minX, minY, minZ);
    const max = new XYZ(maxX, maxY, maxZ);
    return { min: min, max: max, width: max.x - min.x, height: max.y - min.y };
  }

  private _normalizeBoundingBox(box: unknown): BoundingBox | null {
    if (!box || typeof box !== 'object') {
      return null;
    }

    const candidate = box as BoundingBoxLike;

    const min = candidate.min ?? candidate.min;
    const max = candidate.max ?? candidate.max;

    if (!min || !max) {
      return null;
    }

    const normalizedMin = new XYZ(min.x ?? 0, min.y ?? 0, min.z ?? 0);
    const normalizedMax = new XYZ(max.x ?? 0, max.y ?? 0, max.z ?? 0);
    return {
      min: normalizedMin,
      max: normalizedMax,
      width: normalizedMax.x - normalizedMin.x,
      height: normalizedMax.y - normalizedMin.y,
    };
  }

  private _getPolylinePoints(polyline: { getPoints?: (precision: number) => XYZ[] | XY[]; vertices?: Iterable<PolylineVertexLike>; }): Array<XY | XYZ> {
    if (typeof polyline.getPoints === 'function') {
      return polyline.getPoints(this.configuration.arcPoints);
    }

    const points: Array<XY | XYZ> = [];
    for (const vertex of polyline.vertices ?? []) {
      if (vertex == null || typeof vertex !== 'object') {
        continue;
      }

      const location = typeof vertex.getLocation3D === 'function'
        ? vertex.getLocation3D()
        : vertex.location;

      if (typeof location === 'object' && location !== null) {
        const vector = location as { x?: number; y?: number; z?: number };
        if (typeof vector.x === 'number' && typeof vector.y === 'number' && typeof vector.z === 'number') {
          points.push(new XYZ(vector.x, vector.y, vector.z));
        } else if (typeof vector.x === 'number' && typeof vector.y === 'number') {
          points.push(new XY(vector.x, vector.y));
        }
      }
    }

    return points;
  }

  private _createPath(...polylines: IPolyline[]): string {
    let sb = '';

    for (const item of polylines) {
      const pts = this._getPolylinePoints(item);
      if (!pts || pts.length === 0) {
        continue;
      }

      const pt0 = SvgConverter.vectorToPixelSize(pts[0], this.units);
      sb += `M ${SvgConverter.vectorToSvg(pt0)} `;
      for (let i = 1; i < pts.length; i++) {
        const pt = SvgConverter.vectorToPixelSize(pts[i], this.units);
        sb += `L ${SvgConverter.vectorToSvg(pt)} `;
      }

      if (item.isClosed) {
        sb += 'Z';
      }
    }

    return sb;
  }

  private _drawableLineType(lineType: LineType): boolean {
    return lineType.isComplex && !lineType.hasShapes;
  }

  private _getPointSize(entity: StyledSvgEntity): number {
    const lw = entity.getActiveLineWeightType ? entity.getActiveLineWeightType() : LineWeightType.Default;
    return SvgConverter.toPixelSize(
      this.configuration.getLineWeightValue(lw, this.units),
      this.units
    );
  }

  private _startDocument(box: BoundingBox, viewBox: BoundingBox | null, units: UnitsType): void {
    this.writeStartDocument();

    this.writeStartElement('svg');
    this.writeAttributeString('xmlns', 'http://www.w3.org/2000/svg');

    this.writeAttributeString('width', SvgConverter.toSvgWithUnits(box.max.x - box.min.x, units));
    this.writeAttributeString('height', SvgConverter.toSvgWithUnits(box.max.y - box.min.y, units));

    if (viewBox) {
      const vb = viewBox;
      this.writeStartAttribute('viewBox');
      this.writeValue(SvgConverter.toPixelSize(vb.min.x, units));
      this.writeValue(' ');
      this.writeValue(SvgConverter.toPixelSize(vb.min.y, units));
      this.writeValue(' ');
      this.writeValue(SvgConverter.toPixelSize(vb.width, units));
      this.writeValue(' ');
      this.writeValue(SvgConverter.toPixelSize(vb.height, units));
      this.writeEndAttribute();
    }

    this.writeAttributeString('transform', 'scale(1,-1)');

    if (this.layout !== null) {
      this.writeAttributeString('style', 'background-color:white');
    }
  }

  private _endDocument(): void {
    this.writeEndElement();
    this.writeEndDocument();
    this.close();
  }

  private _svgPoints(points: ReadonlyArray<XY | XYZ>, transform: Transform): string {
    if (!points || points.length === 0) {
      return '';
    }

    let sb = SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(points[0], this.units));
    for (let i = 1; i < points.length; i++) {
      sb += ' ';
      sb += SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(points[i], this.units));
    }

    return sb;
  }

  private _writeArc(arc: Arc, transform: Transform): void {
    this.writeStartElement('path');

    this._writeEntityHeader(arc, transform);

    const vertices = arc.getEndVertices();
    const start = vertices.start;
    const end = vertices.end;
    const sweep = arc.endAngle - arc.startAngle;
    const largeArc = Math.abs(sweep) > Math.PI ? 1 : 0;

    let sb = '';
    sb += `M ${SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(start, this.units))}`;
    sb += ` `;
    sb += `A ${SvgConverter.toPixelSize(arc.radius, this.units)} ${SvgConverter.toPixelSize(arc.radius, this.units)}`;
    sb += ` `;
    sb += `${0} ${largeArc} ${1} ${SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(end, this.units))}`;

    this.writeAttributeString('d', sb);
    this.writeAttributeString('fill', 'none');

    this.writeEndElement();
  }

  private _writeDimension(dimension: Dimension, transform: Transform): void {
    this.writeStartElement('g');

    if (dimension.block && dimension.block.entities) {
      for (const e of dimension.block.entities) {
        this.writeEntity(e as Entity, transform);
      }
    }

    this.writeEndElement();
  }

  private _writeCircle(circle: Circle, transform: Transform): void {
    const loc = transform.applyTransform(circle.center);

    this.writeStartElement('circle');

    this._writeEntityHeader(circle, transform);

    this.writeAttributeString('r', SvgConverter.toSvgWithUnits(circle.radius, this.units));
    this.writeAttributeString('cx', SvgConverter.toSvgWithUnits(loc.x, this.units));
    this.writeAttributeString('cy', SvgConverter.toSvgWithUnits(loc.y, this.units));

    this.writeAttributeString('fill', 'none');

    this.writeEndElement();
  }

  private _writeDashes(dashes: number[]): void {
    let sb = '';

    for (const d of dashes) {
      sb += Math.abs(SvgConverter.toPixelSize(d, this.units)).toString();
      sb += ' ';
    }

    this.writeAttributeString('stroke-dasharray', sb.trim());
  }

  private _writeDashesFromLineType(lineType: LineType, pointSize: number): void {
    let sb = '';
    for (const segment of lineType.segments) {
      if (segment.length === 0) {
        sb += SvgConverter.toPixelSize(pointSize, this.units).toString();
      } else {
        sb += Math.abs(SvgConverter.toPixelSize(segment.length, this.units)).toString();
      }
      sb += ' ';
    }

    this.writeAttributeString('stroke-dasharray', sb.trim());
  }

  private _writeEllipse(ellipse: Ellipse, transform: Transform): void {
    if (ellipse.isFullEllipse) {
      this.writeStartElement('path');

      this._writeEntityHeader(ellipse, transform);

      let sb = '';

      const start = ellipse.polarCoordinateRelativeToCenter ? ellipse.polarCoordinateRelativeToCenter(0) : new XYZ(0, 0, 0);
      const end = ellipse.polarCoordinateRelativeToCenter ? ellipse.polarCoordinateRelativeToCenter(Math.PI) : new XYZ(0, 0, 0);

      sb += `M ${SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(start, this.units))} `;
      sb += `A ${ellipse.majorAxis / 2} ${ellipse.minorAxis / 2} ${ellipse.rotation * 180 / Math.PI} ${0} ${1} ${SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(end, this.units))} `;

      const start2 = ellipse.polarCoordinateRelativeToCenter ? ellipse.polarCoordinateRelativeToCenter(Math.PI) : new XYZ(0, 0, 0);
      const end2 = ellipse.polarCoordinateRelativeToCenter ? ellipse.polarCoordinateRelativeToCenter(Math.PI * 2) : new XYZ(0, 0, 0);
      sb += `A ${ellipse.majorAxis / 2} ${ellipse.minorAxis / 2} ${ellipse.rotation * 180 / Math.PI} ${0} ${1} ${SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(end2, this.units))}`;

      this.writeAttributeString('d', sb);
      this.writeAttributeString('fill', 'none');
      this.writeEndElement();
    } else {
      this.writeStartElement('polyline');

      this._writeEntityHeader(ellipse, transform);

      const vertices = ellipse.polygonalVertexes ? ellipse.polygonalVertexes(256) : [];
      const pts = this._svgPoints(vertices, transform);
      this.writeAttributeString('points', pts);
      this.writeAttributeString('fill', 'none');

      this.writeEndElement();
    }
  }

  private _writeEntityHeader(entity: StyledSvgEntity, transform: Transform, drawStroke: boolean = true): void {
    const color = entity.getActiveColor ? entity.getActiveColor() : entity.color ?? Color.default;

    this.writeAttributeString('vector-effect', 'non-scaling-stroke');

    if (drawStroke) {
      this.writeAttributeString('stroke', this._colorSvg(color));
    } else {
      this.writeAttributeString('stroke', 'none');
    }

    const lineWeight = entity.getActiveLineWeightType ? entity.getActiveLineWeightType() : LineWeightType.Default;
    this.writeAttributeString('stroke-width', `${SvgConverter.toSvgWithUnits(this.configuration.getLineWeightValue(lineWeight, this.units), UnitsType.Millimeters)}`);

    this._writeTransformObj(transform);

    const lt = entity.getActiveLineType ? entity.getActiveLineType() : null;
    if (lt && this._drawableLineType(lt)) {
      this._writeDashesFromLineType(lt, this._getPointSize(entity));
    }
  }

  private _writeHatch(hatch: Hatch, transform: Transform): void {
    this.writeStartElement('g');

    const patternId = this._writePattern(hatch);

    const plines: IPolyline[] = [];
    for (const path of hatch.paths) {
      const pts = path.getPoints ? path.getPoints(this.configuration.arcPoints) : [];
      const pline = new Polyline3D(pts);
      plines.push(pline as unknown as IPolyline);
    }

    this.writeStartElement('path');

    this._writeEntityHeader(hatch, transform, false);

    this.writeAttributeString('d', this._createPath(...plines));

    this.writeAttributeString('fill', `url(#${patternId})`);

    this.writeEndElement();

    this.writeEndElement();
  }

  private _writePatternHeader(hatch: Hatch): string {
    const id = `${hatch.pattern.name}_pattern`;

    this.writeStartElement('pattern');

    this.writeAttributeString('id', id);
    this.writeAttributeString('patternUnits', 'userSpaceOnUse');

    return id;
  }

  private _writeSolidPattern(hatch: Hatch): string {
    const id = this._writePatternHeader(hatch);

    this.writeAttributeString('width', '100%');
    this.writeAttributeString('height', '100%');

    this.writeStartElement('rect');

    this.writeAttributeString('width', '100%');
    this.writeAttributeString('height', '100%');
    this.writeAttributeString('fill', this._colorSvg(hatch.color));

    // rect
    this.writeEndElement();

    // pattern
    this.writeEndElement();

    return id;
  }

  private _writePattern(hatch: Hatch): string {
    if (hatch.isSolid) {
      return this._writeSolidPattern(hatch);
    }

    const patterns = new Map<string, BoundingBox>();
    for (const [index, item] of hatch.pattern.lines.entries()) {
      const i = `${hatch.pattern.name}_${index}_line`;
      patterns.set(i, {
        min: new XYZ(0, 0, 0),
        max: new XYZ(item.lineOffset, item.lineOffset, 0),
        width: item.lineOffset,
        height: item.lineOffset,
      });

      this.writeStartElement('pattern');
      this.writeAttributeString('id', i);
      this.writeAttributeString('patternUnits', 'userSpaceOnUse');

      this.writeAttributeString('width', SvgConverter.toSvgWithUnits(item.lineOffset, this.units));
      this.writeAttributeString('height', SvgConverter.toSvgWithUnits(item.lineOffset, this.units));

      this._writeTransformValues(
        'patternTransform',
        SvgConverter.vectorToPixelSize(new XYZ(item.basePoint.x, item.basePoint.y, 0), this.units)
      );

      this.writeStartElement('line');

      const x = Math.cos(item.angle) * 10;
      const y = Math.sin(item.angle) * 10;

      this.writeAttributeString('x1', SvgConverter.toSvgWithUnits(0, this.units));
      this.writeAttributeString('y1', SvgConverter.toSvgWithUnits(0, this.units));
      this.writeAttributeString('x2', SvgConverter.toSvgWithUnits(x, this.units));
      this.writeAttributeString('y2', SvgConverter.toSvgWithUnits(y, this.units));

      this.writeAttributeString('stroke', this._colorSvg(hatch.color));
      this.writeAttributeString('stroke-width', `${SvgConverter.toSvgWithUnits(this.configuration.getLineWeightValue(hatch.lineWeight ?? LineWeightType.Default, this.units), UnitsType.Millimeters)}`);

      if (item.dashLengths && item.dashLengths.length > 0) {
        this._writeDashes(item.dashLengths);
      }

      // Line
      this.writeEndElement();

      // Pattern
      this.writeEndElement();
    }

    const id = this._writePatternHeader(hatch);
    let width = 0;
    let height = 0;
    for (const [, box] of patterns) {
      if (box.width > width) width = box.width;
      if (box.height > height) height = box.height;
    }

    this.writeAttributeString('width', SvgConverter.toSvgWithUnits(width, this.units));
    this.writeAttributeString('height', SvgConverter.toSvgWithUnits(height, this.units));

    for (const [key, box] of patterns) {
      this.writeStartElement('rect');
      this.writeAttributeString('width', SvgConverter.toSvgWithUnits(box.width, this.units));
      this.writeAttributeString('height', SvgConverter.toSvgWithUnits(box.height, this.units));
      this.writeAttributeString('fill', `url(#${key})`);
      this.writeEndElement();
    }

    // pattern
    this.writeEndElement();

    return id;
  }

  private _writeInsert(insert: Insert, transform: Transform): void {
    const insertTransform = insert.getTransform ? insert.getTransform() : new Transform();
    // Merge transforms
    const merged = new Transform(
      new XYZ(transform.translation.x + insertTransform.translation.x, transform.translation.y + insertTransform.translation.y, transform.translation.z + insertTransform.translation.z,)
    );

    this.writeStartElement('g');
    this._writeTransformObj(merged);

    for (const e of insert.block.entities) {
      this.writeEntity(e as Entity);
    }

    this.writeEndElement();
  }

  private _writeLine(line: Line, transform: Transform): void {
    this.writeStartElement('line');

    this._writeEntityHeader(line, transform);

    this.writeAttributeString('x1', SvgConverter.toSvgWithUnits(line.startPoint.x, this.units));
    this.writeAttributeString('y1', SvgConverter.toSvgWithUnits(line.startPoint.y, this.units));
    this.writeAttributeString('x2', SvgConverter.toSvgWithUnits(line.endPoint.x, this.units));
    this.writeAttributeString('y2', SvgConverter.toSvgWithUnits(line.endPoint.y, this.units));

    this.writeEndElement();
  }

  private _writePoint(point: Point, transform: Transform): void {
    this.writeStartElement('circle');

    this._writeEntityHeader(point, transform);

    this.writeAttributeString('r', SvgConverter.toSvgWithUnits(this.configuration.pointRadius, UnitsType.Unitless));
    this.writeAttributeString('cx', SvgConverter.toSvgWithUnits(point.location.x, this.units));
    this.writeAttributeString('cy', SvgConverter.toSvgWithUnits(point.location.y, this.units));

    this.writeAttributeString('fill', this._colorSvg(point.color));

    this.writeEndElement();
  }

  private _writePolyline(polyline: IPolyline, transform: Transform): void {
    if (polyline.isClosed) {
      this.writeStartElement('polygon');
    } else {
      this.writeStartElement('polyline');
    }

    this._writeEntityHeader(polyline, transform);

    const pts = this._getPolylinePoints(polyline);
    const ptsStr = this._svgPoints(pts, transform);

    this.writeAttributeString('points', ptsStr);
    this.writeAttributeString('fill', 'none');

    this.writeEndElement();
  }

  private _writeText(text: TextEntity | MText, transform: Transform): void {
    let insert: XYZ;

    if (text instanceof TextEntity
      && (text.horizontalAlignment !== TextHorizontalAlignment.Left
        || text.verticalAlignment !== TextVerticalAlignmentType.Baseline)
      && !(text.horizontalAlignment === TextHorizontalAlignment.Fit
        || text.horizontalAlignment === TextHorizontalAlignment.Aligned)) {
      insert = text.alignmentPoint;
    } else {
      insert = text.insertPoint;
    }

    this.writeStartElement('g');
    this._writeTransformObj(transform);

    this.writeStartElement('text');

    this._writeTransformValues(
      'transform',
      SvgConverter.vectorToPixelSize(insert, this.units),
      new XYZ(1, -1, 0),
      text.rotation !== 0 ? text.rotation : undefined
    );

    this.writeAttributeString('fill', this._colorSvg(text.color ?? Color.default));

    let style = 'font:';
    style += SvgConverter.toSvgWithUnits(text.height, this.units);
    if (this.units === UnitsType.Unitless) {
      style += 'px';
    }

    if (text.style?.trueType !== undefined) {
      if (text.style.trueType & FontFlags.Bold) {
        style += 'bold';
      }
      if (text.style.trueType & FontFlags.Italic) {
        style += 'italic';
      }
    }

    style += ' ';
    if (text.style?.filename) {
      const filename = text.style.filename;
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
      style += nameWithoutExt;
    }

    this.writeAttributeString('style', style);

    if (text instanceof MText) {
      const mtext = text as MText;
      switch (mtext.attachmentPoint) {
        case AttachmentPointType.TopLeft:
          this.writeAttributeString('alignment-baseline', 'hanging');
          this.writeAttributeString('text-anchor', 'start');
          break;
        case AttachmentPointType.TopCenter:
          this.writeAttributeString('alignment-baseline', 'hanging');
          this.writeAttributeString('text-anchor', 'middle');
          break;
        case AttachmentPointType.TopRight:
          this.writeAttributeString('alignment-baseline', 'hanging');
          this.writeAttributeString('text-anchor', 'end');
          break;
        case AttachmentPointType.MiddleLeft:
          this.writeAttributeString('alignment-baseline', 'middle');
          this.writeAttributeString('text-anchor', 'start');
          break;
        case AttachmentPointType.MiddleCenter:
          this.writeAttributeString('alignment-baseline', 'middle');
          this.writeAttributeString('text-anchor', 'middle');
          break;
        case AttachmentPointType.MiddleRight:
          this.writeAttributeString('alignment-baseline', 'middle');
          this.writeAttributeString('text-anchor', 'end');
          break;
        case AttachmentPointType.BottomLeft:
          this.writeAttributeString('alignment-baseline', 'baseline');
          this.writeAttributeString('text-anchor', 'start');
          break;
        case AttachmentPointType.BottomCenter:
          this.writeAttributeString('alignment-baseline', 'baseline');
          this.writeAttributeString('text-anchor', 'middle');
          break;
        case AttachmentPointType.BottomRight:
          this.writeAttributeString('alignment-baseline', 'baseline');
          this.writeAttributeString('text-anchor', 'end');
          break;
      }

      const lines = mtext.getPlainTextLines ? mtext.getPlainTextLines() : [mtext.value];
      for (const item of lines) {
        this.writeStartElement('tspan');
        this.writeAttributeString('x', '0');
        this.writeAttributeString('dy', '1em');
        this.writeString(item);
        this.writeEndElement();
      }

      // Hidden line to avoid offset
      this.writeStartElement('tspan');
      this.writeAttributeString('x', '0');
      this.writeAttributeString('dy', '1em');
      this.writeAttributeString('visibility', 'hidden');
      this.writeString('.');
      this.writeEndElement();
    } else if (text instanceof TextEntity) {
      const textEntity = text as TextEntity;

      switch (textEntity.horizontalAlignment) {
        case TextHorizontalAlignment.Left:
          this.writeAttributeString('text-anchor', 'start');
          break;
        case TextHorizontalAlignment.Middle:
        case TextHorizontalAlignment.Center:
          this.writeAttributeString('text-anchor', 'middle');
          break;
        case TextHorizontalAlignment.Right:
          this.writeAttributeString('text-anchor', 'end');
          break;
      }

      switch (textEntity.verticalAlignment) {
        case TextVerticalAlignmentType.Baseline:
        case TextVerticalAlignmentType.Bottom:
          this.writeAttributeString('alignment-baseline', 'baseline');
          break;
        case TextVerticalAlignmentType.Middle:
          this.writeAttributeString('alignment-baseline', 'middle');
          break;
        case TextVerticalAlignmentType.Top:
          this.writeAttributeString('alignment-baseline', 'hanging');
          break;
      }

      this.writeString(text.value);
    }

    this.writeEndElement();
    this.writeEndElement();
  }

  private _writeSolid(solid: Solid, transform: Transform): void {
    this.writeStartElement('polygon');

    this._writeEntityHeader(solid, transform);

    const pts = this._svgPoints([solid.firstCorner, solid.secondCorner, solid.thirdCorner, solid.fourthCorner], transform);
    this.writeAttributeString('points', pts);
    this.writeAttributeString('fill', this._colorSvg(solid.color));

    this.writeEndElement();
  }

  private _writeTransformObj(transform: Transform): void {
    const translation = (transform.translation.x !== 0 || transform.translation.y !== 0 || transform.translation.z !== 0) ? transform.translation : undefined;
    const scale = (transform.scale.x !== 1 || transform.scale.y !== 1) ? transform.scale : undefined;
    const rotation = transform.eulerRotation.z !== 0 ? transform.eulerRotation.z : undefined;

    this._writeTransformValues('transform', translation, scale, rotation);
  }

  private _writeTransformValues(name: string = 'transform', translation?: XYZ, scale?: XYZ, rotation?: number): void {
    let sb = '';

    if (translation) {
      sb += `translate(${translation.x.toString()},${translation.y.toString()})`;
    }

    if (scale) {
      sb += `scale(${scale.x.toString()},${scale.y.toString()})`;
    }

    if (rotation !== undefined) {
      const r = -(rotation * 180 / Math.PI);
      sb += `rotate(${r.toString()})`;
    }

    if (!sb) {
      return;
    }

    this.writeAttributeString(name, sb);
  }
}
