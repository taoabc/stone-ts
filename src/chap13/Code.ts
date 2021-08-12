import {
  ADD,
  BCONST,
  CALL,
  DIV,
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

function printOp(op: string, v1?: number, v2?: number) {
  let str = op;
  if (v1 != null) str += ' ' + v1;
  if (v2 != null) str += ' ' + v2;
  str += ';';
  return str;
}

function opToString(op: number) {
  switch (op) {
    case ADD:
      return 'ADD';
    case SUB:
      return 'SUB';
    case MUL:
      return 'MUL';
    case DIV:
      return 'DIV';
    case REM:
      return 'REM';
    case EQUAL:
      return 'EQUAL';
    case MORE:
      return 'MORE';
    case LESS:
      return 'LESS';
    default:
      throw new Error('bad opcode');
  }
}

export class Code {
  protected codeSize = 0;
  protected numOfString = 0;
  public nextReg = 0;
  public frameSize = 0;
  constructor(protected svm: StoneVM) {}
  position(): number {
    return this.codeSize;
  }
  // value int16
  set16(value: number, pos: number) {
    this.svm.code().writeInt16BE(value, pos);
  }
  add8(b: number) {
    this.svm.code().writeInt8(b, this.codeSize++);
  }
  add16(i: number) {
    // this.add8(i>>>8);
    // this.add8(i);
    this.svm.code().writeInt16BE(i, this.codeSize);
    this.codeSize += 2;
  }
  add32(i: number) {
    // add((byte)(i >>> 24));
    // add((byte)(i >>> 16));
    // add((byte)(i >>> 8));
    // add((byte)i);
    this.svm.code().writeInt32BE(i, this.codeSize);
    this.codeSize += 4;
  }
  record(s: string): number {
    this.svm.strings()[this.numOfString] = s;
    return this.numOfString++;
  }
  toString(): string {
    let pc = 0;
    let str = '';
    const code = this.svm.code();
    while (pc < this.codeSize) {
      const op = code.readInt8(pc);
      switch (op) {
        case ICONST: // +1234 for int to read, +5 for dest register
          str += printOp(
            'ICONST',
            code.readInt32BE(pc + 1),
            code.readInt8(pc + 5)
          );
          pc += 6;
          break;
        case BCONST:
          str += printOp(
            'BCONST',
            code.readInt8(pc + 1),
            code.readInt8(pc + 2)
          );
          pc += 3;
          break;
        case SCONST:
          str += printOp(
            'SCONST',
            code.readInt16BE(pc + 1),
            code.readInt8(pc + 3)
          );
          pc += 4;
          break;
        case MOVE:
          str += printOp('MOVE', code.readInt8(pc + 1), code.readInt8(pc + 2));
          pc += 3;
          break;
        case GMOVE:
          const rand = code.readInt8(pc + 1);
          if (rand < 0) str += printOp('GMOVE', rand, code.readInt16BE(pc + 2));
          else
            str += printOp(
              'GMOVE',
              code.readInt16BE(pc + 1),
              code.readInt8(pc + 3)
            );
          pc += 4;
          break;
        case IFZERO:
          str += printOp(
            'IFZERO',
            code.readInt8(pc + 1),
            code.readInt16BE(pc + 2)
          );
          pc += 4;
          break;
        case GOTO:
          str += printOp('GOTO', code.readInt16BE(pc + 1));
          pc += 3;
          break;
        case CALL:
          str += printOp(
            'CALL',
            code.readInt8(pc + 1),
            code.readInt16BE(pc + 2)
          );
          pc += 3;
          break;
        case RETURN:
          str += printOp('RETURN');
          pc += 1;
          break;
        case SAVE:
          str += printOp('SAVE', code.readInt8(pc + 1));
          pc += 2;
          break;
        case RESTORE:
          str += printOp('RESTORE', code.readInt8(pc + 1));
          pc += 2;
          break;
        case NEG:
          str += printOp('NEG', code.readInt8(pc + 1));
          pc += 2;
          break;
        default:
          if (op > LESS) throw new Error('bad opcode');
          else {
            str += printOp(
              opToString(op),
              code.readInt8(pc + 1),
              code.readInt8(pc + 2)
            );
            pc += 3;
          }
          break;
      }
    }
    return str;
  }
}
