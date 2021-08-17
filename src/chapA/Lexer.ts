import { readFileSync } from 'fs';

export class CharReader {
  private content: Buffer;
  private cursor = 0;

  constructor(filePath: string) {
    this.content = readFileSync(filePath);
  }

  read(): number {
    if (this.cursor >= this.content.length) {
      return -1;
    }
    return this.content[this.cursor++];
  }
}
const EMPTY = -1;

function isLetter(c: number) {
  return (
    (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) ||
    (c >= 'A'.charCodeAt(0) && c <= 'Z'.charCodeAt(0))
  );
}
function isDigit(c: number) {
  return c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0);
}
function isSpace(c: number) {
  return c >= 0 && c <= ' '.charCodeAt(0);
}

export class Lexer {
  private lastChar: number = EMPTY;
  constructor(private reader: CharReader) {}
  private getChar(): number {
    if (this.lastChar === EMPTY) return this.reader.read();
    else {
      const c = this.lastChar;
      this.lastChar = EMPTY;
      return c;
    }
  }
  private ungetChar(c: number) {
    this.lastChar = c;
  }
  public read(): string {
    let str = '';
    let c;
    do {
      c = this.getChar();
    } while (isSpace(c));
    if (c < 0) return '';
    else if (isDigit(c)) {
      do {
        str += String.fromCharCode(c);
        c = this.getChar();
      } while (isDigit(c));
    } else if (isLetter(c)) {
      do {
        str += String.fromCharCode(c);
        c = this.getChar();
      } while (isLetter(c));
    } else if (c === '='.charCodeAt(0)) {
      c = this.getChar();
      if (c === '='.charCodeAt(0)) {
        return '==';
      } else {
        this.ungetChar(c);
        return '=';
      }
    } else throw new Error('ioerror');
    if (c >= 0) this.ungetChar(c);
    return str;
  }
}
