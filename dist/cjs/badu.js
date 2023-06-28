'use strict';

// noinspection JSUnusedLocalSymbols

/**
 * @type {Array<number>}
 */
const numericInt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * @type {Array<string>}
 */
const numericString = '0123456789'.split('');

/**
 * @type {Array<string>}
 */
const signedNumericString = ['-', ...numericString];

/**
 * @type {Array<string>}
 */
const floatString = ['.', ...signedNumericString];


/**
 * @type {Array<string>}
 */
const alphaLower = 'abcdefghijklmnopqrstuvwxyz'.split('');

/**
 * @type {Array<string>}
 */
const alphaUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * @type {Array<string>}
 */
const alphaNum = [...alphaLower, ...alphaUpper, ...numericString];

/**
 * @type {Map<string, boolean>}
 */
const boolMap = new Map()
  .set('true', true)
  .set('false', false);


/**
 * A variadic compose that accepts any number of pure functions and composes
 * them together.
 * @param {...function(?): ?} fns
 * @returns {function(?): ?}
 */
const compose = (...fns) => (...x) => fns.reduce((a, b) => c => a(b(c)))(...x);


/**
 * @param {*} e
 * @returns {*}
 */
const identity = e => e;


/**
 * Usage:
 * var g = partial(f, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param {!Function} fn A function to partially apply.
 * @param {...*} a Additional arguments that are partially applied to fn.
 * @return {function(...*): *} A partially-applied form of the function.
 */
const partial = (fn, ...a) => (...b) => fn(...[...a, ...b]);


//---------------------------------------------------------[ Always the same ]--
// noinspection JSUnusedLocalSymbols
/**
 * @param {...*} args
 * @return {undefined}
 */
const alwaysUndef = (...args) => undefined;


// noinspection JSUnusedLocalSymbols
/**
 * @param {...*} args
 * @returns {boolean}
 */
const alwaysFalse = (...args) => false;


// noinspection JSUnusedLocalSymbols
/**
 * @param {...*} args
 * @returns {boolean}
 */
const alwaysTrue = (...args) => true;


// noinspection JSUnusedLocalSymbols
/**
 * @param {...*} args
 * @returns {null}
 */
const alwaysNull = (...args) => null;


//-------------------------------------------------------[ Log & Debug Tools ]--
/**
 * @param {string} tag
 * @param {*} x
 * @returns {*}
 */
const logInline = (tag, x) => {
  console.log(tag, x);
  return x;
};


/**
 * Given a tag return a partial function that will print whatever it was given
 * along with the tag.
 * @param {string} tag
 * @returns {function(string, *): *}
 */
const trace = tag => partial(logInline, tag);


//---------------------------------------------------------------[ Questions ]--
/**
 * @param {*} x
 * @return {string}
 */
const whatType = x => typeof x;

/**
 * Convert the given thing to a boolean if it can. Else return it as is.
 * @param {*} s
 * @returns {*|boolean}
 */
const maybeBool = s => isDef(boolMap.get(s)) ? boolMap.get(s) : s;

/**
 * @param {*} func
 * @return {function(): undefined}
 */
const maybeFunc = func => () => {
  if (whatType(func) === 'function') {
    return /** @type {!Function} */(func)()
  }
};


//--------------------------------------------------------------[ Assertions ]--
/**
 * @param {?} t
 * @returns {boolean}
 */
const isDef = t => t !== undefined;


/**
 *
 *
 * @param {*} t
 * @return {boolean}
 */
const isUndefined = t => t === void 0;


/**
 * @param {*} t
 * @return {boolean}
 */
const isDefAndNotNull = t => t != null;


/**
 * @param {*} n
 * @return {boolean}
 */
const isString = n => whatType(n) === 'string';


/**
 * @param {*} def
 * @return {function(string):*}
 */
const isStringElse = def => n => isString(n) ? n : def;


/**
 * @param {*} n
 * @return {boolean}
 */
const isNumber = n => whatType(n) === 'number' &&
  !Number.isNaN(/** @type number */(n));

/**
 * @param t
 * @returns {*|boolean}
 */
const isObject = t => (
  (t
    && typeof t === 'object'
    && !(t instanceof Array)
    && !(t instanceof Set)
    && !(t instanceof Map)
    && !(t instanceof Date)) === true
);

/**
 * @param t
 * @returns {boolean}
 */
const isArray = t => t instanceof Array;

/**
 * @param {*} n
 * @return {boolean}
 */
const isFunction = n => whatType(n) === 'function';

/**
 * A strict even test that does not coerce values, and results in false if the
 * given element is not a number.
 * @param {*} t
 * @returns {boolean}
 */
const isEven = t => isNumber(t) && !(/** @type number */(t) % 2);


/**
 * @param {number} n
 * @returns {function(*): boolean}
 */
const isDivisibleBy = n => x => isNumber(x) && /** @type number */(x) % n === 0;

/**
 * @param {function(*=): *} a
 * @param {function(*=): *} b
 * @returns {function(?): ?}
 */
const both = (a, b) => n => a(n) && b(n);


/**
 * @param {*} v
 * @returns {boolean}
 */
const hasValue = v => (!(v === undefined || Number.isNaN(v)));


/**
 * Check if an Object has keys. Useful to check if JSON responses are
 * empty.
 * @param o
 * @returns {boolean}
 */
const isEmpty = o => !isObject(o) || Object.keys(o).length === 0;


/**
 * Returns true if the values are the same
 * @param {*} v
 * @returns {function(*): boolean}
 */
const sameAs = v => e => v === e;


//-------------------------------------------------------------[ Array Tools ]--
/**
 * A generator function that returns an iterator over the specified range of
 * numbers. By default the step size is 1, but this can optionally be passed
 * in as well. A negative step size is silently converted to a positive number.
 * The generator will always yield the first value, and from there step
 * towards the second value.
 * It does not matter which of the 2 values are larger, the generator will
 * always step from the first towards the second.
 * @param {number} b Begin here - First element in array
 * @param {number} e End here - Last element in array
 * @param {number=} s Step this size
 */
function* rangeGen(b, e, s = 1) {
  if (!isNumber(s) || s === 0) {
    throw new TypeError(`Invalid step size: ${s}`);
  }
  if (!(isNumber(b) && isNumber(e))) {
    throw new TypeError('Arguments to range must be numbers');
  }
  let up = e >= b;
  for (let i = b; up ? i <= e : i >= e;
       up ? i += Math.abs(s) : i -= Math.abs(s)) {
    yield i;
  }
}


/**
 * Range between. Similar to Python's range.
 * console.log(range(1, -1));
 * Both begin and end is inclusive
 * @param {number} b Beginning Inclusive
 * @param {number} e End Inclusive
 * @param {number=} s Step size
 * @returns {Array<number>}
 */
const range = (b, e, s) => [...(rangeGen(b, e, s))];


/**
 * Works by spoofing an iterable object by creating an object with a length
 * property. Steps by 1 only.
 * Both begin and end is inclusive
 * @param {!number} m
 * @param {!number} n
 * @returns {Array<!number>}
 */
const range2 = (m, n) => Array.from(
  {length: Math.floor(n - m) + 1},
  (_, i) => m + i
);


/**
 * Range from 0 to n - 1
 * @param {!number} n
 * @returns {Array<!number>}
 */
const iRange = n => [...Array(n).keys()];


