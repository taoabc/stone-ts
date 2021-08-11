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
}
