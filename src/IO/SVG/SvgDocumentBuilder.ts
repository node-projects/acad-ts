import { SvgXmlWriter } from './SvgXmlWriter.js';
import { SvgConfiguration } from './SvgConfiguration.js';
import { Layout } from '../../Objects/Layout.js';
import { PlotRotation } from '../../Objects/PlotRotation.js';
import { SvgConverter } from './SvgConverter.js';
import { UnitsType } from '../../Types/Units/UnitsType.js';
import { UnitExtensions } from '../../Extensions/UnitExtensions.js';
import { Entity } from '../../Entities/Entity.js';
import { XYZ } from '../../Math/XYZ.js';

interface BoundingBox { min: XYZ; max: XYZ; width: number; height: number; }

/** @deprecated is it needed? defs block? styles? */
export class SvgDocumentBuilder extends SvgXmlWriter {
  entitiesWriter: SvgXmlWriter | null = null;

  lineTypeWriters: Map<string, SvgXmlWriter> = new Map();

  constructor(stream: ArrayBuffer | Uint8Array, encoding: string | null, configuration: SvgConfiguration) {
    super(stream, encoding, configuration);
  }

  override writeLayout(layout: Layout): void {
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

    this._startDocumentInternal(paper);

    const translation = SvgConverter.vectorToPixelSize(lowerMargin, this.units);
    const scale: XYZ = new XYZ(layout.printScale, layout.printScale, layout.printScale);

    for (const e of layout.associatedBlock.entities) {
      this.writeEntity(e as Entity);
    }

    this._endDocumentInternal();
  }

  private _startDocumentInternal(box: BoundingBox): void {
    this.writeStartDocument();

    this.writeStartElement('svg');
    this.writeAttributeString('xmlns', 'http://www.w3.org/2000/svg');

    this.writeAttributeString('width', SvgConverter.toSvgWithUnits(box.max.x - box.min.x, this.units));
    this.writeAttributeString('height', SvgConverter.toSvgWithUnits(box.max.y - box.min.y, this.units));

    this.writeStartAttribute('viewBox');
    this.writeValue(SvgConverter.toSvgWithUnits(box.min.x, this.units));
    this.writeValue(' ');
    this.writeValue(SvgConverter.toSvgWithUnits(box.min.y, this.units));
    this.writeValue(' ');
    this.writeValue(SvgConverter.toSvgWithUnits(box.max.x - box.min.x, this.units));
    this.writeValue(' ');
    this.writeValue(SvgConverter.toSvgWithUnits(box.max.y - box.min.y, this.units));
    this.writeEndAttribute();

    this.writeAttributeString('transform', 'scale(1,-1)');

    if (this.layout !== null) {
      this.writeAttributeString('style', 'background-color:white');
    }
  }

  private _endDocumentInternal(): void {
    this.writeEndElement();
    this.writeEndDocument();
    this.close();
  }

  private _createWriter(): SvgXmlWriter {
    const xmlWriter = new SvgXmlWriter(new Uint8Array(0), this.configuration);
    xmlWriter.formatting = 'Indented';
    xmlWriter.onNotification = (sender, e) => this.triggerNotification(sender, e);
    return xmlWriter;
  }
}