/**
 * Given max value, return a function that takes an int, and returns an
 * array of values in clock order from the given int around.
 * Example:
 *     clock12 = clock(12)
 *     clock12(4) -> [ 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3 ]
 * @param {number} m
 * @returns {function(number):Array<number>}
 */
const clock = m => s => [...range2(s, m), ...(s > 1 ? range2(1, s - 1) : [])];


/**
 * Get the first element of an array
 * @param {!Array<*>} x
 * @return {*}
 */
const head = x => x[0];


/**
 * Return the last element of an array, or undefined if the array is empty.
 * @param {Array<*>} x
 * @returns {*}
 */
const tail = x => x[x.length - 1];


/**
 * Reverse either an array or a string
 * @param {string|!Array<*>} x
 * @return {!Array<string|*>}
 */
const reverse = x => Array.from(x).reduce((p, c) => [c, ...p], []);


/**
 * Truncate an array to the number of elements given in n;
 * @param {number} n
 * @return {function(!Array<*>): !Array<*>}
 */
const truncate = n => arr => arr.filter((_, i) => i < n);


/**
 * Flatten multi-dimensional array to single dimension.
 * Example:
 * [[1], 2, [[3, 4], 5], [[[]]], [[[6]]], 7, 8, []] -> [1, 2, 3, 4, 5, 6, 7, 8]
 * @param {!Array<*>} a
 * @return {Array<*>}
 */
const flatten = a => a.reduce(
  (p, c) => c.reduce ? flatten([...p, ...c]) : [...p, c], []);


/**
 * Given an index number, return a function that takes an array and returns the
 * element at the given index
 * @param {number} i
 * @return {function(!Array<*>): *}
 */
const elAt = i => arr => arr[i];


/**
 * Given an array of arrays return a function that returns an array of
 * elements at the given index.
 * Example:
 * columnAt([
 *    ['a', 'b', 'c'],
 *    ['A', 'B', 'C'],
 *    [1, 2, 3]
 * ])(2) -> ['c', 'C', 3]
 * @param {!Array<!Array<*>|!string>} arr
 * @returns {function(!number): !Array<*>}
 */
const columnAt = arr => i => arr.map(e => e[i]);


/**
 * Transpose an array of arrays:
 * Example:
 * [['a', 'b', 'c'], ['A', 'B', 'C'], [1, 2, 3]] ->
 * [['a', 'A', 1], ['b', 'B', 2], ['c', 'C', 3]]
 * @param {!Array<!Array<*>>} a
 * @return {!Array<!Array<*>>}
 */
const transpose = a => a[0].map((e, i) => a.map(elAt(i)));


/**
 * a → n → [a]
 * Returns a fixed list of size n containing a specified identical value.
 * @param {*} v
 * @param {number} n
 * @return {!Array<*>}
 */
const repeat = (v, n) => new Array(parseInt(n, 10)).fill(v);


/**
 * Counts the occurrence of an element in an array.
 * @param {*} t
 * @return {function(!Array<*>): *}
 */
const countOck = t => arr =>
  arr.filter(e => Number.isNaN(t) ? Number.isNaN(e) : e === t).length;


/**
 * Counts the occurrence of something that satisfies the predicate
 * @param {function(*): * } f
 * @returns {function(!Array<*>): number}
 */
const countByFunc = f => arr => arr.filter(f).length;


/**
 * Remove every n-th element from the given array
 * @param {number} n
 * @return {function(!Array<*>): Array<*>}
 */
const filterAtInc = n => arr => arr.filter((e, i) => (i + 1) % n);


/**
 * A strict same elements in same order comparison.
 * @param {Array<*>} a
 * @param {Array<*>} b
 * @returns {boolean}
 */
const sameArr = (a, b) => a.length === b.length && a.every((c, i) => b[i] === c);


/**
 * A loose same elements comparison.
 * @param {Array<*>} a
 * @param {Array<*>} b
 * @returns {boolean}
 */
const sameEls = (a, b) => a.length === b.length &&
  a.every(c => b.includes(c)) && b.every(c => a.includes(c));


/**
 * Checks of all the elements in the array are the same.
 * @param arr
 * @returns {boolean}
 */
const allElementsEqual = arr => arr.every(sameAs(arr[0]));


/**
 * @param func
 * @returns {function(!Array<*>): !Array<*>}
 */
const map = func => x => x.map(func);


/**
 * @param func
 * @returns {function(!Array<*>): !Array<*>}
 */
const filter = func => n => n.filter(func);


/**
 * Convert the given array into an array of smaller arrays each with the length
 * given by n.
 * @param {number} n
 * @returns {function(!Array<*>): !Array<!Array<*>>}
 */
const chunk = n => a => a.reduce(
  (p, c, i) => (!(i % n)) ? p.push([c]) && p : p[p.length - 1].push(c) && p,
  []);

/**
 * A special implementation of 'chunks' where the chunk size is 2.
 * Useful for converting array into kv-pairs.
 * @param arr
 * @returns {!Array<!Array<*>>}
 */
const pairs = arr => chunk(2)(arr);


/**
 * Given an array of elements, treat each even index as a key, and each odd
 * index as the value for the preceding key.
 * Return a map of those kv-pairs
 * @param arr
 * @returns {Map<any, any>}
 */
const pairsToMap = arr => new Map(pairs(arr));


/**
 * Find the biggest number in a list of numbers
 * @param {!Array<number>} arr
 * @returns {number}
 */
const maxInArr = arr => Math.max(...arr);


/**
 * Find the biggest number in a list of numbers
 * @param {!Array<number>} arr
 * @returns {number}
 */
const minInArr = arr => Math.min(...arr);


/**
 * Reduce the columns in an array of arrays.
 * columnReduce([[1,2,3], [4,5,6]], (p,c) => p + c) // [5,7,9]
 * @param arr
 * @param f
 * @returns {Array}
 */
const columnReduce = (arr, f) => transpose(arr).map(e => e.reduce(f));


/**
 * Split an array into two arrays at the given position.
 * splitAt :: Int -> [a] -> ([a],[a])
 * @param {number} n
 * @returns {function(!Array<*>):!Array<Array<*>>}
 */
const splitAt = n => arr => [arr.slice(0, n), arr.slice(n)];


/**
 * Creates a new list out of the two supplied by pairing up equally-positioned
 * items from both lists. The returned list is truncated to the length of the
 * shorter of the two input lists.
 * Example:
 *    zip([1, 2], ['a', 'b', 'c']) -> [[1, 'a'], [2, 'b']]
 *    zip([1, 2, 3], ['a', 'b']) -> [[1, 'a'], [2, 'b']]
 * @param {Array<*>} a
 * @param {Array<*>} b
 * @returns {Array<*>}
 */
const zip = (a, b) => a.reduce((p, c, i) => b[i] ? push(p, [c, b[i]]) : p, []);

/**
 * Creates a new flat list out of the two supplied by pairing up
 * equally-positioned items from both lists. The pairing is limited to
 * elements where both arrays have elements at that position.
 * Example:
 *    zipFlat([1, 2], ['a', 'b', 'c']) -> [1, 'a', 2, 'b']
 *    zipFlat([1, 2, 3], ['a', 'b']) -> [1, 'a', 2, 'b']
 * @param {Array<*>} a
 * @param {Array<*>} b
 * @returns {Array<*>}
 */
const zipFlat = (a, b) => flatten(zip(a, b));

/**
 * Given an array of arrays, find the elements that appear in more than
 * one array.
 * @param a {!Array<!Array<*>>}
 * @returns {Array}
 */
