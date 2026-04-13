import { CadWriterConfiguration } from '../CadWriterConfiguration.js';
import { CadHeader } from '../../Header/CadHeader.js';
import { CadSystemVariable } from '../../CadSystemVariable.js';

export class DxfWriterConfiguration extends CadWriterConfiguration {
  public static readonly Variables: string[] = [
    "$ACADVER",
    "$DWGCODEPAGE",
    "$LASTSAVEDBY",
    "$HANDSEED",
    "$ANGBASE",
    "$ANGDIR",
    "$ATTMODE",
    "$AUNITS",
    "$AUPREC",
    "$CECOLOR",
    "$CELTSCALE",
    "$CELTYPE",
    "$CELWEIGHT",
    "$CLAYER",
    "$CMLJUST",
    "$CMLSCALE",
    "$CMLSTYLE",
    "$DIMSTYLE",
    "$TEXTSIZE",
    "$TEXTSTYLE",
    "$LUNITS",
    "$LUPREC",
    "$MIRRTEXT",
    "$EXTNAMES",
    "$INSBASE",
    "$INSUNITS",
    "$LTSCALE",
    "$LWDISPLAY",
    "$PDMODE",
    "$PDSIZE",
    "$PLINEGEN",
    "$PSLTSCALE",
    "$SPLINESEGS",
    "$SURFU",
    "$SURFV",
    "$TDCREATE",
    "$TDUCREATE",
    "$TDUPDATE",
    "$TDUUPDATE",
    "$TDINDWG",
  ];

  public WriteAllHeaderVariables: boolean = false;

  public WriteOptionalValues: boolean = true;

  public get HeaderVariables(): ReadonlySet<string> {
    return this._headerVariables;
  }

  private _headerVariables: Set<string>;

  public constructor() {
    super();
    this._headerVariables = new Set<string>(DxfWriterConfiguration.Variables);
  }

  public AddHeaderVariable(name: string): void {
    const map: Map<string, CadSystemVariable> = CadHeader.GetHeaderMap();

    if (!map.has(name)) {
      throw new Error(`The variable ${name} does not exist in the header`);
    }

    this._headerVariables.add(name);
  }

  public RemoveHeaderVariable(name: string): boolean {
    if (DxfWriterConfiguration.Variables.map(v => v.toLowerCase()).includes(name.toLowerCase())) {
      throw new Error(`The variable ${name} cannot be removed from the set`);
    }

    return this._headerVariables.delete(name);
  }
}
