import { ASTLeaf } from '../stone/ast/ASTLeaf';
import { ASTList } from '../stone/ast/ASTList';
import { ASTree } from '../stone/ast/ASTree';
import { BinaryExpr } from '../stone/ast/BinaryExpr';
import { BlockStmnt } from '../stone/ast/BlockStmnt';
import { IfStmnt } from '../stone/ast/IfStmnt';
import { Name } from '../stone/ast/name';
import { NegativeExpr } from '../stone/ast/NegativeExpr';
import { NullStmnt } from '../stone/ast/NullStmnt';
import { NumberLiteral } from '../stone/ast/NumberLiteral';
import { StringLiteral } from '../stone/ast/StringLiteral';
import { WhileStmnt } from '../stone/ast/WhileStmnt';
import { StoneException } from '../stone/StoneException';
import { inject } from '../utils/inject';
import { Environment } from './Environment';

const TRUE = 1;
const FALSE = 0;

export class ASTreeEx extends ASTree {
  eval(env: Environment): unknown {
    throw new Error('ASTreeEx not implemented');
  }
}
class ASTListEx extends ASTList {
  eval(env: Environment): unknown {
    throw new StoneException('cannot eval list: ' + this.toString(), this);
  }
}
class ASTLeafEx extends ASTLeaf {
  eval(env: Environment): unknown {
    throw new StoneException('cannot eval leaf: ' + this.toString(), this);
  }
}
class NumberEx extends NumberLiteral {
  eval(env: Environment): unknown {
    return this.value();
  }
}
class StringEx extends StringLiteral {
  eval(env: Environment): unknown {
    return this.value();
  }
}
class NameEx extends Name {
  eval(env: Environment): unknown {
    const value = env.get(this.name());
    if (value == null)
      throw new StoneException('undefined name: ' + this.name(), this);
    else return value;
  }
}
class NegativeEx extends NegativeExpr {
  eval(env: Environment): unknown {
    const v = (this.operand() as ASTLeafEx).eval(env);
    if (typeof v === 'number') return -v;
    else throw new StoneException('bad type for -', this);
  }
}
class BinaryEx extends BinaryExpr {
  eval(env: Environment): unknown {
    const op = this.operator();
    if ('=' === op) {
      const right = (this.right() as ASTreeEx).eval(env);
      return this.computeAssign(env, right);
    } else {
      const left = (this.left() as ASTreeEx).eval(env);
      const right = (this.right() as ASTreeEx).eval(env);
      return this.computeOp(left, op, right);
    }
  }
  protected computeAssign(env: Environment, rvalue: unknown) {
    const l = this.left();
    if (l instanceof Name) {
      env.put((l as Name).name(), rvalue);
      return rvalue;
    } else throw new StoneException('bad assignment', this);
  }
  protected computeOp(left: unknown, op: string, right: unknown) {
    if (typeof left === 'number' && typeof right === 'number') {
      return this.computeNumber(left, op, right);
    } else {
      if (op === '+' && typeof left === 'string' && typeof right === 'string')
        return left + right;
      else if (op === '==') {
        return left === right ? TRUE : FALSE;
      } else throw new StoneException('bad type', this);
    }
  }
  protected computeNumber(left: number, op: string, right: number) {
    switch (op) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      case '%':
        return left % right;
      case '==':
        return left === right ? TRUE : FALSE;
      case '>':
        return left > right ? TRUE : FALSE;
      case '<':
        return left < right ? TRUE : FALSE;
      default:
        throw new StoneException('bad operator', this);
    }
  }
}
export class BlockEx extends BlockStmnt {
  eval(env: Environment): unknown {
    let result: unknown = 0;
    for (const t of this.children()) {
      if (!(t instanceof NullStmnt)) result = (t as ASTreeEx).eval(env);
    }
    return result;
  }
}
class IfEx extends IfStmnt {
  eval(env: Environment): unknown {
    const c = (this.condition() as ASTreeEx).eval(env);
    if (typeof c === 'number' && c !== FALSE)
      return (this.thenBlock() as ASTreeEx).eval(env);
    else {
      const b = this.elseBlock();
      if (b == null) return 0;
      else return (b as ASTreeEx).eval(env);
    }
  }
}
class WhileEx extends WhileStmnt {
  eval(env: Environment): unknown {
    let result: unknown = 0;
    while (true) {
      const c = (this.condition() as ASTreeEx).eval(env);
      if (typeof c === 'number' && c === FALSE) return result;
      else result = (this.body() as ASTreeEx).eval(env);
    }
  }
}

inject(ASTree.prototype, ASTreeEx.prototype);
inject(ASTList.prototype, ASTListEx.prototype);
inject(ASTLeaf.prototype, ASTLeafEx.prototype);
inject(NumberLiteral.prototype, NumberEx.prototype);
inject(StringLiteral.prototype, StringEx.prototype);
inject(Name.prototype, NameEx.prototype);
inject(NegativeExpr.prototype, NegativeEx.prototype);
inject(BinaryExpr.prototype, BinaryEx.prototype);
inject(BlockStmnt.prototype, BlockEx.prototype);
inject(IfStmnt.prototype, IfEx.prototype);
inject(WhileStmnt.prototype, WhileEx.prototype);