const findShared = a => [...flatten(a).reduce((p, c) =>
    p.has(c) ? p.set(c, [...p.get(c), c]) : p.set(c, [c]),
  new Map()).values()].filter(e => e.length > 1).map(e => e[0]);


/**
 * Filter an array to only include the elements that correspond to the given
 * array of indexes.
 * @param indexes {!Array<!number>}
 * @returns {function(*): *}
 */
const filterOnlyIndexes = indexes => arr => {
  return arr.filter((e, i) => indexes.includes(i));
};


/**
 * Convert two arrays into a map. The first array is considered the keys, and
 * the second the values. When arrays are of unequal lengths, the values will
 * be undefined for all elements in the key array without a matching index in
 * the values array. If the keys array is shorter than the values array, the
 * non-mapped values will be discarded
 * @param kA {Array<*>} Array to use as keys
 * @param vA {Array<*>} Array to use as values
 * @returns {Map<any, any>}
 */
const arrToMap = (kA, vA) =>
  kA.reduce((p, c, i) => p.set(c, vA[i]), new Map());

/**
 * Remove n elements from the array starting at the given index
 * @param {number} idx Index position of first removed element
 * @param {number} n Number of elements to remove from there onwards
 * @param {Array<*>} arr The array to operate on.
 *    This array will NOT be mutated.
 * @returns {Array<*>} A two element 2D array, the first element is
 *    the array of removed elements, and the second element is a copy
 *    of the original array with the elements removed.
 */
const remove = (idx, n, arr) => {
  const cpy = [...arr];
  return [cpy.splice(idx, n), cpy]
};

/**
 * Remove the element from the array at index
 * @param {number} i The index number of the element to be removed
 * @param {Array<*>} arr The array to remove the element from
 * @returns {Array<*>} A two element array, the first element is the
 *    element removed from the index position, the next is the leftover
 *    array after the element was removed.
 */
const removeAtIndex = (i, arr) => {
  const [a, b] = remove(i, 1, arr);
  return [a[0], b];
};

/**
 * Returns a random element from an array, and a copy of the original array with
 * that element removed.
 * @param {Array<*>} arr
 * @returns {Array<*>}
 */
const removeRandom = arr => removeAtIndex(randIntBetween(0, arr.length)(), arr);

/**
 * Pushes, but returns the array not the pushed element.
 * @param {Array<*>} arr
 * @param {*} e
 * @returns {Array<*>}
 */
const push = (arr, e) => [...arr, e];


/**
 * Find elements common in both arrays
 * @example
 *    intersection([0, 0, 0, 1, 2, 4, 9], [2, 3, 3, 4, 5]) -> [2, 4]
 * @param {Array<*>} arr1
 * @param {Array<*>} arr2
 * @returns {Array<*>}
 */
const intersection = (arr1, arr2) => {
  const s2 = new Set(arr2);
  return [...new Set(arr1)].filter(e => s2.has(e))
};


/**
 * Find elements in only in arr1 and not in arr2
 * @example
 *    difference([0, 0, 0, 1, 2, 4, 9], [2, 3, 3, 4, 5]) -> [0, 1, 9]
 * @param {Array<*>} arr1
 * @param {Array<*>} arr2
 * @returns {Array<*>}
 */
const difference = (arr1, arr2) => {
  const s2 = new Set(arr2);
  return [...new Set(arr1)].filter(e => !s2.has(e))
};


/**
 * All unique elements from the combination of both arrays
 * @example
 *     union([0, 0, 0, 1, 2, 4, 9], [2, 3, 3, 4, 5]) -> [0, 1, 2, 4, 9, 3, 5]
 * @param {Array<*>} arr1
 * @param {Array<*>} arr2
 * @returns {Array<*>}
 */
const union = (arr1, arr2) => [...new Set(
  [...new Set(arr1), ...new Set(arr2)])];

/**
 * Find elements unique to each of the arrays
 * @example
 *      symmetricDiff([0, 1, 2, 4, 9], [2, 3, 4, 5]) -> [0, 1, 9, 3, 5]
 * @param {Array<*>} arr1
 * @param {Array<*>} arr2
 * @returns {Array<*>}
 */
const symmetricDiff = (arr1, arr2) => difference(
  union(arr1, arr2), intersection(arr1, arr2));


//--------------------------------------------------------------[ Conversion ]--
/**
 * @param {string} x
 * @return {string}
 */
const toLowerCase = x => x.toLowerCase();

/**
 * @param {*} x
 * @return {string}
 */
const toString = x => x + '';


/**
 * @param {string} x
 * @return {number}
 */
const toNumber = x => +x;


/**
 * @param {string} x
 * @return {string}
 */
const toUpperCase = x => x.toUpperCase();


/**
 * @param {*=} n
 * @returns {boolean}
 */
const negate = n => !n;


/**
 * If the given string includes the delimiter, quote the text
 * @param delim
 * @return {function(*): *}
 */
const quote = delim => s => (isString(s) && s.includes(delim)) ? `"${s}"` : s;


/**
 * @type {function(*): string}
 */
const anyToLowerCase = compose(toLowerCase, toString);


//------------------------------------------------------------[ String Tools ]--
/**
 * Returns a string with at least 64-bits of randomness.
 *
 * Doesn't trust Javascript's random function entirely. Uses a combination of
 * random and current timestamp, and then encodes the string in base-36 to
 * make it shorter.
 *
 * @return {string} A random string, e.g. sn1s7vb4gcic.
 */
const makeRandomString = () => {
  let x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) +
    Math.abs(Math.floor(Math.random() * x) ^ Date.now()).toString(36);
};

/**
 * Pad a string with the given char to a total length of n
 * @param {string} v
 * @param {number} n
 * @return {function(string): string}
 */
const leftPadWithTo = (v, n) => {
  const a = /** @type Array<string> */ (repeat(v[0], parseInt(n, 10)));
  return str => {
    const sArr = reverse(str.split(''));
    return reverse(a.map((e, i) => sArr[i] || e)).join('')
  }
};

/**
 * Given an array of characters, test that a string only contains elements from
 * that array.
 * @param {!Array<string>} a
 * @param {boolean} retBool When set to true, return true/false instead of the
 *    default which is to return the original string if it passes.
 * @returns {function(string): (boolean|string)}
 */
const onlyIncludes = (a, retBool = false) => s => {
  const allGood = Array.from(/** @type string */(s)).every(e => a.includes(e));
  return allGood ? (retBool ? true : s) : false;
};

/**
 * Given a default value, return a function that takes a string and returns it if it is not empty.
 * Else it returns the given value.
 * @param {*} def
 * @return {function(string): string|*}
 */
const stringIfNotEmptyElse = def => s => s === '' ? def : s;

/**
 * Return true only if what has been passed in is a string with nothing but Digit chars
 * @param {*} val
 * @return {function(*): *}
 */
const stringIsOnlyDigits = val => compose(
  onlyIncludes(numericString, true),
  stringIfNotEmptyElse("_"),
  isStringElse("_"))(val);


/**
 * Return true only if what has been passed in is a string with nothing but Alphanumeric chars
 * @param {*} val
 * @return {function(*): boolean}
 */
const stringIsAlphaNumeric = val => compose(
  onlyIncludes(alphaNum, true),
  stringIfNotEmptyElse("_"),
  isStringElse("_"))(val);

