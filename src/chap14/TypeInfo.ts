import { ASTree } from '../stone/ast/ASTree';
import { TypeTag } from '../stone/ast/TypedTag';
import { TypeEnv } from './TypeEnv';
import { TypeException } from './TypeException';

export class TypeInfo {
  public static ANY: TypeInfo = new TypeInfo('Any');
  public static INT: TypeInfo = new TypeInfo('Int');
  public static STRING: TypeInfo = new TypeInfo('String');

  constructor(private tag: string = 'Any') {}
  toString(): string {
    return this.tag;
  }
  type(): TypeInfo {
    return this;
  }
  match(obj: TypeInfo): boolean {
    return this.type() === obj.type();
  }
  subtypeOf(superType: TypeInfo): boolean {
    return (
      this.type() === superType.type() || superType.type() === TypeInfo.ANY
    );
  }
  assertSubtypeOf(type: TypeInfo, env: TypeEnv, where: ASTree) {
    if (!this.subtypeOf(type))
      throw new TypeException(
        'type mismatch: cannot convert from ' + this + ' to ' + type,
        where
      );
  }
  union(right: TypeInfo, tenv: TypeEnv): TypeInfo {
    if (this.match(right)) return this.type();
    else return TypeInfo.ANY;
  }
  plus(right: TypeInfo, tenv: TypeEnv): TypeInfo {
    if (TypeInfo.INT.match(this) && TypeInfo.INT.match(right))
      return TypeInfo.INT;
    else if (TypeInfo.STRING.match(this) && TypeInfo.STRING.match(right))
      return TypeInfo.STRING;
    else return TypeInfo.ANY;
  }
  static get(tag: TypeTag): TypeInfo {
    const tname = tag.type();
    if (TypeInfo.INT.toString() === tname) return TypeInfo.INT;
    else if (TypeInfo.STRING.toString() === tname) return TypeInfo.STRING;
    else if (TypeTag.UNDEF === tname) return new UnknownType();
    else throw new TypeException('unknown type ' + tname, tag);
  }
  static function(ret: TypeInfo, ...params: TypeInfo[]): FunctionType {
    return new FunctionType(ret, params);
  }
  isFunctionType(): boolean {
    return false;
  }
  toFunctionType(): FunctionType | null {
    return null;
  }
  isUnknownType(): boolean {
    return false;
  }
  toUnknownType(): UnknownType | null {
    return null;
  }
}
export class UnknownType extends TypeInfo {
  type(): TypeInfo {
    return TypeInfo.ANY;
  }
  toString(): string {
    return this.type().toString();
  }
  isUnknownType(): boolean {
    return true;
  }
  toUnknownType(): UnknownType {
    return this;
  }
}
export class FunctionType extends TypeInfo {
  // public returnType: TypeInfo;
  // public parameterTypes: TypeInfo[];
  constructor(public returnType: TypeInfo, public parameterTypes: TypeInfo[]) {
    super();
  }
  isFunctionType(): boolean {
    return true;
  }
  toFunctionType(): FunctionType {
    return this;
  }
  match(obj: TypeInfo): boolean {
    if (!(obj instanceof FunctionType)) return false;
    const func = obj;
    if (this.parameterTypes.length !== func.parameterTypes.length) return false;
    for (let i = 0; i < this.parameterTypes.length; i++)
      if (!this.parameterTypes[i].match(func.parameterTypes[i])) return false;
    return this.returnType.match(func.returnType);
  }
  toString(): string {
    let str = '';
    if (this.parameterTypes.length === 0) str += 'Unit';
    else {
      for (let i = 0; i < this.parameterTypes.length; i++) {
        if (i > 0) str += ' * ';
        str += this.parameterTypes[i].toString();
      }
    }
    str += ' -> ' + this.returnType.toString();
    return str;
  }
}
