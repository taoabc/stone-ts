import { ASTreeOptEx, BinaryEx2, NameEx } from '../chap11/EnvOptimizer';
import { IfEx } from '../chap6/BasicEvaluator';
import { BlockEx, NumberEx, StringEx } from '../chap6/BasicEvaluator';
import { PrimaryEx } from '../chap7/FuncEvaluator';
import { NativeArgEx } from '../chap8/NativeEvaluator';
import { NegativeExpr } from '../stone/ast/NegativeExpr';
import { NullStmnt } from '../stone/ast/NullStmnt';
import { Postfix } from '../stone/ast/Postfix';
import { WhileStmnt } from '../stone/ast/WhileStmnt';
import { astFactory } from '../utils/ASTFactory';
import { DefStmntEx2, ParamListEx, VarStmntEx } from './TypedEvaluator';
import { TypeEnv } from './TypeEnv';
import { TypeException } from './TypeException';
import { FunctionType, TypeInfo } from './TypeInfo';

export class ASTreeTypeEx extends ASTreeOptEx {
  typeCheck(_tenv: TypeEnv): TypeInfo {
    throw new Error('typeCheck should be impl');
  }
}
export class NumberEx2 extends NumberEx {
  typeCheck(_tenv: TypeEnv): TypeInfo {
    return TypeInfo.INT;
  }
}
export class StringEx2 extends StringEx {
  typeCheck(_tenv: TypeEnv): TypeInfo {
    return TypeInfo.STRING;
  }
}
export class NameEx2 extends NameEx {
  protected type?: TypeInfo;
  typeCheck(tenv: TypeEnv): TypeInfo {
    const type = tenv.get(this.nest, this.index);
    if (type == null)
      throw new TypeException('undefined name: ' + this.name(), this);
    else {
      this.type = type;
      return type;
    }
  }
  typeCheckForAssign(tenv: TypeEnv, valueType: TypeInfo): TypeInfo {
    const type = tenv.get(this.nest, this.index);
    if (type == null) {
      this.type = valueType;
      tenv.put(0, this.index, valueType);
      return valueType;
    } else {
      this.type = type;
      valueType.assertSubtypeOf(this.type, tenv, this);
      return this.type;
    }
  }
}
export class NegativeEx extends NegativeExpr {
  typeCheck(tenv: TypeEnv): TypeInfo {
    const t = (this.operand() as ASTreeTypeEx).typeCheck(tenv);
    t.assertSubtypeOf(TypeInfo.INT, tenv, this);
    return TypeInfo.INT;
  }
}
export class BinaryEx extends BinaryEx2 {
  protected leftType?: TypeInfo;
  protected rightType?: TypeInfo;
  typeCheck(tenv: TypeEnv): TypeInfo {
    const op = this.operator();
    if ('=' === op) return this.typeCheckForAssign(tenv);
    else {
      this.leftType = (this.left() as ASTreeTypeEx).typeCheck(tenv);
      this.rightType = (this.right() as ASTreeTypeEx).typeCheck(tenv);
      if ('+' === op) return this.leftType.plus(this.rightType, tenv);
      else if ('==' === op) return TypeInfo.INT;
      else {
        this.leftType.assertSubtypeOf(TypeInfo.INT, tenv, this);
        this.rightType.assertSubtypeOf(TypeInfo.INT, tenv, this);
        return TypeInfo.INT;
      }
    }
  }
  protected typeCheckForAssign(tenv: TypeEnv): TypeInfo {
    this.rightType = (this.right() as ASTreeTypeEx).typeCheck(tenv);
    const le = this.left();
    if (le instanceof NameEx2)
      return le.typeCheckForAssign(tenv, this.rightType);
    else throw new TypeException('bad assignment', this);
  }
}
export class BlockEx2 extends BlockEx {
  public type?: TypeInfo;
  typeCheck(tenv: TypeEnv): TypeInfo {
    this.type = TypeInfo.INT;
    for (const t of this.children()) {
      if (!(t instanceof NullStmnt))
        this.type = (t as ASTreeTypeEx).typeCheck(tenv);
    }
    return this.type;
  }
}
export class IfEx14 extends IfEx {
  typeCheck(tenv: TypeEnv): TypeInfo {
    const condType = (this.condition() as ASTreeTypeEx).typeCheck(tenv);
    condType.assertSubtypeOf(TypeInfo.INT, tenv, this);
    const thenType = (this.thenBlock() as ASTreeTypeEx).typeCheck(tenv);
    let elseType;
    const elseBk = this.elseBlock();
    if (elseBk == null) elseType = TypeInfo.INT;
    else elseType = (elseBk as ASTreeTypeEx).typeCheck(tenv);
    return thenType.union(elseType, tenv);
  }
}
export class WhileEx extends WhileStmnt {
  typeCheck(tenv: TypeEnv): TypeInfo {
    const condType = (this.condition() as ASTreeTypeEx).typeCheck(tenv);
    condType.assertSubtypeOf(TypeInfo.INT, tenv, this);
    const bodyType = (this.body() as ASTreeTypeEx).typeCheck(tenv);
    return bodyType.union(TypeInfo.INT, tenv);
  }
}
export class DefStmntEx3 extends DefStmntEx2 {
  protected funcType?: FunctionType;
  protected bodyEnv?: TypeEnv;
  typeCheck(tenv: TypeEnv): TypeInfo {
    const params = (this.parameters() as ParamListEx2).types();
    const retType = TypeInfo.get(this.type());
    this.funcType = TypeInfo.function(retType, ...params);
    const oldType = tenv.put(0, this.index, this.funcType);
    if (oldType != null)
      throw new TypeException('function redefinition: ' + this.name(), this);
    this.bodyEnv = new TypeEnv(this.size, tenv);
    for (let i = 0; i < params.length; i++) this.bodyEnv.put(0, i, params[i]);
    const bodyType = (this.body() as BlockEx2).typeCheck(this.bodyEnv);
    bodyType.assertSubtypeOf(retType, tenv, this);
    return this.funcType;
  }
}
export class ParamListEx2 extends ParamListEx {
  types(): TypeInfo[] {
    const s = this.size();
    const result: TypeInfo[] = [];
    for (let i = 0; i < s; i++) result.push(TypeInfo.get(this.typeTag(i)));
    return result;
  }
}
export class PrimaryEx2 extends PrimaryEx {
  typeCheck(tenv: TypeEnv): TypeInfo {
    return this.typeCheckNest(tenv, 0);
  }
  typeCheckNest(tenv: TypeEnv, nest: number): TypeInfo {
    if (this.hasPostfix(nest)) {
      const target = this.typeCheckNest(tenv, nest + 1);
      return (this.postfix(nest) as PostfixEx).typeCheck(tenv, target);
    } else return (this.operand() as ASTreeTypeEx).typeCheck(tenv);
  }
}
export class PostfixEx extends Postfix {
  typeCheck(_tenv: TypeEnv, _target: TypeInfo): TypeInfo {
    throw new TypeException('shout be impl for Postfix', this);
  }
}
export class ArgumentsEx extends NativeArgEx {
  protected argTypes: TypeInfo[] = [];
  protected funcType?: FunctionType;
  typeCheck(tenv: TypeEnv, target: TypeInfo) {
    if (!(target instanceof FunctionType))
      throw new TypeException('bad function', this);
    this.funcType = target as FunctionType;
    const params = this.funcType.parameterTypes;
    if (this.size() !== params.length)
      throw new TypeException('bad number of arguments', this);
    this.argTypes = new Array(params.length);
    let num = 0;
    for (const a of this.children()) {
      const t = (this.argTypes[num] = (a as ASTreeTypeEx).typeCheck(tenv));
      t.assertSubtypeOf(params[num++], tenv, this);
    }
    return this.funcType.returnType;
  }
}
export class VarStmntEx2 extends VarStmntEx {
  protected varType?: TypeInfo;
  protected valueType?: TypeInfo;
  typeCheck(tenv: TypeEnv): TypeInfo {
    if (tenv.get(0, this.index) != null)
      throw new TypeException('duplicate variable: ' + this.name(), this);
    this.varType = TypeInfo.get(this.type());
    tenv.put(0, this.index, this.varType);
    this.valueType = (this.initializer() as ASTreeTypeEx).typeCheck(tenv);
    this.valueType.assertSubtypeOf(this.varType, tenv, this);
    return this.varType;
  }
}

export function EnableTypeChecker(): void {
  astFactory.setLeaf(NumberEx2, StringEx2, NameEx2);
  astFactory.setList(
    NegativeEx,
    BinaryEx,
    BlockEx2,
    IfEx14,
    WhileEx,
    DefStmntEx3,
    ParamListEx2,
    PrimaryEx2,
    PostfixEx,
    ArgumentsEx,
    VarStmntEx2
  );
}
