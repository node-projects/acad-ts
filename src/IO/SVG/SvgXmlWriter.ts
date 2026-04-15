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

interface BoundingBox { Min: XYZ; Max: XYZ; Width: number; Height: number; }
type BoundingBoxLike = {
  Min?: { x?: number; y?: number; z?: number } | null;
  Max?: { x?: number; y?: number; z?: number } | null;
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
  Translation: XYZ = new XYZ(0, 0, 0);
  Scale: XYZ = new XYZ(1, 1, 1);
  EulerRotation: XYZ = new XYZ(0, 0, 0);
  Matrix: number[][] | null = null;

  constructor(translation?: XYZ, scale?: XYZ, rotation?: XYZ) {
    if (translation) this.Translation = translation;
    if (scale) this.Scale = scale;
    if (rotation) this.EulerRotation = rotation;
  }

  ApplyTransform(point: XYZ): XYZ {
    return new XYZ(point.x + this.Translation.x, point.y + this.Translation.y, point.z + this.Translation.z,);
  }
}

export class SvgXmlWriter {
  OnNotification: NotificationEventHandler | null = null;

  Configuration: SvgConfiguration;

  Layout: Layout | null = null;

  Units: UnitsType = UnitsType.Unitless;

  Formatting: string = 'Indented';

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
      this.Configuration = configuration;
    } else {
      this._encoding = null;
      this.Configuration = configOrEncoding as SvgConfiguration;
    }
  }

  WriteBlock(record: BlockRecord): void {
    this.Units = record.units;

    const box = this.getBlockBoundingBox(record);

    this.startDocument(box, box, this.Units);

    for (const e of record.entities) {
      this.writeEntity(e as Entity);
    }

    this.endDocument();
  }

  WriteLayout(layout: Layout): void {
    this.Layout = layout;
    this.Units = UnitExtensions.toUnits(layout.paperUnits);

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
    const paper: BoundingBox = { Min: lowerCorner, Max: upperCorner, Width: paperWidth, Height: paperHeight };

    const lowerMargin: XYZ = new XYZ(layout.unprintableMargin?.bottomLeftCorner?.x ?? 0, layout.unprintableMargin?.bottomLeftCorner?.y ?? 0, 0,);

    this.startDocument(paper, null, UnitsType.Millimeters);

    const transform = new Transform(
      SvgConverter.vectorToPixelSize(lowerMargin, UnitsType.Millimeters),
      new XYZ(layout.printScale, layout.printScale, layout.printScale),
      new XYZ(0, 0, 0)
    );

    for (const e of layout.associatedBlock.entities) {
      this.writeEntity(e as Entity, transform);
    }

    this.endDocument();
  }

  // ========== XML Writing Methods ==========

  WriteStartDocument(): void {
    this._output += '<?xml version="1.0" encoding="utf-8"?>\n';
  }

  WriteEndDocument(): void {
    // no-op
  }

  WriteStartElement(localName: string): void {
    this.closeOpenElement();
    this._output += `${this.getIndent()}<${localName}`;
    this._elementStack.push(localName);
    this._currentElementOpen = true;
    this._indent++;
  }

  WriteEndElement(): void {
    this._indent--;
    if (this._currentElementOpen) {
      this._output += ' />\n';
      this._currentElementOpen = false;
      this._elementStack.pop();
    } else {
      this._elementStack.pop();
      this._output += `${this.getIndent()}</${this._elementStack.length >= 0 ? '' : ''}`;
      // Re-get the element name before it was popped
      this._output = this._output.slice(0, this._output.lastIndexOf(`${this.getIndent()}<`));
      // Actually let's redo this
      const name = this._elementStack.length >= 0 ? '' : '';
      this._output += `${this.getIndent()}</${this.getClosingTag()}>\n`;
    }
  }

  WriteAttributeString(localName: string, value: string | number): void {
    if (typeof value === 'number') {
      this._output += ` ${localName}="${SvgConverter.toSvgWithUnits(value, this.Units)}"`;
    } else {
      this._output += ` ${localName}="${this.escapeXml(value)}"`;
    }
  }

  WriteStartAttribute(localName: string): void {
    this._inAttribute = true;
    this._attrName = localName;
    this._attrValue = '';
  }

  WriteEndAttribute(): void {
    this._output += ` ${this._attrName}="${this.escapeXml(this._attrValue)}"`;
    this._inAttribute = false;
  }

  WriteValue(value: string | number): void {
    if (this._inAttribute) {
      this._attrValue += typeof value === 'number' ? value.toString() : value;
    } else {
      this.closeOpenElement();
      this._output += this.escapeXml(typeof value === 'number' ? value.toString() : value);
    }
  }

  WriteComment(comment: string): void {
    this.closeOpenElement();
    this._output += `${this.getIndent()}<!-- ${comment} -->\n`;
  }

  WriteString(text: string): void {
    this.closeOpenElement();
    this._output += this.escapeXml(text);
  }

  Close(): void {
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
    if (this.OnNotification) {
      this.OnNotification(this, new NotificationEventArgs(message, type, ex));
    }
  }

  protected triggerNotification(sender: object, e: NotificationEventArgs): void {
    if (this.OnNotification) {
      this.OnNotification(sender, e);
    }
  }

  protected writeEntity(entity: Entity, transform?: Transform): void {
    if (!transform) {
      transform = new Transform();
    }

    this.WriteComment(`${entity.objectName} | ${entity.handle}`);

    if (entity instanceof Arc) {
      this.writeArc(entity as Arc, transform);
    } else if (entity instanceof Dimension) {
      this.writeDimension(entity as Dimension, transform);
    } else if (entity instanceof Line) {
      this.writeLine(entity as Line, transform);
    } else if (entity instanceof Point) {
      this.writePoint(entity as Point, transform);
    } else if (entity instanceof Circle) {
      this.writeCircle(entity as Circle, transform);
    } else if (entity instanceof Ellipse) {
      this.writeEllipse(entity as Ellipse, transform);
    } else if (entity instanceof Hatch) {
      this.writeHatch(entity as Hatch, transform);
    } else if (entity instanceof Insert) {
      this.writeInsert(entity as Insert, transform);
    } else if ('isClosed' in entity && 'vertices' in entity) {
      this.writePolyline(entity as unknown as IPolyline, transform);
    } else if (entity instanceof TextEntity || entity instanceof MText) {
      this.writeText(entity, transform);
    } else if (entity instanceof Solid) {
      this.writeSolid(entity as Solid, transform);
    } else {
      this.notify(`[${entity.objectName}] Entity not implemented.`, NotificationType.NotImplemented);
    }
  }

  // ========== Private helper methods ==========

  private closeOpenElement(): void {
    if (this._currentElementOpen) {
      this._output += '>\n';
      this._currentElementOpen = false;
    }
  }

  private getIndent(): string {
    return '  '.repeat(this._indent);
  }

  private getClosingTag(): string {
    // We need to track this differently
    return '';
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private colorSvg(color: Color): string {
    if (this.Layout !== null && color.equals(Color.Default)) {
      color = Color.Black;
    }
    return `rgb(${color.r},${color.g},${color.b})`;
  }

  private getBlockBoundingBox(record: BlockRecord): BoundingBox {
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

      const box = this.normalizeBoundingBox(item.getBoundingBox());
      if (!box) {
        continue;
      }

      minX = Math.min(minX, box.Min.x);
      minY = Math.min(minY, box.Min.y);
      minZ = Math.min(minZ, box.Min.z);
      maxX = Math.max(maxX, box.Max.x);
      maxY = Math.max(maxY, box.Max.y);
      maxZ = Math.max(maxZ, box.Max.z);
    }

    if (!Number.isFinite(minX) || !Number.isFinite(maxX)) {
      return { Min: new XYZ(0, 0, 0), Max: new XYZ(0, 0, 0), Width: 0, Height: 0 };
    }

    const min = new XYZ(minX, minY, minZ);
    const max = new XYZ(maxX, maxY, maxZ);
    return { Min: min, Max: max, Width: max.x - min.x, Height: max.y - min.y };
  }

  private normalizeBoundingBox(box: unknown): BoundingBox | null {
    if (!box || typeof box !== 'object') {
      return null;
    }

    const candidate = box as BoundingBoxLike;

    const min = candidate.Min ?? candidate.min;
    const max = candidate.Max ?? candidate.max;

    if (!min || !max) {
      return null;
    }

    const normalizedMin = new XYZ(min.x ?? 0, min.y ?? 0, min.z ?? 0);
    const normalizedMax = new XYZ(max.x ?? 0, max.y ?? 0, max.z ?? 0);
    return {
      Min: normalizedMin,
      Max: normalizedMax,
      Width: normalizedMax.x - normalizedMin.x,
      Height: normalizedMax.y - normalizedMin.y,
    };
  }

  private getPolylinePoints(polyline: { getPoints?: (precision: number) => XYZ[] | XY[]; vertices?: Iterable<PolylineVertexLike>; }): Array<XY | XYZ> {
    if (typeof polyline.getPoints === 'function') {
      return polyline.getPoints(this.Configuration.ArcPoints);
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

  private createPath(...polylines: IPolyline[]): string {
    let sb = '';

    for (const item of polylines) {
      const pts = this.getPolylinePoints(item);
      if (!pts || pts.length === 0) {
        continue;
      }

      const pt0 = SvgConverter.vectorToPixelSize(pts[0], this.Units);
      sb += `M ${SvgConverter.vectorToSvg(pt0)} `;
      for (let i = 1; i < pts.length; i++) {
        const pt = SvgConverter.vectorToPixelSize(pts[i], this.Units);
        sb += `L ${SvgConverter.vectorToSvg(pt)} `;
      }

      if (item.isClosed) {
        sb += 'Z';
      }
    }

    return sb;
  }

  private drawableLineType(lineType: LineType): boolean {
    return lineType.isComplex && !lineType.hasShapes;
  }

  private getPointSize(entity: StyledSvgEntity): number {
    const lw = entity.getActiveLineWeightType ? entity.getActiveLineWeightType() : LineWeightType.Default;
    return SvgConverter.toPixelSize(
      this.Configuration.GetLineWeightValue(lw, this.Units),
      this.Units
    );
  }

  private startDocument(box: BoundingBox, viewBox: BoundingBox | null, units: UnitsType): void {
    this.WriteStartDocument();

    this.WriteStartElement('svg');
    this.WriteAttributeString('xmlns', 'http://www.w3.org/2000/svg');

    this.WriteAttributeString('width', SvgConverter.toSvgWithUnits(box.Max.x - box.Min.x, units));
    this.WriteAttributeString('height', SvgConverter.toSvgWithUnits(box.Max.y - box.Min.y, units));

    if (viewBox) {
      const vb = viewBox;
      this.WriteStartAttribute('viewBox');
      this.WriteValue(SvgConverter.toPixelSize(vb.Min.x, units));
      this.WriteValue(' ');
      this.WriteValue(SvgConverter.toPixelSize(vb.Min.y, units));
      this.WriteValue(' ');
      this.WriteValue(SvgConverter.toPixelSize(vb.Width, units));
      this.WriteValue(' ');
      this.WriteValue(SvgConverter.toPixelSize(vb.Height, units));
      this.WriteEndAttribute();
    }

    this.WriteAttributeString('transform', 'scale(1,-1)');

    if (this.Layout !== null) {
      this.WriteAttributeString('style', 'background-color:white');
    }
  }

  private endDocument(): void {
    this.WriteEndElement();
    this.WriteEndDocument();
    this.Close();
  }

  private svgPoints(points: ReadonlyArray<XY | XYZ>, transform: Transform): string {
    if (!points || points.length === 0) {
      return '';
    }

    let sb = SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(points[0], this.Units));
    for (let i = 1; i < points.length; i++) {
      sb += ' ';
      sb += SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(points[i], this.Units));
    }

    return sb;
  }

  private writeArc(arc: Arc, transform: Transform): void {
    this.WriteStartElement('path');

    this.writeEntityHeader(arc, transform);

    const vertices = arc.getEndVertices();
    const start = vertices.start;
    const end = vertices.end;
    const sweep = arc.endAngle - arc.startAngle;
    const largeArc = Math.abs(sweep) > Math.PI ? 1 : 0;

    let sb = '';
    sb += `M ${SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(start, this.Units))}`;
    sb += ` `;
    sb += `A ${SvgConverter.toPixelSize(arc.radius, this.Units)} ${SvgConverter.toPixelSize(arc.radius, this.Units)}`;
    sb += ` `;
    sb += `${0} ${largeArc} ${1} ${SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(end, this.Units))}`;

    this.WriteAttributeString('d', sb);
    this.WriteAttributeString('fill', 'none');

    this.WriteEndElement();
  }

  private writeDimension(dimension: Dimension, transform: Transform): void {
    this.WriteStartElement('g');

    if (dimension.block && dimension.block.entities) {
      for (const e of dimension.block.entities) {
        this.writeEntity(e as Entity, transform);
      }
    }

    this.WriteEndElement();
  }

  private writeCircle(circle: Circle, transform: Transform): void {
    const loc = transform.ApplyTransform(circle.center);

    this.WriteStartElement('circle');

    this.writeEntityHeader(circle, transform);

    this.WriteAttributeString('r', SvgConverter.toSvgWithUnits(circle.radius, this.Units));
    this.WriteAttributeString('cx', SvgConverter.toSvgWithUnits(loc.x, this.Units));
    this.WriteAttributeString('cy', SvgConverter.toSvgWithUnits(loc.y, this.Units));

    this.WriteAttributeString('fill', 'none');

    this.WriteEndElement();
  }

  private writeDashes(dashes: number[]): void {
    let sb = '';

    for (const d of dashes) {
      sb += Math.abs(SvgConverter.toPixelSize(d, this.Units)).toString();
      sb += ' ';
    }

    this.WriteAttributeString('stroke-dasharray', sb.trim());
  }

  private writeDashesFromLineType(lineType: LineType, pointSize: number): void {
    let sb = '';
    for (const segment of lineType.segments) {
      if (segment.length === 0) {
        sb += SvgConverter.toPixelSize(pointSize, this.Units).toString();
      } else {
        sb += Math.abs(SvgConverter.toPixelSize(segment.length, this.Units)).toString();
      }
      sb += ' ';
    }

    this.WriteAttributeString('stroke-dasharray', sb.trim());
  }

  private writeEllipse(ellipse: Ellipse, transform: Transform): void {
    if (ellipse.isFullEllipse) {
      this.WriteStartElement('path');

      this.writeEntityHeader(ellipse, transform);

      let sb = '';

      const start = ellipse.polarCoordinateRelativeToCenter ? ellipse.polarCoordinateRelativeToCenter(0) : new XYZ(0, 0, 0);
      const end = ellipse.polarCoordinateRelativeToCenter ? ellipse.polarCoordinateRelativeToCenter(Math.PI) : new XYZ(0, 0, 0);

      sb += `M ${SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(start, this.Units))} `;
      sb += `A ${ellipse.majorAxis / 2} ${ellipse.minorAxis / 2} ${ellipse.rotation * 180 / Math.PI} ${0} ${1} ${SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(end, this.Units))} `;

      const start2 = ellipse.polarCoordinateRelativeToCenter ? ellipse.polarCoordinateRelativeToCenter(Math.PI) : new XYZ(0, 0, 0);
      const end2 = ellipse.polarCoordinateRelativeToCenter ? ellipse.polarCoordinateRelativeToCenter(Math.PI * 2) : new XYZ(0, 0, 0);
      sb += `A ${ellipse.majorAxis / 2} ${ellipse.minorAxis / 2} ${ellipse.rotation * 180 / Math.PI} ${0} ${1} ${SvgConverter.vectorToSvg(SvgConverter.vectorToPixelSize(end2, this.Units))}`;

      this.WriteAttributeString('d', sb);
      this.WriteAttributeString('fill', 'none');
      this.WriteEndElement();
    } else {
      this.WriteStartElement('polyline');

      this.writeEntityHeader(ellipse, transform);

      const vertices = ellipse.polygonalVertexes ? ellipse.polygonalVertexes(256) : [];
      const pts = this.svgPoints(vertices, transform);
      this.WriteAttributeString('points', pts);
      this.WriteAttributeString('fill', 'none');

      this.WriteEndElement();
    }
  }

  private writeEntityHeader(entity: StyledSvgEntity, transform: Transform, drawStroke: boolean = true): void {
    const color = entity.getActiveColor ? entity.getActiveColor() : entity.color ?? Color.Default;

    this.WriteAttributeString('vector-effect', 'non-scaling-stroke');

    if (drawStroke) {
      this.WriteAttributeString('stroke', this.colorSvg(color));
    } else {
      this.WriteAttributeString('stroke', 'none');
    }

    const lineWeight = entity.getActiveLineWeightType ? entity.getActiveLineWeightType() : LineWeightType.Default;
    this.WriteAttributeString('stroke-width', `${SvgConverter.toSvgWithUnits(this.Configuration.GetLineWeightValue(lineWeight, this.Units), UnitsType.Millimeters)}`);

    this.writeTransformObj(transform);

    const lt = entity.getActiveLineType ? entity.getActiveLineType() : null;
    if (lt && this.drawableLineType(lt)) {
      this.writeDashesFromLineType(lt, this.getPointSize(entity));
    }
  }

  private writeHatch(hatch: Hatch, transform: Transform): void {
    this.WriteStartElement('g');

    const patternId = this.writePattern(hatch);

    const plines: IPolyline[] = [];
    for (const path of hatch.paths) {
      const pts = path.getPoints ? path.getPoints(this.Configuration.ArcPoints) : [];
      const pline = new Polyline3D(pts);
      plines.push(pline as unknown as IPolyline);
    }

    this.WriteStartElement('path');

    this.writeEntityHeader(hatch, transform, false);

    this.WriteAttributeString('d', this.createPath(...plines));

    this.WriteAttributeString('fill', `url(#${patternId})`);

    this.WriteEndElement();

    this.WriteEndElement();
  }

  private writePatternHeader(hatch: Hatch): string {
    const id = `${hatch.pattern.name}_pattern`;

    this.WriteStartElement('pattern');

    this.WriteAttributeString('id', id);
    this.WriteAttributeString('patternUnits', 'userSpaceOnUse');

    return id;
  }

  private writeSolidPattern(hatch: Hatch): string {
    const id = this.writePatternHeader(hatch);

    this.WriteAttributeString('width', '100%');
    this.WriteAttributeString('height', '100%');

    this.WriteStartElement('rect');

    this.WriteAttributeString('width', '100%');
    this.WriteAttributeString('height', '100%');
    this.WriteAttributeString('fill', this.colorSvg(hatch.color));

    // rect
    this.WriteEndElement();

    // pattern
    this.WriteEndElement();

    return id;
  }

  private writePattern(hatch: Hatch): string {
    if (hatch.isSolid) {
      return this.writeSolidPattern(hatch);
    }

    const patterns = new Map<string, BoundingBox>();
    for (const [index, item] of hatch.pattern.lines.entries()) {
      const i = `${hatch.pattern.name}_${index}_line`;
      patterns.set(i, {
        Min: new XYZ(0, 0, 0),
        Max: new XYZ(item.lineOffset, item.lineOffset, 0),
        Width: item.lineOffset,
        Height: item.lineOffset,
      });

      this.WriteStartElement('pattern');
      this.WriteAttributeString('id', i);
      this.WriteAttributeString('patternUnits', 'userSpaceOnUse');

      this.WriteAttributeString('width', SvgConverter.toSvgWithUnits(item.lineOffset, this.Units));
      this.WriteAttributeString('height', SvgConverter.toSvgWithUnits(item.lineOffset, this.Units));

      this.writeTransformValues(
        'patternTransform',
        SvgConverter.vectorToPixelSize(new XYZ(item.basePoint.x, item.basePoint.y, 0), this.Units)
      );

      this.WriteStartElement('line');

      const x = Math.cos(item.angle) * 10;
      const y = Math.sin(item.angle) * 10;

      this.WriteAttributeString('x1', SvgConverter.toSvgWithUnits(0, this.Units));
      this.WriteAttributeString('y1', SvgConverter.toSvgWithUnits(0, this.Units));
      this.WriteAttributeString('x2', SvgConverter.toSvgWithUnits(x, this.Units));
      this.WriteAttributeString('y2', SvgConverter.toSvgWithUnits(y, this.Units));

      this.WriteAttributeString('stroke', this.colorSvg(hatch.color));
      this.WriteAttributeString('stroke-width', `${SvgConverter.toSvgWithUnits(this.Configuration.GetLineWeightValue(hatch.lineWeight ?? LineWeightType.Default, this.Units), UnitsType.Millimeters)}`);

      if (item.dashLengths && item.dashLengths.length > 0) {
        this.writeDashes(item.dashLengths);
      }

      // Line
      this.WriteEndElement();

      // Pattern
      this.WriteEndElement();
    }

    const id = this.writePatternHeader(hatch);
    let width = 0;
    let height = 0;
    for (const [, box] of patterns) {
      if (box.Width > width) width = box.Width;
      if (box.Height > height) height = box.Height;
    }

    this.WriteAttributeString('width', SvgConverter.toSvgWithUnits(width, this.Units));
    this.WriteAttributeString('height', SvgConverter.toSvgWithUnits(height, this.Units));

    for (const [key, box] of patterns) {
      this.WriteStartElement('rect');
      this.WriteAttributeString('width', SvgConverter.toSvgWithUnits(box.Width, this.Units));
      this.WriteAttributeString('height', SvgConverter.toSvgWithUnits(box.Height, this.Units));
      this.WriteAttributeString('fill', `url(#${key})`);
      this.WriteEndElement();
    }

    // pattern
    this.WriteEndElement();

    return id;
  }

  private writeInsert(insert: Insert, transform: Transform): void {
    const insertTransform = insert.getTransform ? insert.getTransform() : new Transform();
    // Merge transforms
    const merged = new Transform(
      new XYZ(transform.Translation.x + insertTransform.Translation.x, transform.Translation.y + insertTransform.Translation.y, transform.Translation.z + insertTransform.Translation.z,)
    );

    this.WriteStartElement('g');
    this.writeTransformObj(merged);

    for (const e of insert.block.entities) {
      this.writeEntity(e as Entity);
    }

    this.WriteEndElement();
  }

  private writeLine(line: Line, transform: Transform): void {
    this.WriteStartElement('line');

    this.writeEntityHeader(line, transform);

    this.WriteAttributeString('x1', SvgConverter.toSvgWithUnits(line.startPoint.x, this.Units));
    this.WriteAttributeString('y1', SvgConverter.toSvgWithUnits(line.startPoint.y, this.Units));
    this.WriteAttributeString('x2', SvgConverter.toSvgWithUnits(line.endPoint.x, this.Units));
    this.WriteAttributeString('y2', SvgConverter.toSvgWithUnits(line.endPoint.y, this.Units));

    this.WriteEndElement();
  }

  private writePoint(point: Point, transform: Transform): void {
    this.WriteStartElement('circle');

    this.writeEntityHeader(point, transform);

    this.WriteAttributeString('r', SvgConverter.toSvgWithUnits(this.Configuration.PointRadius, UnitsType.Unitless));
    this.WriteAttributeString('cx', SvgConverter.toSvgWithUnits(point.location.x, this.Units));
    this.WriteAttributeString('cy', SvgConverter.toSvgWithUnits(point.location.y, this.Units));

    this.WriteAttributeString('fill', this.colorSvg(point.color));

    this.WriteEndElement();
  }

  private writePolyline(polyline: IPolyline, transform: Transform): void {
    if (polyline.isClosed) {
      this.WriteStartElement('polygon');
    } else {
      this.WriteStartElement('polyline');
    }

    this.writeEntityHeader(polyline, transform);

    const pts = this.getPolylinePoints(polyline);
    const ptsStr = this.svgPoints(pts, transform);

    this.WriteAttributeString('points', ptsStr);
    this.WriteAttributeString('fill', 'none');

    this.WriteEndElement();
  }

  private writeText(text: TextEntity | MText, transform: Transform): void {
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

    this.WriteStartElement('g');
    this.writeTransformObj(transform);

    this.WriteStartElement('text');

    this.writeTransformValues(
      'transform',
      SvgConverter.vectorToPixelSize(insert, this.Units),
      new XYZ(1, -1, 0),
      text.rotation !== 0 ? text.rotation : undefined
    );

    this.WriteAttributeString('fill', this.colorSvg(text.color ?? Color.Default));

    let style = 'font:';
    style += SvgConverter.toSvgWithUnits(text.height, this.Units);
    if (this.Units === UnitsType.Unitless) {
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

    this.WriteAttributeString('style', style);

    if (text instanceof MText) {
      const mtext = text as MText;
      switch (mtext.attachmentPoint) {
        case AttachmentPointType.TopLeft:
          this.WriteAttributeString('alignment-baseline', 'hanging');
          this.WriteAttributeString('text-anchor', 'start');
          break;
        case AttachmentPointType.TopCenter:
          this.WriteAttributeString('alignment-baseline', 'hanging');
          this.WriteAttributeString('text-anchor', 'middle');
          break;
        case AttachmentPointType.TopRight:
          this.WriteAttributeString('alignment-baseline', 'hanging');
          this.WriteAttributeString('text-anchor', 'end');
          break;
        case AttachmentPointType.MiddleLeft:
          this.WriteAttributeString('alignment-baseline', 'middle');
          this.WriteAttributeString('text-anchor', 'start');
          break;
        case AttachmentPointType.MiddleCenter:
          this.WriteAttributeString('alignment-baseline', 'middle');
          this.WriteAttributeString('text-anchor', 'middle');
          break;
        case AttachmentPointType.MiddleRight:
          this.WriteAttributeString('alignment-baseline', 'middle');
          this.WriteAttributeString('text-anchor', 'end');
          break;
        case AttachmentPointType.BottomLeft:
          this.WriteAttributeString('alignment-baseline', 'baseline');
          this.WriteAttributeString('text-anchor', 'start');
          break;
        case AttachmentPointType.BottomCenter:
          this.WriteAttributeString('alignment-baseline', 'baseline');
          this.WriteAttributeString('text-anchor', 'middle');
          break;
        case AttachmentPointType.BottomRight:
          this.WriteAttributeString('alignment-baseline', 'baseline');
          this.WriteAttributeString('text-anchor', 'end');
          break;
      }

      const lines = mtext.getPlainTextLines ? mtext.getPlainTextLines() : [mtext.value];
      for (const item of lines) {
        this.WriteStartElement('tspan');
        this.WriteAttributeString('x', '0');
        this.WriteAttributeString('dy', '1em');
        this.WriteString(item);
        this.WriteEndElement();
      }

      // Hidden line to avoid offset
      this.WriteStartElement('tspan');
      this.WriteAttributeString('x', '0');
      this.WriteAttributeString('dy', '1em');
      this.WriteAttributeString('visibility', 'hidden');
      this.WriteString('.');
      this.WriteEndElement();
    } else if (text instanceof TextEntity) {
      const textEntity = text as TextEntity;

      switch (textEntity.horizontalAlignment) {
        case TextHorizontalAlignment.Left:
          this.WriteAttributeString('text-anchor', 'start');
          break;
        case TextHorizontalAlignment.Middle:
        case TextHorizontalAlignment.Center:
          this.WriteAttributeString('text-anchor', 'middle');
          break;
        case TextHorizontalAlignment.Right:
          this.WriteAttributeString('text-anchor', 'end');
          break;
      }

      switch (textEntity.verticalAlignment) {
        case TextVerticalAlignmentType.Baseline:
        case TextVerticalAlignmentType.Bottom:
          this.WriteAttributeString('alignment-baseline', 'baseline');
          break;
        case TextVerticalAlignmentType.Middle:
          this.WriteAttributeString('alignment-baseline', 'middle');
          break;
        case TextVerticalAlignmentType.Top:
          this.WriteAttributeString('alignment-baseline', 'hanging');
          break;
      }

      this.WriteString(text.value);
    }

    this.WriteEndElement();
    this.WriteEndElement();
  }

  private writeSolid(solid: Solid, transform: Transform): void {
    this.WriteStartElement('polygon');

    this.writeEntityHeader(solid, transform);

    const pts = this.svgPoints([solid.firstCorner, solid.secondCorner, solid.thirdCorner, solid.fourthCorner], transform);
    this.WriteAttributeString('points', pts);
    this.WriteAttributeString('fill', this.colorSvg(solid.color));

    this.WriteEndElement();
  }

  private writeTransformObj(transform: Transform): void {
    const translation = (transform.Translation.x !== 0 || transform.Translation.y !== 0 || transform.Translation.z !== 0) ? transform.Translation : undefined;
    const scale = (transform.Scale.x !== 1 || transform.Scale.y !== 1) ? transform.Scale : undefined;
    const rotation = transform.EulerRotation.z !== 0 ? transform.EulerRotation.z : undefined;

    this.writeTransformValues('transform', translation, scale, rotation);
  }

  private writeTransformValues(name: string = 'transform', translation?: XYZ, scale?: XYZ, rotation?: number): void {
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

    this.WriteAttributeString(name, sb);
  }
}