/**
 * Strip all non-number chars from a string
 * @param {string} s
 * @return {number|string|*}
 */
const stringStripNonFloatDigits = s => [...s].filter((e) => floatString.includes(e)).join('');


/**
 * Strip the leading char if it is the same as c
 * @param {string} c
 * @return {function(string): string}
 */
const stripLeadingChar = c => s => s.startsWith(c) ? s.slice(c.length) : s;


/**
 * Strip the trailing char if it is the same as c
 * @param {string} c
 * @return {function(string): string}
 */
const stripTrailingChar = c => {
  const f = compose(
    stringReverse,
    stripLeadingChar(stringReverse(c)),
    stringReverse);
  return s => f(s);
};


/**
 * @param {string} s
 * @return {function(string): Array<string>}
 */
const split = s => x => x.split(s);


/**
 * @param {!RegExp|string} p
 * @param {string} r
 * @return {function(string): string}
 */
const replace = (p, r) => x => x.replace(p, r);


/**
 * @param {!RegExp|string} p
 * @param {string} r
 * @return {function(string): string}
 */
const replaceAll = (p, r) => x => x.replace(new RegExp(`${p}`, 'g'), r);


/**
 * Join the elements of an array
 * @param {string} s
 * @return {function(Array): (string)}
 */
const join = s => x => x.join(s);


/**
 * Join the given arguments
 * @param {string} s
 * @return {function(*): (*|string)}
 */
const join2 = s => (...x) => [...x].join(s);


/**
 * @param {string} x
 * @param {string} y
 * @return {string}
 */
const append = (x, y) => y + x;


/**
 * @param {string} x
 * @return {function(string): string}
 */
const alwaysAppend = x => y => y + x;


/**
 * @param {string} x
 * @return {function(string):string}
 */
const prepend = x => y => x + y;


/**
 * Interleave a string (s) with the given joiner (j) - starting with the joiner
 * @param {string} j The joiner to interleave the string with.
 * @return {function(string): string}
 */
const interleave = j => s => s.split('').map(v => `${j}${v}`).join('');


/**
 * Interleave a string (s) with the given joiner (j) - starting with the string
 * @param {string} j The joiner to interleave the string with.
 * @return {function(string): string}
 */
const interleave2 = j => s => s.split('').join(j);


/**
 * Count occurrences of a substring
 * @param subStr
 * @returns {function(string):number}
 */
const countSubString = subStr => str => str.split(subStr).length - 1;


/**
 * Reverse a string
 * @type {function(string): string}
 */
const stringReverse = compose(join(''), reverse);


/**
 * Longest Common Prefix
 * Given an arbitrary number of string as arguments, return the longest common
 * prefix.
 * @param {...string} args
 * @returns {!string}
 */
const lcp = (...args) => {

  /**
   * Prepare a function to return an array of elements at the given index.
   * @type {function(!number): !Array<*>}
   */
  const elementsAt = columnAt(args);

  /**
   * Takes an integer and a string, and iteratively build the longest common
   * prefix
   * @param {!number} n The index number under consideration.
   * @param {!string} s The resulting string.
   * @returns {*}
   */
  const f = (n, s) => {
    const arr = elementsAt(n);
    const el = arr[0];
    return el && arr.every(sameAs(el)) ? f(n + 1, s + el) : s;
  };
  return f(0, '');
};


//------------------------------------------------------------[ Object tools ]--
/**
 * @param {!Object} l
 * @param {!Object} r
 * @returns {!Object}
 */
const mergeDeep = (l, r) => {
  const output = Object.assign({}, l);
  if (isObject(l) && isObject(r)) {
    Object.keys(r).forEach(key => {
      if (isObject(r[key])) {
        if (!(key in l))
          Object.assign(output, {[key]: r[key]});
        else
          output[key] = mergeDeep(l[key], r[key]);
      } else {
        if (Array.isArray(l[key]) && Array.isArray(r[key])) {
          output[key] = [...l[key], ...r[key]];
        } else {
          Object.assign(output, {[key]: r[key]});
        }
      }
    });
  }
  return output;
};

/**
 * Given a fallback value and an array, return a function that takes an
 * object or an array and returns the value at the path, or the fallback
 * value.
 * @param {*} f A fallback value
 * @param {Array<string|number>} arr
 * @returns {function((Object|Array)):(*)}
 */
const pathOr = (f, arr) => e => {
  const r = arr.reduce((p, c) => {
    try {
      return p[maybeNumber(c)];
    } catch (err) {
      return undefined
    }
  }, e);
  return r === undefined ? f : r;
};


/**
 * Take an object, and return a clone of that object
 * @param {Object} o
 */
const cloneObj = o => Object.assign({}, o);


/**
 * * Given an object, flatten it into an array of arrays of path and value.
 * Example:
 *  obj = {
 *    a: 1,
 *    b: 2,
 *    c: {
 *      d: 4,
 *      e: 5,
 *      f: {
 *        g: 7,
 *        h: 8
 *      }
 *    }
 *  }
 *  objToPaths(obj) ==>
 *  [
 *    [ [ 'a' ], 1 ],
 *    [ [ 'b' ], 2 ],
 *    [ [ 'c', 'd' ], 4 ],
 *    [ [ 'c', 'e' ], 5 ],
 *    [ [ 'c', 'f', 'g' ], 7 ],
 *    [ [ 'c', 'f', 'h' ], 8 ]
 *  ]
 * @param obj
 * @param path
 * @param accl
 * @return {*[]}
 */
const objToPaths = (obj, path = [], accl = []) => {
  Object.entries(obj).forEach(([key, value]) => {
    isObject(value) ? objToPaths(value, [...path, key], accl)
      : accl.push([[...path, key], value]);
  });
  return accl;
};


/**
 * Visit each node of a object, and execute the given function on that
 * node. Returns a copy of the object with each leaf-node mutated by the
 * given function.
 * Example:
 *    const mutate = x => [x, 'Mutated']
 *    const obj = {
 *    a: 1,
 *    b: 2,
 *    c: {
 *      d: 4,
 *      e: 5,
 *      f: {
 *        g: 7,
 *        h: 8
 *      }
 *    }
 *  }
 *  visitObjDeep(obj, mutate) ==> {
 *    a: [ 1, 'Mutated' ],
 *    b: [ 2, 'Mutated' ],
 *    c: {
 *      d: [ 2, 'Mutated' ],
 *      e: [ 4, 'Mutated' ],
 *      f: {
 *        g: [ 7, 'Mutated' ],
 *        h: [ 8, 'Mutated' ]
 *      }
 *    }
 *  }
 *
 * @param obj
 * @param func
 * @return {{}}
 */
const visitObjDeep = (obj, func) =>
  Object.entries(obj).reduce((p, [key, value]) => {
    p[key] = isObject(value) ? visitObjDeep(value, func) : func(value);
    return p;
  }, {});


//--------------------------------------------------------------[ Time Utils ]--
/**
 * This returns now in seconds.
 * The value returned by the Date.now() method is the number of milliseconds
 * since 1 January 1970 00:00:00 UTC. Always UTC.
 * @return {number} The current Epoch timestamp in seconds. Rounding down.
 */
const getNowSeconds = () => Math.floor(Date.now() / 1000);


/**
 * Get a date from the given integer
 * @param {number} ts A timestamp. This can be either positive or negative
 *   Timestamp values of zero or smaller is considered relative seconds ago.
 *   Positive timestamps with 12 digits or less are considered timestamps given
 *   in seconds.
 *   Timestamps with more than 12 digits are considered timestamps given in
 *   milliseconds.
 * @returns {Date|undefined}
 */
