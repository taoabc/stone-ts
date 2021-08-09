import { Environment } from '../chap6/Environment';
import { Dot } from '../stone/ast/Dot';
import { StoneException } from '../stone/StoneException';
import { astFactory } from '../utils/ASTFactory';
import { AssignEx, DotEx } from './ObjOptimizer';
import { OptClassInfo } from './OptClassInfo';
import { OptStoneObject } from './OptStoneObject';

export class DotEx2 extends DotEx {
  protected classInfo?: OptClassInfo;
  protected isField?: boolean;
  protected index?: number;

  eval(env: Environment, value: unknown): unknown {
    if (value instanceof OptStoneObject) {
      const target = value;
      if (target.classInfo() != this.classInfo) this.updateCache(target);
      if (this.isField) return target.readIndex(this.index!);
      else return target.method(this.index!);
    } else return super.eval(env, value);
  }
  updateCache(target: OptStoneObject) {
    const member = this.name();
    this.classInfo = target.classInfo();
    let i = this.classInfo.fieldIndex(member);
    if (i != null) {
      this.isField = true;
      this.index = i;
      return;
    }
    i = this.classInfo.methodIndex(member);
    if (i != null) {
      this.isField = false;
      this.index = i;
      return;
    }
    throw new StoneException('bad member access: ' + member, this);
  }
}
export class AssignEx2 extends AssignEx {
  protected classInfo?: OptClassInfo;
  protected index?: number;
  setField(obj: OptStoneObject, expr: Dot, rvalue: unknown): unknown {
    if (obj.classInfo() != this.classInfo) {
      const member = expr.name();
      this.classInfo = obj.classInfo();
      const i = this.classInfo.fieldIndex(member);
      if (i == null)
        throw new StoneException('bad member access: ' + member, this);
      this.index = i;
    }
    obj.writeIndex(this.index!, rvalue);
    return rvalue;
  }
}

export function EnableInlineCache(): void {
  astFactory.setList(AssignEx2, DotEx2);
}
