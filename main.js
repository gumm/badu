/**
 * @typedef {(
 *    Uint8Array
 *    | *[]
 *    | Int32Array
 *    | Uint16Array
 *    | Uint32Array
 *    | Float64Array
 *    | Int8Array
 *    | Float32Array
 *    | Uint8ClampedArray
 *    | Int16Array
 *    )}
 */
let arrayLike;


/**
 * A variadic compose that accepts any number of pure functions and composes
 * them together.
 * @param fns
 * @returns {function(...[*]): *}
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
 * @param {Function} fn A function to partially apply.
 * @param {...*} var_args Additional arguments that are partially applied to fn.
 * @return {!Function} A partially-applied form of the function goog.partial()
 *     was invoked as a method of.
 */
const partial = function(fn, var_args) {
  let args = Array.prototype.slice.call(arguments, 1);
  return function() {
    let newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};


// noinspection JSUnusedLocalSymbols
/**
 * @param {*} args
 * @return {undefined}
 */
const alwaysUndef = (...args) => undefined;


// noinspection JSUnusedLocalSymbols
/**
 * @param {*} args
 * @returns {boolean}
 */
const alwaysFalse = (...args) => false;


// noinspection JSUnusedLocalSymbols
/**
 * @param {*} args
 * @returns {boolean}
 */
const alwaysTrue = (...args) => true;



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
 * @returns {function(*):*}
 */
const trace = tag => partial(logInline, tag);


//---------------------------------------------------------------[ Questions ]--
/**
 * @param {*} x
 * @return {!string}
 */
const whatType = x => typeof x;

const boolMap = new Map()
    .set('true', true)
    .set('false', false);


/**
 * Convert the given thing to a boolean if it can. Else return it as is.
 * @param {*} s
 * @returns {*|boolean}
 */
const maybeBool = s => isDef(boolMap.get(s)) ?  boolMap.get(s) : s;


//--------------------------------------------------------------[ Assertions ]--
/**
 * @param {?} t
 * @returns {boolean}
 */
const isDef = t => t !== undefined;


/**
 * @param {*} n
 * @return {boolean}
 */
const isNumber = n => whatType(n) === 'number' && !Number.isNaN(n);

/**
 * @param t
 * @returns {*|boolean}
 */
const isObject = t => (
    t
    && typeof t === 'object'
    && !(t instanceof Array)
    && !(t instanceof Set)
    && !(t instanceof Map)
    && !(t instanceof Date)
);


/**
 * A strict even test that does not coerce values, and results in false if the
 * given element is not a number.
 * Example:
 * [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, -0, 0, 1, '1', 2, '2', -1,
 *    'oddball', NaN, {}, [], true, false].forEach(e => console.log(isEven(e)));
 *
 * @param {*} t
 */
const isEven = t => isNumber(t) && !(t % 2);


/**
 * @param {*} n
 * @return {function(*): !boolean}
 */
const isDivisibleBy = n => x => isNumber(x) && x % n === 0;

/**
 * @param {function(*=): *} a
 * @param {function(*=): *} b
 * @returns {function(*=): *}
 */
const both = (a, b) => n => a(n) && b(n);


/**
 * @param {*} v
 * @returns {boolean}
 */
const hasValue = v => (!(v === undefined || Number.isNaN(v)));


//-------------------------------------------------------------[ Array Tools ]--
/**
 * A generator function that returns an iterator over the specified range of
 * numbers. By default the step size is 1, but this can optionally be passed
 * in as well. A negative step size is silently converted to a positive number.
 * The generator will always yield the first value, and from there step
 * towards the second value.
 * It does not matter which of the 2 values are larger, the generator will
 * always step from the first towards the second.
 * @param {!number} b Begin here - First element in array
 * @param {!number} e End here - Last element in array
 * @param {!number=} s Step this size
 */
function* rangeGen(b, e, s=1) {
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
 * @param {number} b
 * @param {number} e
 * @param {number=} s
 * @returns {Array<number>}
 */
const range = (b, e, s) => [...(rangeGen(b, e, s))];


/**
 * Get the first element of an array
 * @type {function((!Array.<*>|!string)): *}
 */
const head = x => x[0];


/**
 * Return the last element of an array, or undefined if the array is empty.
 * @param {!Array<*>} x
 * @returns {*}
 */
const tail = x => x[x.length - 1];


/**
 * Reverse either an array or a string
 * @type {function((!Array.<*>|!string)): !Array.<*>}
 */
const reverse = x => {
  let y = x.split ? x.split('') : x;
  return y.reduce((p, c) => [c].concat(p), [])
};


/**
 * Flatten multi-dimensional array to single dimension.
 * Example:
 * [[1], 2, [[3, 4], 5], [[[]]], [[[6]]], 7, 8, []] -> [1, 2, 3, 4, 5, 6, 7, 8]
 * @param {*} a
 * @return {!Array<*>}
 */
const flatten = a => a.reduce(
    (p,c) => c.reduce ? flatten([...p, ...c]) : [...p, c], []);


/**
 * Given an index number, return a function that takes an array and returns the
 * element at the given index
 * @param {!number} i
 * @return {function(!Array): *}
 */
const elAt = i => arr => arr[i];


/**
 * Transpose an array of arrays:
 * Example:
 * [['a', 'b', 'c'], ['A', 'B', 'C'], [1, 2, 3]] ->
 * [['a', 'A', 1], ['b', 'B', 2], ['c', 'C', 3]]
 * @param {!Array<*>} a
 * @return {!Array<*>}
 */
const transpose = a => a[0].map((e,i) => {
  const fun = elAt(i);
  return a.map(fun);
});


/**
 * a → n → [a]
 * Returns a fixed list of size n containing a specified identical value.
 * @param {*} v
 * @param {!number} n
 */
const repeat = (v, n) => new Array(n).fill(v);


/**
 * Counts the occurrence of an element in an array.
 * example:
 *    let countZeros = countOck(0);
 *    let countNaNs = countOck(NaN);
 *    console.log(`Number of zeros: ${countZeros([0,1,0,1,0,0,0,1])}`);
 *    console.log(`Number of NaNs: ${countNaNs([NaN,1,NaN,1,NaN,0,NaN,1])}`);
 * @param {*} t
 */
const countOck = t => arr =>
    arr.filter(e => Number.isNaN(t) ? Number.isNaN(e) : e === t).length;


/**
 * Counts the occurence of something that satisfies the predicate
 * Example:
 *    let countArr = countByFunc(e => Array.isArray(e));
 *    console.log(`Number of Arrays: ${countArr([[],[], NaN, {}, 1, {length:1}])}`);
 * @param f
 * @returns {function(*): number}
 */
const countByFunc = f => arr => arr.filter(f).length;


/**
 * Remove every n-th element from the given array
 * @param {!number} n
 * @return {function(!Array<*>): Array<*>}
 */
const filterAtInc = n => arr => arr.filter((e, i) => (i + 1) % n);

/**
 * A strict same elements in same order comparison.
 * Example:
 *    console.log('Same Arrays:', sameArr([1, 2], [1, 2]));
 *    console.log('Same Arrays:', sameArr([2, 1], [1, 2]));
 * @param {!Array.<*>} a
 * @param {!Array.<*>} b
 * @returns {boolean}
 */
const sameArr = (a, b) => a.length === b.length && a.every((c, i) => b[i] === c);


/**
 * A loose same elements comparison.
 * Example:
 *    console.log('Same Elements:', sameEls([1, 2], [1, 2]));
 *    console.log('Same Elements:', sameEls([2, 1], [1, 2]));
 *    console.log('Same Elements:', sameEls([2, 2], [1, 2]));
 * @param {!Array.<*>} a
 * @param {!Array.<*>} b
 * @returns {boolean}
 */
const sameEls = (a, b) => a.length === b.length &&
    a.every(c => b.includes(c)) && b.every(c => a.includes(c));


/**
 * @param func
 * @returns {function(*): (arrayLike)}
 */
const map = func => x => x.map(func);


/**
 * @param func
 * @returns {function(*): (arrayLike)}
 */
const filter = func => n => n.filter(func);


/**
 * Convert the given array into an array of smaller arrays each with the length
 * given by n.
 * @param {number} n
 * @returns {function(Array<*>): Array<Array<*>>}
 */
const chunks = n => a => a.reduce(
    (p, c, i) => (!(i % n)) ? p.push([c]) && p : p[p.length - 1].push(c) && p,
    []);


/**
 * Find the biggest number in a list of numbers
 * @param {!Array<!number>} arr
 * @returns {!number}
 */
const maxInArr = arr => Math.max(...arr);


/**
 * Find the biggest number in a list of numbers
 * @param {!Array<!number>} arr
 * @returns {!number}
 */
const minInArr = arr => Math.min(...arr);


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
const toNumber = x => x * 1;


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
 * @type {function(...[*]): *}
 */
const anyToLowerCase = compose(toLowerCase, toString);


//------------------------------------------------------------[ String Tools ]--
/**
 * Strip the leading char if it is the same as c
 * @param {string} c
 * @return {function(string): string}
 */
const stripLeadingChar = c => s => s.startsWith(c) ? s.slice(c.length) : s;


/**
 * @param {string} s
 * @return {function(*): (*|string[])}
 */
const split = s => x => x.split(s);


/**
 * @param {string} p
 * @param {RegExp|string} r
 * @return {function(*): *}
 */
const replace = (p, r) => x => x.replace(p, r);


/**
 * @param {string} s
 * @return {function(*): (*|string)}
 */
const join = s => x => x.join(s);


/**
 * @param {string} s
 * @return {function(*): (*|string)}
 */
const join2 = s => (...x) => [...x].join(s);


/**
 * @param {string} x
 * @return {function(string):string}
 */
const append = x => y => y + x;

/**
 * @param {string} x
 * @return {function(string):string}
 */
const prepend = x => y => x + y;


/**
 * Interleave a string (s) with the given joiner (j) - starting with the joiner
 * @param {!string} j The joiner to interleave the string with.
 * @return {function(string): string}
 */
const interleave = j => s => s.split('').map(v => `${j}${v}`).join('');


/**
 * Interleave a string (s) with the given joiner (j) - starting with the string
 * @param {!string} j The joiner to interleave the string with.
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


//------------------------------------------------------------[ Object tools ]--
/**
 * @param {*} l
 * @param {*} r
 * @returns {*}
 */
const mergeDeep = (l, r) => {
  const output = Object.assign({}, l);
  if (isObject(l) && isObject(r)) {
    Object.keys(r).forEach(key => {
      if (isObject(r[key])) {
        if (!(key in l))
          Object.assign(output, { [key]: r[key] });
        else
          output[key] = mergeDeep(l[key], r[key]);
      } else {
        if (Array.isArray(l[key]) && Array.isArray(r[key])) {
          output[key] = [...l[key], ...r[key]];
        } else {
          Object.assign(output, { [key]: r[key] });
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
 * @param {!Array<string|number>} arr
 * @returns {function((Object|Array)):(*)}
 */
const pathOr = (f, arr) => e => {
  const r = arr.reduce((p, c) => {
    try {
      return p[c];
    } catch (err) {
      return undefined
    }
  }, e);
  return r === undefined ? f : r;
};


//--------------------------------------------------------[ Math and Numbers ]--
/**
 * @param {!number} precision
 * @returns {function(!number): number}
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
  if (s === null) { return s; }
  const p = 1 * s;
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
 * @returns {function(number): number[]}
 */
const divMod = y => x => [Math.floor(y/x), y % x];


/**
 * Create a function that is seeded by a value to use as a divider
 * Calling this function with a number returns a pair of numbers consisting
 * of their quotient and remainder when using integer division.
 * The subsequent number is divided by the seed number.
 * @param {number} x
 * @returns {function(number): number[]}
 */
const divMod2 = x => y => [Math.floor(y/x), y % x];


/**
 * Factorize a function of the form Ax^2 + Bx + C = 0 finding the value of x
 * @param {!number} a
 * @param {!number} b
 * @param {!number} c
 * @return {number} The value of x
 */
const factorize = (a, b, c) => (-b + Math.sqrt(b**2 - 4 * a * (-c))) / (2 * a);


/**
 * calculates the luhn check digit for a given number and returns an array with
 * a boolean (is valid luhn) and the actual check number
 * Example:
 *    luhn(35956805108414) -> [true, 6]
 * @param {!number|!string} n The number to calc and check
 * @return {!Array.<!boolean|!number>} Valid and Luhn number
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
 * AA	   BB-BB-BB	 CC-CC-CC	   D	   EE
 * TAC	 TAC	     SN	         CD	   SVN
 * TAC : Type Allocation Code
 * SN : Serial Number
 * CD : Check Digit based on Luhn algorithm
 * SVN : Software Version Number
 *
 * Example:
 *    console.log(imeisvToImei('3595680510841401'));
 *    console.log(imeisvToImei('86488102222183'));
 * @param {!number|!string} n The IMEIsv number as received from RADIUS.
 * @return {!string}
 */
const imeisvToImei = n => {
  let t = n.toString().substr(0, 14);
  let r = luhn(t);
  return r[0] ? t + r[1] : n;
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
        .map(v => v/s.length)
        .reduce((p, c) => p -= c * Math.log(c) / Math.log(2), 0);


/**
 * Number names
 * http://rosettacode.org/wiki/Number_names
 * @param {number} value
 * @returns {string}
 */
const englishNumber = value => {
  let name = '';
  let quotient, remainder;
  const dm = divMod(value);
  const units = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
    'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
    'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty',
    'seventy', 'eighty', 'ninety'];
  const big = [...['', 'thousand'], ...['m', 'b', 'tr', 'quadr', 'quint',
    'sext', 'sept', 'oct', 'non', 'dec'].map(e => `${e}illion`)];

  if (value < 0) {
    name = `negative ${englishNumber(-value)}`
  } else if (value < 20) {
    name = units[value]
  } else if (value < 100) {
    [quotient, remainder] = dm(10);
    name = `${tens[quotient]} ${units[remainder]}`.replace(' zero', '');
  } else if (value < 1000) {
    [quotient, remainder] = dm(100);
    name = `${englishNumber(quotient)} hundred and ${englishNumber(remainder)}`.replace(' and zero', '')
  } else {
    const chunks = [];
    const text = [];
    while (value !== 0) {
      [value, remainder] = divMod(value)(1000);
      chunks.push(remainder);
    }
    chunks.forEach((e,i) => {
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
 * @param {!number} x1 Coord 1 x value
 * @param {!number} y1 Coord 1 y value
 * @param {!number} x2 Coord 2 x value
 * @param {!number} y2 Coord 2 y value
 * @return {function(number): number[]}
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


module.exports = {
  compose,
  partial,
  mergeDeep,
  pathOr,
  trace,
  identity,
  alwaysUndef,
  alwaysFalse,
  alwaysTrue,
  whatType,
  maybeBool,
  isDef,
  isNumber,
  isObject,
  isEven,
  isDivisibleBy,
  both,
  sameArr,
  sameEls,
  range,
  head,
  reverse,
  tail,
  flatten,
  elAt,
  transpose,
  repeat,
  countOck,
  countByFunc,
  filterAtInc,
  map,
  filter,
  maxInArr,
  minInArr,
  stripLeadingChar,
  toLowerCase,
  toUpperCase,
  toString,
  toNumber,
  anyToLowerCase,
  stringReverse,
  numReverse,
  split,
  replace,
  join,
  join2,
  append,
  prepend,
  interleave,
  interleave2,
  countSubString,
  pRound,
  maybeNumber,
  negate,
  divMod,
  divMod2,
  factorize,
  luhn,
  imeisvToImei,
  shannon,
  englishNumber,
  hasValue,
  chunks,
  extrapolate
};

