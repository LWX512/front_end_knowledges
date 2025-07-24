// 数组普通类型
let arr1: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// 数组泛型
// let arr1: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];


interface ArrItem {
  name: string;
  age?: number;
  children?: ArrItem[];
}

let arr2: ArrItem[] = [{ name: "xiaoming" }];

// 元祖类型 
let arr3: [string, number] = ["xiaoming", 18];


function arrfn (...args) {
    // ts 提供内置IArguments 定义
    let a: IArguments = arguments
}