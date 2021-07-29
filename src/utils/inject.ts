// 该文件模拟书上的GluonJ，实际上直接写入ASTree会更加优美
export function inject(target: Object, source: Object) {
  const names = Object.getOwnPropertyNames(source);
  for (const name of names) {
    if (name !== 'constructor') {
      Object.defineProperty(target, name, { value: (source as any)[name] });
    }
  }
}
