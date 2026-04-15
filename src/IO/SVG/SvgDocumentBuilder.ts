import { SvgXmlWriter } from './SvgXmlWriter.js';
import { SvgConfiguration } from './SvgConfiguration.js';
import { Layout } from '../../Objects/Layout.js';
import { PlotRotation } from '../../Objects/PlotRotation.js';
import { SvgConverter } from './SvgConverter.js';
import { UnitsType } from '../../Types/Units/UnitsType.js';
import { UnitExtensions } from '../../Extensions/UnitExtensions.js';
import { Entity } from '../../Entities/Entity.js';
import { XYZ } from '../../Math/XYZ.js';

interface BoundingBox { Min: XYZ; Max: XYZ; Width: number; Height: number; }

/** @deprecated is it needed? defs block? styles? */
export class SvgDocumentBuilder extends SvgXmlWriter {
  EntitiesWriter: SvgXmlWriter | null = null;

  LineTypeWriters: Map<string, SvgXmlWriter> = new Map();

  constructor(stream: ArrayBuffer | Uint8Array, encoding: string | null, configuration: SvgConfiguration) {
    super(stream, encoding, configuration);
  }

  override WriteLayout(layout: Layout): void {
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

    this.startDocumentInternal(paper);

    const translation = SvgConverter.vectorToPixelSize(lowerMargin, this.Units);
    const scale: XYZ = new XYZ(layout.printScale, layout.printScale, layout.printScale);

    for (const e of layout.associatedBlock.entities) {
      this.writeEntity(e as Entity);
    }

    this.endDocumentInternal();
  }

  private startDocumentInternal(box: BoundingBox): void {
    this.WriteStartDocument();

    this.WriteStartElement('svg');
    this.WriteAttributeString('xmlns', 'http://www.w3.org/2000/svg');

    this.WriteAttributeString('width', SvgConverter.toSvgWithUnits(box.Max.x - box.Min.x, this.Units));
    this.WriteAttributeString('height', SvgConverter.toSvgWithUnits(box.Max.y - box.Min.y, this.Units));

    this.WriteStartAttribute('viewBox');
    this.WriteValue(SvgConverter.toSvgWithUnits(box.Min.x, this.Units));
    this.WriteValue(' ');
    this.WriteValue(SvgConverter.toSvgWithUnits(box.Min.y, this.Units));
    this.WriteValue(' ');
    this.WriteValue(SvgConverter.toSvgWithUnits(box.Max.x - box.Min.x, this.Units));
    this.WriteValue(' ');
    this.WriteValue(SvgConverter.toSvgWithUnits(box.Max.y - box.Min.y, this.Units));
    this.WriteEndAttribute();

    this.WriteAttributeString('transform', 'scale(1,-1)');

    if (this.Layout !== null) {
      this.WriteAttributeString('style', 'background-color:white');
    }
  }

  private endDocumentInternal(): void {
    this.WriteEndElement();
    this.WriteEndDocument();
    this.Close();
  }

  private createWriter(): SvgXmlWriter {
    const xmlWriter = new SvgXmlWriter(new Uint8Array(0), this.Configuration);
    xmlWriter.Formatting = 'Indented';
    xmlWriter.OnNotification = (sender, e) => this.triggerNotification(sender, e);
    return xmlWriter;
  }
}
