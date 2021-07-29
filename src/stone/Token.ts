import { StoneException } from './StoneException';

export class Token {
  static EOF = new Token(-1);
  static EOL = '\\n';

  constructor(private lineNumber: number) {}

  public getLineNumber(): number {
    return this.lineNumber;
  }
  public isIdentifier(): boolean {
    return false;
  }
  public isNumber(): boolean {
    return false;
  }
  public isString(): boolean {
    return false;
  }
  public getNumber(): number {
    throw new StoneException('not number token');
  }
  public getText(): string {
    return '';
  }
}
