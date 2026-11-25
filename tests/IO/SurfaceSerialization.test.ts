import { expect, it } from 'vitest';
import { ACadVersion } from '../../src/ACadVersion.js';
import { CadDocument } from '../../src/CadDocument.js';
import { ExtrudedSurface } from '../../src/Entities/ExtrudedSurface.js';
import { Matrix4 } from '../../src/Math/Matrix4.js';
import { DwgReader } from '../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../src/IO/DWG/DwgWriter.js';

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
