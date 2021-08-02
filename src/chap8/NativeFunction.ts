import { ASTree } from '../stone/ast/ASTree';
import { StoneException } from '../stone/StoneException';

export type NativeFunctionFn = (...args: unknown[]) => unknown;

export class NativeFunction {
  constructor(protected name: string, protected method: NativeFunctionFn) {}
  toString(): string {
    return '<native:' + this + '>';
  }
  invoke(args: unknown[], tree: ASTree) {
    try {
      return this.method.apply(null, args);
    } catch (e) {
      throw new StoneException('bad native function call: ' + this.name, tree);
    }
  }
}
