### interface or type
- interface
  - 可以重复声明，重复的地方会重合
  - 任意key
  - readonly
  - 接口继承
  - 定义函数类型
  
```js
interface A {
    x: number;
}

interface AItem {
    name: string;
}

interface AItem extends A {
    age: number;
    status?:string; // 可选
  readonly cb: () => string; // 不可以修改
  [key: string]: any; //索引 任意key
}


let aItem: AItem = {
  //只有 age 和name 是强校验的 其他的不会强校验
  name: "a",
  age: 1,
  x: 1,
  cb: () => {
    return "cb";
  },
};


```

- 对function 约束
```js

interface Fn {
  (name: string): string[];
}

const fn1: Fn = function (name: string) {
  return ["x"];
};

```
### type （类型别名）

- 类似于interface的属性还有一个那就是 `type`

-  可以表示我们的基本类型、还可以表示对象类型、联合类型、元祖、交集

```js
// 基本类型
type UserName = string 

//  联合类型
type UserMsg = string | bollean

// 元祖类型
type UserInfo = [string, number]

// 交集类型
type User = { name: string } & { age: number }
```

### type or interface 区别

- 相同点
  - 都可以描述一个对象或者函数
  - 都可以定义子属性
  - 都可以定义可选属性
  - 都可以定义只读属性
  - 都可以定义函数类型
  - 都可以继承类型
- 不同点
  - interface 描述对象和函数
  - 继承方式不同
  - type 描述基本类型
  - interface 描述对象和函数时，可以实现继承
  - type 描述基本类型时，不可以实现继承

```js 

// 继承
interface A {
  name: string;
}

interface B extends A {
  age: number;
}

type C = { age: number } & A

```
