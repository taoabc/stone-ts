import { ASTLeaf } from '../stone/ast/ASTLeaf';
import { ASTList } from '../stone/ast/ASTList';
import { ASTree } from '../stone/ast/ASTree';
import { FnCreateASTLeaf, FnCreateASTList } from '../stone/Parser';
import { Token } from '../stone/Token';

// type ClassType = typeof ASTree;

class ASTFactory {
  private leafClass: { [key: string]: typeof ASTLeaf } = {};
  private listClass: { [key: string]: typeof ASTList } = {};
  // private leafCreator: { [key: string]: typeof ASTLeaf } = {};
  private listCreator: { [key: string]: FnCreateASTList } = {};
  setLeaf(...C: typeof ASTLeaf[]): void {
    for (const C2 of C) {
      this.check(C2);
      this.leafClass[C2.CLASS_ID] = C2;
    }
  }
  getLeaf(C: typeof ASTLeaf): typeof ASTLeaf {
    this.check(C);
    const C2 = this.leafClass[C.CLASS_ID];
    if (C2 == null) throw new Error('there is no class for: ' + C.CLASS_ID);
    return C2;
  }
  setList(...C: typeof ASTList[]) {
    for (const C2 of C) {
      this.check(C2);
      this.listClass[C2.CLASS_ID] = C2;
    }
  }
  getList(C: typeof ASTList): typeof ASTList {
    this.check(C);
    const C2 = this.listClass[C.CLASS_ID];
    if (C2 == null) throw new Error('there is no class for: ' + C.CLASS_ID);
    return C2;
  }
  // setLeaf(C: typeof ASTLeaf): void {
  //   this.leafCreator[C.CLASS_ID] = (t: Token) => new C(t);
  // }
  getLeafCreator(C: typeof ASTLeaf): FnCreateASTLeaf {
    this.check(C);
    const C2 = this.getLeaf(C);
    return (t: Token) => new C2(t);
  }
  setListCreator(C: typeof ASTList, creator: FnCreateASTList): void {
    this.check(C);
    this.listCreator[C.CLASS_ID] = creator;
  }
  getListCreator(C: typeof ASTList): FnCreateASTList {
    this.check(C);
    const fn = this.listCreator[C.CLASS_ID];
    if (fn == null) {
      const C2 = this.getList(C);
      return (children: ASTree[]) => new C2(children);
    }
    return fn;
  }
  private check(C: unknown) {
    if (
      typeof (C as any).CLASS_ID !== 'string' ||
      (C as any).CLASS_ID.length < 1
    ) {
      throw new Error('AST class must have a CLASS_ID');
    }
  }
}

const astFactory = new ASTFactory();
export { astFactory };
