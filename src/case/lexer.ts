import { Lexer, Reader } from '../Lexer';
import { Token } from '../Token';

async function readLineTest() {
  const reader = new Reader();
  await reader.fromFile('./src/case/1');
  let l = reader.readLine();
  while (l != null) {
    console.log(l);
    l = reader.readLine();
  }
}

async function testLexer() {
  const reader = new Reader();
  await reader.fromFile('./src/case/1');
  let lexer = new Lexer(reader);

  while (true) {
    const token = lexer.read();
    if (token === Token.EOF) {
      break;
    }
    console.log(token);
  }
}

async function main() {
  // readLineTest();
  testLexer();
}

main();
