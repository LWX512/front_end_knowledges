### Any 类型 和 unknown 顶级类型

**any 任意类型 unknown 不知道的类型**

**类型等级**
top type 顶级类型 any unknown
2.Object
3.Number String Boolean
4.number string boolean
5.never

-   [1.] 没有强制限定哪种类型，随时切换类型都可以 我们可以对 any 进行任何操作，不需要检查类型

```javascript
// 可以是随意类型
let a: any = 10;
a = '10';
a = true;
```

-   [2.] 声明变量时没有定义类型默认为 any 类型

```javascript
let a;

a = 1;

a = '1';
```

3.弊端如果使用 any 就失去了 TS 类型检测的作用

```javaScript

/**
 * unknown
 * 1. 只能赋值给自身或者any类型
 * 2. 没有办法读取属性 方法也不可以调用比any 更加安全
 */

let un: unknown = {
  name: "xiaozhang",
  fn: () => {
    console.log('fn')
  }
};

un.name
un.fn()

//unknown 可以定义任何类型的值
let value: unknown;

value = true;             // OK
value = 42;               // OK
value = "Hello World";    // OK
value = [];               // OK
value = {};               // OK
value = null;             // OK
value = undefined;        // OK
value = Symbol("type");   // OK

//这样写会报错unknow类型不能作为子类型只能作为父类型 any可以作为父类型和子类型
//unknown类型不能赋值给其他类型
let names:unknown = '123'
let names2:string = names

//这样就没问题 any类型是可以的
let names:any = '123'
let names2:string = names

//unknown可赋值对象只有unknown 和 any
let bbb:unknown = '123'
let aaa:any= '456'

aaa = bbb

let b: unknown = 10;

```

**TIPS**

```javascript
// Object 可以是任何类型 相当于第二个any
let Obj: Object = 1;
let Obj1: Object = '1';
let Obj2: Object = ['1'];
let Obj3: Object = {};
let Obj4: Object = () => 1;
// object 只能是引用类型

// {} 字面量类型 也是支持所有类型
// 字面量类型 只能赋值给字面量类型 不能对这个变量做任何操作
let literal: {} = { a: 1 };
// literal.b = '1'
```
