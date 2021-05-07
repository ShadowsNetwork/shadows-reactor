/* eslint-disable no-unused-vars */

/**
 * The order of the typical case: 2 -> 4 -> 0
 */
export enum PolyTransactionStatus {
  FINISHED = 0,
  PENDING = 1,
  SOURCE_DONE = 2,
  SOURCE_CONFIRMED = 3,
  POLY_CONFIRMED = 4
}
