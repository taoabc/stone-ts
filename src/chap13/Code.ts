import {
  BCONST,
  CALL,
  GMOVE,
  GOTO,
  ICONST,
  IFZERO,
  MOVE,
  NEG,
  RESTORE,
  RETURN,
  SAVE,
  SCONST,
} from './Opcode';
import { StoneVM } from './StoneVM';

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
      switch (this.svm.code().readInt8(pc)) {
        case ICONST: // +1234 for int to read, +5 for dest register
          str +=
            'ICONST ' +
            code.readInt32BE(pc + 1) +
            ' ' +
            code.readInt8(pc + 5) +
            '\n';
          pc += 6;
          break;
        case BCONST:
          str +=
            'BCONST ' + code.readInt8(pc + 1) + code.readInt8(pc + 2) + '\n';
          break;
        case SCONST:
          str += 'SCONST ' + code.readInt16BE(pc + 1) + '\n';
          this.registers[decodeRegister(this._code.readInt8(this.pc + 3))] =
            this._strings[readShort(this._code, this.pc + 1)];
          this.pc += 4;
          break;
        case MOVE:
          str += 'SCONST ' + code.readInt16BE(pc + 1) + '\n';
          this.moveValue();
          break;
        case GMOVE:
          str += 'SCONST ' + code.readInt16BE(pc + 1) + '\n';
          this.moveHeapValue();
          break;
        case IFZERO:
          str += 'SCONST ' + code.readInt16BE(pc + 1) + '\n';
          const value =
            this.registers[decodeRegister(this._code.readInt8(this.pc + 1))];
          if (typeof value === 'number' && value === 0) {
            this.pc += readShort(this._code, this.pc + 2);
          } else {
            this.pc += 4;
          }
          break;
        case GOTO:
          str += 'SCONST ' + code.readInt16BE(pc + 1) + '\n';
          this.pc += readShort(this._code, this.pc + 1);
          break;
        case CALL:
          str += 'SCONST ' + code.readInt16BE(pc + 1) + '\n';
          this.callFunction();
          break;
        case RETURN:
          str += 'SCONST ' + code.readInt16BE(pc + 1) + '\n';
          this.pc = this.ret;
          break;
        case SAVE:
          str += 'SCONST ' + code.readInt16BE(pc + 1) + '\n';
          this.saveRegisters();
          break;
        case RESTORE:
          str += 'SCONST ' + code.readInt16BE(pc + 1) + '\n';
          this.restoreRegisters();
          break;
        case NEG:
          str += 'SCONST ' + code.readInt16BE(pc + 1) + '\n';
          const reg = decodeRegister(this._code.readInt8(this.pc + 1));
          const v = this.registers[reg];
          if (typeof v === 'number') {
            this.registers[reg] = -v;
          } else {
            throw new StoneException('bad operand value');
          }
          this.pc += 2;
          break;
        default:
          if (this._code.readInt8(this.pc) > LESS)
            throw new StoneException('bad opcode');
          else str += code.readInt8(pc) + code.readInt8(pc + 1) + '\n';
          break;
      }
    }
    return str;
  }
}
