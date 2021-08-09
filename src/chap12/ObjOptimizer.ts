import { EnvEx2 } from '../chap11/EnvOptimizer';
import { Symbols } from '../chap11/Symbols';
import { Environment } from '../chap6/Environment';
import { ClassStmnt } from '../stone/ast/ClassStmnt';
import { DefStmnt } from '../stone/ast/DefStmnt';
import { MemberSymbols } from './MemberSymbols';
import { OptClassInfo } from './OptClassInfo';
import { SymbolThis } from './SymbolThis';

export class ClassStmntEx extends ClassStmnt {
  lookup(syms: Symbols): void {}
  eval(env: Environment): unknown {
    const methodNames = new MemberSymbols(
      (env as EnvEx2).symbols(),
      MemberSymbols.METHOD
    );
    const fieldNames = new MemberSymbols(methodNames, MemberSymbols.FILED);
    const ci = new OptClassInfo(this, env, methodNames, fieldNames);
    (env as EnvEx2).put(this.name(), ci);
    const methods: DefStmnt[] = new Array();
    if (ci.superClass() != null)
      ci.superClass().copyTo(fieldNames, methodNames, methods);
    const newSyms = new SymbolThis(fieldNames);
    (this.body() as ClassBodyEx).lookup(
      newSyms,
      methodNames,
      fieldNames,
      methods
    );
    ci.setMethod(methods);
    return this.name();
  }
}
