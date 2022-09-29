import { strict as assert } from 'node:assert';
import * as F from '../src/badu.js'

/**
 numericInt,
 numericString,
 alphaLower,
 alphaUpper,
 alphaNum,
 compose,
 identity,
 partial,
 alwaysUndef,
 alwaysFalse,
 alwaysTrue,
 alwaysNull,
 logInline,
 trace,
 whatType,
 boolMap,
 maybeBool,
 maybeFunc,
 isDef,
 isUndefined,
 isDefAndNotNull,
 isString,
 isNumber,
 isObject,
 isEven,
 isDivisibleBy,
 both,
 hasValue,
 isEmpty,
 sameAs,
 rangeGen,
 range,
 range2,
 iRange,
 clock,
 head,
 tail,
 reverse,
 truncate,
 flatten,
 elAt,
 columnAt,
 transpose,
 repeat,
 countOck,
 countByFunc,
 filterAtInc,
 sameArr,
 sameEls,
 allElementsEqual,
 map,
 filter,
 chunk,
 pairs,
 pairsToMap,
 maxInArr,
 minInArr,
 columnReduce,
 splitAt,
 zip,
 zipFlat,
 findShared,
 filterOnlyIndexes,
 arrToMap,
 remove,
 removeAtIndex,
 removeRandom,
 push,
 toLowerCase,
 toString,
 toNumber,
 toUpperCase,
 negate,
 quote,
 anyToLowerCase,
 makeRandomString,
 leftPadWithTo,
 onlyIncludes,
 stripLeadingChar,
 stripTrailingChar,
 split,
 replace,
 replaceAll,
 join,
 join2,
 append,
 alwaysAppend,
 prepend,
 interleave,
 interleave2,
 countSubString,
 stringReverse,
 lcp,
 mergeDeep,
 pathOr,
 cloneObj,
 flattenObj,
 getNowSeconds,
 idGen,
 privateCounter,
 privateRandom,
 randomId,
 randIntBetween,
 randSubSet,
 randSign,
 toInt,
 pRound,
 maybeNumber,
 numReverse,
 divMod,
 divMod2,
 factorize,
 luhn,
 imeisvToImei,
 shannon,
 englishNumber,
 extrapolate,
 formatBytes,
 numToBinString,
 binStringToNum,
 getBitAt,
 setBitAt,
 clearBitAt,
 invBitAt,
 hasBitAt,
 haversine,
 didRiseThroughBoundary,
 didFallThroughBoundary,
 didEnterBand,
 didExitBand,
 geoIsInside,
 geoFenceDidEnter,
 geoFenceDidExit,
 */

describe('Functional tools', () => {
  it('compose: compose pure functions', () => {
    const plusOne = x => x + 1;
    const timesTwo = x => x * 2;
    const composed = F.compose(timesTwo, plusOne);
    assert.strictEqual(composed(3), ((3 + 1) * 2));
  });

  it('compose: works from right to left', () => {
    const plusOne = x => x + 1;
    const timesTwo = x => x * 2;
    const composed = F.compose(plusOne, timesTwo);
    assert.strictEqual(composed(3), ((3 * 2) + 1));
  });

  it('identity: returns whatever it was given',
      () => assert.strictEqual(F.identity(1), 1));

  it('identity: strings',
      () => assert.strictEqual(F.identity('s'), 's'));

  it('identity: array',
      () => assert.deepStrictEqual(F.identity([1, 2, 3]), [1, 2, 3]));

  it('partial: returns a partially applied function', () => {
    const test = (a, b, c, d) => `${a} ${b} ${c} ${d}`;
    const partial = F.partial(test, 'first', 'second');
    assert.strictEqual(partial('third', 'last'), 'first second third last');
  });

  it('partial: returns a partially applied function', () => {
    const sum = (a, b) => a + b;
    const sum10 = F.partial(sum, 10);
    assert.strictEqual(sum10(20), 30);
  });

  it('partial: can be applied multiple times', () => {
    const plusThenDiv = (a, b, c) => (a + b) / c;
    const plus10ThenDiv = F.partial(plusThenDiv, 10);
    const plus10And5ThenDiv = F.partial(plus10ThenDiv, 5);
    assert.strictEqual(plus10And5ThenDiv(5), 3);
    assert.strictEqual(plus10And5ThenDiv(3), 5);
  });

});

describe('Some functions always return the same thing', () => {

  it('alwaysUndef: returns "undefined"',
      () => assert.strictEqual(F.alwaysUndef(), undefined));

  it('alwaysUndef: regardless of what is passed in',
      () => assert.strictEqual(F.alwaysUndef(1, false, 'hello'), undefined));

  it('alwaysFalse: returns "false" ',
      () => assert.strictEqual(F.alwaysFalse(), false));

  it('alwaysFalse: regardless of what is passed in',
      () => assert.strictEqual(F.alwaysFalse(true), false));

  it('alwaysTrue: returns "false" ',
      () => assert.strictEqual(F.alwaysTrue(), true));

  it('alwaysTrue: regardless of what is passed in',
      () => assert.strictEqual(F.alwaysTrue(true), true));

  it('alwaysNull: returns "false" ',
      () => assert.strictEqual(F.alwaysNull(), null));

  it('alwaysNull: regardless of what is passed in',
      () => assert.strictEqual(F.alwaysNull(true), null));

});

describe('Functions to debug and trace', () => {

  it('logInline: logs the tag and returns the value', () => {
    const tag = 'log the tag';
    const value = 2;
    assert.strictEqual(F.logInline(tag, value), 2);
  });

  it('trace: the same tag for different values', () => {
    const trace1 = F.trace('The value is now:');
    [1, 2, 3, 4].forEach(trace1)
  });

  it('trace: can be used to see what is passed around inside a ' +
      'composed function. Trace is partially applied logInline', () => {
    const plusOne = x => x + 1;
    const timesTwo = x => x * 2;
    const trace1 = F.trace('First this:');
    const trace2 = F.trace('Then this:');
    const trace3 = F.trace('Lastly:');
    const composed = F.compose(trace3, plusOne, trace2, timesTwo, trace1);
    assert.strictEqual(composed(3), ((3 * 2) + 1));
  });
});

describe('Type interrogation function:', () => {

  it('whatType: returns "string" if a string is given',
      () => assert.strictEqual(F.whatType('s'), 'string'));

  it('whatType: returns "number" if a number is given',
      () => assert.strictEqual(F.whatType(12.3), 'number'));

  it('whatType: returns "number" if a NaN is given',
      () => assert.strictEqual(F.whatType(NaN), 'number'));

  it('whatType: returns "object" if an object is given',
      () => assert.strictEqual(F.whatType({a: 1}), 'object'));

  it('whatType: returns "object" if an array is given',
      () => assert.strictEqual(F.whatType([1, 2]), 'object'));

  it('whatType: returns "object" if a Map is given',
      () => assert.strictEqual(F.whatType(new Map()), 'object'));

  it('whatType: returns "object" if a Set is given',
      () => assert.strictEqual(F.whatType(new Set()), 'object'));

  it('maybeBool: converts string "true" to boolean true',
      () => assert.strictEqual(F.maybeBool('true'), true));

  it('maybeBool: converts string "false" to boolean false',
      () => assert.strictEqual(F.maybeBool('false'), false));

  it('maybeBool: returns what it was given if it could not be converted',
      () => assert.strictEqual(F.maybeBool(123), 123));

  it('maybeBool: handles nulls',
      () => assert.strictEqual(F.maybeBool(null), null));

  it('maybeBool: handles zero',
      () => assert.strictEqual(F.maybeBool(0), 0));

  it('maybeBool: is case sensitive',
      () => assert.strictEqual(F.maybeBool('True'), 'True'));

  it('maybeFunc: executes its argument if a function', () => {
    const aFunc = () => 2;
    assert.strictEqual(F.maybeFunc(aFunc)(), 2);
  });

  it('maybeFunc: returns undefined if the argument is not a function', () => {
    const notaFunc = `I'm not a function`;
    assert.strictEqual(F.maybeFunc(notaFunc)(), undefined);
  });
});

