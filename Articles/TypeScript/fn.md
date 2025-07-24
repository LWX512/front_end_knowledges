### 函数

```js
// 函数定义类型和返回值  箭头函数定义类型和返回值
function fnAdd(a: number, b: number): number {
  return a + b;
}
const fnAdd1 = (a: number, b: number): number => a + b;
console.log(fnAdd(1, 2), fnAdd1(1, 2));

// 默认值
function fnDefaultValue(a: number = 5, b: number = 10): number {
  return a + b;
}

console.log(fnDefaultValue());

// 可选参数
function fnOptional(a: number = 1, b?: number): number {
  return a + (b || 0);
}

console.log(fnOptional());

// 对象定义
interface FnUser {
  name: string;
}

function fnUser(user: FnUser): FnUser {
  return user;
}
console.log(fnUser({ name: "张三" }));

// 函数this类型

interface FnObj {
  arr: number[];
  fnObjArr: (this: FnObj, num: number) => void;
}
// ts 可以定义this 的类型 在js中无法使用 必须是在第一个参数定义this的类型
let fnObj: FnObj = {
  arr: [1, 2, 3],
  fnObjArr(this: FnObj, num: number) {
    this.arr.push(num);
  },
};

fnObj.fnObjArr(4);

console.log(fnObj.arr);

// 函数重载
const fnarr = [1, 2, 3, 4, 5, 6];
function fnOverload(id: number[]): number[]; // 如果传入的是number 类型的数组就做添加
function fnOverload(id: number): number[]; // 如果传入了id 就是单个查询
function fnOverload(): number[]; // 如果没有传入东西就做查询全部
function fnOverload(ids?: number | number[]): number[] {
  if (typeof ids === "number") {
    return fnarr.filter((v) => v === ids);
  }else if(Array.isArray(ids)) {
    return fnarr.concat(ids)
  }else {
    return fnarr;
  }
} // 如果没有传入东西就做查询全部


// 泛型函数承载
function fnGeneric<T>(id: T): T {
  return id;
}

console.log(fnGeneric<string>("张三"));

// 泛型接口
interface FnGeneric<T> {
  (id: T): T;
}
const fnGeneric2: FnGeneric<string> = (id) => id;

```