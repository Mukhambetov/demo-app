const debug = require('debug')('GRYADKI:EXPRESSION');

const { get, isNil, set } = require('lodash');

const isExpression = (value) => value instanceof Array;

const fn = {
  '=': ([a, b]) => a === b,
  '!=': ([a, b]) => a !== b,
  '+': ([a, b]) => a + b,
  '-': ([a, b]) => a - b,
  '>': ([a, b]) => a > b,
  '>=': ([a, b]) => a >= b,
  '<': ([a, b]) => a < b,
  '<=': ([a, b]) => a <= b,
  get: ([a, def], context) => get(context.payload, a, def),
  case: (a) => {
    let result = a[a.length - 1];
    for (let i = 0; i < (a.length - 1); i += 2) {
      if (a[i]) {
        result = a[i + 1];
        break;
      }
    }
    return result;
  },
  coalesce: (a) => {
    let result;
    let i = 0;
    while (isNil(result) && i < a.length) {
      result = a[i];
      i += 1;
    }
    return result;
  },
  all: (a) => {
    let result = true;
    for (let i = 0; i < a.length - 1; i += 1) {
      result = result && !!a[i];
      if (!result) {
        break;
      }
    }
    return result;
  },
  any: (a) => {
    let result = false;
    for (let i = 0; i < a.length; i += 1) {
      result = result || !!a[i];
      if (result) {
        break;
      }
    }
    return result;
  },
  serve: ([serviceMethod, ...args], context) => {
    const func = get(context.services, serviceMethod, () => null);
    return func(...args);
  },
  set: ([val, path], context) => {
    set(context, path, val);
    return true;
  },
};
const invoke = async (context, expression, os = false) => {
  if (!isExpression(expression)) {
    return expression;
  }
  const [operand, ...values] = expression;
  let evaluatedValues;
  if (os) {
    evaluatedValues = await values.reduce(async (prev, v) => {
      const result = await prev;
      const res = await invoke(context, v, os);
      return [...result, res];
    }, Promise.resolve([]));
  } else {
    evaluatedValues = await Promise.all(values.map((v) => invoke(context, v)));
  }
  const result = await fn[operand](evaluatedValues, context);
  debug(operand, values, result);
  return result;
};
module.exports = {
  invoke,
};
// (async () => {
//   const result = await invoke({
//     payload: { a: 1, b: 2, c: 3 },
//     services: {
//       math: {
//         sum: async (a, b) => Promise.resolve(a + b),
//         dif: async (a, b) => Promise.resolve(a - b),
//       },
//     },
//   }, [
//     'all',
//     ['+', ['serve', 'math.sum', ['get', 'a'], ['get', 'b']], ['serve', 'math.dif', 9, 8]],
//     ['set', 10, 'payload.a'],
//     ['+', ['serve', 'math.sum', ['get', 'a'], ['get', 'b']], ['serve', 'math.dif', 9, 8]],
//   ]);
// })();
