import { ASTree } from '../stone/ast/ASTree';
import { TypeEnv } from './TypeEnv';
import { TypeInfo, UnknownType } from './TypeInfo';

export class TypeInfoEx extends TypeInfo {
  assertSubtypeOf(type: TypeInfo, tenv: TypeEnv, where: ASTree): void {
    if (type.isUnknownType())
      type.toUnknownType()?.assertSubtypeOf(this, tenv, where);
    else super.assertSubtypeOf(type, tenv, where);
  }
  union(right: TypeInfo, tenv: TypeEnv): TypeInfo {
    if (right.isUnknownType()) return right.union(this, tenv);
    else return super.union(right, tenv);
  }
  plus(right: TypeInfo, tenv: TypeEnv): TypeInfo {
    if (right.isUnknownType()) return right.plus(this, tenv);
    else return super.plus(right, tenv);
  }
}
export class UnknownTypeEx extends UnknownType {
  protected _type?: TypeInfo;
  resolved(): boolean {
    return this._type != null;
  }
  setType(t: TypeInfo): void {
    this._type = t;
  }
  type(): TypeInfo {
    return this._type == null ? TypeInfo.ANY : this._type;
  }
  assertSubtypeOf(t: TypeInfo, tenv: TypeEnv, where: ASTree): void {
    if (this.resolved()) this._type!.assertSubtypeOf(t, tenv, where);
    else (tenv as TypeEnvEx).addEquation(this, t);
  }
  assertSupertypeof(t: TypeInfo, tenv: TypeEnv, where: ASTree): void {
    if (this.resolved()) t.assertSubtypeOf(this._type!, tenv, where);
    else (tenv as TypeEnvEx).addEquation(this, t);
  }
  union(right: TypeInfo, tenv: TypeEnv): TypeInfo {
    if (this.resolved()) return this._type!.union(right, tenv);
    else {
      (tenv as TypeEnvEx).addEquation(this, right);
      return right;
    }
  }
  plus(right: TypeInfo, tenv: TypeEnv): TypeInfo {
    if (this.resolved()) return this._type!.plus(right, tenv);
    else {
      (tenv as TypeEnvEx).addEquation(this, UnknownTypeEx.INT);
      return right.plus(UnknownTypeEx.INT, tenv);
    }
  }
}
type Equation = UnknownType[];
export class TypeEnvEx extends TypeEnv {
  protected equations: Set<Equation> = new Set();
  addEquation(t1: UnknownType, t2: TypeInfo): void {
    // assert t1.unknown() === true
    if (t2.isUnknownType())
      if ((t2.toUnknownType() as UnknownTypeEx).resolved()) t2 = t2.type();
    const eq = this.find(t1);
    if (t2.isUnknownType()) eq.push(t2.toUnknownType()!);
    else {
      for (const t of eq) (t as UnknownTypeEx).setType(t2);
      this.equations.delete(eq);
    }
  }
  protected find(t: UnknownType): Equation {
    for (const e of this.equations) if (e.includes(t)) return e;
    const e = [t];
    this.equations.add(e);
    return e;
  }
}
