import { expect, it } from 'vitest';
import { ACadVersion } from '../../src/ACadVersion.js';
import { CadDocument } from '../../src/CadDocument.js';
import { ExtrudedSurface } from '../../src/Entities/ExtrudedSurface.js';
import { Matrix4 } from '../../src/Math/Matrix4.js';
import { DwgReader } from '../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../src/IO/DWG/DwgWriter.js';
import { DxfReader } from '../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../src/IO/DXF/DxfWriter.js';
import { LoftedSurface, LoftProfile } from '../../src/Entities/LoftedSurface.js';
import { RevolvedSurface } from '../../src/Entities/RevolvedSurface.js';
import { SweptSurface } from '../../src/Entities/SweptSurface.js';

it.each([LoftedSurface, RevolvedSurface, SweptSurface, ExtrudedSurface])('round-trips surface definitions in DWG and ASCII/binary DXF (%s)', Type => {
  const surface = new Type(); surface.uIsolines = 4; surface.vIsolines = 9;
  surface.binaryData = new TextEncoder().encode('700 0 0 0\nEnd-of-ACIS-data');
  const matrix = new Matrix4(Array.from({length:16},(_,i)=>i+.125));
  if (surface instanceof LoftedSurface) {
    const profile = new LoftProfile(); profile.classId = 31; profile.binaryData = Uint8Array.from({length:300},(_,i)=>i&255);
    surface.crossSections.push(profile,profile.clone()); surface.guides.push(profile.clone()); surface.path = profile.clone();
    surface.loftTransform = matrix; surface.endDraftAngle = .4; surface.virtualGuide = true;
    const clone = surface.clone(); clone.crossSections[0].binaryData[0] = 99; expect(profile.binaryData[0]).toBe(0);
  } else {
    surface.classId = 31; surface.profileData = Uint8Array.from({length:300},(_,i)=>i&255); surface.draftAngle = .4; surface.isSolid = true;
    if (surface instanceof RevolvedSurface) { surface.revolveTransform = matrix; surface.axisVector.y = 1; surface.revolveAngle = 3; }
    else { surface.sweepEntityTransform = matrix; surface.unknown71 = 3; surface.referenceVector.z = 12; }
    if (surface instanceof SweptSurface) { surface.pathClassId = 15; surface.pathBinaryData = new Uint8Array([23,24]); surface.pathTransform.m03 = 7; }
  }
  const doc = new CadDocument(); doc.entities.add(surface);
  const documents = [new DwgReader(DwgWriter.writeToBuffer(doc)).read()];
  const chunks: string[] = [];
  new DxfWriter({write:(value:string)=>chunks.push(value),flush(){},close(){}},doc,false).write();
  documents.push(new DxfReader(new TextEncoder().encode(chunks.join(''))).read());
  const binary = new Uint8Array(1024*1024); new DxfWriter(binary,doc,true).write(); documents.push(new DxfReader(binary).read());
  for (const decoded of documents) {
    const result = [...decoded.entities][0]; expect(result).toBeInstanceOf(Type);
    for (const [key,value] of Object.entries(surface)) {
      if (['uIsolines','vIsolines','classId','profileData','pathBinaryData','crossSections','guides','path','draftAngle','endDraftAngle','virtualGuide','unknown71','referenceVector','axisVector','revolveAngle','isSolid'].includes(key) || value instanceof Matrix4) {
        if (typeof value === 'number') expect(Reflect.get(result,key),key).toBeCloseTo(value,12);
        else expect(Reflect.get(result,key),key).toEqual(value);
      }
    }
    expect((result as ExtrudedSurface).binaryData).toEqual(surface.binaryData);
  }
});

it.each([ACadVersion.AC1021, ACadVersion.AC1032])('round-trips extruded parameters independently from primary ACIS (%s)', version => {
  const surface = new ExtrudedSurface(); surface.uIsolines = 5; surface.vIsolines = 7;
  surface.classId = 23; surface.profileData = Uint8Array.from({ length: 300 }, (_, i) => i & 255);
  surface.binaryData = new TextEncoder().encode('700 0 0 0\nEnd-of-ACIS-data');
  surface.direction.z = 15; surface.draftAngle = .2; surface.twistAngle = -.3; surface.unknown71 = 9;
  surface.alignStart = true; surface.sweepEntityTransformComputed = true;
  surface.extrusionTransform = new Matrix4(Array.from({length:16},(_,i)=>i+.25));
  const clone = surface.clone() as ExtrudedSurface; clone.profileData[0] = 99; clone.extrusionTransform.m03 = 99;
  expect(surface.profileData[0]).toBe(0); expect(surface.extrusionTransform.m03).toBe(3.25);
  const doc = new CadDocument(version); doc.entities.add(surface);
  const decoded = [...new DwgReader(DwgWriter.writeToBuffer(doc)).read().entities][0] as ExtrudedSurface;
  expect(decoded).toBeInstanceOf(ExtrudedSurface);
  for (const key of ['uIsolines','vIsolines','classId','profileData','binaryData','direction','draftAngle','twistAngle','unknown71','alignStart','sweepEntityTransformComputed','extrusionTransform']) expect(Reflect.get(decoded,key),key).toEqual(Reflect.get(surface,key));
});