describe('Assertion functions:', () => {

  it('isDef: returns true if it was given something other than "undefined"',
      () => assert.strictEqual(F.isDef(0), true));

  it('isDef: handles null',
      () => assert.strictEqual(F.isDef(null), true));

  it('isDef: handles NaN',
      () => assert.strictEqual(F.isDef(NaN), true));

  it('isDef: handles undefined',
      () => assert.strictEqual(F.isDef(undefined), false));

  it('isUndefined: returns true if given something that is not defined', () => {
    let uDef;
    // noinspection JSUnusedAssignment
    assert.strictEqual(F.isUndefined(uDef), true);
    assert.strictEqual(F.isUndefined(undefined), true);
    assert.strictEqual(F.isUndefined(void 0), true);
  });

  it('isUndefined: handles null', () => {
    return assert.strictEqual(F.isUndefined(null), false);
  });

  it('isUndefined: handles NaN', () => {
    return assert.strictEqual(F.isUndefined(NaN), false);
  });

  it('isUndefined: handles the empty string', () => {
    return assert.strictEqual(F.isUndefined(''), false);
  });

  it('isDefAndNotNull: returns true if it was given something other ' +
      'than "undefined" or null',
      () => assert.strictEqual(F.isDefAndNotNull(undefined), false));

  it('isDefAndNotNull: null returns false',
      () => assert.strictEqual(F.isDefAndNotNull(null), false));

  it('isDefAndNotNull: NaN is considered defined',
      () => assert.strictEqual(F.isDefAndNotNull(NaN), true));

  it('isDefAndNotNull: false is considered defined',
      () => assert.strictEqual(F.isDefAndNotNull(false), true));

  it('isDefAndNotNull: zero is considered defined',
      () => assert.strictEqual(F.isDefAndNotNull(0), true));

  it('isDefAndNotNull: empty string is considered defined',
      () => assert.strictEqual(F.isDefAndNotNull(''), true));

  it('isString: returns true if given a string',
      () => assert.strictEqual(F.isString('s'), true));

  it('isString: handles null',
      () => assert.strictEqual(F.isString(null), false));

  it('isString: handles undefined',
      () => assert.strictEqual(F.isString(undefined), false));

  it('isString: handles NaN',
      () => assert.strictEqual(F.isString(NaN), false));

  it('isNumber: returns true if given a number',
      () => assert.strictEqual(F.isNumber(1), true));

  it('isNumber: handles NaN in sane way',
      () => assert.strictEqual(F.isNumber(NaN), false));

  it('isNumber: handles infinity',
      () => assert.strictEqual(F.isNumber(Infinity), true));

  it('isNumber: handles Number.POSITIVE_INFINITY',
      () => assert.strictEqual(F.isNumber(Number.POSITIVE_INFINITY), true));

  it('isNumber: handles Number.NEGATIVE_INFINITY',
      () => assert.strictEqual(F.isNumber(Number.NEGATIVE_INFINITY), true));

  it('isObject: returns true if given an object',
      () => assert.strictEqual(F.isObject({a: 1}), true));

  it('isObject: handles array as not-an-object',
      () => assert.strictEqual(F.isObject([1, 2]), false));

  it('isObject: handles Maps as not-an-object',
      () => assert.strictEqual(F.isObject(new Map()), false));

  it('isObject: handles Sets as not-an-object',
      () => assert.strictEqual(F.isObject(new Set()), false));

  it('isObject: handles Date as not-an-object',
      () => assert.strictEqual(F.isObject(new Date()), false));

  it('isArray: identifies arrays',
      () => assert.strictEqual(F.isArray([]), true));

  it('isArray: handles strings as not-an-array',
      () => assert.strictEqual(F.isArray('hello'), false));

  it('isEven: returns true if given a number that can be divided by 2',
      () => assert.strictEqual(F.isEven(2), true));

  it('isEven: returns false if given a number that cant be divided by 2',
      () => assert.strictEqual(F.isEven(3), false));

  it('isEven: it returns false if the given thing is not a number',
      () => assert.strictEqual(F.isEven('hello'), false));

  it('isEven: handles NaN',
      () => assert.strictEqual(F.isEven(NaN), false));

  it('isEven: handles Undefined',
      () => assert.strictEqual(F.isEven(undefined), false));

  it('isEven: handles null',
      () => assert.strictEqual(F.isEven(null), false));

  it('isEven: handles Number.POSITIVE_INFINITY',
      () => assert.strictEqual(F.isEven(Number.POSITIVE_INFINITY), true));

  it('isEven: handles Number.NEGATIVE_INFINITY',
      () => assert.strictEqual(F.isEven(Number.NEGATIVE_INFINITY), true));

  it('isDivisibleBy: returns a function to test divisibility',
      () => {
        const t = F.isDivisibleBy(2);
        assert.strictEqual(t(2), true);
        assert.strictEqual(t(3), false);
      });

  it('both: returns a function to test if both the given functions return true',
      () => {
        const t = F.both(F.isNumber, F.isEven);
        assert.strictEqual(t(123), false);
        assert.strictEqual(t(124), true);
      });

  it('hasValue: is defined and not null',
      () => assert.strictEqual(F.hasValue(1), true));

  it('hasValue: empty string has value',
      () => assert.strictEqual(F.hasValue(''), true));

  it('hasValue: number 0 has value',
      () => assert.strictEqual(F.hasValue(0), true));

  it('hasValue: empty array has value',
      () => assert.strictEqual(F.hasValue([]), true));

  it('hasValue: empty object has value',
      () => assert.strictEqual(F.hasValue({}), true));

  it('hasValue: null has value',
      () => assert.strictEqual(F.hasValue(null), true));

  it('hasValue: undefined does not have value',
      () => assert.strictEqual(F.hasValue(undefined), false));

  it('hasValue: NaN does not have value',
      () => assert.strictEqual(F.hasValue(NaN), false));

  it('isEmpty: Check if an object has keys',
      () => assert.strictEqual(F.isEmpty({}), true));

  it('isEmpty: Check if an object has keys',
      () => assert.strictEqual(F.isEmpty({a: 1}), false));

  it('isEmpty: Check if an object has keys. Should not fail on null',
      () => assert.strictEqual(F.isEmpty(null), true));

  it('isEmpty: Check if an object has keys. Should not fail on undefined',
      () => assert.strictEqual(F.isEmpty(undefined), true));

  it('isEmpty: Check if an object has keys. Should not fail on strings',
      () => assert.strictEqual(F.isEmpty(''), true));

  it('isEmpty: Check if an object has keys. Should not fail on undefined',
      () => assert.strictEqual(F.isEmpty(), true));

  it('sameAs: given a marker, test that the given element is the same', () => {
    const marker = 'a';
    const test = F.sameAs(marker);
    assert.strictEqual(test('a'), true);
    assert.strictEqual(test('_a'), false);
  });

  it('sameAs: marker can be a number', () => {
    const marker = 123;
    const test = F.sameAs(marker);
    assert.strictEqual(test(123), true);
    assert.strictEqual(test(122), false);
  });

  it('sameAs: marker can be a boolean', () => {
    const marker = true;
    const test = F.sameAs(marker);
    assert.strictEqual(test(true), true);
    assert.strictEqual(test(false), false);
  });

  it('sameAs: marker can be a undefined', () => {
    const marker = undefined;
    const test = F.sameAs(marker);
    assert.strictEqual(test(undefined), true);
    assert.strictEqual(test(void 0), true);
    assert.strictEqual(test(false), false);
  });

  it('sameAs: marker can be null', () => {
    const marker = null;
    const test = F.sameAs(marker);
    assert.strictEqual(test(null), true);
    assert.strictEqual(test(undefined), false);
  });

  it('sameAs: marker can *NOT* be NaN!', () => {
    const marker = NaN;
    const test = F.sameAs(marker);
    assert.strictEqual(test(NaN), false);
  });


});

