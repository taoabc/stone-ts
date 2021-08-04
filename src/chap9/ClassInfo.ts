import { Environment } from '../chap6/Environment';
import { ClassBody } from '../stone/ast/ClassBody';
import { ClassStmnt } from '../stone/ast/ClassStmnt';
import { StoneException } from '../stone/StoneException';

export class ClassInfo {
  protected _superClass: ClassInfo | null;
  constructor(
    protected definition: ClassStmnt,
    protected _environment: Environment
  ) {
    const defSuper = definition.superClass();
    const obj = defSuper ? _environment.get(defSuper) : null;
    if (obj == null) this._superClass = null;
    else if (obj instanceof ClassInfo) this._superClass = obj;
    else
      throw new StoneException(
        `unknown super class: ${definition.superClass()}`,
        definition
      );
  }
  name(): string {
    return this.definition.name();
  }
  superClass(): ClassInfo | null {
    return this._superClass;
  }
  body(): ClassBody {
    return this.definition.body();
  }
  environment(): Environment {
    return this._environment;
  }
  toString(): string {
    return `<class ${this.name()}>`;
  }
}
