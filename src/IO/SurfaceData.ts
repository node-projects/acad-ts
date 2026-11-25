import { Surface } from '../Entities/Surface.js';
import { ExtrudedSurface } from '../Entities/ExtrudedSurface.js';
import { RevolvedSurface } from '../Entities/RevolvedSurface.js';
import { SweptSurface } from '../Entities/SweptSurface.js';
import { LoftedSurface, LoftProfile } from '../Entities/LoftedSurface.js';
import { Matrix4 } from '../Math/Matrix4.js';
import { XYZ } from '../Math/XYZ.js';
import { MathHelper } from '../Math/MathHelper.js';
import { IDxfStreamReader } from './DXF/DxfStreamReader/IDxfStreamReader.js';
import { IDxfStreamWriter } from './DXF/DxfStreamWriter/IDxfStreamWriter.js';
import { IDwgStreamReader } from './DWG/DwgStreamReaders/IDwgStreamReader.js';
import { IDwgStreamWriter } from './DWG/DwgStreamWriters/IDwgStreamWriter.js';

type FieldType = 'double' | 'angle' | 'short' | 'bool' | 'point' | 'matrix';
type Field = readonly [name: string, code: number, type: FieldType];
const sweepFields: readonly Field[] = [
  ['draftAngle',42,'angle'], ['draftStartDistance',43,'double'], ['draftEndDistance',44,'double'],
  ['twistAngle',45,'angle'], ['scaleFactor',48,'double'], ['alignAngle',49,'angle'],
  ['isSolid',290,'bool'], ['sweepAlignment',70,'short'], ['unknown71',71,'short'],
  ['alignStart',292,'bool'], ['bank',293,'bool'], ['basePointSet',294,'bool'],
  ['referenceVector',11,'point'], ['sweepEntityTransformComputed',295,'bool'], ['pathEntityTransformComputed',296,'bool'],
  ['sweepEntityTransform',46,'matrix'], ['pathEntityTransform',47,'matrix'],
];
function fields(surface: Surface): readonly Field[] {
  if (surface instanceof ExtrudedSurface) return [...sweepFields, ['direction',10,'point'], ['extrusionTransform',40,'matrix']];
  if (surface instanceof SweptSurface) return [...sweepFields, ['sweepTransform',40,'matrix'], ['pathTransform',41,'matrix']];
  if (surface instanceof RevolvedSurface) return [
    ['draftAngle',43,'double'], ['draftStartDistance',44,'double'], ['draftEndDistance',45,'double'], ['twistAngle',46,'double'],
    ['isSolid',290,'bool'], ['isCloseToAxis',291,'bool'], ['axisPoint',10,'point'], ['axisVector',11,'point'],
    ['revolveTransform',42,'matrix'], ['revolveAngle',40,'double'], ['startAngle',41,'double'],
  ];
  if (surface instanceof LoftedSurface) return [
    ['loftTransform',40,'matrix'], ['startDraftAngle',41,'double'], ['endDraftAngle',42,'double'],
    ['startDraftMagnitude',43,'double'], ['endDraftMagnitude',44,'double'],
    ['arcLengthParameterization',290,'bool'], ['noTwist',291,'bool'], ['alignDirection',292,'bool'],
    ['simpleSurfaces',293,'bool'], ['closedSurfaces',294,'bool'], ['isSolid',295,'bool'],
    ['ruledSurface',296,'bool'], ['virtualGuide',297,'bool'], ['planeNormalLofting',70,'short'],
  ];
  return [];
}

function readDxfBlob(reader: IDxfStreamReader): Uint8Array {
  const size = reader.valueAsInt;
  if (size < 0) throw new Error('Negative surface profile size.');
  const chunks: Uint8Array[] = []; let total = 0; reader.readNext();
  while (reader.code === 310) { const chunk = reader.valueAsBinaryChunk; total += chunk.length; if (total > size) throw new Error('Surface profile exceeds its declared size.'); chunks.push(chunk); reader.readNext(); }
  if (total !== size) throw new Error('Truncated surface profile.');
  const data = new Uint8Array(total); let offset = 0;
  for (const chunk of chunks) { data.set(chunk, offset); offset += chunk.length; }
  return data;
}