describe('Array specific utils', () => {

  it('range: make an array from beginning to end', () => {
    const r = F.range(1, 10);
    const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    assert.strictEqual(F.sameArr(r, result), true)
  });

  it('range: can go backwards', () => {
    const r = F.range(10, 1);
    const result = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    assert.strictEqual(F.sameArr(r, result), true)
  });

  it('range: takes an optional step size', () => {
    const r = F.range(1, 10, 2);
    const result = [1, 3, 5, 7, 9];
    assert.strictEqual(F.sameArr(r, result), true)
  });

  it('range2: make an array from beginning to end', () => {
    const r = F.range2(1, 10);
    const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    assert.strictEqual(F.sameArr(r, result), true)
  });

  it('range2: can start at any positive number', () => {
    const r = F.range2(7, 10);
    const result = [7, 8, 9, 10];
    assert.strictEqual(F.sameArr(r, result), true)
  });

  it('range2: Empty array if begin is bigger than end', () => {
    const r = F.range2(10, 5);
    const result = [];
    assert.strictEqual(F.sameArr(r, result), true)
  });

  it('iRange: takes a single argument and ranges from 0 up', () => {
    const r = F.iRange(10);
    const result = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    assert.strictEqual(F.sameArr(r, result), true)
  });

  it('clock: Given size, return a function to give array starting at n', () => {
    const clock6 = F.clock(6);
    assert.strictEqual(F.sameArr(clock6(1), [1, 2, 3, 4, 5, 6]), true);
    assert.strictEqual(F.sameArr(clock6(2), [2, 3, 4, 5, 6, 1]), true);
    assert.strictEqual(F.sameArr(clock6(3), [3, 4, 5, 6, 1, 2]), true);
    assert.strictEqual(F.sameArr(clock6(4), [4, 5, 6, 1, 2, 3]), true);
    assert.strictEqual(F.sameArr(clock6(5), [5, 6, 1, 2, 3, 4]), true);
    assert.strictEqual(F.sameArr(clock6(6), [6, 1, 2, 3, 4, 5]), true);
  });

  // it('clock: can do multiple rotations from given input', () => {
  //   const clock6 = F.clock(6);
  //   console.log(clock6(17));
  //   assert.strictEqual(F.sameArr(clock6(7), [1,2,3,4,5,6]), true);
  //   assert.strictEqual(F.sameArr(clock6(17), [1,2,3,4,5,6]), true);
  // });

  it('allElementsEqual: returns true if all the elements ' +
      'in the array are the same',
      () => assert.strictEqual(F.allElementsEqual([1, 1, 1, 1, 1]), true));

  it('allElementsEqual: returns false if any element differs',
      () => assert.strictEqual(F.allElementsEqual([1, 1, '1', 1, 1]), false));

  it('allElementsEqual: returns true an empty array is given',
      () => assert.strictEqual(F.allElementsEqual([]), true));

  it('sameArr: returns true if both arrays have the ' +
      'same elements in the same order',
      () => assert.strictEqual(F.sameArr([1, 2], [1, 2]), true));

  it('sameArr: if the order differs the test fails',
      () => assert.strictEqual(F.sameArr([1, 2], [2, 1]), false));

  it('sameArr: if the elements differs the test fails',
      () => assert.strictEqual(F.sameArr([1, 2], [1, 1]), false));

  it('sameEls: returns true if both arrays have the same elements',
      () => assert.strictEqual(F.sameEls([1, 2], [1, 2]), true));

  it('sameEls: order does not matter',
      () => assert.strictEqual(F.sameEls([1, 2], [2, 1]), true));

  it('sameEls: when elements differ it fails',
      () => assert.strictEqual(F.sameEls([1, 2], [2, 1, 1]), false));

  it('iRange: takes a single argument and ranges from 0 up', () => {
    const r = F.iRange(10);
    const result = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    assert.strictEqual(F.sameArr(r, result), true)
  });

  it('head: returns the first element of an array',
      () => assert.strictEqual(F.head([1, 2, 3]), 1)
  );

  it('head: returns undefined when the array is empty',
      () => assert.strictEqual(F.head([]), undefined)
  );

  it('tail: returns the last element of an array',
      () => assert.strictEqual(F.tail([1, 2, 3]), 3)
  );

  it('tail: returns undefined when the array is empty',
      () => assert.strictEqual(F.tail([]), undefined)
  );

  it('reverse: reverses an array', () => {
    assert.strictEqual(F.sameArr(F.reverse([1, 2, 3]), [3, 2, 1]), true)
  });

  it('reverse: given a string, it returns an array with ' +
      'the string reversed', () => {
    assert.strictEqual(F.sameArr(F.reverse('abc'), ['c', 'b', 'a']), true)
  });

  it('flatten: flattens a multi dimensional arr', () => {
    assert.strictEqual(F.sameArr(
        F.flatten([[1], [2, [[[3, 4], 5]], [[[]]], [[[6]]], 7, 8, []]]),
        [1, 2, 3, 4, 5, 6, 7, 8]
    ), true)
  });

  it('truncate: truncate an array to the given length', () => {
    const truncTo3 = F.truncate(3);
    assert.strictEqual(F.sameArr(
        truncTo3([1, 2, 3, 4, 5, 6, 7, 8]),
        [1, 2, 3]),
        true)
  });

  it('elAt: returns the element of an array at the given position', () => {
    const first = F.elAt(0);
    const second = F.elAt(1);
    const third = F.elAt(2);
    const arr = [1, 2, 3];
    assert.strictEqual(first(arr), 1);
    assert.strictEqual(second(arr), 2);
    assert.strictEqual(third(arr), 3);
  });

  it('elAt: returns the undefined if the index is not valid', () => {
    const wayOut = F.elAt(99);
    const arr = [1, 2, 3];
    assert.strictEqual(wayOut(arr), undefined);
  });

  it('columnAt: returns an array of all elements at position n', () => {
    const matrix = [
      ['1', '2', '3'],
      [1, 2, 3],
      [true, false, null]
    ];
    const column0 = ['1', 1, true];
    const column1 = ['2', 2, false];
    const column2 = ['3', 3, null];
    const testThese = F.columnAt(matrix);
    [column0, column1, column2].forEach((e, i) => {
      assert.strictEqual(F.sameArr(testThese(i), e), true);
    })
  });

  it('columnAt: does not need equal length arrays', () => {
    const matrix = [
      ['1'],
      [1, 2,],
      [true, false, null]
    ];
    const column0 = ['1', 1, true];
    const column1 = [undefined, 2, false];
    const column2 = [undefined, undefined, null];
    const column3 = [undefined, undefined, undefined];
    const testThese = F.columnAt(matrix);
    [column0, column1, column2, column3].forEach((e, i) => {
      assert.strictEqual(F.sameArr(testThese(i), e), true);
    })
  });

  it('transpose: rotate an array of arrays', () => {
    const input = [['a', 'b', 'c'], ['A', 'B', 'C'], [1, 2, 3]];
    const output = [['a', 'A', 1], ['b', 'B', 2], ['c', 'C', 3]];
    assert.deepStrictEqual(F.transpose(input), output);
  });

  it('repeat: fills an array with the given element n times', () => {
    assert.deepStrictEqual(F.repeat(1, 3), [1, 1, 1]);
  });

  it('countOck: counts the number of times an element is in an array', () => {
    const countZeros = F.countOck(0);
    assert.deepStrictEqual(countZeros([0, 1, 0, 1, 0, 0, 0, 1]), 5);
  });

  it('countOck: handles NaNs', () => {
    const countNaNs = F.countOck(NaN);
    assert.deepStrictEqual(countNaNs([NaN, 1, NaN, 1, NaN, 0, NaN, 1]), 4);
  });

  it('countOck: handles undefined', () => {
    const countundefineds = F.countOck(undefined);
    assert.deepStrictEqual(
        countundefineds([undefined, 1, undefined, 1, null, 0, NaN, 1]), 2);
  });

  it('countOck: handles null', () => {
    const countnulls = F.countOck(null);
    assert.deepStrictEqual(
        countnulls([undefined, 1, undefined, 1, null, 0, NaN, 1]), 1);
  });

  it('countByFunc:  Counts the occurrence of something that ' +
      'satisfies the predicate', () => {
    const countArr = F.countByFunc(e => Array.isArray(e));
    assert.deepStrictEqual(
        countArr([[], [], NaN, {}, 1, {length: 1}]), 2);
  });

  it('filterAtInc: Remove every n-th element from the given array', () => {
    const remThirds = F.filterAtInc(3);
    assert.deepStrictEqual(remThirds([1, 2, 3, 4, 1, 2, 3, 4]), [1, 2, 4, 1, 3, 4]);
  });

  it('map: Takes a function returns a function that takes an array', () => {
    const plus1 = F.map(x => x + 1);
    assert.deepStrictEqual(plus1([1, 2, 3]), [2, 3, 4]);
  });

  it('filter: Takes a function returns a function that takes an array', () => {
    const onlyEvens = F.filter(F.isEven);
    assert.deepStrictEqual(onlyEvens([1, 2, 3, 4, 5, 6]), [2, 4, 6]);
  });

  it('chunk: split an array into set of arrays of size n', () => {
    const chunkToThree = F.chunk(3);
    const testArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    assert.deepStrictEqual(
        chunkToThree(testArr),
        [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]
    );
  });

  it('pairs: split an array into set of arrays of size 2', () => {
    const testArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    assert.deepStrictEqual(
        F.pairs(testArr),
        [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]]
    );
  });

  it('pairs: empty input is OK', () => {
    const testArr = [];
    assert.deepStrictEqual(
        F.pairs(testArr),
        []
    );
  });

  it('pairs: uneven input is OK and results in final singleton', () => {
    const testArr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    assert.deepStrictEqual(
        F.pairs(testArr),
        [[0, 1], [2, 3], [4, 5], [6, 7], [8]]
    );
  });

  it('pairsToMap: returns a Map of kv-pairs from a flat array', () => {
    const testArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    assert.deepStrictEqual(
        F.pairsToMap(testArr),
        new Map().set(0, 1).set(2, 3).set(4, 5).set(6, 7).set(8, 9)
    );
  });

  it('pairsToMap: Uneven array result in undefined last element', () => {
    const testArr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    assert.deepStrictEqual(
        F.pairsToMap(testArr),
        new Map().set(0, 1).set(2, 3).set(4, 5).set(6, 7).set(8, undefined)
    );
  });

  it('maxInArr: returns max value of array',
      () => assert.strictEqual(F.maxInArr([1, 2, 3, 2, 1]), 3)
  );

  it('minInArr: returns min value of array',
      () => assert.strictEqual(F.minInArr([1, 2, 3, 2, 1]), 1)
  );

  it('columnReduce: Reduce the columns in an array of arrays.', () => {
    assert.deepStrictEqual(
        F.columnReduce([[1, 2, 3], [4, 5, 6]], (p, c) => p + c),
        [5, 7, 9])
  });

  it('splitAt: Split an array into two arrays at the given position.', () => {
    const spitAt3 = F.splitAt(3);
    const spitAt6 = F.splitAt(6);
    const expected3 = [[0, 1, 2], [3, 4, 5, 6, 7, 8, 9]];
    const expected6 = [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9]];
    assert.deepStrictEqual(
        spitAt3(F.numericInt), expected3);
    assert.deepStrictEqual(
        spitAt6(F.numericInt), expected6);
  });

  it('zip: Combine two arrays into array of tuples', () => {
    const expected = [
      [0, 'A'], [1, 'B'], [2, 'C'], [3, 'D'], [4, 'E'],
      [5, 'F'], [6, 'G'], [7, 'H'], [8, 'I'], [9, 'J'],];
    assert.deepStrictEqual(
        F.zip(F.numericInt, F.alphaUpper), expected);
  });

  it('zip: Shorter Array drives result. Shorter first', () => {
    const expected = [[0, 'A'], [1, 'B'], [2, 'C']];
    assert.deepStrictEqual(
        F.zip([0, 1, 2], F.alphaUpper), expected);
  });

  it('zip: Shorter Array drives result. Shorter second', () => {
    const expected = [[0, 'A'], [1, 'B'], [2, 'C']];
    assert.deepStrictEqual(
        F.zip(F.numericInt, ['A', 'B', 'C']), expected);
  });

  it('zipFlat: Combine two arrays flat consecutive pairs', () => {
    const expected = [
      0, 'A', 1, 'B', 2, 'C', 3, 'D', 4, 'E',
      5, 'F', 6, 'G', 7, 'H', 8, 'I', 9, 'J'];
    assert.deepStrictEqual(
        F.zipFlat(F.numericInt, F.alphaUpper), expected);
  });

  it('zipFlat: Shorter Array drives result. Shorter first', () => {
    const expected = [0, 'A', 1, 'B', 2, 'C'];
    assert.deepStrictEqual(
        F.zipFlat([0, 1, 2], F.alphaUpper), expected);
  });

  it('zipFlat: Shorter Array drives result. Shorter second', () => {
    const expected = [0, 'A', 1, 'B', 2, 'C'];
    assert.deepStrictEqual(
        F.zipFlat(F.numericInt, ['A', 'B', 'C']), expected);
  });

  it('findShared: find elements shared amongst an array of arrays', () => {
    const test1 = [0, 1, 2, 9];
    const test2 = [2, 3, 4, 5];
    const test3 = [4, 6, 7, 8, 2, 9];
    const expected = [2, 9, 4];
    assert.deepStrictEqual(
        F.findShared([test1, test2, test3]),
        expected
    );
  });

  it('findShared: also counts duplicates *within* its target', () => {
    const test1 = [0, 0, 0, 1, 2, 9];
    const test2 = [2, 3, 3, 4, 5];
    const test3 = [4, 6, 7, 8, 2, 9, 6, 7];
    const expected = [0, 2, 9, 3, 4, 6, 7];
    assert.deepStrictEqual(
        F.findShared([test1, test2, test3]),
        expected
    );
  });

  it('intersection: finds elements that appear in both arrays', () => {
    const test1 = [0, 0, 0, 1, 2, 4, 9];
    const test2 = [2, 3, 3, 4, 5];
    const expected = [2, 4];
    assert.deepStrictEqual(
        F.intersection(test1, test2),
        expected
    );
  });

  it('union: unique elements in the combination of the given arrays', () => {
    const test1 = [0, 0, 0, 1, 2, 4, 9];
    const test2 = [2, 3, 3, 4, 5];
    const expected = [0, 1, 2, 4, 9, 3, 5];
    assert.deepStrictEqual(
        F.union(test1, test2),
        expected
    );
  });

  it('difference: elements in arr1 one and not in arr2', () => {
    const test1 = [0, 0, 0, 1, 2, 4, 9];
    const test2 = [2, 3, 3, 4, 5];
    const expected = [0, 1, 9];
    assert.deepStrictEqual(
        F.difference(test1, test2),
        expected
    );
  });


  it('symmetricDiff: find elements that only appear in a single array', () => {
    const test1 = [0, 0, 0, 1, 2, 4, 9];
    const test2 = [2, 3, 3, 4, 5];
    const expected = [0, 1, 9, 3, 5];
    assert.deepStrictEqual(
        F.symmetricDiff(test1, test2),
        expected
    );
  });


  it('filterOnlyIndexes: filters an array to only contain elements at given ' +
      'indexes', () => {
    const given = [10, 11, 12, 13, 14, 15];
    const indexes = [0, 2, 5];
    const expected = [10, 12, 15];
    const func = F.filterOnlyIndexes(indexes);
    assert.deepStrictEqual(
        func(given),
        expected
    );
  });

  it('arrToMap: converts key and value arrays to a map', () => {
    const keys = [1, 2, 3, 4];
    const values = ['a', 'b', 'c', 'd'];
    const expected = new Map().set(1, 'a').set(2, 'b').set(3, 'c').set(4, 'd');
    assert.deepStrictEqual(
        F.arrToMap(keys, values),
        expected
    );
  });

  it('arrToMap: discards values if keys array is short', () => {
    const keys = [1, 2, 3];
    const values = ['a', 'b', 'c', 'd'];
    const expected = new Map().set(1, 'a').set(2, 'b').set(3, 'c');
    assert.deepStrictEqual(
        F.arrToMap(keys, values),
        expected
    );
  });

  it('arrToMap: makes values undefined if values are short', () => {
    const keys = [1, 2, 3, 4];
    const values = ['a', 'b', 'c'];
    const expected = new Map().set(1, 'a').set(2, 'b')
        .set(3, 'c').set(4, undefined);
    assert.deepStrictEqual(
        F.arrToMap(keys, values),
        expected
    );
  });

  it('remove: Remove n elements from the array starting at the given index', () => {
    assert.deepStrictEqual(
        F.remove(4, 3, F.numericInt), [[4, 5, 6], [0, 1, 2, 3, 7, 8, 9]]
    );
  });

  it('removeAtIndex: Remove a single element at index', () => {
    assert.deepStrictEqual(
        F.removeAtIndex(4, F.numericInt), [4, [0, 1, 2, 3, 5, 6, 7, 8, 9]]
    );
  });

  it('removeRandom: Remove a random single element from array', () => {
    const [removed, resultArr] = F.removeRandom(F.numericInt);

    // Check that the element has been removed
    assert.strictEqual(resultArr.indexOf(removed), -1);

    // Check the result is shorter by 1 than the original
    assert.strictEqual(resultArr.length, F.numericInt.length - 1);

    // Check removed was in the original, and original is not mutated
    assert.strictEqual(F.numericInt.indexOf(removed) >= 0, true);

    // Check that all elements in the result were in the original
    // (bar the removed element)
    F.numericInt.forEach(e => {
      if (e !== removed) {
        assert.strictEqual(resultArr.indexOf(e) >= 0, true);
      }
    })
  });

  it('push: Pushes, but returns the array not the pushed element.', () => {
    const original = [1, 2, 3];
    const expected = [1, 2, 3, 4];
    assert.deepStrictEqual(F.push(original, 4), expected);

    // Also check the original remains unchanged
    assert.deepStrictEqual([1, 2, 3], original);
  });

});

