import { OptClassInfo } from './OptClassInfo';

// 实例化的一个对象
export class OptStoneObject {
  protected fields: unknown[];
  constructor(protected _classInfo: OptClassInfo, size: number) {
    this.fields = new Array(size);
  }
  classInfo(): OptClassInfo {
    return this._classInfo;
  }
  read(name: string): unknown {
    let i = this._classInfo.fieldIndex(name);
    if (i != null) return this.fields[i];
    else {
      i = this._classInfo.methodIndex(name);
      if (i != null) return this.method(i);
    }
    throw new Error(`field or method ${name} not found`);
  }
  write(name: string, value: unknown): void {
    const i = this._classInfo.fieldIndex(name);
    if (i == null) throw new Error(`field ${name} not found`);
    else this.fields[i] = value;
  }
  readIndex(index: number): unknown {
    return this.fields[index];
  }
  writeIndex(index: number, value: unknown): void {
    this.fields[index] = value;
  }
  method(index: number): unknown {
    return this._classInfo.method(this, index);
  }
}
