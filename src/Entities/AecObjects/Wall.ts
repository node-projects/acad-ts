import { Entity } from '../Entity.js';
import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';
import { BoundingBox } from '../../Math/BoundingBox.js';
import { AecBinRecord } from '../../Objects/AEC/AecBinRecord.js';
import { AecCleanupGroup } from '../../Objects/AEC/AecCleanupGroup.js';
import { AecWallStyle } from '../../Objects/AEC/AecWallStyle.js';

export enum WallJustification {
  Left = 0,
  Center = 1,
  Right = 2,
  Baseline = 3,
}

export class Wall extends Entity {
  baseHeight: number = 0;
  binRecord: AecBinRecord | null = null;
  binRecordHandle: number = 0;
  cleanupGroup: AecCleanupGroup | null = null;
  cleanupGroupHandle: number = 0;
  endPoint: XYZ = new XYZ();
  height: number = 0;
  justification: WallJustification = WallJustification.Baseline;
  length: number = 0;
  normal: XYZ = new XYZ(0, 0, 1);
  rawData: Uint8Array | null = null;
  startPoint: XYZ = new XYZ();
  style: AecWallStyle | null = null;
  version: number = 0;
  width: number = 0;

  override get objectName(): string { return DxfFileToken.entityAecWall; }
  override get objectType(): ObjectType { return ObjectType.UNLISTED; }
  override get subclassMarker(): string { return DxfSubclassMarker.aecWall; }

  getBoundingBox(): BoundingBox {
    throw new Error('Not implemented');
  }

  applyTransform(transform: unknown): void { /* no-op */ }
}