describe('Basic Object utils', () => {

  it('mergeDeep: merges 2 objects', () => {
    const obj1 = {a: {b: {c: [1, 2, 3]}}};
    const obj2 = {a: {d: 'new', b: {c: [4, 5, 6]}}, e: {f: [123]}};
    const expected = {
      "a": {
        "b": {
          "c": [1, 2, 3, 4, 5, 6]
        },
        "d": "new",
      },
      "e": {
        "f": [
          123
        ]
      }
    };
    return assert.deepStrictEqual(F.mergeDeep(obj1, obj2), expected);
  });

  it('mergeDeep: arrays are merged', () => {
    const obj1 = {a: [1, 2, 3]};
    const obj2 = {a: [4, 5, 6]};
    const expected = {a: [1, 2, 3, 4, 5, 6]};
    return assert.deepStrictEqual(F.mergeDeep(obj1, obj2), expected);
  });

  it('mergeDeep: second object trumps first if key exist in both', () => {
    const obj1 = {a: {b: {c: 'hello'}}};
    const obj2 = {a: {b: {c: 'I win'}}};
    const expected = {a: {b: {c: 'I win'}}};
    return assert.deepStrictEqual(F.mergeDeep(obj1, obj2), expected);
  });

  it('pathOr: gets a value from deep in an object', () => {
    const obj1 = {a: {b: {c: 'hello'}}};
    const findC = F.pathOr('default', ['a', 'b', 'c']);
    return assert.deepStrictEqual(findC(obj1), 'hello');
  });

  it('pathOr: can have a fallback default', () => {
    const obj1 = {a: {b: {c: 'hello'}}};
    const findE = F.pathOr('default', ['a', 'b', 'e']);
    return assert.deepStrictEqual(findE(obj1), 'default');
  });

  it('pathOr: can find elements in an array', () => {
    const obj1 = {a: {b: {c: [0, 1, [2, {d: 'here I am'}]]}}};
    const findE = F.pathOr('default', ['a', 'b', 'c', 2, 1, 'd']);
    return assert.deepStrictEqual(findE(obj1), 'here I am');
  });

  it('pathOr: converts string numbers to numbers when ' +
      'trying to find things in an array', () => {
    const obj1 = {a: {b: {c: [0, 1, [2, {d: 'here I am'}]]}}};
    const findE = F.pathOr('default', ['a', 'b', 'c', '2', '1', 'd']);
    return assert.deepStrictEqual(findE(obj1), 'here I am');
  });

  it('pathOr: matches when value is false', () => {
    const obj1 = {a: {b: {c: false}}};
    const findC = F.pathOr('default', ['a', 'b', 'c']);
    return assert.deepStrictEqual(findC(obj1), false);
  });

  it('pathOr: matches when value is null', () => {
    const obj1 = {a: {b: {c: null}}};
    const findC = F.pathOr('default', ['a', 'b', 'c']);
    return assert.deepStrictEqual(findC(obj1), null);
  });

  it('cloneObj: is a utility around Object.assign', () => {
    const obj1 = {a: {b: {c: [0, 1, [2, {d: 'here I am'}]]}}};
    const clone = F.cloneObj(obj1);
    return assert.deepStrictEqual(clone, obj1);
  });

  it('objToPaths: turns a multilevel object into a list of paths', () => {
    const data = {
      a: 1,
      b: 2,
      c: {
        d: 4,
        e: 5,
        f: {
          g: 7,
          h: 8
        }
      }
    };

    const expected = [
      [['a'], 1],
      [['b'], 2],
      [['c', 'd'], 4],
      [['c', 'e'], 5],
      [['c', 'f', 'g'], 7],
      [['c', 'f', 'h'], 8]
    ];

    const actual = F.objToPaths(data);
    return assert.deepStrictEqual(actual, expected);
  });

  it('visitObjDeep: calls a function on each value in a nested object', () => {
    const data = {
      a: 1,
      b: 2,
      c: {
        d: 4,
        e: 5,
        f: {
          g: 7,
          h: 8
        }
      }
    };

    const expected = {
      a: [1, 'Mutated'],
      b: [2, 'Mutated'],
      c: {
        d: [4, 'Mutated'],
        e: [5, 'Mutated'],
        f: {
          g: [7, 'Mutated'],
          h: [8, 'Mutated']
        }
      }
    }

    const actual = F.visitObjDeep(data, x => [x, 'Mutated']);
    return assert.deepStrictEqual(actual, expected);
  });


});


