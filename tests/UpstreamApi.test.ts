import { describe, expect, it } from 'vitest';
import {
  AecEntity,
  ImageDefinition,
  LwPolyline,
  VisualStyle,
  Wall,
  XYZ,
} from '../src/index.js';

describe('upstream API compatibility', () => {
  it('supports the AEC entity base, named objects, and vector polyline vertices', () => {
    const wall = new Wall();
    const imageDefinition = new ImageDefinition('image');
    const visualStyle = new VisualStyle('style');
    const polyline = new LwPolyline([new XYZ(1, 2, 3)]);

    expect(wall).toBeInstanceOf(AecEntity);
    expect(imageDefinition.name).toBe('image');
    expect(visualStyle.name).toBe('style');
    expect(polyline.vertices[0].location.x).toBe(1);
    expect(polyline.vertices[0].location.y).toBe(2);
  });
});
