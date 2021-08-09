import { Location, Symbols } from '../chap11/Symbols';
import { StoneException } from '../stone/StoneException';

export class SymbolThis extends Symbols {
  static NAME: string = 'this';
  constructor(outer: Symbols) {
    super(outer);
    this.add(SymbolThis.NAME);
  }
  putNew(key: string): number {
    throw new StoneException('fatal');
  }
  put(key: string): Location {
    if (!this.outer) throw new StoneException('symbol this has no outer!');
    const loc = this.outer.put(key);
    if (loc.nest >= 0) loc.nest++;
    return loc;
  }
}
