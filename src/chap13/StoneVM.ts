import { HeapMemory } from './HeapMemory';
import { Opcode } from './Opcode';

export class StoneVM {
  protected _code: Buffer;
  protected _stack: unknown[];
  protected _strings: string[];

  protected registers: unknown[];

  public pc: number = 0;
  public fp: number = 0;
  public sp: number = 0;
  public ret: number = 0;

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
  statck(): unknown[] {
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
    switch (this._code[this.pc]) {
      case Opcode.ICONST:
        break;
      case Opcode.BCONST:
        break;
    }
  }

  public static readInt(array: Buffer, index: number): number {
    return (
      (array[index] << 24) |
      (array[index + 1] << 16) |
      (array[index + 2] << 8) |
      array[index + 3]
    );
  }
}
