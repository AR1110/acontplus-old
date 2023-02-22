



/**
 * S de Source: El tipo del origen
 * T de Target: El tipo del destino
 */

export abstract class Mapper<S, T> {
  abstract mapFrom(param: S): T;
  abstract mapTo(param: T): S;
}