/** Returns null for an unhandled field, otherwise whether the reader advanced to the next field. */
export function readDxfSurfaceData(reader: IDxfStreamReader, surface: Surface): boolean | null {
  if (surface instanceof LoftedSurface && [90,91,92].includes(reader.code)) {
    const code = reader.code, profile = new LoftProfile(); profile.classId = reader.valueAsInt;
    reader.expectedCode(90); profile.binaryData = readDxfBlob(reader);
    if (code === 90) surface.crossSections.push(profile); else if (code === 91) surface.guides.push(profile); else surface.path = profile;
    return true;
  }
  if (surface instanceof SweptSurface && [90,91].includes(reader.code)) {
    const path = reader.code === 91, id = reader.valueAsInt;
    reader.expectedCode(90); const data = readDxfBlob(reader);
    if (path) { surface.pathClassId = id; surface.pathBinaryData = data; } else { surface.classId = id; surface.profileData = data; }
    return true;
  }
  if ((surface instanceof ExtrudedSurface || surface instanceof RevolvedSurface) && reader.code === 90) {
    if (surface.classId === null) { surface.classId = reader.valueAsInt; return false; }
    surface.profileData = readDxfBlob(reader); return true;
  }
  for (const [name, code, type] of fields(surface)) {
    if (type === 'point' && [code,code+10,code+20].includes(reader.code)) {
      const point = Reflect.get(surface,name) as XYZ;
      if (reader.code === code) point.x = reader.valueAsDouble; else if (reader.code === code+10) point.y = reader.valueAsDouble; else point.z = reader.valueAsDouble;
      return false;
    }
    if (reader.code !== code) continue;
    if (type === 'matrix') {
      const matrix = new Matrix4();
      for (let i=0; i<16; i++) { if (i) reader.expectedCode(code); matrix.setElement(i%4,Math.floor(i/4),reader.valueAsDouble); }
      Reflect.set(surface,name,matrix);
    } else Reflect.set(surface,name,type === 'bool' ? reader.valueAsBool : type === 'angle' ? reader.valueAsAngle : reader.valueAsDouble);
    return false;
  }
  return null;
}

function writeDxfProfile(writer: IDxfStreamWriter, code: number, id: number, data: Uint8Array): void {
  writer.write(code,id); writer.write(90,data.length); if (data.length) writer.write(310,data);
}
export function writeDxfSurfaceData(writer: IDxfStreamWriter, surface: Surface): void {
  writer.write(100,'AcDbSurface'); writer.write(71,surface.uIsolines); writer.write(72,surface.vIsolines);
  writer.write(100,surface.subclassMarker);
  if (surface instanceof LoftedSurface) {
    for (const profile of surface.crossSections) writeDxfProfile(writer,90,profile.classId,profile.binaryData);
    for (const profile of surface.guides) writeDxfProfile(writer,91,profile.classId,profile.binaryData);
    if (surface.path) writeDxfProfile(writer,92,surface.path.classId,surface.path.binaryData);
  } else if (surface instanceof ExtrudedSurface || surface instanceof RevolvedSurface || surface instanceof SweptSurface) {
    writeDxfProfile(writer,90,surface.classId ?? 0,surface.profileData);
    if (surface instanceof SweptSurface) writeDxfProfile(writer,91,surface.pathClassId ?? 0,surface.pathBinaryData);
  }
  for (const [name,code,type] of fields(surface)) {
    const value = Reflect.get(surface,name);
    if (type === 'point') writer.writeVector(code,value);
    else if (type === 'matrix') for (let i=0;i<16;i++) writer.write(code,(value as Matrix4).get(i%4,Math.floor(i/4)));
    else writer.write(code,type === 'angle' ? MathHelper.radToDeg(value) : value);
  }
}

