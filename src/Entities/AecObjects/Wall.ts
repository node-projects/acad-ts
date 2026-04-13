import { Entity } from '../Entity.js';
import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';
import { BoundingBox } from '../../Math/BoundingBox.js';
import { NonGraphicalObject } from '../../Objects/NonGraphicalObject.js';

export enum WallJustification {
  Left = 0,
  Center = 1,
  Right = 2,
  Baseline = 3,
}

export class Wall extends Entity {
  baseHeight: number = 0;
  binRecord: any = null;
  binRecordHandle: number = 0;
  cleanupGroup: any = null;
  cleanupGroupHandle: number = 0;
  endPoint: XYZ = new XYZ();
  height: number = 0;
  justification: WallJustification = WallJustification.Baseline;
  length: number = 0;
  normal: XYZ = new XYZ(0, 0, 1);
  rawData: Uint8Array | null = null;
  startPoint: XYZ = new XYZ();
  style: any = null;
  version: number = 0;
  width: number = 0;

  override get objectName(): string { return DxfFileToken.EntityAecWall; }
  override get objectType(): ObjectType { return ObjectType.UNLISTED; }
  override get subclassMarker(): string { return DxfSubclassMarker.AecWall; }

  getBoundingBox(): BoundingBox {
    throw new Error('Not implemented');
  }

  applyTransform(transform: any): void { /* no-op */ }
}
