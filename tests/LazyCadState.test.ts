import { expect, it } from 'vitest';
import { Line } from '../src/Entities/Line.js';
import { Layer } from '../src/Tables/Layer.js';
import { CadDocument } from '../src/CadDocument.js';
import { LineType } from '../src/Tables/LineType.js';

it('keeps unset entity and layer references unset through clone and detach', () => {
  const line = new Line();
  const clone = line.clone() as Line;
  const layer = new Layer('example');
  const clonedLayer = layer.clone() as Layer;
  line.unassignDocument();
  layer.unassignDocument();
  for (const entity of [line, clone]) {
    expect(Reflect.get(entity, '_layer')).toBeNull();
    expect(Reflect.get(entity, '_lineType')).toBeNull();
    expect(entity.layer.name).toBe('0');
    expect(entity.lineType.name).toBe('ByLayer');
  }
  for (const item of [layer, clonedLayer]) {
    expect(Reflect.get(item, '_lineType')).toBeNull();
    expect(item.lineType.name).toBe('Continuous');
  }
});

it('deep-clones populated references without changing the source', () => {
  const line = new Line();
  line.layer = new Layer('custom');
  line.lineType = LineType.byBlock;
  const clone = line.clone() as Line;
  expect(clone.layer).not.toBe(line.layer);
  expect(clone.layer.name).toBe('custom');
  expect(clone.lineType).not.toBe(line.lineType);
  expect(clone.lineType.name).toBe('ByBlock');
});

it('initializes extended data, reactors and default references only on demand', () => {
  const line = new Line();
  for (const field of ['_extendedData', '_reactors', '_layer', '_lineType']) expect(Reflect.get(line, field)).toBeNull();
  expect(line.removeReactor(new Line())).toBe(false);
  line.cleanReactors();
  expect(Reflect.get(line, '_reactors')).toBeNull();
  expect(line.extendedData.owner).toBe(line);
  expect(line.extendedData).toBe(line.extendedData);
  expect(line.layer.name).toBe('0');
  expect(line.lineType.name).toBe('ByLayer');
  const reactor = new Line();
  line.addReactor(reactor);
  expect(line.reactors).toEqual([reactor]);
  expect(line.removeReactor(reactor)).toBe(true);
});

it('registers lazy defaults with a document without allocating unused extended data', () => {
  const document = new CadDocument();
  const line = new Line();
  document.entities.add(line);
  expect(line.layer).toBe(document.layers.tryGetValue('0'));
  expect(line.lineType).toBe(document.lineTypes.tryGetValue('ByLayer'));
  expect(Reflect.get(line, '_extendedData')).toBeNull();
});

it('clones and detaches unused collections without allocating or sharing them', () => {
  const line = new Line();
  line.extendedData.addByName('EXAMPLE');
  line.addReactor(new Line());
  const clone = line.clone() as Line;
  expect(Reflect.get(clone, '_extendedData')).toBeNull();
  expect(Reflect.get(clone, '_reactors')).toBeNull();
  expect(clone.extendedData.owner).toBe(clone);
  expect(clone.extendedData.size).toBe(0);
  clone.addReactor(new Line());
  expect(clone.reactors).not.toBe(line.reactors);
  expect(line.extendedData.size).toBe(1);
  const untouched = new Line();
  untouched.unassignDocument();
  expect(Reflect.get(untouched, '_extendedData')).toBeNull();
  expect(Reflect.get(untouched, '_reactors')).toBeNull();
});