const assumeDateFromTs = ts => {
  let date;
  if (isSignedInt(ts)) {
    date = new Date();
    if (ts <= 0) {
      // Zero or below is relative seconds.
      date.setSeconds(date.getSeconds() + ts);
    } else if (ts > 999999999999) {
      // This timestamp is probably in milliseconds
      date.setTime(ts);
    } else if (ts > 0) {
      // This timestamp is probably in seconds
      const milli = ts * 1000;
      date.setTime(milli);
    }
  }
  return date;
};


//----------------------------------------------------------[ IDs and Random ]--
/**
 * A generator function to produce consecutive ids, starting from
 * n + 1 of n. If n is not given, use 0.
 * @param {number=} opt_n
 * @return {!Iterator<number>}
 */
function* idGen(opt_n) {
  let i = opt_n ? opt_n + 1 : 0;
  while (true) yield i++;
}


/**
 * Private function that will return an incremented counter value each time it
 * is called.
 * @param {?number=} opt_start
 * @return {function(): number}
 */
const privateCounter = (opt_start) => {
  let c = opt_start ? opt_start : 0;
  return () => c++;
};


/**
 * Private function that will always return the same random string each time
 * it is called.
 * @return {Function}
 */
const privateRandom = () => {
  const c = randomId();
  return () => c;
};


/**
 * Returns a pseudo random string. Good for ids.
 * @param {?number=} opt_length An optional length for the string. Note this
 *    clearly reduces the randomness, and increases the chances of a collision.
 * @return {string}
 */
const randomId = opt_length => {
  const s = makeRandomString();
  return opt_length ? s.substr(0, opt_length) : s;
};


/**
 * Get a function that produces an integer in the range
 * between start (inclusive) and end (exclusive)
 * @param {number} min
 * @param {number} max
 * @returns {function(): number}
 */
const randIntBetween = (min = 0, max = 10) => {
  const diff = max - min;
  return () => (Math.random() * diff) + min | 0;
};


/**
 * A non-repeating sub-string of the given length from the given seed string.
 * @param {string} seed The seed string.
 * @returns {function(number): string}
 */
const randSubSet = seed => l => Array(l).fill(0).reduce(p => {
  const [a, b] = removeRandom(p[1]);
  return [push(p[0], a), b]
}, [[], seed.split('')])[0].join('');


/**
 * Randomly get either a 1 or a -1. Good for randomly changing the sign of a
 * number
 * @returns {number}
 */
const randSign = () => [-1, 1][(Math.random() * 2) | 0];


//--------------------------------------------------------[ Math and Numbers ]--
const expoRegex = new RegExp(/^([+-]?[0-9]+\.?[0-9]+)[eE]([+-]?[0-9]+)$/i);
const hexRegex = new RegExp(/^([-+]?)0[xX]([0-9A-F]+)$/i);
const binaryRegex = new RegExp(/^([-+]?)0[bB]([0-1]+)$/i);
const numberRegex = new RegExp(/^[-+]?[0-9]*\\.?[0-9]+$/i);


/**
 * Given an exponent string in the form '1.2e5+5' parse this to a number
 * Returns NaN if it can't do it.
 * @param {string} s
 * @return {number}
 */
const parseExpoStringToNum = s => {
  if (expoRegex.test(s)) {
    const [_, v, ex] = s.match(expoRegex);
    return (+v) * Math.pow(10, +ex)
  }
  return NaN
};

const parseHexStringToNum = s => {
  if (hexRegex.test(s)) {
    const [_, sign, st] = s.match(hexRegex);
    return Number.parseInt(st, 16) * (sign === "-" ? -1 : 1)
  }
  return NaN
};

const parseBinaryStringToNum = s => {
  if (binaryRegex.test(s)) {
    const [_, sign, st] = s.match(binaryRegex);
    return Number.parseInt(st, 2) * (sign === "-" ? -1 : 1)
  }
  return NaN
};

/**
 * Given a value, check if it will parse as a Number (either float or int)
 * @param {*} val
 * @return {boolean}
 */
const willParseAsNum = val => {
  if (isString(val)) {
    if (numberRegex.test(val) || hexRegex.test(val) || binaryRegex.test(val) || expoRegex.test(val)) {
      return true;
    }
  }
  // DID YOU KNOW?
  // Number.parseFloat([123]]) === 123
  if (isArray(val)) { return false }
  if (Number.isNaN(+val)) { return false }
  return Number.isFinite(Number.parseFloat(val))
};

/**
 * The given thing will be parsed as a number (float) or return the given default.
 * @param def
 * @return {function(*): number|*}
 */
const parseAsNumElse = (def = NaN) => val => {
  if (!willParseAsNum(val)) { return def }
  return parseBinaryStringToNum(val)
    || parseHexStringToNum(val)
    || parseExpoStringToNum(val)
    || Number.parseFloat(val);
};


/**
 * Given a value check if it will parse as an Int intact.
 * @param {*} val
 * @return {boolean}
 */
const willParseAsInt = val => {
  return willParseAsNum(val) && Number.isInteger(parseAsNumElse(NaN)(val));
};

const parseAsIntElse = (def = NaN) => val => {
  if (!willParseAsInt(val)) { return def }
  return parseAsNumElse(NaN)(val);
};

/**
 * Given a value check if it will parse as a floating point number with decimal places intact.
 * @param {*} val
 * @return {boolean}
 */
const willParseAsFloatWithDecimals = val => {
  return willParseAsNum(val) && Number.parseFloat(val) % 1 !== 0
};

/**
 * Given decimal degrees, return radians
 * @param {!number} x
 * @returns {number}
 */
const degreesToRadians = x => x / 180 * Math.PI;


/**
 * Determine the sign of the zero
 * @param {!number} x
 * @returns {boolean}
 */
const isNegativeZero = x => x === 0 && (1 / x < 0);


/**
 * Bitwise conversion of a number to its integer component.
 * Unlike Math.floor(n) this does not convert -1.123 to -2 but to the integer
 * part: -1.
 * It just chops any floating bits from the number.
 * @param n
 * @returns {number}
 */
const toInt = n => n | 0;


/**
 * Only numbers that can reliably be passed to JSON as a number, and that
 * are not floats will return true. The rest false.
 * @param {*} a The value to check
 * @return {boolean}
 */
const isSignedInt = a => {
  const aS = isDefAndNotNull(a) ? a.toString() : '.';
  const onlyNums = onlyIncludes('+-0123456789'.split(''), true);
  return whatType(a) === 'number' && onlyNums(aS);
};


/**
 * @param {number} precision
 * @returns {function(number): number}
 */
const pRound = precision => {
  const factor = Math.pow(10, precision);
  return number => Math.round(number * factor) / factor;
};

/**
 * Given a string, returns a number if you can. Else return what was given.
 * @param {*} s
 * @returns {number|*}
 */
const maybeNumber = s => {
  if (s === null) {
    return s;
  }
  if (whatType(s) === 'string' &&
    s.length > 1 &&
    s.startsWith('0') &&
    !s.startsWith('0.')) {
    return s;
  }
  const p = 1 * s;
  if (p > Number.MAX_SAFE_INTEGER) {
    return s
  }
  return Number.isNaN(p) ? s : p;
};

/**
 * Reverse a number
 * @type {function(number): number}
 */
