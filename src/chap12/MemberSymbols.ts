import { Location, Symbols } from '../chap11/Symbols';

export class MemberSymbols extends Symbols {
  static METHOD = -1;
  static FILED = -2;
  constructor(outer: Symbols, protected type: number) {
    super();
  }
  getNest(key: string, nest: number): Location | null {
    const index = this.table.get(key);
    if (index == null) {
      if (this.outer == null) return null;
      else return this.outer.getNest(key, nest);
    } else return new Location(this.type, index);
  }
  put(key: string): Location {
    const loc = this.getNest(key, 0);
    if (loc == null) {
      return new Location(this.type, this.add(key));
    } else return loc;
  }
}
