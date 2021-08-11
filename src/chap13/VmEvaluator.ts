import {
  BinaryEx2,
  DefStmntEx,
  EnvEx2,
  NameEx,
  ParamsEx,
} from '../chap11/EnvOptimizer';
import { ASTreeEx, NumberEx, StringEx } from '../chap6/BasicEvaluator';
import { Environment } from '../chap6/Environment';
import { PrimaryEx } from '../chap7/FuncEvaluator';
import { Arguments } from '../stone/ast/Arguments';
import { ASTLeaf } from '../stone/ast/ASTLeaf';
import { ASTList } from '../stone/ast/ASTList';
import { ASTree } from '../stone/ast/ASTree';
import { BlockStmnt } from '../stone/ast/BlockStmnt';
import { IfStmnt } from '../stone/ast/IfStmnt';
import { Name } from '../stone/ast/Name';
import { NegativeExpr } from '../stone/ast/NegativeExpr';
import { WhileStmnt } from '../stone/ast/WhileStmnt';
import { StoneException } from '../stone/StoneException';
import { astFactory } from '../utils/ASTFactory';
import { Code } from './Code';
import {
  ADD,
  BCONST,
  CALL,
  DIV,
  encodeOffset,
  encodeRegister,
  encodeShortOffset,
  EQUAL,
  GMOVE,
  GOTO,
  ICONST,
  IFZERO,
  LESS,
  MORE,
  MOVE,
  MUL,
  NEG,
  REM,
  RESTORE,
  RETURN,
  SAVE,
  SCONST,
  SUB,
} from './Opcode';
import { StoneVM } from './StoneVM';
import { VmFunction } from './VmFunction';

const INT8_MIN_VALUE = -128;
const INT8_MAX_VALUE = 127;