describe('Date and time utils', () => {

  it('assumeDateFromTs: assumes the date from a timestamp', () => {
    const nowSeconds = F.getNowSeconds();
    const nowFromSeconds = F.assumeDateFromTs(nowSeconds);
    const nowFromMilliseconds = F.assumeDateFromTs(nowSeconds * 1000);
    const tenSecAgo = F.assumeDateFromTs(-10);
    assert.strictEqual(
        Math.floor((tenSecAgo.getTime() / 1000)) + 10, nowSeconds);
    assert.deepStrictEqual(nowFromSeconds, nowFromMilliseconds);
  });

  it('assumeDateFromTs: assumes zero to be now', () => {
    assert.strictEqual(F.assumeDateFromTs(0).getTime(), new Date().getTime());
  });

  it('assumeDateFromTs: assumes negative numbers are seconds ago', () => {
    const secondsAgo = 1234;
    const nowSeconds = F.getNowSeconds();
    const tenSecAgo = F.assumeDateFromTs(-secondsAgo);
    assert.strictEqual(
        Math.floor((tenSecAgo.getTime() / 1000)) + secondsAgo, nowSeconds);
  });

});


describe('String related utils', () => {

  it('leftPadWithTo: left-pad a string with the given ' +
      'char to a total length of n', () => {
    const pad = F.leftPadWithTo('-', 10);
    assert.strictEqual(pad('hello'), '-----hello');
  });

  it('leftPadWithTo: only uses the first char. The rest are ignored', () => {
    const pad = F.leftPadWithTo('Multi Char', 10);
    assert.strictEqual(pad('hello'), 'MMMMMhello');
  });

  it('leftPadWithTo: is forgiving about the number passed in', () => {
    const pad = F.leftPadWithTo(' ', 10.2);
    assert.strictEqual(pad('hello'), '     hello');
  });

  it('onlyIncludes: checks that a string only contains ' +
      'elements from a. If it passes it returns the string, else false', () => {
    const only = F.onlyIncludes(['a', 'b', 'c']);
    assert.strictEqual(only('abc'), 'abc');
  });

  it('onlyIncludes: it fails with false', () => {
    const only = F.onlyIncludes(['a', 'b', 'c']);
    assert.strictEqual(only('abce'), false);
  });

  it('stripLeadingChar: make function that strips the leading ' +
      'char if it matches', () => {
    const stripSlash = F.stripLeadingChar('/');
    assert.strictEqual(stripSlash('/hello'), 'hello')
  });

  it('stripLeadingChar: does not strip if the leading char does ' +
      'not match', () => {
    const stripSlash = F.stripLeadingChar('/');
    assert.strictEqual(stripSlash('hello'), 'hello')
  });

  it('stripLeadingChar: can take a sub-string', () => {
    const stripSub = F.stripLeadingChar('sub-');
    assert.strictEqual(stripSub('sub-hello'), 'hello')
  });

  it('stripTrailingChar: strips a single trailing char', () => {
    const strip = F.stripTrailingChar(':');
    assert.strictEqual(strip('hello:'), 'hello')
  });

  it('stripTrailingChar: can take a sub-string', () => {
    const strip = F.stripTrailingChar(' there');
    assert.strictEqual(strip('hello there'), 'hello')
  });

  it('stripTrailingChar: strips nothing if the pattern is not found', () => {
    const strip = F.stripTrailingChar('/');
    assert.strictEqual(strip('hello'), 'hello')
  });

  it('toLowerCase: converts strings to lowercase', () => {
    assert.strictEqual(F.toLowerCase('HellO'), 'hello')
  });

  it('toLowerCase: is not safe', () => {
    assert.throws(() => F.toLowerCase({}), TypeError)
  });

  it('anyToLowerCase: is a safe version of toLowerCase', () => {
    assert.strictEqual(F.anyToLowerCase({}), '[object object]')
  });

  it('toUpperCase: converts strings to upper case', () => {
    assert.strictEqual(F.toUpperCase('HellO'), 'HELLO')
  });

  it('toUpperCase: is not safe', () => {
    assert.throws(() => F.toUpperCase({}), TypeError)
  });

  it('toString: converts to string', () => {
    assert.deepStrictEqual(F.toString(1), '1')
  });

  it('toNumber: converts to number', () => {
    assert.deepStrictEqual(F.toNumber('1e6'), 1000000)
  });

  it('stringReverse: reverses a string', () => {
    assert.deepStrictEqual(F.stringReverse('abc'), 'cba')
  });

  it('numReverse: reverses a number', () => {
    assert.deepStrictEqual(F.numReverse(123), 321)
  });

  it('numReverse: leading zeros', () => {
    assert.deepStrictEqual(F.numReverse(120), 21)
  });

  it('split: split a string at the given char', () => {
    const splitAtB = F.split('B');
    assert.deepStrictEqual(splitAtB('aBc'), ['a', 'c'])
  });

  it('replace: replace a given char or substring in a string', () => {
    const replaceB = F.replace('B', ' -replaced here- ');
    assert.deepStrictEqual(replaceB('aBc'), 'a -replaced here- c')
  });

  it('replace: only replaces the first occurrence', () => {
    const replaceB = F.replace('B', '1');
    assert.deepStrictEqual(replaceB('aBcB'), 'a1cB')
  });

  it('replaceAll: replaces all occurrences of a substring', () => {
    const replaceB = F.replaceAll('B', '1');
    assert.deepStrictEqual(replaceB('aBcB'), 'a1c1')
  });

  it('replaceAll: can replace multi chars with multi chars', () => {
    const replaceAAA = F.replaceAll('AAA', 'BCD');
    assert.deepStrictEqual(replaceAAA('aAAAAbAAAAcAAAA'), 'aBCDAbBCDAcBCDA')
  });

  it('join: joins an array of strings with the given char or substring', () => {
    const joinWithB = F.join('B');
    assert.deepStrictEqual(joinWithB(['a', 'c']), 'aBc')
  });

  it('join2: joins its arguments with the given char or substring', () => {
    const joinWithB = F.join2('B');
    assert.deepStrictEqual(joinWithB('a', 'c', 'd'), 'aBcBd')
  });

  it('append: append chart or substring to argument', () => {
    assert.deepStrictEqual(F.append('B', 'a'), 'aB')
  });

  it('alwaysAppend: append chart or substring to argument', () => {
    const appendB = F.alwaysAppend('B');
    assert.deepStrictEqual(appendB('a'), 'aB')
  });

  it('prepend: prepends chart or substring to argument', () => {
    const prependB = F.prepend('B');
    assert.deepStrictEqual(prependB('a'), 'Ba')
  });

  it('interleave: interleave a string with the joiner ' +
      '- starting with the joiner', () => {
    const interleaveP = F.interleave('|');
    assert.deepStrictEqual(interleaveP('hello'), '|h|e|l|l|o')
  });

  it('interleave2: interleave a string with the joiner ' +
      '- staring with the string', () => {
    const interleaveP = F.interleave2('|');
    assert.deepStrictEqual(interleaveP('hello'), 'h|e|l|l|o')
  });

  it('countSubString: Count occurrences of a substring', () => {
    const countTh = F.countSubString('th');
    assert.deepStrictEqual(countTh('the three truths'), 3)
  });

  it('lcp: Finds the longest common prefix in a set of strings', () => {
    assert.strictEqual(F.lcp('hello', 'helicopter'), 'hel')
  });

  it('lcp: Returns the empty string if nothing is passed in', () => {
    assert.strictEqual(F.lcp(), '')
  });

  it('lcp: Takes any number of arguments', () => {
    assert.strictEqual(F.lcp('hello', 'helm', 'helium', 'helix'), 'hel')
  });

  it('lcp: Returns the string as is when given only one argument', () => {
    assert.strictEqual(F.lcp('hello'), 'hello')
  });

});

