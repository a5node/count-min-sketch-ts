import { HashFunction } from '../types';

export const JSHash: HashFunction = (str: string): number => {
  const length: number = str.length;
  let hash = 1315423911;

  for (let i = 0; i < length; ++i) {
    hash ^= (hash << 5) + str.charCodeAt(i) + (hash >> 2);
  }

  return hash;
};

export const SDBMHash: HashFunction = (str: string): number => {
  const length: number = str.length;
  let hash = 0;
  let i = 0;

  for (i = 0; i < length; ++i) {
    hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
  }

  return hash;
};

export const DJBHash: HashFunction = (str: string): number => {
  const length: number = str.length;
  let hash = 5381;

  for (let i = 0; i < length; ++i) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }

  return hash;
};

export const DEKHash: HashFunction = (str: string): number => {
  const length: number = str.length;
  let hash: number = length;

  for (let i = 0; i < length; ++i) {
    hash = (hash << 5) ^ (hash >> 27) ^ str.charCodeAt(i);
  }

  return hash;
};

export const APHash: HashFunction = (str: string): number => {
  const length: number = str.length;
  let hash = 0xaaaaaaaa;

  for (let i = 0; i < length; ++i) {
    hash ^=
      (i & 1) == 0
        ? (hash << 7) ^ (str.charCodeAt(i) * (hash >> 3))
        : ~((hash << 11) + (str.charCodeAt(i) ^ (hash >> 5)));
  }

  return hash;
};

//---------- do not use functions below as single hash functions -----------
//weak!
export const ELFHash: HashFunction = (str: string): number => {
  const strLength: number = str.length;
  let hash = 0;
  let bit = 0;

  for (let i = 0; i < strLength; ++i) {
    hash = (hash << 4) + str.charCodeAt(i);
    if ((bit = hash & 0xf0000000) != 0) hash ^= bit >> 24;
    hash &= ~bit;
  }

  return hash;
};

//weak!
export const BKDRHash: HashFunction = (str: string): number => {
  const length: number = str.length;
  const seed = 131; /* 31 131 1313 13131 131313 etc.. */
  let hash = 0;

  for (let i = 0; i < length; ++i) {
    hash = hash * seed + str.charCodeAt(i);
  }

  return hash;
};

// weak!
export const RSHash: HashFunction = (str: string): number => {
  const length: number = str.length;
  const b = 378551;
  let a = 63689;
  let hash = 0;

  for (let i = 0; i < length; ++i) {
    hash = hash * a + str.charCodeAt(i);
    a = a * b;
  }
  return hash;
};

// --------------------------------------------------------------------------