const numReverse = compose(toNumber, join(''), reverse, toString);

/**
 * Create a function that is seeded by a value to be divided
 * Calling this function with a number returns a pair of numbers consisting
 * of their quotient and remainder when using integer division.
 * The seed number is divided by the subsequent number
 * @param {number} y
 * @returns {function(number): !Array<number>}
 */
const divMod = y => x => [Math.floor(y / x), y % x];


/**
 * Create a function that is seeded by a value to use as a divider
 * Calling this function with a number returns a pair of numbers consisting
 * of their quotient and remainder when using integer division.
 * The subsequent number is divided by the seed number.
 * @param {number} x
 * @returns {function(number): !Array<number>}
 */
const divMod2 = x => y => [Math.floor(y / x), y % x];


/**
 * Factorize a function of the form Ax^2 + Bx + C = 0 finding the value of x
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {number} The value of x
 */
const factorize = (a, b, c) => (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * (-c))) / (2 * a);


/**
 * calculates the luhn check digit for a given number and returns an array with
 * a boolean (is valid luhn) and the actual check number
 * Example:
 *    luhn(35956805108414) -> [true, 6]
 * @param {number|string} n The number to calc and check
 * @return {Array.<boolean|number>} Valid and Luhn number
 */
const luhn = n => {
  let result = n.toString()
    .split('')
    .reverse()
    .reduce((p, e, i) => {
      let n = Number(e);
      // noinspection JSUnusedAssignment
      return p += (!(i % 2))
        ? n
        : (n * 2)
          .toString()
          .split('')
          .reduce((a, b) => Number(a) + Number(b), 0);
    }, 0);
  return [!(result % 10), result / 10];
};


/**
 * The IMEI (International Mobile Station Equipment Identity) is a 15-digit
 * number to uniquely identify a mobile phone device.
 * IMEISV (IMEI Software Version) is a 16-digit number with the IMEI and an
 * additional software version number.
 *
 * As of 2004, the formats of the IMEI and IMEISV are
 *    AA-BBBBBB-CCCCCC-D and
 *    AA-BBBBBB-CCCCCC-EE respectively.
 * The definition of the formats can be found below.
 *
 * AA     BB-BB-BB   CC-CC-CC     D     EE
 * TAC   TAC       SN           CD     SVN
 * TAC : Type Allocation Code
 * SN : Serial Number
 * CD : Check Digit based on Luhn algorithm
 * SVN : Software Version Number
 *
 * Example:
 *    console.log(imeisvToImei('3595680510841401'));
 *    console.log(imeisvToImei('86488102222183'));
 * @param {number|string} n The IMEIsv number as received from RADIUS.
 * @return {string}
 */
const imeisvToImei = n => {
  let t = toString(n).substr(0, 14);
  let r = luhn(t);
  return r[0] ? t + r[1] : toString(n);
};


// noinspection JSUnusedAssignment
/**
 * Measure the entropy of a string in bits per symbol.
 * Calculate the Shannon entropy H of a given input string.
 * http://rosettacode.org/wiki/Entropy
 * Example:
 *    Log the Shannon entropy of a string.
 *    const log = s => {
 *        console.log(`Entropy of ${s} in bits per symbol: ${shannon(s)}`);
 *    };
 *  ['1223334444', '0', '01', '0123', '01234567', '0123456789abcdef'].forEach(log);
 * @param {string} s
 * @returns {number}
 */
const shannon = s =>
  [...s.split('').reduce((p, c) => p.set(c, p.has(c) ? p.get(c) + 1 : 1),
    new Map()
  ).values()]
    .map(v => v / s.length)
    .reduce((p, c) => p -= c * Math.log(c) / Math.log(2), 0);


/**
 * Number names
 * http://rosettacode.org/wiki/Number_names
 * @param {number} value
 * @returns {string}
 */
const englishNumber = value => {
  let name, quotient, remainder;
  const dm = divMod(value);
  const units = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
    'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
    'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty',
    'seventy', 'eighty', 'ninety'];
  const big = [...['', 'thousand'], ...['m', 'b', 'tr', 'quadr', 'quint',
    'sext', 'sept', 'oct', 'non', 'dec'].map(e => `${e}illion`)];

  if (value < 0) {
    name = `negative ${englishNumber(-value)}`;
  } else if (value < 20) {
    name = units[value];
  } else if (value < 100) {
    [quotient, remainder] = dm(10);
    name = `${tens[quotient]} ${units[remainder]}`.replace(' zero', '');
  } else if (value < 1000) {
    [quotient, remainder] = dm(100);
    name = `${englishNumber(quotient)} hundred and ${englishNumber(remainder)}`.replace(' and zero', '');
  } else {
    const chunks = [];
    const text = [];
    while (value !== 0) {
      [value, remainder] = divMod(value)(1000);
      chunks.push(remainder);
    }
    chunks.forEach((e, i) => {
      if (e > 0) {
        text.push(`${englishNumber(e)}${i === 0 ? '' : ' ' + big[i]}`);
        if (i === 0 && e < 100) {
          text.push('and');
        }
      }
    });
    name = text.reverse().join(', ').replace(', and,', ' and');
  }
  return name;
};


/**
 * Given 2 coordinates, (x1, y1) and (x2, y2) what is the y value
 * of a 3rd coordinate on the same line described by the two initial coordinates
 * and a given x-value.
 * @param {!Array<number>} $0
 * @param {!Array<number>} $1
 * @return {function(number): (!Array<number>|undefined)}
 */
const extrapolate = ([x1, y1], [x2, y2]) => x3 => {
  if (y1 === y2) {
    return [x3, y1]
  }
  if (x1 === x2) {
    return undefined
  }
  return [x3, x3 * Math.tan(Math.atan((y2 - y1) / (x2 - x1)))];
};


/**
 * Given bytes (octets) format it into a human readable string.
 * @param {number} precision
 * @returns {function(number): !string}
 */
const formatBytes = precision => bytes => {
  if (bytes === 0) {
    return '0';
  }
  const k = 1024; // or 1024 for binary
  const dm = precision ? precision : 2;
  const sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number((bytes / Math.pow(k, i)).toPrecision(dm)) + ' ' + sizes[i];
};


const didRiseThroughBoundary = b => (p, c) => p < b && b < c;

const didFallThroughBoundary = b => (p, c) => p > b && b > c;

const didEnterBand = (u, l) => {
  const enterFromBottom = didRiseThroughBoundary(l);
  const enterFromTop = didFallThroughBoundary(u);
  return (p, c) => {
    const isInside = c >= l && c <= u;
    return isInside && (enterFromTop(p, c) || enterFromBottom(p, c))
  }
};

const didExitBand = (u, l) => {
  const exitThroughUpper = didRiseThroughBoundary(u);
  const exitThroughLower = didFallThroughBoundary(l);
  return (p, c) => {
    const wasInside = p >= l && p <= u;
    return wasInside && (exitThroughUpper(p, c) || exitThroughLower(p, c))
  }
};


/**
 * The haversine formula is an equation important in navigation, giving
 * great-circle distances between two points on a sphere from their longitudes
 * and latitudes. It is a special case of a more general formula in spherical
 * trigonometry, the law of haversines, relating the sides and angles
 * of spherical "triangles".
 *
 * haversine :: (Num, Num) -> (Num, Num) -> Num
 *
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns {number} km distance between points.
 */