describe('Number and math specific utils', () => {

  it('isSignedInt: return true if the number is a signed int', () => {
    assert.strictEqual(F.isSignedInt(1), true);
    assert.strictEqual(F.isSignedInt(-1234), true);
    assert.strictEqual(F.isSignedInt(+1234), true);
    assert.strictEqual(F.isSignedInt(1.0), true);
    assert.strictEqual(F.isSignedInt(1.01), false);
  });

  it('extrapolate: find a point on a line', () => {
    const pointOnLineAtX = F.extrapolate([0, 0], [3, 5]);
    assert.deepStrictEqual(pointOnLineAtX(3), [3, 5]);
    assert.deepStrictEqual(pointOnLineAtX(12), [12, 20]);
  });

  it('extrapolate: horizontal line', () => {
    const pointOnLineAtX = F.extrapolate([0, 0], [5, 0]);
    assert.deepStrictEqual(pointOnLineAtX(3), [3, 0]);
  });

  it('extrapolate: vertical lines are undefined', () => {
    const pointOnLineAtX = F.extrapolate([0, 0], [0, 5]);
    assert.deepStrictEqual(pointOnLineAtX(3), undefined);
  });

  it('toInt: fast (bitwise) conversion of float to integer', () => {
    const r = F.toInt(3.346);
    assert.strictEqual(r, 3)
  });

  it('toInt: takes the integer component of the float', () => {
    const r = F.toInt(3.999);
    assert.strictEqual(r, 3)
  });

  it('toInt: same for negative numbers', () => {
    const r = F.toInt(-3.999);
    assert.strictEqual(r, -3)
  });

  it('pRound: precision round', () => {
    const r = F.pRound(3);
    assert.strictEqual(r(2 / 3), 0.667)
  });

  it('pRound: round to int', () => {
    const r = F.pRound(0);
    assert.strictEqual(r(2 / 3), 1)
  });

  it('maybeNumber: return a number if you can - else ' +
      'whatever you were given', () => {
    assert.strictEqual(F.maybeNumber('123'), 123)
  });

  it('maybeNumber: handles exponents', () => {
    assert.strictEqual(F.maybeNumber('1e6'), 1000000)
  });

  it('maybeNumber: returns what it was given if it is not a number', () => {
    assert.strictEqual(F.maybeNumber('hello'), 'hello')
  });

  it('maybeNumber: handles undefined', () => {
    assert.strictEqual(F.maybeNumber(undefined), undefined)
  });

  it('maybeNumber: handles NaN', () => {
    assert.deepStrictEqual(Number.isNaN(F.maybeNumber(NaN)), true)
  });

  it('maybeNumber: handles null', () => {
    assert.deepStrictEqual(F.maybeNumber(null), null)
  });

  it('negate: inverts the boolean value', () => {
    assert.deepStrictEqual(F.negate(true), false)
  });

  it('negate: empty string is falsey', () => {
    assert.deepStrictEqual(F.negate(''), true)
  });

  it('negate: number zero (0) is falsey', () => {
    assert.deepStrictEqual(F.negate(0), true)
  });

  it('negate: null is falsey', () => {
    assert.deepStrictEqual(F.negate(null), true)
  });

  it('negate: NaN is falsey', () => {
    assert.deepStrictEqual(F.negate(NaN), true)
  });

  it('negate: undefined is falsey', () => {
    assert.deepStrictEqual(F.negate(undefined), true)
  });

  it('negate: empty array is truthy', () => {
    assert.deepStrictEqual(F.negate([]), false)
  });

  it('negate: empty object is truthy', () => {
    assert.deepStrictEqual(F.negate({}), false)
  });

  it('negate: the string "false" is truthy', () => {
    assert.deepStrictEqual(F.negate('false'), false)
  });

  it('negate: the string "0" is truthy', () => {
    assert.deepStrictEqual(F.negate('0'), false)
  });

  it('quote: a string is quoted if it contains the delimiter', () => {
    const s = 'Hello, there';
    const f = F.quote(',');
    assert.deepStrictEqual(f(s), '"Hello, there"')
  });

  it('quote: If s is not a string, it just falls through', () => {
    const s = 123.456;
    const f = F.quote(',');
    assert.deepStrictEqual(f(s), s)
  });

  it('quote: If s does not contain the delimiter, it just falls through', () => {
    const s = "Hello there";
    const f = F.quote(',');
    assert.deepStrictEqual(f(s), s)
  });

  it('divMod: the seed number is divided by the subsequent number', () => {
    const divTen = F.divMod(10);
    // divTen(3) = [3, 1] -> 10/3 = 3 carry 1

    assert.deepStrictEqual(divTen(3), [3, 1])
  });

  it('divMod2: the subsequent number is divided by the seed number', () => {
    const divByTen = F.divMod2(10);
    // divByTen(3) = [0, 3] -> 3/10 = 0 carry 3

    assert.deepStrictEqual(divByTen(3), [0, 3])
  });

  it('factorize: ', () => {
    assert.deepStrictEqual(F.factorize(5, 2, 3), 0.6)
  });

  it('luhn: checks a valid luhn', () => {
    assert.deepStrictEqual(F.luhn(35956805108414), [true, 6])
  });

  it('luhn: also accepts strings', () => {
    assert.deepStrictEqual(F.luhn('35956805108414'), [true, 6])
  });

  it('luhn: checks an invalid valid luhn', () => {
    assert.deepStrictEqual(F.luhn(35956805108413), [false, 5.9])
  });

  it('imeisvToImei: converts an IMEI-SV to an IMEI', () => {
    assert.deepStrictEqual(F.imeisvToImei(3595680510841401), '359568051084146')
  });

  it('imeisvToImei: also accepts string', () => {
    assert.deepStrictEqual(F.imeisvToImei('3595680510841401'), '359568051084146')
  });

  it('shannon: only accepts strings', () => {
    assert.deepStrictEqual(F.shannon('0123'), 2)
  });

  it('englishNumber: converts a number into english', () => {
    assert.deepStrictEqual(F.englishNumber(12), 'twelve')
  });

  it('englishNumber: handles large numbers', () => {
    assert.deepStrictEqual(F.englishNumber(1e6), 'one million')
  });

  it('englishNumber: handles negitive numbers', () => {
    assert.deepStrictEqual(
        F.englishNumber(-12345678),
        'negative twelve million, three hundred and forty five thousand, ' +
        'six hundred and seventy eight')
  });

  it('englishNumber: can not do fractions', () => {
    assert.deepStrictEqual(F.englishNumber(3.2), undefined)
  });

  it('didRiseThroughBoundary: detects rising boundary crossing', () => {
    const boundry = 36.12;
    const previous = 30;
    const current = 40;
    assert.strictEqual(F.didRiseThroughBoundary(boundry)(previous, current), true);
  });

  it('didRiseThroughBoundary: false if it was above and went up', () => {
    const boundry = 36.12;
    const previous = 37;
    const current = 40;
    assert.strictEqual(F.didRiseThroughBoundary(boundry)(previous, current), false);
  });

  it('didRiseThroughBoundary: false if it was below and stayed below', () => {
    const boundry = 36.12;
    const previous = 35;
    const current = 36;
    assert.strictEqual(F.didRiseThroughBoundary(boundry)(previous, current), false);
  });

  it('didRiseThroughBoundary: false if it was above and went below', () => {
    const boundry = 36.12;
    const previous = 37;
    const current = 36;
    assert.strictEqual(F.didRiseThroughBoundary(boundry)(previous, current), false);
  });

  it('didFallThroughBoundary: detects falling boundary crossing', () => {
    const boundry = 36.12;
    const previous = 40;
    const current = 30;
    assert.strictEqual(F.didFallThroughBoundary(boundry)(previous, current), true);
  });

  it('didFallThroughBoundary: false if it was below and went down', () => {
    const boundry = 36.12;
    const previous = 36;
    const current = 35;
    assert.strictEqual(F.didFallThroughBoundary(boundry)(previous, current), false);
  });

  it('didFallThroughBoundary: false if it was above and stayed above', () => {
    const boundry = 36.12;
    const previous = 37;
    const current = 36;
    assert.strictEqual(F.didRiseThroughBoundary(boundry)(previous, current), false);
  });

  it('didRiseThroughBoundary: false if it was below and went above', () => {
    const boundry = 36.12;
    const previous = 36;
    const current = 37;
    assert.strictEqual(F.didFallThroughBoundary(boundry)(previous, current), false);
  });

  it('didEnterBand: detects if a value is between two other values', () => {
    const upper = 30;
    const lower = 20;
    const testFunc = F.didEnterBand(upper, lower);
    let previous;
    let current;

    // Enter from above
    previous = 36;
    current = 25;
    assert.strictEqual(testFunc(previous, current), true);

    // Enter from below
    previous = 19;
    current = 25;
    assert.strictEqual(testFunc(previous, current), true);

    // Cross over whole band
    previous = 19;
    current = 36;
    assert.strictEqual(testFunc(previous, current), false);

    // Stay inside
    previous = 21;
    current = 22;
    assert.strictEqual(testFunc(previous, current), false);

    // Stay outside
    previous = 19;
    current = 18;
    assert.strictEqual(testFunc(previous, current), false);
  });

  it('didExitBand: detects if a value is between two other values', () => {
    const upper = 30;
    const lower = 20;
    const testFunc = F.didExitBand(upper, lower);
    let previous;
    let current;

    // Rising exit
    previous = 25;
    current = 36;
    assert.strictEqual(testFunc(previous, current), true);

    // Falling exit
    previous = 25;
    current = 19;
    assert.strictEqual(testFunc(previous, current), true);

    // Cross over whole band
    previous = 36;
    current = 19;
    assert.strictEqual(testFunc(previous, current), false);

    // Stay inside
    previous = 21;
    current = 22;
    assert.strictEqual(testFunc(previous, current), false);

    // Stay outside
    previous = 19;
    current = 18;
    assert.strictEqual(testFunc(previous, current), false);
  });

  it('haversine: computes km distance between geo points', () => {
    const cLat = 36.12;
    const cLon = -86.67;
    const pLat = 33.94;
    const pLon = -118.40;
    assert.strictEqual(F.haversine([cLat, cLon], [pLat, pLon]), 2887.26)
  });

  it('geoIsInside: true if point inside circular geo-fence', () => {
    const cLat = 0;
    const cLon = 0;
    const radius = 0.1; // Expressed as kilometers
    const isInside = F.geoIsInside([cLat, cLon], radius);

    let pLat;
    let pLon;

    pLat = 33.94;
    pLon = -118.40;
    assert.strictEqual(isInside([pLat, pLon]), false);

    pLat = 0;
    pLon = 0;
    assert.strictEqual(isInside([pLat, pLon]), true);

    pLat = 0;
    pLon = 0.0001;
    assert.strictEqual(isInside([pLat, pLon]), true);

    pLat = 0;
    pLon = 0.001;
    assert.strictEqual(isInside([pLat, pLon]), false);
  });

  it('geoFenceDidEnter: true for inward boundary crossing', () => {
    const cLat = 0;
    const cLon = 0;
    const centerPoint = [cLat, cLon];
    const radius = 0.1; // Expressed as kilometers
    const testDidEnter = F.geoFenceDidEnter(centerPoint, radius);
    let pPrev;
    let pCur;

    // Was inside, now outside
    pPrev = [0, 0];
    pCur = [1, 1];
    assert.strictEqual(testDidEnter(pPrev, pCur), false);

    // Was inside, stayed inside
    pPrev = [0, 0];
    pCur = [0.0001, 0.0001];
    assert.strictEqual(testDidEnter(pPrev, pCur), false);

    // Was outside, stayed outside
    pPrev = [2, 2];
    pCur = [1, 1];
    assert.strictEqual(testDidEnter(pPrev, pCur), false);

    // Was outside, now inside
    pPrev = [1, 1];
    pCur = [0, 0];
    assert.strictEqual(testDidEnter(pPrev, pCur), true);
  });

  it('geoFenceDidExit: true for outward boundary crossing', () => {
    const cLat = 0;
    const cLon = 0;
    const centerPoint = [cLat, cLon];
    const radius = 0.1; // Expressed as kilometers
    const testDidExit = F.geoFenceDidExit(centerPoint, radius);
    let pPrev;
    let pCur;

    // Was inside, now outside
    pPrev = [0, 0];
    pCur = [1, 1];
    assert.strictEqual(testDidExit(pPrev, pCur), true);

    // Was inside, stayed inside
    pPrev = [0, 0];
    pCur = [0.0001, 0.0001];
    assert.strictEqual(testDidExit(pPrev, pCur), false);

    // Was outside, stayed outside
    pPrev = [2, 2];
    pCur = [1, 1];
    assert.strictEqual(testDidExit(pPrev, pCur), false);

    // Was outside, now inside
    pPrev = [1, 1];
    pCur = [0, 0];
    assert.strictEqual(testDidExit(pPrev, pCur), false);
  });

  it('geoFenceRealWorld...', () => {
    const arr = [-26.182922, 28.11948, 30, -26.183341, 28.118475, -26.181599, 28.11805900000001];
    const [latF, lonF, rad, latC, lonC, latP, lonP] = arr;

    const pPoint = [latP, lonP]; // Previous position
    const cPoint = [latC, lonC]; // Current position

    const testInside = F.geoIsInside([latF, lonF], rad / 1000);
    const wasInside = testInside(pPoint);
    const nowInside = testInside(cPoint);

    const didEnter = !wasInside && nowInside;
    const didExit = wasInside && !nowInside;

  });

});

