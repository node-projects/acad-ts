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
    const normal = this.normal.normalize();
    const up = normal.getLength() === 0 ? new XYZ(0, 0, 1) : normal;
    const rawDirection = new XYZ(
      this.endPoint.x - this.startPoint.x,
      this.endPoint.y - this.startPoint.y,
      this.endPoint.z - this.startPoint.z,
    );
    const direction = rawDirection.getLength() === 0 ? new XYZ(1, 0, 0) : rawDirection.normalize();
    const end = rawDirection.getLength() === 0
      ? new XYZ(
        this.startPoint.x + direction.x * this.length,
        this.startPoint.y + direction.y * this.length,
        this.startPoint.z + direction.z * this.length,
      )
      : this.endPoint;
    let lateral = up.cross(direction).normalize();
    if (lateral.getLength() === 0) {
      lateral = new XYZ(0, 1, 0);
    }

    let minimumWidth = -this.width / 2;
    let maximumWidth = this.width / 2;
    if (this.justification === WallJustification.Left) {
      minimumWidth = 0;
      maximumWidth = this.width;
    } else if (this.justification === WallJustification.Right) {
      minimumWidth = -this.width;
      maximumWidth = 0;
    }

    const points: XYZ[] = [];
    for (const endpoint of [this.startPoint, end]) {
      for (const width of [minimumWidth, maximumWidth]) {
        for (const height of [this.baseHeight, this.baseHeight + this.height]) {
          points.push(new XYZ(
            endpoint.x + lateral.x * width + up.x * height,
            endpoint.y + lateral.y * width + up.y * height,
            endpoint.z + lateral.z * width + up.z * height,
          ));
        }
      }
    }

    return BoundingBox.fromPoints(points);
  }

  applyTransform(transform: unknown): void {
    const direction = new XYZ(
      this.endPoint.x - this.startPoint.x,
      this.endPoint.y - this.startPoint.y,
      this.endPoint.z - this.startPoint.z,
    );
    const unitDirection = direction.getLength() === 0 ? new XYZ(1, 0, 0) : direction.normalize();
    const unitNormal = this.normal.getLength() === 0 ? new XYZ(0, 0, 1) : this.normal.normalize();
    let lateral = unitNormal.cross(unitDirection).normalize();
    if (lateral.getLength() === 0) lateral = new XYZ(0, 1, 0);

    const transformedDirection = this.applyTransformToVector(transform, unitDirection);
    const transformedNormal = this.applyTransformToVector(transform, unitNormal);
    const transformedLateral = this.applyTransformToVector(transform, lateral);
    const originalLength = direction.getLength();

    this.startPoint = this.applyTransformToPoint(transform, this.startPoint);
    this.endPoint = this.applyTransformToPoint(transform, this.endPoint);
    this.length = originalLength > 0
      ? Math.hypot(
        this.endPoint.x - this.startPoint.x,
        this.endPoint.y - this.startPoint.y,
        this.endPoint.z - this.startPoint.z,
      )
      : this.length * transformedDirection.getLength();
    this.width *= transformedLateral.getLength();
    this.height *= transformedNormal.getLength();
    this.baseHeight *= transformedNormal.getLength();
    this.normal = transformedNormal.getLength() === 0 ? unitNormal : transformedNormal.normalize();
  }
}