function readDwgField(reader: IDwgStreamReader, surface: Surface, [name,,type]: Field): void {
  let value: unknown;
  if (type === 'matrix') value = new Matrix4(Array.from({length:16},()=>reader.readBitDouble()));
  else if (type === 'point') value = reader.read3BitDouble();
  else if (type === 'bool') value = reader.readBit();
  else if (type === 'short') value = reader.readBitShort();
  else value = reader.readBitDouble();
  Reflect.set(surface,name,value);
}
function writeDwgField(writer: IDwgStreamWriter, surface: Surface, [name,,type]: Field): void {
  const value = Reflect.get(surface,name);
  if (type === 'matrix') for (let i=0;i<16;i++) writer.writeBitDouble((value as Matrix4).get(Math.floor(i/4),i%4));
  else if (type === 'point') writer.write3BitDouble(value);
  else if (type === 'bool') writer.writeBit(value);
  else if (type === 'short') writer.writeBitShort(value);
  else writer.writeBitDouble(value);
}
function readDwgProfile(reader: IDwgStreamReader): LoftProfile {
  const profile = new LoftProfile(); profile.classId = reader.readBitLong(); const bits = reader.readBitLong();
  if (bits < 0) throw new Error('Negative surface profile size.');
  profile.binaryData = bits ? reader.readBytes(Math.ceil(bits/8)) : new Uint8Array(); return profile;
}
function writeDwgProfile(writer: IDwgStreamWriter, id: number, data: Uint8Array): void { writer.writeBitLong(id); writer.writeBitLong(data.length*8); if (data.length) writer.writeBytes(data); }
export function readDwgSurfaceData(reader: IDwgStreamReader, surface: Surface): void {
  surface.uIsolines = reader.readBitShort(); surface.vIsolines = reader.readBitShort();
  const list = fields(surface);
  if (surface instanceof LoftedSurface) {
    readDwgField(reader,surface,list[0]);
    const cross = reader.readBitShort(), guides = reader.readBitShort(), path = reader.readBit();
    if (cross < 0 || guides < 0) throw new Error('Negative loft profile count.');
    for (const field of list.slice(1)) readDwgField(reader,surface,field);
    for (let i=0;i<cross;i++) surface.crossSections.push(readDwgProfile(reader));
    for (let i=0;i<guides;i++) surface.guides.push(readDwgProfile(reader));
    if (path) surface.path = readDwgProfile(reader);
  } else {
    for (const field of list) readDwgField(reader,surface,field);
    const profile = readDwgProfile(reader);
    if (surface instanceof ExtrudedSurface || surface instanceof RevolvedSurface || surface instanceof SweptSurface) { surface.classId = profile.classId; surface.profileData = profile.binaryData; }
    if (surface instanceof SweptSurface) { const path = readDwgProfile(reader); surface.pathClassId = path.classId; surface.pathBinaryData = path.binaryData; }
  }
}
export function writeDwgSurfaceData(writer: IDwgStreamWriter, surface: Surface): void {
  writer.writeBitShort(surface.uIsolines); writer.writeBitShort(surface.vIsolines);
  const list = fields(surface);
  if (surface instanceof LoftedSurface) {
    writeDwgField(writer,surface,list[0]); writer.writeBitShort(surface.crossSections.length); writer.writeBitShort(surface.guides.length); writer.writeBit(surface.path !== null);
    for (const field of list.slice(1)) writeDwgField(writer,surface,field);
    for (const profile of [...surface.crossSections,...surface.guides]) writeDwgProfile(writer,profile.classId,profile.binaryData);
    if (surface.path) writeDwgProfile(writer,surface.path.classId,surface.path.binaryData);
  } else {
    for (const field of list) writeDwgField(writer,surface,field);
    if (surface instanceof ExtrudedSurface || surface instanceof RevolvedSurface || surface instanceof SweptSurface) writeDwgProfile(writer,surface.classId ?? 0,surface.profileData);
    if (surface instanceof SweptSurface) writeDwgProfile(writer,surface.pathClassId ?? 0,surface.pathBinaryData);
  }
}
