TypeScript 学习

## 什么是 TypeScript ？

### TypeScript 是一种由微软开发的开源编程语言，它是 JavaScript 语言的一个超集，支持 JavaScript 中的所有语法和特性，并在此基础上添加了一些新的特性。

    TypeScript与JavaScript最大的不同是它引入了静态类型检查机制，通过在编译时检查变量的类型，可以帮助程序员更快速地找出代码中潜在的错误。

## TypeScript 特点

[1.] 类型系统：TypeScript 支持静态类型、动态类型的检查，还有类型推断功能，让程序员能够更好地编写易于维护、可扩展且可读性高的代码。
[2.] 强大的开发工具：TypeScript 具有完整的编辑器和开发工具支持，包括语法高亮、自动补全、重构等功能，还支持多种常用的构建工具。
[3.] 容易上手：TypeScript 基于 JavaScript 语言，对于已经掌握 JavaScript 开发的开发者们来说，学习成本相应较低，只需要花费少量时间阅读文档和实践即可。
[4.] 增强代码质量：TypeScript 能够在编译时发现代码中的潜在错误，减少运行时异常导致的问题，同时提高代码的可读性和可维护性。
[5.] 兼容性：TypeScript 兼容 JavaScript 的所有版本和第三方库，可以无缝地向已有的 JavaScript 项目中引入 TypeScript。
[6.] 社区支持：TypeScript 拥有庞大的社区支持，有丰富的文档和资源可供使用，并且在 GitHub 上有着很高的活跃度。

## 第一步

[1.] 安装 node.js

[2.] 安装 typescript

```JavaScript
npm init -y //初始化

npm  i typescript -g
tsc -v //查看版本

// 初始化
tsc --init

// nodejs 环境执行ts
npm i ts-node -g //
npm i @types/node -D // 安装nodejs 类型定义
// 可以采用 实时监听我们的 ts 文件，然后生成 js 文件
tsc -w
```

### 字符串类型

```javaScript
let str: string = 'hello world';
```

也可以使用模板字符串

```javaScript
let xm: string = `xiaoming${str}`;
```

### 数字类型

```javaScript
let num: number = 100; //普通数字
let notANum: number = NaN; // NaN
let infinityNum: number = Infinity; //无穷大
let devimalNum: number = 5   // 十进制  十进制就是从 0-9的数字就被称之为10进制
let hexNum: number = 0xf00d; //十六进制   十六进制是由 0-9 这个十个数字 加上 A-F/a-f 这六个字符组合成 共有16个字符
let binaryNum: number = 0b1010; //二进制  二进制是由 0-1 这两个数字组合成
let octalNum: number = 0o744; //八进制  八进制是由 0-7 这八个数字组合成
```

### 布尔类型

**TIP**：这里注意使用用构造函数创造的 Boolean 不是布尔值是一个对象

```javaScript
// 这个报错的问题是 他不是Boolean类型，而是Boolean对象
let createBoolean: boolean = new Boolean(1); // 创建一个Boolean对象
```

我们可以将上面的这个改成

```javaScript
let isOk: boolean = true; // true/false
let okBoolean: boolean = Boolean(1); // 也可以通过创建一个Boolean对象
```

### undefined 和 null 类型

```javascript
let u: undefined = undefined; // undefined类型
let n: null = null; // null 类型
```

### 空值类型

在 JavaScript 当中是没有空值这么一说的， 在 TypeScript void 是可以用在函数当中

```javascript
function fn(): void {
    console.log('hello world');
}
```

void 主要用法, 是在不想让调用者知道返回值是什么

当然也可以使用在 undefined 和 null

```javascript
let u: void = undefined;
let n: void = null;
```

**TIP**
**如果你配置了 tsconfig.json 开启了严格模式**

```javascript
{
	compilerOptions: {
		"strict": true,
	}
}
```

**这里是不可以将 null 赋值给 void 类型**

```javascript
/**
 * 因为null 是一个特殊的值标识一个空对象引用，它是JavaScript中的一个原始值，表示一个变量没有值或者对象不指向任何实际的对象
 * 虽然 undefined 和null 在某些情况下可以交换使用，但这两个的含义不同的，undefined 表示变量未定义或者一个对象属性不存在，而null 表示 一个变量被明确地赋值为一个空对象引用
 */
let n: void = null;
let u: void = undefined;
```

### void 和 undefined 和 null 最大的区别

**与 void 的区别是，undefined 和 null 是所有类型的子类型。也就是说 undefined 类型的变量，可以赋值给 string 类型的变量：**

```javascript
//这样写会报错 void类型不可以分给其他类型
let u: void = undefined;
let str: string = '1';

u = str;
```

在不严格的情况下才可以分配这些类型

```javascript
let u: undefined = undefined;
let str: string = '1';

str = u;

let n: null = null;
let str: string = '1';

str = n;
```