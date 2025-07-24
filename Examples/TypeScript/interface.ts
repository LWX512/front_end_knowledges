/**
 * interface
 *
 * 重复声明 重合
 * 任意key
 * readonly
 * 接口继承
 * 定义函数类型
 */

interface A {
  x: number;
}

interface AItem {
  name: string;
}

interface AItem extends A {
  age: number;
  status?: string; // 可选
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


// 对function 约束

interface Fn {
  (name: string): string[];
}

const fn1: Fn = function (name: string) {
  return ["x"];
};
