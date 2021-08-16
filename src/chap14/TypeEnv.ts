import { StoneException } from '../stone/StoneException';
import { TypeInfo } from './TypeInfo';

export class TypeEnv {
  protected types: TypeInfo[];
  constructor(size: number = 8, protected outer: TypeEnv | null = null) {
    this.types = new Array(size);
  }
  get(nest: number, index: number): TypeInfo | null {
    if (nest === 0)
      if (index < this.types.length) return this.types[index];
      else return null;
    else if (this.outer == null) return null;
    else return this.outer.get(nest - 1, index);
  }
  put(nest: number, index: number, value: TypeInfo): TypeInfo | null {
    let oldValue;
    if (nest === 0) {
      this.access(index);
      oldValue = this.types[index];
      this.types[index] = value;
      return oldValue;
    } else if (this.outer == null)
      throw new StoneException('no outer type environment');
    else return this.outer.put(nest - 1, index, value);
  }
  protected access(index: number): void {
    // grow, but nothing todo with nodejs
    // if (index >= types.length) {
    //   int newLen = types.length * 2;
    //   if (index >= newLen)
    //     newLen = index + 1;
    //   types = Arrays.copyOf(types, newLen);
    // }
  }
}