describe('Random Numbers and IDs', () => {

  it('idGen: A generator function to produce a count on each call', () => {
    const counter = F.idGen();
    assert.strictEqual(counter.next().value, 0);
    assert.strictEqual(counter.next().value, 1);
    assert.strictEqual(counter.next().value, 2);
    assert.strictEqual(counter.next().value, 3);
    assert.strictEqual(counter.next().value, 4);
    assert.strictEqual(counter.next().value, 5);
  });

  it('privateCounter: A function to produce a count on each call', () => {
    const counter = F.privateCounter();
    const counter2 = F.privateCounter();
    assert.strictEqual(counter(), 0);
    assert.strictEqual(counter2(), 0);
    assert.strictEqual(counter(), 1);
    assert.strictEqual(counter2(), 1);
    assert.strictEqual(counter(), 2);
    assert.strictEqual(counter2(), 2);
    assert.strictEqual(counter(), 3);
    assert.strictEqual(counter2(), 3);
    assert.strictEqual(counter(), 4);
    assert.strictEqual(counter2(), 4);
    assert.strictEqual(counter(), 5);
    assert.strictEqual(counter2(), 5);
  });

  it('privateRandom: A function to always return the same random ID', () => {
    const pRand1 = F.privateRandom();
    const result = pRand1();
    const counter = F.privateCounter();
    const count = 10000;
    while (counter() < count) {
      assert.strictEqual(pRand1(), result);
    }

  });

  it('randomId: Generates a random ID random ID', () => {
    const counter = F.privateCounter();
    const count = 10000;
    const seen = [];
    while (counter() < count) {
      const id = F.randomId();
      assert.strictEqual(seen.includes(id), false);
      seen.push(id);
    }
  });

  it('randIntBetween: Default is an integer between 0 and 10(excl)', () => {
    const min = 0;
    const max = 10;
    const randIntFunc = F.randIntBetween();
    const counter = F.privateCounter();
    const count = 10000;
    while (counter() < count) {
      assert.strictEqual(min <= randIntFunc() < max, true);
    }
  });

  it('randIntBetween: Accepts limits', () => {
    const min = 12;
    const max = 23;
    const randIntFunc = F.randIntBetween(min, max);
    const counter = F.privateCounter();
    const count = 10000;
    while (counter() < count) {
      const rand = randIntFunc();
      assert.strictEqual(((min <= rand) && (rand < max)), true);
    }
  });

  it('randSign: Randomly return either -1 of 1', () => {
    const counter = F.privateCounter();
    const count = 10000;
    while (counter() < count) {
      const s = F.randSign();
      assert.strictEqual(s === -1 || s === 1, true);
    }
  });


});


