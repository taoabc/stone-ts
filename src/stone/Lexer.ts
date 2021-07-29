import { createInterface } from 'readline';
import { createReadStream } from 'fs';
import { Token } from './Token';

export class Reader {
  private content: string[] = [];
  private cursor = 0;

  constructor() {}

  fromFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const rl = createInterface({
        input: createReadStream(filePath),
        crlfDelay: Infinity,
      });

      rl.on('line', (line: string) => {
        this.content.push(line);
      });
      rl.on('close', () => {
        resolve();
      });
      rl.on('error', (err: Error) => {
        reject(err);
      });
    });
  }

  readLine(): string | null {
    if (this.cursor < this.content.length) {
      return this.content[this.cursor++];
    }
    return null;
  }

  getLineNumber(): number {
    return this.cursor;
  }
}

class NumToken extends Token {
  constructor(line: number, private value: number) {
    super(line);
  }
  isNumber(): boolean {
    return true;
  }
  getText(): string {
    return this.value.toString();
  }
  getNumber(): number {
    return this.value;
  }
}

class IdToken extends Token {
  constructor(line: number, private text: string) {
    super(line);
  }
  isIdentifier(): boolean {
    return true;
  }
  getText(): string {
    return this.text;
  }
}

class StrToken extends Token {
  constructor(line: number, private literal: string) {
    super(line);
  }
  isString(): boolean {
    return true;
  }
  getText(): string {
    return this.literal;
  }
}

// punctuation
// [!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]
export class Lexer {
  private pattern: RegExp =
    /\s*((\/\/.*)|(\d+)|("(\"|\\\\|\\n|[^"])*")|[\w_][\w\d_]*|==|<=|>=|&&|\||\|\||[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])?/g;
  private queue: Token[] = [];
  private hasMore = true;

  constructor(private reader: Reader) {}

  read(): Token {
    if (this.fillQueue(0)) return this.queue.shift() as Token;
    else return Token.EOF;
  }

  peek(i: number): Token {
    if (this.fillQueue(i)) return this.queue[i];
    else return Token.EOF;
  }

  fillQueue(i: number): boolean {
    while (i >= this.queue.length) {
      if (this.hasMore) this.readLine();
      else return false;
    }
    return true;
  }

  readLine(): void {
    const line = this.reader.readLine();
    if (line == null) {
      this.hasMore = false;
      return;
    }

    const lineNo = this.reader.getLineNumber();
    const matches = line.matchAll(this.pattern);

    for (const match of matches) {
      this.addToken(lineNo, match);
    }
    // 很关键，用来匹配sep(Token.EOL)
    this.queue.push(new IdToken(lineNo, Token.EOL));
  }

  addToken(lineNo: number, match: string[]): void {
    // console.log('addToken', match);
    const m = match[1];
    // if not a space
    if (m != null) {
      // if not a comment
      if (match[2] == null) {
        let token;
        if (match[3] != null) {
          token = new NumToken(lineNo, parseInt(m, 10));
        } else if (match[4] != null) {
          token = new StrToken(lineNo, this.toStringLiteral(m));
        } else {
          token = new IdToken(lineNo, m);
        }
        this.queue.push(token);
      }
    }
  }

  private toStringLiteral(s: string): string {
    let str = '';
    const len = s.length - 1;
    // ignore first letter "
    for (let i = 1; i < len; i++) {
      let c = s[i];
      if (c == '\\' && i + 1 < len) {
        let c2 = s[i + 1];
        if (c2 === '"' || c2 === '\\') c = s[++i];
        else if (c2 === 'n') {
          ++i;
          c = '\n';
        }
      }
      str += c;
    }
    return str;
  }
}
