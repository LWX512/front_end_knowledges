// 联合类型
let jointPhone: string | number = "18616022206";

// 交叉类型
interface CorssPople {
  name: string;
}

interface CorssMan {
  sex: string;
}

const corssFn = (man: CorssMan & CorssPople) => {
  console.log(man.name);
  console.log(man.sex);
};
corssFn({
  name: "张三",
  sex: "男",
});

// 类型断言
// 在使用断言的时候只会欺骗我们的typescript，不会改变js的类型，所以断言的时候要小心。
const asFn = (num: number | string) => {
  //不要随便使用 断言 number 是没有length属性的
  if (typeof num === "number") {
    console.log(num, "number 类型");
  } else {
    console.log((num as string).length, "string 类型");
  }
};

console.log(asFn("123"));

interface AsA {
  a: string;
}

interface AsB {
  b: string;
}

const fna = (obj: AsA | AsB) => {
  // 这两种断言都可以
  console.log(<AsA>obj);
  console.log(obj as AsA);
};
