
// noinspection JSUnusedLocalSymbols
/**
 * @typedef {(Uint8Array | Int32Array | Uint16Array | Uint32Array | Float64Array | Int8Array | Float32Array | Uint8ClampedArray | Int16Array)}
 */
let arrayLike;


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
const partial = (fn, ...a) => (...b)  => fn(...[...a, ...b]);


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


/**
 * @param {*} func
 * @return {function(): undefined}
 */
const maybeFunc = func => () => {
  if (whatType(func) === 'function') { /** @type {!Function} */(func)() }
};



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
 * @type {Map<*, boolean>}
 */
const boolMap = new Map()
    .set('true', true)
    .set('false', false);


/**
 * Convert the given thing to a boolean if it can. Else return it as is.
 * @param {*} s
 * @returns {*|boolean}
 */
const maybeBool = s => isDef(boolMap.get(s)) ? boolMap.get(s) : s;


//--------------------------------------------------------------[ Assertions ]--
/**
 * @param {?} t
 * @returns {boolean}
 */
const isDef = t => t !== undefined;


/**
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
 * Check if an Object has keys. Usefull to check if JSON responses are
 * empty.
 * @param o
 * @returns {boolean}
 */
const isEmpty = o => o.constructor === Object && Object.keys(o).length === 0;


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
 * Works by spoofing an iterable object by creating an object with a length
 * property.
 * @param {!number} m
 * @param {!number} n
 * @returns {Array<!number>}
 */
const range2 = (m, n) => Array.from(
    {length: Math.floor(n - m) + 1},
    (_, i) => m + i
);


/**
 * Given max value, return a function that takes an int, and returns an
 * array of values in clock order from the given int around.
 * Example:
 *     clock12 = clock(12)
 *     clock12(4) -> [ 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3 ]
 * @param {number} m
 * @returns {function(number):Array<number>}
 */
const clock = m => s => [...range2(s, m), ...(s > 1 ? range2(1, s - 1): [])];



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
const truncate = n => arr => arr.filter((_,i) => i < n);


/**
 * Flatten multi-dimensional array to single dimension.
 * Example:
 * [[1], 2, [[3, 4], 5], [[[]]], [[[6]]], 7, 8, []] -> [1, 2, 3, 4, 5, 6, 7, 8]
 * @param {!Array<*>} a
 * @return {Array<*>}
 */
const flatten = a => a.reduce(
    (p,c) => c.reduce ? flatten([...p, ...c]) : [...p, c], []);


/**
 * Given an index number, return a function that takes an array and returns the
 * element at the given index
 * @param {number} i
 * @return {function(!Array<*>): *}
 */
const elAt = i => arr => arr[i];


/**
 * Transpose an array of arrays:
 * Example:
 * [['a', 'b', 'c'], ['A', 'B', 'C'], [1, 2, 3]] ->
 * [['a', 'A', 1], ['b', 'B', 2], ['c', 'C', 3]]
 * @param {!Array<!Array<*>>} a
 * @return {!Array<!Array<*>>}
 */
const transpose = a => a[0].map(
    (e,i) => {
      const fun = elAt(i);
      return a.map(fun);
    });


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


const shuffle = (a, b) => a.reduce((p,c,i) => p.push(c) && p.push(b[i]) && p, []);



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
 * @returns {function(string): (boolean|string)}
 */
const onlyIncludes = a => s => {
  const allGood = Array.from(/** @type string */(s)).every(e => a.includes(e));
  return allGood ? s : false;
};

/**
 * Strip the leading char if it is the same as c
 * @param {string} c
 * @return {function(string): string}
 */
const stripLeadingChar = c => s => s.startsWith(c) ? s.slice(c.length) : s;


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
 * @param {string} s
 * @return {function(string): (string)}
 */
const join = s => x => x.join(s);


/**
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


//--------------------------------------------------------------[ Time Utils ]--
/**
 * This returns now in seconds.
 * The value returned by the Date.now() method is the number of milliseconds
 * since 1 January 1970 00:00:00 UTC. Always UTC.
 * @return {number} The current Epoch timestamp in seconds. Rounding down.
 */
const getNowSeconds = () => Math.floor(Date.now() / 1000);


//--------------------------------------------------------[ Math and Numbers ]--
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
 * @return {string}
 */
const privateRandom = () => {
  const c = randomId();
  return (() => c)();
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


//--------------------------------------------------------[ Math and Numbers ]--
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
 * @returns {function(number): !Array<number>}
 */
const divMod = y => x => [Math.floor(y/x), y % x];


/**
 * Create a function that is seeded by a value to use as a divider
 * Calling this function with a number returns a pair of numbers consisting
 * of their quotient and remainder when using integer division.
 * The subsequent number is divided by the seed number.
 * @param {number} x
 * @returns {function(number): !Array<number>}
 */
const divMod2 = x => y => [Math.floor(y/x), y % x];


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
  if (bytes === 0) { return '0'; }
  const k = 1024; // or 1024 for binary
  const dm = precision ? precision : 2;
  const sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number((bytes / Math.pow(k, i)).toPrecision(dm)) + ' ' + sizes[i];
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


export {
  isUndefined,
  leftPadWithTo,
  onlyIncludes,
  isDef,
  isDefAndNotNull,
  alwaysAppend,
  replaceAll,
  cloneObj,
  compose,
  partial,
  mergeDeep,
  pathOr,
  trace,
  identity,
  alwaysUndef,
  alwaysFalse,
  alwaysTrue,
  alwaysNull,
  whatType,
  maybeBool,
  isNumber,
  isString,
  isObject,
  isEven,
  isDivisibleBy,
  isEmpty,
  both,
  sameArr,
  sameEls,
  range,
  range2,
  clock,
  head,
  reverse,
  tail,
  flatten,
  truncate,
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
  chunk,
  extrapolate,
  numToBinString,
  binStringToNum,
  getBitAt,
  setBitAt,
  clearBitAt,
  invBitAt,
  hasBitAt,
  idGen,
  makeRandomString,
  randomId,
  privateRandom,
  privateCounter,
  maybeFunc,
  formatBytes,
  columnReduce,
  splitAt
};

