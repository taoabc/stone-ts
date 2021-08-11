import { ResizableArrayEnv } from '../chap11/ResizableArrayEnv';
import { Code } from './Code';
import { HeapMemory } from './HeapMemory';
import { StoneVM } from './StoneVM';

export class StoneVMEnv extends ResizableArrayEnv implements HeapMemory {
  protected svm: StoneVM;
  protected _code: Code;
  constructor(codeSize: number, stackSize: number, stringsSize: number) {
    super();
    this.svm = new StoneVM(codeSize, stackSize, stringsSize, this);
    this._code = new Code(this.svm);
  }
  stoneVM(): StoneVM {
    return this.svm;
  }
  code(): Code {
    return this._code;
  }
  read(index: number): unknown {
    return this.values[index];
  }
  write(index: number, v: unknown): void {
    this.values[index] = v;
  }
}
