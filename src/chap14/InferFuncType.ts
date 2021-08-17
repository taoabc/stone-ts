import { UnknownTypeEx } from './InferTypes';
import { DefStmntEx3 } from './TypeChecker';
import { TypeEnv } from './TypeEnv';
import { TypeInfo } from './TypeInfo';

export class DefStmntEx4 extends DefStmntEx3 {
  typeCheck(tenv: TypeEnv): TypeInfo {
    const func = super.typeCheck(tenv).toFunctionType();
    for (const t of func!.parameterTypes) {
      this.fixUnknown(t);
    }
    this.fixUnknown(func!.returnType);
    return func!;
  }
  fixUnknown(t: TypeInfo) {
    if (t.isUnknownType()) {
      const ut = t.toUnknownType() as UnknownTypeEx;
      if (!ut.resolved()) ut.setType(TypeInfo.ANY);
    }
  }
}
