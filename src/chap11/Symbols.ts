class Location {
  constructor(public nest: number, public index: number) {}
}
export class Symbols {
  protected table: Map<string, number> = new Map();
  constructor(protected outer?: Symbols) {}
  size(): number {
    return this.table.size;
  }
  append(s: Symbols): void {
    for (const [key, value] of s.table) {
      this.table.set(key, value);
    }
  }
  find(key: string) {
    return this.table.get(key);
  }
  get(key: string) {
    return this.getNest(key, 0);
  }
  getNest(key: string, nest: number): Location | null {
    const index = this.table.get(key);
    if (index == null)
      if (this.outer == null) return null;
      else return this.outer.getNest(key, nest + 1);
    else return new Location(nest, index);
  }
  putNew(key: string): number {
    const i = this.find(key);
    if (i == null) return this.add(key);
    else return i;
  }
  put(key: string): Location {
    const loc = this.getNest(key, 0);
    if (loc == null) return new Location(0, this.add(key));
    else return loc;
  }
  protected add(key: string): number {
    const i = this.table.size;
    this.table.set(key, i);
    return i;
  }
}
