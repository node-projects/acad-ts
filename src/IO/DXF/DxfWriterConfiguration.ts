import { CadWriterConfiguration } from '../CadWriterConfiguration.js';
import { CadHeader } from '../../Header/CadHeader.js';
import { CadSystemVariable } from '../../CadSystemVariable.js';

export class DxfWriterConfiguration extends CadWriterConfiguration {
  public static readonly variables: string[] = [
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

  public writeAllHeaderVariables: boolean = false;

  public writeOptionalValues: boolean = true;

  public get headerVariables(): ReadonlySet<string> {
    return this._headerVariables;
  }

  private _headerVariables: Set<string>;

  public constructor() {
    super();
    this._headerVariables = new Set<string>(DxfWriterConfiguration.variables);
  }

  public addHeaderVariable(name: string): void {
    const map: Map<string, CadSystemVariable> = CadHeader.getHeaderMap();

    if (!map.has(name)) {
      throw new Error(`The variable ${name} does not exist in the header`);
    }

    this._headerVariables.add(name);
  }

  public removeHeaderVariable(name: string): boolean {
    if (DxfWriterConfiguration.variables.map(v => v.toLowerCase()).includes(name.toLowerCase())) {
      throw new Error(`The variable ${name} cannot be removed from the set`);
    }

    return this._headerVariables.delete(name);
  }
}