export class EnvEx3 extends EnvEx2 {
  stoneVM(): StoneVM {
    throw new Error('stoneVM not impl');
  }
  code(): Code {
    throw new Error('code not impl');
  }
}
export class ASTreeVmEx extends ASTree {
  compile(c: Code): void {
    throw new Error('compile not impl');
  }
}
class ASTLeafEx extends ASTLeaf {
  compile(c: Code): void {}
}
export class ASTListEx extends ASTList {
  compile(c: Code): void {
    for (const t of this.children()) (t as ASTreeVmEx).compile(c);
  }
}
export class DefStmntVmEx extends DefStmntEx {
  eval(env: Environment): unknown {
    const funcName = this.name();
    const vmenv = env as EnvEx3;
    const code = vmenv.code();
    const entry = code.position();
    this.compile(code);
    vmenv.putNew(
      funcName,
      new VmFunction(this.parameters(), this.body(), env, entry)
    );
    return funcName;
  }
  compile(c: Code): void {
    c.nextReg = 0;
    c.frameSize = this.size + StoneVM.SAVE_AREA_SIZE;
    c.add8(SAVE);
    c.add8(encodeOffset(this.size));
    (this.body() as ASTListEx).compile(c);
    c.add8(MOVE);
    c.add8(encodeRegister(c.nextReg - 1));
    c.add8(encodeOffset(0));
    c.add8(RESTORE);
    c.add8(encodeOffset(this.size));
    c.add8(RETURN);
  }
}
export class ParamsEx2 extends ParamsEx {
  eval(env: Environment, index: number, value: unknown): void {
    const vm = (env as EnvEx3).stoneVM();
    vm.stack()[this.offsets[index]] = value;
  }
}
export class NumberEx2 extends NumberEx {
  compile(c: Code): void {
    const v = this.value();
    if (v >= INT8_MIN_VALUE && v <= INT8_MAX_VALUE) {
      c.add8(BCONST);
      c.add8(v);
    } else {
      c.add8(ICONST);
      c.add8(v);
    }
    c.add8(encodeRegister(c.nextReg++));
  }
}
export class StringEx2 extends StringEx {
  compile(c: Code): void {
    const i = c.record(this.value());
    c.add8(SCONST);
    c.add16(encodeShortOffset(i));
    c.add8(encodeRegister(c.nextReg++));
  }
}
export class NameEx2 extends NameEx {
  compile(c: Code): void {
    if (this.nest > 0) {
      c.add8(GMOVE);
      c.add16(encodeShortOffset(this.index));
      c.add8(encodeRegister(c.nextReg++));
    } else {
      c.add8(MOVE);
      c.add8(encodeOffset(this.index));
      c.add8(encodeRegister(c.nextReg++));
    }
  }
  compileAssign(c: Code): void {
    if (this.nest > 0) {
      c.add8(GMOVE);
      c.add8(encodeRegister(c.nextReg - 1));
      c.add16(encodeShortOffset(this.index));
    } else {
      c.add8(MOVE);
      c.add8(encodeRegister(c.nextReg - 1));
      c.add8(encodeRegister(this.index));
    }
  }
}
export class NegativeEx extends NegativeExpr {
  compile(c: Code): void {
    (this.operand() as ASTreeVmEx).compile(c);
    c.add8(NEG);
    c.add8(encodeRegister(c.nextReg - 1)); // let last reg to negative
  }
}
export class BinaryEx extends BinaryEx2 {
  compile(c: Code): void {
    const op = this.operator();
    if (op === '=') {
      const l = this.left();
      if (l instanceof Name) {
        (this.right() as ASTreeVmEx).compile(c);
        (l as NameEx2).compileAssign(c);
      }
    } else {
      (this.left() as ASTreeVmEx).compile(c);
      (this.right() as ASTreeVmEx).compile(c);
      c.add8(this.getOpcode(op));
      c.add8(encodeRegister(c.nextReg - 2));
      c.add8(encodeRegister(c.nextReg - 1));
      c.nextReg--;
    }
  }
  protected getOpcode(op: string): number {
    switch (op) {
      case '+':
        return ADD;
      case '-':
        return SUB;
      case '*':
        return MUL;
      case '/':
        return DIV;
      case '%':
        return REM;
      case '==':
        return EQUAL;
      case '>':
        return MORE;
      case '<':
        return LESS;
      default:
        throw new StoneException('bad operator', this);
    }
  }
}
export class PrimaryVmEx extends PrimaryEx {
  compile(c: Code): void {
    this.compileSubExpr(c, 0);
  }
  compileSubExpr(c: Code, nest: number): void {
    if (this.hasPostfix(nest)) {
      this.compileSubExpr(c, nest + 1);
      (this.postfix(nest) as ASTListEx).compile(c);
    } else (this.operand() as ASTreeVmEx).compile(c);
  }
}
export class ArgumentsEx extends Arguments {
  compile(c: Code): void {
    let newOffset = c.frameSize;
    let numOfArgs = 0;
    for (const a of this.children()) {
      (a as ASTreeVmEx).compile(c);
      c.add8(MOVE);
      c.add8(encodeRegister(--c.nextReg));
      c.add8(encodeOffset(newOffset++));
      numOfArgs++;
    }
    c.add8(CALL);
    c.add8(encodeRegister(--c.nextReg));
    c.add8(encodeOffset(numOfArgs));
    c.add8(MOVE);
    c.add8(encodeOffset(c.frameSize));
    c.add8(encodeRegister(c.nextReg++));
  }
  eval(env: Environment, value: unknown): unknown {
    if (!(value instanceof VmFunction))
      throw new StoneException('bad function', this);
    const func = value;
    const params = func.parameters();
    if (this.size() !== params.size() && params.size() !== -1) {
      throw new StoneException('bad number of arguments', this);
    }
    let num = 0;
    for (const a of this.children()) {
      (params as ParamsEx2).eval(env, num++, (a as ASTreeEx).eval(env));
    }
    const svm = (env as EnvEx3).stoneVM();
    svm.run(func.entry());
    return svm.stack()[0];
  }
}
export class BlockEx extends BlockStmnt {
  compile(c: Code): void {
    if (this.numChildren() > 0) {
      const initReg = c.nextReg;
      for (const a of this.children()) {
        c.nextReg = initReg;
        (a as ASTreeVmEx).compile(c);
      }
    } else {
      c.add8(BCONST);
      c.add8(0);
      c.add8(encodeRegister(c.nextReg++));
    }
  }
}
export class IfEx extends IfStmnt {
  compile(c: Code): void {
    (this.condition() as ASTreeVmEx).compile(c);
    const pos = c.position();
    c.add8(IFZERO);
    c.add8(encodeRegister(--c.nextReg));
    c.add16(encodeShortOffset(0));
    const oldReg = c.nextReg;
    (this.thenBlock() as ASTreeVmEx).compile(c);
    const pos2 = c.position();
    c.add8(GOTO);
    c.add16(encodeShortOffset(0));
    c.set16(encodeShortOffset(c.position() - pos), pos + 2);
    const b = this.elseBlock();
    if (b != null) (b as ASTreeVmEx).compile(c);
    else {
      c.add8(BCONST);
      c.add8(0);
      c.add8(encodeRegister(c.nextReg++));
    }
    c.set16(encodeShortOffset(c.position() - pos2), pos2 + 1);
  }
}
export class WhileEx extends WhileStmnt {
  compile(c: Code): void {
    const oldReg = c.nextReg;
    c.add8(BCONST);
    c.add8(0);
    c.add8(encodeRegister(c.nextReg++));
    const pos = c.position();
    (this.condition() as ASTreeVmEx).compile(c);
    const pos2 = c.position();
    c.add8(IFZERO);
    c.add8(encodeRegister(--c.nextReg));
    c.add16(encodeShortOffset(0));
    c.nextReg = oldReg;
    (this.body() as ASTreeVmEx).compile(c);
    const pos3 = c.position();
    c.add8(GOTO);
    c.add16(encodeShortOffset(pos - pos3));
    c.set16(encodeShortOffset(c.position() - pos2), pos2 + 2);
  }
}

export function EnableVmEvaluator(): void {
  astFactory.setLeaf(ASTLeafEx, NumberEx2, StringEx2, NameEx2);
  astFactory.setList(
    ASTListEx,
    DefStmntVmEx,
    ParamsEx2,
    NegativeEx,
    BinaryEx,
    PrimaryVmEx,
    ArgumentsEx,
    BlockEx,
    IfEx,
    WhileEx
  );
}
