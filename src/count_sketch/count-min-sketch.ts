import { ICountMinSketch, Key, WrapperHashFunc, ToJSON } from '../types';
/** TypeScript realization of Count-Min-Sketch data structured, inspired by https://github.com/mikolalysenko/count-min-sketch
 * ```ts
 * class CountMinSketch {
 * query: (key: Key) => number;
 * update: (key: Key) => void;
 * toJSON: () => ToJSON;
 * fromJSON: (data: string | ToJSON) => this;
 * }
 * ```
 */
export class CountMinSketch implements ICountMinSketch {
  private table: Uint32Array;
  private scratch: Uint32Array;
  constructor(private width: number, private depth: number, private hashFunc: WrapperHashFunc) {
    this.table = new Uint32Array(width * depth);
    this.scratch = new Uint32Array(depth);
  }

  query = (key: Key): number => {
    const depth = this.depth;
    const width = this.width;
    const table = this.table;

    this.hashFunc(key, this.scratch);

    let ptr = width;
    let r = table[this.scratch[0] % width];

    for (let i = 1; i < depth; ++i) {
      r = Math.min(r, table[ptr + (this.scratch[i] % width)]);
      ptr += width;
    }
    return r;
  };

  update = (key: Key): void => {
    const d = this.depth;
    const w = this.width;
    const tab = this.table;
    let ptr = 0;
    this.hashFunc(key, this.scratch);
    for (let i = 0; i < d; ++i) {
      tab[ptr + (this.scratch[i] % w)] += 1;
      ptr += w;
    }
  };

  toJSON = (): ToJSON => {
    const table = new Array<Uint32Array>().slice.call<Uint32Array, number[], Uint32Array[]>(this.table);
    return {
      width: this.width,
      depth: this.depth,
      table: table as unknown as Uint32Array,
    };
  };

  fromJSON = (data: string | ToJSON): this => {
    if (typeof data == 'string') data = JSON.parse(data);

    if (typeof data === 'object') {
      const { width, depth, table } = data;
      if (!width && !depth && !table) throw new Error('Cannot reconstruct the filter with a partial object');

      const widthDepth = width * depth;
      const inputTable = table;
      const scratchLength = this.scratch.length;

      let thisTable = this.table;

      if (thisTable.length > widthDepth) thisTable = thisTable.subarray(0, widthDepth);
      else thisTable = new Uint32Array(widthDepth);

      for (let i = 0; i < widthDepth; ++i) {
        thisTable[i] = inputTable[i];
      }

      if (scratchLength > depth) this.scratch = this.scratch.subarray(0, depth);
      else this.scratch = new Uint32Array(depth);

      this.width = width | 0;
      this.depth = depth | 0;
      this.table = thisTable;
    }

    return this;
  };
}
