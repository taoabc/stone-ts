# 《两周自制脚本语言》书籍的TS实现

原书使用Java来实现，这里使用TS进行了实现，其中使用到Reviser的部分，使用了工厂和修改原型链来配合实现

该程序在node 16.6.1 版本测试通过

## 运行方法

```bash
npm install
npm run build-w
node dist/chap{x}/Runner.js
```

前13章的代码和书本代码一致
第14章的指定类型相关的代码自测通过
第14章的类型推导，由于需要动态修改TypeInfo，TypeEnv等类，这里就不再使用astFactory这样的方式来做了，所以代码写好了，但是还没有运行。
第14章的转机器码，由于使用了nodejs，无法进行转换，故这块的代码也是缺失的。