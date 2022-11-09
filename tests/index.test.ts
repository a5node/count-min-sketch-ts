import { expect, describe, test, beforeAll } from '@jest/globals';
import { createCountMin, createCountMinSketch } from '../src';

import { JSHash, SDBMHash, DJBHash, DEKHash, APHash, ELFHash } from '../src';

const dataCsutomisable = {
  depth: 6,
  width: 10,
};

describe('Testing default and customisable implementation', () => {
  describe('Basic operations', () => {
    let sketch;
    let customisable;
    beforeAll(() => {
      sketch = createCountMin();
      customisable = createCountMinSketch(dataCsutomisable.width, dataCsutomisable.depth, [
        APHash,
        JSHash,
        SDBMHash,
        DJBHash,
        DEKHash,
        APHash,
        ELFHash,
      ]);
    });
    test('if createCountMin defined', () => {
      expect(sketch).toBeDefined();
      expect(customisable).toBeDefined();
    });

    test('If throw error', () => {
      expect(() => sketch.fromJSON({})).toThrow();
      expect(() => sketch.fromJSON({})).toThrow(Error);
      expect(() => sketch.fromJSON({})).toThrow('Cannot reconstruct the filter with a partial object');
      expect(() => customisable.fromJSON({})).toThrow();
      expect(() => customisable.fromJSON({})).toThrow(Error);
      expect(() => customisable.fromJSON({})).toThrow('Cannot reconstruct the filter with a partial object');
    });

    describe('With toJSON()', () => {
      test('if return data', () => {
        const sketchJson = sketch.toJSON();
        const customisableJson = customisable.toJSON();
        expect(sketchJson).toBeDefined();
        expect(customisableJson).toBeDefined();
      });
      describe('checking data from default', () => {
        let sketchJson;
        beforeAll(() => {
          sketchJson = sketch.toJSON();
        });
        test('if width ok', () => {
          expect(sketchJson.width).toBeDefined();
          expect(sketchJson.width).toBe(28);
          expect(sketchJson.width).toEqual(28);
        });
        test('if depth ok', () => {
          expect(sketchJson.depth).toBeDefined();
          expect(sketchJson.depth).toBe(10);
          expect(sketchJson.depth).toEqual(10);
        });
        test('if table ok', () => {
          const l = sketchJson.table.length;
          expect(sketchJson.table).toBeDefined();
          expect(l).toBe(280);
          expect(l).toEqual(280);
        });
      });
      describe('checking data from customisable', () => {
        let sketchJson;

        beforeAll(() => {
          sketchJson = customisable.toJSON();
        });
        test('if width ok', () => {
          expect(sketchJson.width).toBeDefined();
          expect(sketchJson.width).toBe(dataCsutomisable.width);
          expect(sketchJson.width).toEqual(dataCsutomisable.width);
        });
        test('if depth ok', () => {
          expect(sketchJson.depth).toBeDefined();
          expect(sketchJson.depth).toBe(dataCsutomisable.depth);
          expect(sketchJson.depth).toEqual(dataCsutomisable.depth);
        });
        test('if table ok', () => {
          const sketchLength = sketchJson.table.length;
          const length = dataCsutomisable.width * dataCsutomisable.depth;
          expect(sketchJson.table).toBeDefined();
          expect(sketchLength).toBe(length);
          expect(sketchLength).toEqual(length);
        });
      });
    });
  });

  describe('Testing default implementation to/from JSON', () => {
    let sketch;
    let from;
    const obj = { test: 'test', key: 123 };
    beforeAll(() => {
      sketch = createCountMin();
      sketch.update('a');
      sketch.update(1111);
      sketch.update(obj);
      const x = sketch.toJSON();
      from = createCountMin();
      from.fromJSON(x);
    });

    test('if createCountMin defined', () => {
      expect(sketch).toBeDefined();
      expect(from).toBeDefined();
    });

    test('if throw error', () => {
      expect(() => from.fromJSON({})).toThrow();
      expect(() => from.fromJSON({})).toThrow(Error);
      expect(() => from.fromJSON({})).toThrow('Cannot reconstruct the filter with a partial object');
      expect(() => sketch.fromJSON({})).toThrow();
      expect(() => sketch.fromJSON({})).toThrow(Error);
      expect(() => sketch.fromJSON({})).toThrow('Cannot reconstruct the filter with a partial object');
    });
    describe('With toJSON()', () => {
      test('if toJSON return data', () => {
        const sketchJson = sketch.toJSON();
        const fromJson = from.toJSON();
        expect(sketchJson).toBeDefined();
        expect(fromJson).toBeDefined();
      });
      describe('checking data', () => {
        let fromJson;
        beforeAll(() => {
          fromJson = from.toJSON();
        });
        test('if width ok', () => {
          expect(fromJson.width).toBeDefined();
          expect(fromJson.width).toBe(28);
          expect(fromJson.width).toEqual(28);
        });
        test('if depth ok', () => {
          expect(fromJson.depth).toBeDefined();
          expect(fromJson.depth).toBe(10);
          expect(fromJson.depth).toEqual(10);
        });
        test('if table ok', () => {
          const l = fromJson.table.length;
          expect(fromJson.table).toBeDefined();
          expect(l).toBe(280);
          expect(l).toEqual(280);
        });
      });
    });
  });
});
