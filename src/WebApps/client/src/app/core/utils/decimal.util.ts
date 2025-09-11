import Decimal from 'decimal.js';
/**
 *
 * @param {*} num
 * @param {*} max por defecto 0
 * @returns
 */
function instanceDecimal<T>(num: number, max = 0) {
  if (max > 0) {
    return new Decimal(num).toDecimalPlaces(max).toNumber() as T;
  }
  return new Decimal(num) as T;
}

/**
 *
 * @param {*} num1
 * @param {*} num2
 * @param {*} max
 * @returns
 */
function plus<T>(num1: number, num2: number, max = 0) {
  const instanceDecimal = new Decimal(num1).plus(num2);
  if (max > 0) {
    return instanceDecimal.toDecimalPlaces(max).toNumber();
  }

  return instanceDecimal as T;
}
/**
 *
 * @param {*} num1
 * @param {*} num2
 * @param {*} max
 * @returns
 */

function minus<T>(num1: number, num2: number, max = 0) {
  const instanceDecimal = new Decimal(num1).minus(num2);
  if (max > 0) {
    return instanceDecimal.toDecimalPlaces(max).toNumber() as T;
  }

  return instanceDecimal;
}

function mul<T>(num1: number, num2: number, max = 0) {
  const instanceDecimal = new Decimal(num1).mul(num2);
  if (max > 0) {
    return instanceDecimal.toDecimalPlaces(max).toNumber();
  }

  return instanceDecimal as T;
}

function div(num1: number, num2: number, max = 0) {
  const instanceDecimal = new Decimal(num1).div(num2);
  if (max > 0) {
    return instanceDecimal.toDecimalPlaces(max).toNumber();
  }

  return instanceDecimal;
}

export { instanceDecimal, plus, minus, div, mul };
