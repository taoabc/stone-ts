import { StoneException } from '../stone/StoneException';
import { StoneVM } from './StoneVM';

/**
 * iconst int32 reg  将整数值int32 保存至reg
 * bconst int8 reg   将整数值int8 保存至reg
 * sconst int16 reg  将字符常量区的第int16 个字符串字面量保存至reg
 * move src dest     在栈与寄存器，或寄存器之间进行值复制操作（src 与dest 可以是reg 或int8）
 * gmove src dest    在堆与寄存器之间进行值复制操作（src 与dest 可以是reg 或int16）
 * ifzero reg int16  如果reg 的值为0，则跳转至int16 分支
 * goto int16        强制跳转至int16 分支
 * call reg int8     调用函数reg ，该函数将调用int8 个参数（同时，call 之后的指令地址将被保存至 ret 寄存器）
 * return            跳转至 ret 寄存器储存的分支地址
 * save int8         将寄存器的值转移至栈中，并更改寄存器 fp与 sp的值
 * restore int8      还原之前转移至栈中的寄存器值
 * neg reg           反转reg 中保存的值的正负号
 * add reg 1 reg 2   计算reg 1+reg 2 后保存至reg 1
 * sub reg 1 reg 2   计算reg 1-reg 2 后保存至reg 1
 * mul reg 1 reg 2   计算reg 1×reg 2 后保存至reg 1
 * div reg 1 reg 2   计算reg 1÷reg 2 后保存至reg 1
 * rem reg 1 reg 2   计算reg 1÷reg 2 的余数后将余数保存至reg 1
 * equal reg 1 reg 2 如果reg 1 = reg 2 则将reg 1 赋值为1，否则赋值为0
 * more reg 1 reg 2  如果reg 1 > reg 2 则将reg 1 赋值为1，否则赋值为0
 * less reg 1 reg 2  如果reg 1 < reg 2 则将reg 1 赋值为1，否则赋值为0
 */
export class Opcode {
  public static ICONST = 1; // load an integer
  public static BCONST = 2; // load an 8bit (1byte) integer
  public static SCONST = 3; // load a character string
  public static MOVE = 4; // move a value
  public static GMOVE = 5; // move a value (global variable)
  public static IFZERO = 6; // branch if false
  public static GOTO = 7; // always branch
  public static CALL = 8; // call a function
  public static RETURN = 9; // return
  public static SAVE = 10; // save all registers
  public static RESTORE = 11; // restore all registers
  public static NEG = 12; // arithmetic negation
  public static ADD = 13; // add
  public static SUB = 14; // subtract
  public static MUL = 15; // multiply
  public static DIV = 16; // divide
  public static REM = 17; // remainder
  public static EQUAL = 18; // equal
  public static MORE = 19; // more than
  public static LESS = 20; // less than

  private static SHORT_MIN_VALUE = -Math.pow(2, 15);
  private static SHORT_MAX_VALUE = Math.pow(2, 15) - 1;
  private static BYTE_MAX_VALUE = Math.pow(2, 8) - 1;

  // 使用负数表示寄存器
  static encodeRegister(reg: number): number {
    if (reg > StoneVM.NUM_OF_REG)
      throw new StoneException('too many registers required');
    else return -(reg + 1);
  }
  static decodeRegister(operand: number): number {
    return -1 - operand;
  }
  static encodeOffset(offset: number): number {
    if (offset > this.BYTE_MAX_VALUE) {
      throw new StoneException('offset too big');
    }
    return offset;
  }
  // int16
  static encodeShortOffset(offset: number): number {
    if (offset < this.SHORT_MIN_VALUE || offset > this.SHORT_MAX_VALUE)
      throw new StoneException('invalid offset');
    return offset;
  }
  static decodeOffset(operand: number): number {
    return operand;
  }
  static isRegister(operand: number): boolean {
    return operand < 0;
  }
  static isOffset(operand: number): boolean {
    return operand >= 0;
  }
}
