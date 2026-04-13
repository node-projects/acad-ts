import { describe, it, expect } from 'vitest';
import { Color } from '../src/Color.js';

describe('ColorTests', () => {
  it('IndexedColorProperties', () => {
    expect(new Color(0).isByBlock).toBe(true);
    expect(new Color(256).isByLayer).toBe(true);

    expect(Color.fromTrueColor(2705).isTrueColor).toBe(true);
    expect(Color.fromTrueColor(2706).isTrueColor).toBe(true);
    expect(Color.fromTrueColor(2707).isTrueColor).toBe(true);
    expect(Color.fromTrueColor(2708).isTrueColor).toBe(true);
  });

  it('ParsesTrueColors', () => {
    for (let i = 0; i < 1000; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);

      const intColor = r | (g << 8) | (b << 16);
      const color = new Color(r, g, b);

      expect(color.isTrueColor).toBe(true);
      expect(color.trueColor).toBe(intColor);
      expect(color.index).toBe(-1);

      const rgb = color.getTrueColorRgb();
      expect(rgb[0]).toBe(r);
      expect(rgb[1]).toBe(g);
      expect(rgb[2]).toBe(b);
    }
  });

  it('Handles000TrueColor', () => {
    const color = new Color(0, 0, 0);

    expect(color.isTrueColor).toBe(true);
    expect(color.trueColor).toBe(0);
  });

  it('HandlesIndexedColors', () => {
    for (let i = 0; i <= 256; i++) {
      const color = new Color(i);
      expect(color.isTrueColor).toBe(false);
      expect(color.index).toBe(i);
      expect(color.trueColor).toBe(-1);

      const rgb = color.getTrueColorRgb();
      expect(rgb[0]).toBe(0);
      expect(rgb[1]).toBe(0);
      expect(rgb[2]).toBe(0);
    }
  });

  it('GetRgbTest', () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const color = new Color(r, g, b);
    const rgb = color.getRgb();

    expect(rgb[0]).toBe(r);
    expect(rgb[1]).toBe(g);
    expect(rgb[2]).toBe(b);
  });

  it('ByLayerTest', () => {
    const byLayer = Color.ByLayer;

    expect(byLayer.isByLayer).toBe(true);
    expect(byLayer.isByBlock).toBe(false);
    expect(byLayer.index).toBe(256);
  });

  it('ByBlockTest', () => {
    const byBlock = Color.ByBlock;

    expect(byBlock.isByBlock).toBe(true);
    expect(byBlock.isByLayer).toBe(false);
    expect(byBlock.index).toBe(0);
  });
});