const haversine = ([lat1, lon1], [lat2, lon2]) => {

  const [rlat1, rlat2, rlon1, rlon2] =
    [lat1, lat2, lon1, lon2].map(degreesToRadians);

  const dLat = rlat2 - rlat1;
  const dLon = rlon2 - rlon1;
  const radius = 6372.8; // Earth's radius in km

  return Math.round(
    radius * 2 * Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(dLat / 2), 2) +
        Math.pow(Math.sin(dLon / 2), 2) *
        Math.cos(rlat1) * Math.cos(rlat2))
    ) * 100
  ) / 100;
};

const geoIsInside = ([latC, lonC], radius) => ([latP, lonP]) => {
  const h = haversine([latC, lonC], [latP, lonP]);
  return radius >= h
};

const geoFenceDidEnter = (centerPoint, radius) => (p, c) => {
  const isInside = geoIsInside(centerPoint, radius);
  return isInside(c) && !isInside(p);
};

const geoFenceDidExit = (centerPoint, radius) => (p, c) => {
  const isInside = geoIsInside(centerPoint, radius);
  return isInside(p) && !isInside(c);
};


// ---------------------------------------------------------[ Hex Conversion ]--
/**
 * Converts a hex string into an integer array.
 * @param {string} hexString Hex string of 16-bit integers (two characters
 *     per integer).
 * @return {!Array<number>} Array of {0,255} integers for the given string.
 */
const hexToByteArray = hexString => {
  if (hexString.length % 2 === 0) {
    return [...hexString].reduce(
      (p, c, i) => i % 2 === 0
        ? [...p, parseInt(hexString.substring(i, i + 2), 16)]
        : p, []);
  } else {
    throw new Error('Key string length must be multiple of 2');
  }
};


/**
 * Turns an array of numbers into the hex string given by the concatenation of
 * the hex values to which the numbers correspond.
 * @param {Uint8Array|Array<number>} arr Array of numbers representing
 *     characters.
 * @param {string=} opt_separator Optional separator between values
 * @return {string} Hex string.
 */
const byteArrayToHex = (arr, opt_separator) => arr.map(
  numByte => {
    const hexByte = numByte.toString(16).toUpperCase();
    return hexByte.length > 1 ? hexByte : `0${hexByte}`;
  }).join(opt_separator || '');


// -------------------------------------------------------[ UTF-8 Conversion ]--
/**
 * Converts a JS string to a UTF-8 "byte" array.
 * @param {string} str 16-bit unicode string.
 * @return {!Array<number>} UTF-8 byte array.
 */
const stringToUtf8ByteArray = (str) => {
  const out = [];
  let p = 0;
  [...str].forEach((e, i) => {
    let c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = (c >> 6) | 192;
      out[p++] = (c & 63) | 128;
    } else if (
      ((c & 0xFC00) === 0xD800) && (i + 1) < str.length &&
      ((str.charCodeAt(i + 1) & 0xFC00) === 0xDC00)) {
      // Surrogate Pair
      c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
      out[p++] = (c >> 18) | 240;
      out[p++] = ((c >> 12) & 63) | 128;
      out[p++] = ((c >> 6) & 63) | 128;
      out[p++] = (c & 63) | 128;
    } else {
      out[p++] = (c >> 12) | 224;
      out[p++] = ((c >> 6) & 63) | 128;
      out[p++] = (c & 63) | 128;
    }
  });
  return out;
};


/**
 * Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
 * @param {Uint8Array|Array<number>} bytes UTF-8 byte array.
 * @return {string} 16-bit Unicode string.
 */
const utf8ByteArrayToString = bytes => {
  const out = [];
  let pos = 0;
  let c = 0;
  while (pos < bytes.length) {
    const c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      const c2 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else if (c1 > 239 && c1 < 365) {
      // Surrogate Pair
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      const c4 = bytes[pos++];
      const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) -
        0x10000;
      out[c++] = String.fromCharCode(0xD800 + (u >> 10));
      out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
    } else {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      out[c++] =
        String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }
  return out.join('');
};


// ------------------------------------------------------------[ Bit Banging ]--
/**
 * Convert a decimal number to a binary string.
 * @param {number} n
 * @return {string} A string representing a binary ie. "1011".
 */
const numToBinString = n => n.toString(2);


/**
 * Convert a binary string to a decimal number.
 * @param {string} s A string representing a binary ie. "1011".
 * @return {number}
 */
const binStringToNum = s => parseInt(s, 2);


/**
 * Get the bit at the position n of the number b.
 * Bit count starts at 0.
 *
 * Example:
 * var b = 8;  // 1000
 * alert(getBit(b,2));  // 0
 * alert(getBit(b,6));  // 0
 * alert(getBit(b,3));  // 1
 *
 * To print the result: result.toString(2)
 *
 * @param {number} b
 * @param {number} n
 * @return {number}
 */
const getBitAt = (b, n) => (b >> n) & 1;

/**
 * Set the bit at the position n of the number b. The bit is set to 1.
 * Bit count starts at 0.
 *
 * Example:
 * var b = 10;  // 1010
 * c = setBit(b,2));  // 14 // 1110
 * d = setBit(b,0));  // 11 // 1011
 *
 * @param {number} b
 * @param {number} n
 * @return {number}
 */
const setBitAt = (b, n) => b | (1 << n);


/**
 * Remove the bit at the position n of the number b. The bit is set to 0.
 * Bit count starts at 0.
 * @param {number} b
 * @param {number} n
 * @return {number}
 */
const clearBitAt = (b, n) => b & ~(1 << n);


/**
 * Invert the bit at the position n of the number b.
 * Bit count starts at 0.
 * @param {number} b
 * @param {number} n
 * @return {number}
 */
const invBitAt = (b, n) => b ^ (1 << n);


/**
 * Return true if the bit at the given position is 1.
 * Bit count starts at 0.
 * @param {number} b
 * @param {number} n
 * @return {boolean}
 */
const hasBitAt = (b, n) => getBitAt(b, n) === 1;


/**
 * Change the lower bits of a 32bit unsigned int to zeros,
 * keeping only the k number of high bits unchanged.
 * @param {number} n
 * @param {number} k
 * @returns {number} This returns an unsigned int by force.
 */
const zeroOut32 = (n, k) => k > 0 ? (((n >>> 0) >> 32 - k) << 32 - k) >>> 0 : 0;

// -----------------------------------------------------------[ IP Addresses ]--
/**
 * Given a IPv4 Address, convert it to its integer value
 * @param {string} ip
 * @returns {number}
 */
const ipv4ToInt2 = ip => new DataView(
  new Uint8Array(ip.split('.').map(e => parseInt(e || 0, 10))).buffer).getUint32(0);

/**
 * Given an int, convert it to a IPv4 address.
 * @param {number} int
 * @param {DataView} dv
 * @returns {string}
 */
const intToIpv4 = (int, dv = new DataView(new ArrayBuffer(16))) => {
  dv.setUint32(0, int);
  return [0, 1, 2, 3].map(e => dv.getUint8(e)).join('.')
};

/**
 * Canonical IP pool definitions.
 * Example:
 * 87.70.141.1/22 -> 87.70.140.0/22
 * 36.18.154.103/12 -> 36.16.0.0/12
 * 67.137.119.181/4 -> 64.0.0.0/4
 * 10.207.219.251/32 -> 10.207.219.251/32
 * 10.207.219.251 -> 10.207.219.251/32
 * 110.200.21/4 -> 96.0.0.0/4
 * 10..55/8 -> 10.0.0.0/8
 * 10.../8 -> 10.0.0.0/8
 *
 * @param {string} s
 * @returns {string}
 */
