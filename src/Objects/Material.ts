import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { AutoTransformMethodFlags } from './AutoTransformMethodFlags.js';
import { ColorMethod } from './ColorMethod.js';
import { MapSource } from './MapSource.js';
import { ProjectionMethod } from './ProjectionMethod.js';
import { TilingMethod } from './TilingMethod.js';

export enum MaterialChannelFlags {
	None = 0,
	UseDiffuse = 0x01,
	UseSpecular = 0x02,
	UseReflection = 0x04,
	UseOpacity = 0x08,
	UseBump = 0x10,
	UseRefraction = 0x20,
	UseNormalMap = 0x40,
	UseAll = 0x7f,
}

export enum MaterialIlluminationModel {
	BlinnShader = 0,
	MetalShader = 1,
}

export enum MaterialMode {
	Realistic = 0,
	Advanced = 1,
}

export class Material extends NonGraphicalObject {
	ambientColor: Color = Color.byLayer;

	private _ambientColorFactor: number = 1.0;
	get ambientColorFactor(): number { return this._ambientColorFactor; }
	set ambientColorFactor(value: number) {
		if (value < 0 || value > 1) throw new Error('Value must be in range 0 to 1');
		this._ambientColorFactor = value;
	}

	ambientColorMethod: ColorMethod = ColorMethod.Current;

	bumpAutoTransform: AutoTransformMethodFlags = AutoTransformMethodFlags.NoAutoTransform;
	bumpMapBlendFactor: number = 1.0;
	bumpMapFileName: string = '';
	bumpMapSource: MapSource = MapSource.UseImageFile;
	bumpMatrix: number[] = []; // Matrix4
	bumpProjectionMethod: ProjectionMethod = ProjectionMethod.Planar;
	bumpTilingMethod: TilingMethod = TilingMethod.Tile;

	channelFlags: MaterialChannelFlags = MaterialChannelFlags.UseDiffuse;
	description: string = '';

	diffuseAutoTransform: AutoTransformMethodFlags = AutoTransformMethodFlags.NoAutoTransform;
	diffuseColor: Color = Color.byLayer;

	private _diffuseColorFactor: number = 1.0;
	get diffuseColorFactor(): number { return this._diffuseColorFactor; }
	set diffuseColorFactor(value: number) {
		if (value < 0 || value > 1) throw new Error('Value must be in range 0 to 1');
		this._diffuseColorFactor = value;
	}

	diffuseColorMethod: ColorMethod = ColorMethod.Current;
	diffuseMapBlendFactor: number = 1.0;
	diffuseMapFileName: string = '';
	diffuseMapSource: MapSource = MapSource.UseImageFile;
	diffuseMatrix: number[] = []; // Matrix4
	diffuseProjectionMethod: ProjectionMethod = ProjectionMethod.Planar;
	diffuseTilingMethod: TilingMethod = TilingMethod.Tile;

	illuminationModel: MaterialIlluminationModel = MaterialIlluminationModel.BlinnShader;
	mode: MaterialMode = MaterialMode.Realistic;

	override get objectName(): string { return DxfFileToken.objectMaterial; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }

	opacity: number = 1.0;

	opacityAutoTransform: AutoTransformMethodFlags = AutoTransformMethodFlags.NoAutoTransform;
	opacityMapBlendFactor: number = 1.0;
	opacityMapFileName: string = '';
	opacityMapSource: MapSource = MapSource.UseImageFile;
	opacityMatrix: number[] = []; // Matrix4
	opacityProjectionMethod: ProjectionMethod = ProjectionMethod.Planar;
	opacityTilingMethod: TilingMethod = TilingMethod.Tile;

	reflectionAutoTransform: AutoTransformMethodFlags = AutoTransformMethodFlags.NoAutoTransform;
	reflectionMapBlendFactor: number = 1.0;
	reflectionMapFileName: string = '';
	reflectionMapSource: MapSource = MapSource.UseImageFile;
	reflectionMatrix: number[] = []; // Matrix4
	reflectionProjectionMethod: ProjectionMethod = ProjectionMethod.Planar;
	reflectionTilingMethod: TilingMethod = TilingMethod.Tile;

	reflectivity: number = 0.0;

	refractionAutoTransform: AutoTransformMethodFlags = AutoTransformMethodFlags.NoAutoTransform;
	refractionIndex: number = 1.0;
	refractionMapBlendFactor: number = 1.0;
	refractionMapFileName: string = '';
	refractionMapSource: MapSource = MapSource.UseImageFile;
	refractionMatrix: number[] = []; // Matrix4
	refractionProjectionMethod: ProjectionMethod = ProjectionMethod.Planar;
	refractionTilingMethod: TilingMethod = TilingMethod.Tile;

	specularAutoTransform: AutoTransformMethodFlags = AutoTransformMethodFlags.NoAutoTransform;
	specularColor: Color = Color.byLayer;

	private _specularColorFactor: number = 1.0;
	get specularColorFactor(): number { return this._specularColorFactor; }
	set specularColorFactor(value: number) {
		if (value < 0 || value > 1) throw new Error('Value must be in range 0 to 1');
		this._specularColorFactor = value;
	}

	specularColorMethod: ColorMethod = ColorMethod.Current;
	specularGlossFactor: number = 0.5;
	specularMapBlendFactor: number = 1.0;
	specularMapFileName: string = '';
	specularMapSource: MapSource = MapSource.UseImageFile;
	specularMatrix: number[] = []; // Matrix4
	specularProjectionMethod: ProjectionMethod = ProjectionMethod.Planar;
	specularTilingMethod: TilingMethod = TilingMethod.Tile;

	override get subclassMarker(): string { return DxfSubclassMarker.material; }

	translucence: number = 0.0;

	static readonly byBlockName = 'ByBlock';
	static readonly byLayerName = 'ByLayer';
	static readonly globalName = 'Global';

	constructor(name?: string) {
		super(name);
	}
}

export { ColorMethod } from './ColorMethod.js';

export { ProjectionMethod } from './ProjectionMethod.js';

export { TilingMethod } from './TilingMethod.js';

export { AutoTransformMethodFlags } from './AutoTransformMethodFlags.js';

export { MapSource } from './MapSource.js';
