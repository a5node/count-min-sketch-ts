import { createCountMin, createCountMinSketch } from '../src/index';
import {JSHash, SDBMHash, DJBHash, DEKHash, APHash, ELFHash} from '../src/hashes';

describe('testing default implementation', () => {
  test('testing default implementation basic operations', () => {

    const sketch = createCountMin()
    const obj= {test: "test", key: 123}
  
    sketch.update("a")
    sketch.update("b")
    sketch.update("c")
    sketch.update("b")
    sketch.update(obj)

    expect(sketch.query("a")).toBe(1)
    expect(sketch.query("b")).toBe(2)
    expect(sketch.query("c")).toBe(1)

    sketch.update("a", 1)

    expect(sketch.query("a")).toBe(2)
    expect(sketch.query("b")).toBe(2)
    expect(sketch.query("c")).toBe(1)
    expect(sketch.query(obj)).toBe(1)

  });

  test('testing default implementation to/from JSON', () => {

    const sketch = createCountMin()
  
    sketch.update("a")
    sketch.update("b")
    sketch.update("c")

    const x = sketch.toJSON()
    const y = createCountMin()
    y.fromJSON(x)

    expect(y.query("a")).toBe(1)
    expect(y.query("b")).toBe(1)
    expect(y.query("c")).toBe(1)
    expect(y.query("d")).toBe(0)

  });
 });

describe('testing customisable implementation', () => {
  test('testing customisable implementation basic operations', () => {

    const sketch = createCountMinSketch(10, 6, [APHash, JSHash, SDBMHash, DJBHash, DEKHash, APHash])

    const obj= {test: "test", key: 123}
  
    sketch.update("a")
    sketch.update("b")
    sketch.update("c")
    sketch.update("bbbb")
    sketch.update("bbbb")
    sketch.update(obj)
    sketch.update(12345)
    sketch.update(124)

    expect(sketch.query("a")).toBe(1)
    expect(sketch.query("b")).toBe(1)
    expect(sketch.query("bbbb")).toBe(2)
    expect(sketch.query("c")).toBe(1)
    expect(sketch.query(obj)).toBe(1)
    expect(sketch.query(124)).toBe(1)
    expect(sketch.query(12345)).toBe(1)

    sketch.update("a") 
    sketch.update(12345)
    sketch.update(obj)

    expect(sketch.query("a")).toBe(2)
    expect(sketch.query("b")).toBe(1)
    expect(sketch.query("c")).toBe(1)
    expect(sketch.query(12345)).toBe(2)
    expect(sketch.query(12)).toBe(0)
    expect(sketch.query(obj)).toBe(2)

  });

  test('testing customisable implementation to/from JSON', () => {

    const sketch = createCountMinSketch(10, 7, [ELFHash, JSHash, SDBMHash, DJBHash, DEKHash, APHash])
  
    const obj= {test: "test", key: 123}

    sketch.update("a")
    sketch.update("b")
    sketch.update("c")
    sketch.update("c")
    sketch.update(obj)

    const x = sketch.toJSON()
    const y = createCountMinSketch(10, 7, [ELFHash, JSHash, SDBMHash, DJBHash, DEKHash, APHash])
    y.fromJSON(x)

    expect(y.query("a")).toBe(1)
    expect(y.query("b")).toBe(1)
    expect(y.query("c")).toBe(2)
    expect(y.query(obj)).toBe(1)
    expect(y.query("d")).toBe(0)

  });
});