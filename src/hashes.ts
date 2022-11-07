/**
 * letious hash-functions, inspired by https://www.partow.net/programming/hashfunctions/#JSHashFunction
 */
 // eslint-disable-next-line @typescript-eslint/ban-types
 export function wrapperHashFunction(hashFunctions: Array<Function>)
 {

const hashInt = function(value: number, idx: number): number {
   return hashFunctions[idx < hashFunctions.length ? idx : idx % hashFunctions.length](value.toString());
}

//compatibility with k-hash,  murmur: (str: string, seed?: number)
const murmur = function(str: string, idx: number) : number {
    return hashFunctions[idx < hashFunctions.length ? idx : idx % hashFunctions.length](str);
}

return function (key: any, bins: Array<any>) {

    const DOUBLE_BUFFER = new Float64Array(1)
    const INT_VIEW = new Uint32Array(DOUBLE_BUFFER.buffer)

    const d = bins.length

  if(typeof key === "number") {
    if(Number.isInteger(key)) {
      let b = hashInt(key, 0)
      bins[0] = b
      for(let i=1; i<d; ++i) {
        b = hashInt(b, i)
        bins[i] = b
      }
    } else {
      DOUBLE_BUFFER[0] = key
      let b = hashInt(INT_VIEW[0] + hashInt(INT_VIEW[1], 0), 0)
      bins[0] = b
      for(let i=1; i<d; ++i) {
        b = hashInt(b, i)
        bins[i] = b
      }
    }
  } else if(typeof key === "string") {
    for(let i=0; i<d; ++i) {
      bins[i] = murmur(key, i)
    }
  } else if(typeof key === "object") {
    const str: string = JSON.stringify(key)
    for(let i=0; i<d; ++i) {
      bins[i] = murmur(str, i)
    }
  } else {
    const str = (key as string) + ""
    for(let i=0; i<d; ++i) {
      bins[i] = murmur(str, i)
    }
  }
  return 
 };
}

export function JSHash(str: string): number
{
   const length: number = str.length;
   let hash = 1315423911;

   for (let i = 0; i < length; ++i)
   {
      hash ^= ((hash << 5) + str.charCodeAt(i) + (hash >> 2));
   }

   return hash;
}

export function SDBMHash(str: string): number
{
   const length: number = str.length;
   let hash = 0;
   let i    = 0;

   for (i = 0; i < length; ++i)
   {
      hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
   }

   return hash;
}

export function DJBHash(str: string): number
{
   const length: number = str.length;
   let hash = 5381;

   for (let i = 0; i < length; ++i)
   {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
   }

   return hash;
}

export function DEKHash(str: string): number
{
   const length: number = str.length;
   let hash: number = length;

   for (let i = 0; i < length; ++i)
   {
      hash = ((hash << 5) ^ (hash >> 27)) ^ str.charCodeAt(i);
   }

   return hash;
}

export function APHash(str: string): number
{
   const length: number = str.length;
   let hash = 0xAAAAAAAA;

   for (let i = 0; i < length; ++i)
   {
      hash ^= ((i & 1) == 0) ? (  (hash <<  7) ^ str.charCodeAt(i) * (hash >> 3)) :
                               (~((hash << 11) + (str.charCodeAt(i)^ (hash >> 5))));
   }

   return hash;
}

//---------- do not use functions below as single hash functions -----------
//weak!
export function ELFHash(str: string): number
{
   const length: number = str.length;
   let hash = 0;
   let x    = 0;

   for (let i = 0; i < length; ++i)
   {
      hash = (hash << 4) + str.charCodeAt(i);

      if ((x = hash & 0xF0000000) != 0)
      {
         hash ^= (x >> 24);
      }

      hash &= ~x;
   }

   return hash;
}

//weak!
export function BKDRHash(str: string): number
{
   const length: number = str.length;
   const seed = 131; /* 31 131 1313 13131 131313 etc.. */
   let hash = 0;  

   for (let i = 0; i < length; ++i)
   {
      hash = (hash * seed) + str.charCodeAt(i);
   }

   return hash;
}

// weak!
export function RSHash(str: string)
{
   const length: number = str.length;
   const b = 378551;
   let a = 63689;
   let hash = 0;

   for (let i = 0; i < length; ++i)
   {
      hash = hash * a + str.charCodeAt(i);
      a    = a * b;
   }
   return hash;
}

// --------------------------------------------------------------------------