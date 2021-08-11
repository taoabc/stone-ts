import { NativeFunction } from '../chap8/NativeFunction';
import { ASTList } from '../stone/ast/ASTList';
import { StoneException } from '../stone/StoneException';
import { HeapMemory } from './HeapMemory';
import {
  ADD,
  BCONST,
  CALL,
  decodeOffset,
  decodeRegister,
  DIV,
  EQUAL,
  GMOVE,
  GOTO,
  ICONST,
  IFZERO,
  isRegister,
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
import { VmFunction } from './VmFunction';

function readInt(array: Buffer, index: number): number {
  return array.readInt32BE(index);
  // return (
  //   (array[index] << 24) |
  //   (array[index + 1] << 16) |
  //   (array[index + 2] << 8) |
  //   array[index + 3]
  // );
}
function readShort(array: Buffer, index: number): number {
  return array.readInt16BE(index);
  // return (array[index] << 8) | array[index + 1];
}

// 整体从小往大生长

export class StoneVM {
  protected _code: Buffer;
  protected _stack: unknown[];
  protected _strings: string[];

  protected registers: unknown[];

  public pc: number = 0; // program counter
  public fp: number = 0; // frame pointer
  public sp: number = 0; // stack pointer
  public ret: number = 0; // functon return address

  static NUM_OF_REG = 6;
  static SAVE_AREA_SIZE = this.NUM_OF_REG + 2;

  static TRUE = 1;
  static FALSE = 0;

  constructor(
    codeSize: number,
    stackSize: number,
    stringsSize: number,
    protected _heap: HeapMemory
  ) {
    this._code = Buffer.allocUnsafe(codeSize);
    this._stack = new Array(stackSize);
    this._strings = new Array(stringsSize);
    this.registers = new Array(StoneVM.NUM_OF_REG);
  }
  getReg(i: number) {
    return this.registers[i];
  }
  setReg(i: number, v: unknown) {
    this.registers[i] = v;
  }
  strings(): string[] {
    return this._strings;
  }
  code(): Buffer {
    return this._code;
  }
  stack(): unknown[] {
    return this._stack;
  }
  heap(): HeapMemory {
    return this._heap;
  }

  run(entry: number) {
    this.pc = entry;
    this.fp = 0;
    this.sp = 0;
    this.ret = -1;
    while (this.pc >= 0) this.mainLoop();
  }
  protected mainLoop(): void {
    switch (this._code.readInt8(this.pc)) {
      case ICONST: // +1234 for int to read, +5 for dest register
        this.registers[decodeRegister(this._code.readInt8(this.pc + 5))] =
          readInt(this._code, this.pc + 1);
        this.pc += 6;
        break;
      case BCONST:
        this.registers[decodeRegister(this._code.readInt8(this.pc + 2))] =
          this._code.readInt8(this.pc + 1);
        this.pc += 3;
        break;
      case SCONST:
        this.registers[decodeRegister(this._code.readInt8(this.pc + 3))] =
          this._strings[readShort(this._code, this.pc + 1)];
        this.pc += 4;
        break;
      case MOVE:
        this.moveValue();
        break;
      case GMOVE:
        this.moveHeapValue();
        break;
      case IFZERO:
        const value =
          this.registers[decodeRegister(this._code.readInt8(this.pc + 1))];
        if (typeof value === 'number' && value === 0) {
          this.pc += readShort(this._code, this.pc + 2);
        } else {
          this.pc += 4;
        }
        break;
      case GOTO:
        this.pc += readShort(this._code, this.pc + 1);
        break;
      case CALL:
        this.callFunction();
        break;
      case RETURN:
        this.pc = this.ret;
        break;
      case SAVE:
        this.saveRegisters();
        break;
      case RESTORE:
        this.restoreRegisters();
        break;
      case NEG:
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
        else this.computeNumber();
        break;
    }
  }

  // move src dest
  // 在栈与寄存器，或寄存器之间进行值复制操作（src 与dest 可以是reg 或int8）
  protected moveValue(): void {
    const src = this._code.readInt8(this.pc + 1);
    const dest = this._code.readInt8(this.pc + 2);
    let value: unknown;
    // get value from register or stack
    if (isRegister(src)) value = this.registers[decodeRegister(src)];
    else value = this._stack[this.fp + decodeOffset(src)];
    // store value to register or stack
    if (isRegister(dest)) this.registers[decodeRegister(dest)] = value;
    else this._stack[this.fp + decodeOffset(dest)] = value;
    this.pc += 3;
  }
  // gmove src, dest, src will be register or heap location
  // 在堆与寄存器之间进行值复制操作（src与dest可以是reg或int16）
  protected moveHeapValue(): void {
    const rand = this._code.readInt8(this.pc + 1);
    if (isRegister(rand)) {
      // register -> heap
      const dest = readShort(this._code, this.pc + 2);
      this._heap.write(dest, this.registers[decodeRegister(rand)]);
    } else {
      // heap location -> register
      const src = readShort(this._code, this.pc + 1); // read pointer
      this.registers[decodeRegister(this._code.readInt8(this.pc + 3))] =
        this._heap.read(src);
    }
    this.pc += 4;
  }
  // call reg int8
  // 调用函数reg，该函数将调用int8个参数（同时，call之后的指令地址将被保存至ret寄存器）
  protected callFunction(): void {
    const value =
      this.registers[decodeRegister(this._code.readInt8(this.pc + 1))];
    const numOfArgs = this._code.readInt8(this.pc + 2);
    if (value instanceof VmFunction && value.parameters().size() == numOfArgs) {
      this.ret = this.pc + 3; // store ret address
      this.pc = value.entry(); // pc jump to function entry
    } else if (
      value instanceof NativeFunction &&
      (value.numOfParameters() === -1 || value.numOfParameters() === numOfArgs)
    ) {
      const args = new Array(numOfArgs);
      for (let i = 0; i < numOfArgs; i++) {
        args[i] = this._stack[this.sp + i]; // stack pointer
      }
      // return value to stack[pc]
      this._stack[this.sp] = value.invoke(args, new ASTList([])); // call native function
      this.pc += 3;
    } else throw new StoneException('bad function call');
  }
  // save int8
  // int8 表示offset
  // 将寄存器的值转移至栈中，并更改寄存器 fp与 sp的值
  // stack -> [reg1, reg2, reg3, reg4, reg5, reg6, oldFp, ret]
  // fp -> oldSp, sp -> oldSp + size + SAVE_AREA_SIZE
  protected saveRegisters(): void {
    const size = decodeOffset(this._code.readInt8(this.pc + 1));
    let dest = size + this.sp;
    for (let i = 0; i < StoneVM.NUM_OF_REG; i++)
      this._stack[dest++] = this.registers[i];
    this._stack[dest++] = this.fp;
    this.fp = this.sp;
    this.sp += size + StoneVM.SAVE_AREA_SIZE;
    this._stack[dest++] = this.ret;
    this.pc += 2;
  }
  protected restoreRegisters(): void {
    let dest = decodeOffset(this._code.readInt8(this.pc + 1)) + this.fp;
    for (let i = 0; i < StoneVM.NUM_OF_REG; i++)
      this.registers[i] = this._stack[dest++];
    this.sp = this.fp;
    this.fp = this._stack[dest++] as number;
    this.ret = this._stack[dest++] as number;
    this.pc += 2;
  }
  // only compute number in register
  protected computeNumber(): void {
    const left = decodeRegister(this._code.readInt8(this.pc + 1));
    const right = decodeRegister(this._code.readInt8(this.pc + 2));
    const v1 = this.registers[left];
    const v2 = this.registers[right];
    const areNumbers = typeof v1 === 'number' && typeof v2 === 'number';
    if (this._code.readInt8(this.pc) === ADD && !areNumbers) {
      this.registers[left] = '' + v1 + v2;
    } else if (this._code.readInt8(this.pc) === EQUAL && !areNumbers) {
      this.registers[left] = v1 === v2 ? StoneVM.TRUE : StoneVM.FALSE;
    } else {
      if (!areNumbers) throw new StoneException('bad operand value');
      const i1 = v1 as number;
      const i2 = v2 as number;
      let i3;
      switch (this._code.readInt8(this.pc)) {
        case ADD:
          i3 = i1 + i2;
          break;
        case SUB:
          i3 = i1 - i2;
          break;
        case MUL:
          i3 = i1 * i2;
          break;
        case DIV:
          i3 = i1 / i2;
          break;
        case REM:
          i3 = i1 % i2;
          break;
        case EQUAL:
          i3 = i1 === i2 ? StoneVM.TRUE : StoneVM.FALSE;
          break;
        case MORE:
          i3 = i1 > i2 ? StoneVM.TRUE : StoneVM.FALSE;
          break;
        case LESS:
          i3 = i1 < i2 ? StoneVM.TRUE : StoneVM.FALSE;
          break;
        default:
          throw new StoneException(' never reach here');
      }
      this.registers[left] = i3;
    }
    this.pc += 3;
  }
}
