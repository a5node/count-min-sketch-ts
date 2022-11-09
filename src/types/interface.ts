export type TableBins = number[] | Uint32Array;
export type Key = number | object | string | bigint;
export type HashInt = (int: number) => number;
export type HashFunction = (str: string) => number;
export type KHash = (key: Key, bins: TableBins) => TableBins;
export type Hash32 = (key: string, seed: number) => number;

export type CreateCountMinSketch = (
  algrithmWidth: number,
  numberOfHashFunctions: number,
  hashFunc: KHash,
) => ICountMinSketch;

export type CreateCountMin = () => ICountMinSketch;

export type ToJSON = {
  /** */
  width: number;
  /** */
  depth: number;
  /** Uint32Array */
  table: Uint32Array;
};

export interface ICountMinSketch {
  /**
   *
   * @param key
   * @returns
   */
  query: (key: Key) => number;
  /**
   *
   * @param key
   * @returns
   */
  update: (key: Key) => void;
  /**
   *
   * @returns
   */
  toJSON: () => ToJSON;
  /**
   *
   * @param data
   * @returns
   */
  fromJSON: (data: string | ToJSON) => this;
}