const canonicalIpv4Pool = s => {

  const dv = new DataView(new ArrayBuffer(16));
  const [ip, cidr] = s.split('/');
  const cidrInt = parseInt(cidr || 32, 10);
  ip.split('.').forEach(
    (e, i) => dv.setUint8(i, parseInt(e || 0, 10))
  );
  dv.setUint32(0, (dv.getUint32(0) >> 32 - cidrInt) << 32 - cidrInt);
  const canonIp = [0, 1, 2, 3].map(e => dv.getUint8(e)).join('.');
  return [canonIp, cidrInt].join('/');
};

exports.allElementsEqual = allElementsEqual;
exports.alphaLower = alphaLower;
exports.alphaNum = alphaNum;
exports.alphaUpper = alphaUpper;
exports.alwaysAppend = alwaysAppend;
exports.alwaysFalse = alwaysFalse;
exports.alwaysNull = alwaysNull;
exports.alwaysTrue = alwaysTrue;
exports.alwaysUndef = alwaysUndef;
exports.anyToLowerCase = anyToLowerCase;
exports.append = append;
exports.arrToMap = arrToMap;
exports.assumeDateFromTs = assumeDateFromTs;
exports.binStringToNum = binStringToNum;
exports.boolMap = boolMap;
exports.both = both;
exports.byteArrayToHex = byteArrayToHex;
exports.canonicalIpv4Pool = canonicalIpv4Pool;
exports.chunk = chunk;
exports.clearBitAt = clearBitAt;
exports.clock = clock;
exports.cloneObj = cloneObj;
exports.columnAt = columnAt;
exports.columnReduce = columnReduce;
exports.compose = compose;
exports.countByFunc = countByFunc;
exports.countOck = countOck;
exports.countSubString = countSubString;
exports.didEnterBand = didEnterBand;
exports.didExitBand = didExitBand;
exports.didFallThroughBoundary = didFallThroughBoundary;
exports.didRiseThroughBoundary = didRiseThroughBoundary;
exports.difference = difference;
exports.divMod = divMod;
exports.divMod2 = divMod2;
exports.elAt = elAt;
exports.englishNumber = englishNumber;
exports.extrapolate = extrapolate;
exports.factorize = factorize;
exports.filter = filter;
exports.filterAtInc = filterAtInc;
exports.filterOnlyIndexes = filterOnlyIndexes;
exports.findShared = findShared;
exports.flatten = flatten;
exports.floatString = floatString;
exports.formatBytes = formatBytes;
exports.geoFenceDidEnter = geoFenceDidEnter;
exports.geoFenceDidExit = geoFenceDidExit;
exports.geoIsInside = geoIsInside;
exports.getBitAt = getBitAt;
exports.getNowSeconds = getNowSeconds;
exports.hasBitAt = hasBitAt;
exports.hasValue = hasValue;
exports.haversine = haversine;
exports.head = head;
exports.hexToByteArray = hexToByteArray;
exports.iRange = iRange;
exports.idGen = idGen;
exports.identity = identity;
exports.imeisvToImei = imeisvToImei;
exports.intToIpv4 = intToIpv4;
exports.interleave = interleave;
exports.interleave2 = interleave2;
exports.intersection = intersection;
exports.invBitAt = invBitAt;
exports.ipv4ToInt2 = ipv4ToInt2;
exports.isArray = isArray;
exports.isDef = isDef;
exports.isDefAndNotNull = isDefAndNotNull;
exports.isDivisibleBy = isDivisibleBy;
exports.isEmpty = isEmpty;
exports.isEven = isEven;
exports.isFunction = isFunction;
exports.isNegativeZero = isNegativeZero;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isSignedInt = isSignedInt;
exports.isString = isString;
exports.isStringElse = isStringElse;
exports.isUndefined = isUndefined;
exports.join = join;
exports.join2 = join2;
exports.lcp = lcp;
exports.leftPadWithTo = leftPadWithTo;
exports.logInline = logInline;
exports.luhn = luhn;
exports.makeRandomString = makeRandomString;
exports.map = map;
exports.maxInArr = maxInArr;
exports.maybeBool = maybeBool;
exports.maybeFunc = maybeFunc;
exports.maybeNumber = maybeNumber;
exports.mergeDeep = mergeDeep;
exports.minInArr = minInArr;
exports.negate = negate;
exports.numReverse = numReverse;
exports.numToBinString = numToBinString;
exports.numericInt = numericInt;
exports.numericString = numericString;
exports.objToPaths = objToPaths;
exports.onlyIncludes = onlyIncludes;
exports.pRound = pRound;
exports.pairs = pairs;
exports.pairsToMap = pairsToMap;
exports.parseAsIntElse = parseAsIntElse;
exports.parseAsNumElse = parseAsNumElse;
exports.parseBinaryStringToNum = parseBinaryStringToNum;
exports.parseExpoStringToNum = parseExpoStringToNum;
exports.parseHexStringToNum = parseHexStringToNum;
exports.partial = partial;
exports.pathOr = pathOr;
exports.prepend = prepend;
exports.privateCounter = privateCounter;
exports.privateRandom = privateRandom;
exports.push = push;
exports.quote = quote;
exports.randIntBetween = randIntBetween;
exports.randSign = randSign;
exports.randSubSet = randSubSet;
exports.randomId = randomId;
exports.range = range;
exports.range2 = range2;
exports.rangeGen = rangeGen;
exports.remove = remove;
exports.removeAtIndex = removeAtIndex;
exports.removeRandom = removeRandom;
exports.repeat = repeat;
exports.replace = replace;
exports.replaceAll = replaceAll;
exports.reverse = reverse;
exports.sameArr = sameArr;
exports.sameAs = sameAs;
exports.sameEls = sameEls;
exports.setBitAt = setBitAt;
exports.shannon = shannon;
exports.signedNumericString = signedNumericString;
exports.split = split;
exports.splitAt = splitAt;
exports.stringIfNotEmptyElse = stringIfNotEmptyElse;
exports.stringIsAlphaNumeric = stringIsAlphaNumeric;
exports.stringIsOnlyDigits = stringIsOnlyDigits;
exports.stringReverse = stringReverse;
exports.stringStripNonFloatDigits = stringStripNonFloatDigits;
exports.stringToUtf8ByteArray = stringToUtf8ByteArray;
exports.stripLeadingChar = stripLeadingChar;
exports.stripTrailingChar = stripTrailingChar;
exports.symmetricDiff = symmetricDiff;
exports.tail = tail;
exports.toInt = toInt;
exports.toLowerCase = toLowerCase;
exports.toNumber = toNumber;
exports.toString = toString;
exports.toUpperCase = toUpperCase;
exports.trace = trace;
exports.transpose = transpose;
exports.truncate = truncate;
exports.union = union;
exports.utf8ByteArrayToString = utf8ByteArrayToString;
exports.visitObjDeep = visitObjDeep;
exports.whatType = whatType;
exports.willParseAsFloatWithDecimals = willParseAsFloatWithDecimals;
exports.willParseAsInt = willParseAsInt;
exports.willParseAsNum = willParseAsNum;
exports.zeroOut32 = zeroOut32;
exports.zip = zip;
exports.zipFlat = zipFlat;

module.exports = Object.assign({}, module.exports, exports);
