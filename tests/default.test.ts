import { expect, describe, test, beforeAll } from '@jest/globals';
import { createCountMin } from '../src';

describe('Testing default implementation', () => {
  describe('Basic operations', () => {
    let sketch;
    beforeAll(() => {
      sketch = createCountMin();
    });

    describe('with number', () => {
      test('if added one', () => {
        sketch.update(12345);
        sketch.update(124);
        expect(sketch.query(124)).toBe(1);
        expect(sketch.query(12345)).toBe(1);
      });
      test('if added another one ', () => {
        sketch.update(12345);
        sketch.update(124);
        expect(sketch.query(124)).toBe(2);
        expect(sketch.query(12345)).toBe(2);
      });
      test('if values 0 number', () => {
        expect(sketch.query(333333)).toBe(0);
      });
    });

    describe('With string', () => {
      test('if added one symbol', () => {
        sketch.update('a');
        sketch.update('b');
        sketch.update('c');
        expect(sketch.query('a')).toBe(1);
        expect(sketch.query('b')).toBe(1);
        sketch.update('c');
      });
      test('if added another one symbol ', () => {
        sketch.update('a');
        sketch.update('b');
        expect(sketch.query('b')).toBe(2);
        expect(sketch.query('a')).toBe(2);
        sketch.update('c');
      });
      test('if values 0 string', () => {
        expect(sketch.query('zero')).toBe(0);
      });
    });
    describe('With object', () => {
      test('if added one', () => {
        const obj = { test: 'test', key: 123 };
        sketch.update(obj);
        expect(sketch.query(obj)).toBe(1);
      });
      test('if added another one', () => {
        const obj = { test: 'test', key: 123 };
        sketch.update(obj);
        expect(sketch.query(obj)).toBe(2);
      });
      test('if added other one', () => {
        const other = { test: 'other', key: 222 };
        sketch.update(other);
        expect(sketch.query(other)).toBe(1);
      });
      test('if obj 2 and other 1 ', () => {
        const obj = { test: 'test', key: 123 };
        const other = { test: 'other', key: 222 };
        expect(sketch.query(obj)).toBe(2);
        expect(sketch.query(other)).toBe(1);
      });
      test('if zero', () => {
        const zero = { test: 'zero', key: 100000 };
        expect(sketch.query(zero)).toBe(0);
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
      sketch.update('b');
      sketch.update('c');
      sketch.update('c');
      sketch.update(1111);
      sketch.update(1111);
      sketch.update(2222);
      sketch.update(obj);
      const x = sketch.toJSON();
      from = createCountMin();
      from.fromJSON(x);
    });
    describe('With number', () => {
      test('if found added numbers', () => {
        expect(from.query(1111)).toBe(2);
        expect(from.query(2222)).toBe(1);
      });
      test('if zero', () => {
        expect(from.query(3333)).toBe(0);
      });
      test('if added', () => {
        expect(from.query(3333)).toBe(0);
      });
      test('if added one', () => {
        from.update(124);
        from.update(12345);
        expect(from.query(124)).toBe(1);
        expect(from.query(12345)).toBe(1);
      });
      test('if added another one ', () => {
        from.update(124);
        from.update(12345);
        expect(from.query(124)).toBe(2);
        expect(from.query(12345)).toBe(2);
      });
    });

    describe('With string', () => {
      test('if found added string', () => {
        expect(from.query('a')).toBe(1);
        expect(from.query('b')).toBe(1);
        expect(from.query('c')).toBe(2);
      });
      test('if zero', () => {
        expect(from.query('zero')).toBe(0);
      });
      test('if added one', () => {
        from.update('d');
        from.update('f');
        expect(from.query('d')).toBe(1);
        expect(from.query('f')).toBe(1);
      });
      test('if added another one ', () => {
        from.update('d');
        from.update('f');
        expect(from.query('d')).toBe(2);
        expect(from.query('f')).toBe(2);
      });
    });
    describe('With object', () => {
      test('if found added object', () => {
        expect(from.query(obj)).toBe(1);
      });
      test('if zero', () => {
        const zero = { test: 'zero', key: 12345678 };
        expect(from.query(zero)).toBe(0);
      });
    });
  });
});
