import { Symbols } from '../chap11/Symbols';
import { Environment } from '../chap6/Environment';
import { ClassInfo } from '../chap9/ClassInfo';
import { ClassStmnt } from '../stone/ast/ClassStmnt';
import { DefStmnt } from '../stone/ast/DefStmnt';
import { OptMethod } from './OptMethod';
import { OptStoneObject } from './OptStoneObject';

export class OptClassInfo extends ClassInfo {
  protected methodDefs: DefStmnt[] = [];
  constructor(
    cs: ClassStmnt,
    env: Environment,
    protected methods: Symbols,
    protected fields: Symbols
  ) {
    super(cs, env);
  }
  size(): number {
    return this.fields.size();
  }
  superClass(): OptClassInfo {
    return this._superClass as OptClassInfo;
  }
  copyTo(f: Symbols, m: Symbols, mlist: DefStmnt[]): void {
    f.append(this.fields);
    m.append(this.methods);
    for (const def of this.methodDefs) {
      mlist.push(def);
    }
  }
  fieldIndex(name: string): number | undefined {
    return this.fields.find(name);
  }
  methodIndex(name: string): number | undefined {
    return this.methods.find(name);
  }
  method(self: OptStoneObject, index: number): unknown {
    const def = this.methodDefs[index];
    return new OptMethod(
      def.parameters(),
      def.body(),
      this.environment(),
      (def as DefStmntEx2).locals(),
      self
    );
  }
  setMethods(methods: DefStmnt[]): void {
    this.methodDefs = methods;
  }
}
