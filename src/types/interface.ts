export type TableBins = number[] | Uint32Array;
export type Key = number | object | string | bigint;
export type HashInt = (int: number) => number;
export type HashFunction = (str: string) => number;
export type KHash = (key: Key, bins: TableBins) => TableBins;
export type Hash32 = (key: string, seed: number) => number;

/** Create `count min sketch`
 * @param algrithmWidth - The width of a algorithms
 * @param numberOfHashFunctions - The func number  for data encoding
 * @param hashFunc - The list hashFunction `[ELFHash, JSHash, SDBMHash, DJBHash, DEKHash, APHash]`
 * @returns `CountMinSketch`
 */
export type CreateCountMinSketch = (
  algrithmWidth: number,
  numberOfHashFunctions: number,
  hashFunc: KHash,
) => ICountMinSketch;
/** Create default `count min sketch`
 * @returns `CountMinSketch`
 */
export type CreateCountMin = () => ICountMinSketch;
/** The data cache */
export type ToJSON = {
  /** The width of a algorithms */
  width: number;
  /** The func number  for data encoding */
  depth: number;
  /**The table cache. Uint32Array format */
  table: Uint32Array;
};
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
export interface ICountMinSketch {
  /*** The function that returns the number of matches of the passed data from the cache
   * @param key Receives `number | object | string | bigint`;
   * @returns - Returns the number of matches
   */
  query: (key: Key) => number;
  /*** The function that add the passed data to the cache.
   * @param key Receives `number | object | string | bigint`;
   */
  update: (key: Key) => void;
  /** The function that returns the cache data.
   * @returns `{width, depth, table}`
   */
  toJSON: () => ToJSON;
  /** Getting `Count Min Sketch` for work with cache.
   * @param data Receives data from function `toJSON()`
   * @returns Returns `CountMinSketch`
   */
  fromJSON: (data: string | ToJSON) => this;
}
