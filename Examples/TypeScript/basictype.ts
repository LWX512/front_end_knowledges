//字符串类型
let str: string = 'hello world';

// 也可以使用模板字符串
let xm: string = `xiaoming${str}`;


// 数字类型
let num: number = 100; //普通数字
let notANum: number = NaN; // NaN
let infinityNum: number = Infinity; //无穷大
let devimalNum: number = 5   // 十进制  十进制就是从 0-9的数字就被称之为10进制
let hexNum: number = 0xf00d; //十六进制   十六进制是由 0-9 这个十个数字 加上 A-F/a-f 这六个字符组合成 共有16个字符
let binaryNum: number = 0b1010; //二进制  二进制是由 0-1 这两个数字组合成
let octalNum: number = 0o744; //八进制  八进制是由 0-7 这八个数字组合成


// 布尔类型
// 这个报错的问题是 他不是Boolean类型，而是Boolean对象
// let createBoolean: boolean = new Boolean(1); // 创建一个Boolean对象

// 我们可以直接这样来使用布尔值
let isOk: boolean = true; // true/false
let okBoolean: boolean = Boolean(1); // 也可以通过创建一个Boolean对象


// 空值类型

/**
 * 在不严格，模式下
 */
function fn(): void {
    console.log('hello world');

    // return null 
}

/**
 * 因为null 是一个特殊的值标识一个空对象引用，它是JavaScript中的一个原始值，表示一个变量没有值或者对象不指向任何实际的对象
 * 
 * 虽然 undefined 和null 在某些情况下可以交换使用，但这两个的含义不同的，undefined 表示变量未定义或者一个对象属性不存在，而null 表示 一个变量被明确地赋值为一个空对象引用
 */

let v1: void = undefined; // undefined
// 这个报错的原因是因为在严格模式下不允许这样  可以将我们初始化ts文件的时候把这一行  "strict": true,  改成false就可以了
// let v2: void = null; // null

let n: null = null

let u: undefined = undefined;

// 这种也是可以的刚才上面也说了是再某些情况可以交换使用 但是在ts当中不能在严格模式使用
// n = u;

// u = n;