describe('HEX manipulation', () => {

  const hexStr = 'AE4EE51905A95C63C03D90880B718F6E';
  const byteArr = [
    174, 78, 229, 25, 5, 169, 92, 99,
    192, 61, 144, 136, 11, 113, 143, 110];

  it('hexToByteArray: Convert Hex string to array of numbers', () => {
    const arr = F.hexToByteArray(hexStr);
    assert.strictEqual(F.sameArr(arr, byteArr), true);
  });

  it('byteArrayToHex: Convert array of numbers into hex string', () => {
    const hexString = F.byteArrayToHex(byteArr);
    assert.strictEqual(hexString, hexStr);
  });


});

describe('UTF8 Byte array manipulation', () => {

  const byteArr = [226, 130, 172];
  const utf8String = '€';

  it('stringToUtf8ByteArray: Convert string to array of numbers', () => {

    const res = F.stringToUtf8ByteArray(utf8String);
    assert.strictEqual(F.sameArr(res, byteArr), true);
  });

  it('utf8ByteArrayToString: Convert byte array to a string', () => {
    const str = F.utf8ByteArrayToString(byteArr);
    assert.strictEqual(str, utf8String);
  });

});

describe('Bit Banging', () => {

  it('numToBinString: given a number return a string of 0,1s', () => {
    assert.deepStrictEqual(F.numToBinString(0), '0');
    assert.deepStrictEqual(F.numToBinString(1), '1');
    assert.deepStrictEqual(F.numToBinString(2), '10');
    assert.deepStrictEqual(F.numToBinString(3), '11');
    assert.deepStrictEqual(F.numToBinString(255), '11111111');
    assert.deepStrictEqual(F.numToBinString(9876543210), '1001001100101100000001011011101010');
  });

  it('binStringToNum: a string of 0 and 1 is converted to a number', () => {
    assert.deepStrictEqual(F.binStringToNum('0'), 0);
    assert.deepStrictEqual(F.binStringToNum('1'), 1);
    assert.deepStrictEqual(F.binStringToNum('10'), 2);
    assert.deepStrictEqual(F.binStringToNum('11'), 3);
    assert.deepStrictEqual(F.binStringToNum('11111111'), 255);
    assert.deepStrictEqual(F.binStringToNum('10101100'), 172);
    assert.deepStrictEqual(F.binStringToNum('1001001100101100000001011011101010'), 9876543210);
  });

  it('getBitAt: get either a 0 or a 1 from the position in the number', () => {
    assert.deepStrictEqual(F.getBitAt(172, 0), 0);
    assert.deepStrictEqual(F.getBitAt(172, 1), 0);
    assert.deepStrictEqual(F.getBitAt(172, 2), 1);
    assert.deepStrictEqual(F.getBitAt(172, 3), 1);
    assert.deepStrictEqual(F.getBitAt(172, 4), 0);
    assert.deepStrictEqual(F.getBitAt(172, 5), 1);
    assert.deepStrictEqual(F.getBitAt(172, 6), 0);
    assert.deepStrictEqual(F.getBitAt(172, 7), 1);
  });

  it('setBitAt: Sets the bit in the number and returns the resultant number', () => {
    assert.deepStrictEqual(F.setBitAt(172, 0), 173);
    assert.deepStrictEqual(F.setBitAt(172, 1), 174);
    assert.deepStrictEqual(F.setBitAt(172, 2), 172);
    assert.deepStrictEqual(F.setBitAt(172, 3), 172);
    assert.deepStrictEqual(F.setBitAt(172, 4), 188);
    assert.deepStrictEqual(F.setBitAt(172, 5), 172);
    assert.deepStrictEqual(F.setBitAt(172, 6), 236);
    assert.deepStrictEqual(F.setBitAt(172, 7), 172);
  });

  it('clearBitAt: Sets the bit at n to zero', () => {
    assert.deepStrictEqual(F.clearBitAt(255, 0), 254);
    assert.deepStrictEqual(F.clearBitAt(255, 1), 253);
    assert.deepStrictEqual(F.clearBitAt(255, 2), 251);
    assert.deepStrictEqual(F.clearBitAt(255, 3), 247);
    assert.deepStrictEqual(F.clearBitAt(255, 4), 239);
    assert.deepStrictEqual(F.clearBitAt(255, 5), 223);
    assert.deepStrictEqual(F.clearBitAt(255, 6), 191);
    assert.deepStrictEqual(F.clearBitAt(255, 7), 127);
  });

  it('invBitAt: Inverts the bit at the given position', () => {
    assert.deepStrictEqual(F.invBitAt(8, 0), 9);
    assert.deepStrictEqual(F.invBitAt(8, 1), 10);
    assert.deepStrictEqual(F.invBitAt(8, 2), 12);
  });

  it('hasBitAt: Checks if the bit at postion is set', () => {
    assert.strictEqual(F.hasBitAt(8, 0), false);
    assert.strictEqual(F.hasBitAt(8, 1), false);
    assert.strictEqual(F.hasBitAt(8, 2), false);
    assert.strictEqual(F.hasBitAt(8, 3), true);
  });

  it('zeroOut32: Zero out the lower bits of a 32-bit number', () => {
    // Be aware. This works with and returns unsigned int32 by force!

    const given = F.binStringToNum('10101010101010101010101010101010');
    const expect = F.binStringToNum('10101010101010000000000000000000');
    const keep = 13; // Keep the first 13 bits of the given number
    assert.strictEqual(F.zeroOut32(given, keep), expect);
  });


});


describe('IPv4 Address manipulation', () => {
  const ipV4Address = '10.207.219.251';
  const ipV4int = 181394427;

  it('ipv4ToInt2: Convert ipv4 string to int', () => {
    assert.strictEqual(F.ipv4ToInt2(ipV4Address), ipV4int);
  });

  it('intToIpv4: Convert int to ipv4 string', () => {
    assert.strictEqual(F.intToIpv4(ipV4int), ipV4Address);
  });

  it('canonicalIpv4Pool: Convert a poorly formed IP pool definition into its canonical form', () => {
    const test = ([k, v]) => assert.strictEqual(F.canonicalIpv4Pool(k), v);
    const ipMap = {
      '87.70.141.1/22': '87.70.140.0/22',
      '36.18.154.103/12': '36.16.0.0/12',
      '62.62.197.11/29': '62.62.197.8/29',
      '67.137.119.181/4': '64.0.0.0/4',
      '161.214.74.21/24': '161.214.74.0/24',
      '184.232.176.184/18': '184.232.128.0/18',
      '10.207.219.251/32': '10.207.219.251/32',
      '10.207.219.251': '10.207.219.251/32',
      '110.200.21/4': '96.0.0.0/4',
      '10..55/8': '10.0.0.0/8',
      '10.../8': '10.0.0.0/8',
    };
    [...Object.entries(ipMap)].forEach(test);
  });


});






