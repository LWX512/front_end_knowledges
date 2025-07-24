### 类型断言

```ts
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

**在我们类型断言的时候要注意只会欺骗TypeScript，不会修改真正的JS类型，所以断言需谨慎**

```ts
function fn(num: number | string) {
    const a : string = num as string;
}


const asFn = (num: number | string) => {
  //不要随便使用 断言 number 是没有length属性的
  if (typeof num === "number") {
    console.log(num, "number 类型");
  } else {
    console.log((num as string).length, "string 类型");
  }
};

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


```

### 联合类型
```ts
type A = number | string;
const a: A = 1;

const b: A = "1";
```

### 交叉类型

```ts

type A = { a: string };


type B = { b: string };

type AB = A & B;

const ab: AB = { a: "1", b: "2" };

```

### enum 枚举类型
- 枚举：枚举的意思就是 ---- 列举，把所以的情况都列举出来，那么取值的时候，只有这几个可以使用，其他的不行
  
```ts
enum A  {
    A1 = 1,
    B2 = 2,
    C3 = 3
}

const a: A = A.A1;

const aArr = [A.A1, A.B2, A.C3];

```