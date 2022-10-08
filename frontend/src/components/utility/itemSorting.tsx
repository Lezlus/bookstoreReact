import { Decimal } from 'decimal.js';

type SortTypes = 'sortByName' | 'sortByNameReversed' | 'sortByPrice' | 'sortByPriceReversed' 
| 'reverse' | 'defaultReversed' | 'default';
type SortObjectType = {
  type: SortTypes
}

function compareAlphabetically(a: string, b: string): number {
  if (a.localeCompare(b) < 0) {
    return -1
  } else if (a.localeCompare(b) > 0) {
    return 1
  }
  return 0
}

function compareDate(a: Date, b: Date): number {
  let date1 = a.toISOString();
  let date2 = b.toISOString();

  if (date1.localeCompare(date2) < 0) {
    return -1
  } else if (date1.localeCompare(date2) > 0) {
    return 1
  }
  return 0
}

function comparePrice(a: string, b: string): number {
  let price1 = new Decimal(a);
  let price2 = new Decimal(b);
  return price1.comparedTo(price2);
}

function customSortArray<T>(array: T[], callbackFn: (a: T, b: T) => number): T[] {
  let arrayCopy = [...array];
  arrayCopy.sort(callbackFn);
  return arrayCopy;
}

function customSortArrayReversed<T>(array: T[], callbackFn: (a: T, b: T) => number): T[] {
  let arrayCopy = [...array];
  arrayCopy.sort(callbackFn).reverse();
  return arrayCopy;
}

export { SortObjectType, compareAlphabetically, comparePrice, compareDate, customSortArray, customSortArrayReversed }