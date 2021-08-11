import { StoneException } from '../stone/StoneException';
import { StoneVM } from './StoneVM';

// int8: register, iconst
// int16: pc address
// int32: iconst
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
 * add reg1 reg2   计算reg1+reg2 后保存至reg1
 * sub reg1 reg2   计算reg1-reg2 后保存至reg1
 * mul reg1 reg2   计算reg1×reg2 后保存至reg1
 * div reg1 reg2   计算reg1÷reg2 后保存至reg1
 * rem reg1 reg2   计算reg1÷reg2 的余数后将余数保存至reg1
 * equal reg1 reg2 如果reg1 = reg2 则将reg1 赋值为1，否则赋值为0
 * more reg1 reg2  如果reg1 > reg2 则将reg1 赋值为1，否则赋值为0
 * less reg1 reg2  如果reg1 < reg2 则将reg1 赋值为1，否则赋值为0
 */
export const ICONST = 1; // load an integer
export const BCONST = 2; // load an 8bit (1byte) integer
export const SCONST = 3; // load a character string
export const MOVE = 4; // move a value
export const GMOVE = 5; // move a value (global variable)
export const IFZERO = 6; // branch if false
export const GOTO = 7; // always branch
export const CALL = 8; // call a function
export const RETURN = 9; // return
export const SAVE = 10; // save all registers
export const RESTORE = 11; // restore all registers
export const NEG = 12; // arithmetic negation
export const ADD = 13; // add
export const SUB = 14; // subtract
export const MUL = 15; // multiply
export const DIV = 16; // divide
export const REM = 17; // remainder
export const EQUAL = 18; // equal
export const MORE = 19; // more than
export const LESS = 20; // less than

const SHORT_MIN_VALUE = -Math.pow(2, 15);
const SHORT_MAX_VALUE = Math.pow(2, 15) - 1;
const BYTE_MAX_VALUE = Math.pow(2, 8) - 1;

// 使用负数表示寄存器
export function encodeRegister(reg: number): number {
  if (reg > StoneVM.NUM_OF_REG)
    throw new StoneException('too many registers required');
  else return -(reg + 1);
}
export function decodeRegister(operand: number): number {
  return -1 - operand;
}
// offset 不一定是偏移量，有可能是操作数
export function encodeOffset(offset: number): number {
  if (offset > BYTE_MAX_VALUE) {
    throw new StoneException('offset too big');
  }
  return offset;
}
// int16
export function encodeShortOffset(offset: number): number {
  if (offset < SHORT_MIN_VALUE || offset > SHORT_MAX_VALUE)
    throw new StoneException('invalid offset');
  return offset;
}
export function decodeOffset(operand: number): number {
  return operand;
}
export function isRegister(operand: number): boolean {
  return operand < 0;
}
export function isOffset(operand: number): boolean {
  return operand >= 0;
}
