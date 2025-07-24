### Set 和 Map

#### Set 使用方式

-   属性值有
    -   `set.add` 添加值
    -   `set.delete` 删除某一个值，删除成功返回 `true`，删除失败返回 `false`
    -   `set.has` 判断某一个值是否存在
    -   `set.clear` 清空集合
    -   `set.size` 获取集合的元素个数
-   遍历
    -   `for...of`
    -   `for...in`

```js
const set = new Set();
set.add(1);
set.add(2);
set.add(3);

console.log(set.size); // 3

set.delete(2);
console.log(set.has(2)); // false

set.clear();
console.log(set.size); // 0

for (const item of set) {
    console.log(item); // 1 3
}

for (const item in set) {
    console.log(item); // 1 3
}
```

**TIP 注意 `set` 不可以更改值**

只能以 `set.add` 添加值，不能以 `set.value = 1` 的方式更改值

或者使用

```js
const set = new Set();

set.add(1);

set.add(2);

set.add(3);

console.log(set.size); // 3

// 我们希望把1换成4
set.delete(1);
set.add(4);

```
**TIP 只能通过这种方式删除修改**
另外再强调一下 如果再碰到面试官说修改直接回怼，这种情况如果说了没有还是问，那就是找茬。

#### Map 使用方式

-   属性值有
    -   `map.set` 设置键值对
    -   `map.get` 获取键对应的值
    -   `map.has` 判断某一个键是否存在
    -   `map.delete` 删除某一个键值对，删除成功返回 `true`，删除失败返回 `false`
    -   `map.clear` 清空集合
    -   `map.size` 获取集合的元素个数
-   遍历
    -   `for...of`
    -   `for...in`

```js
const map = new Map();

map.set('name', 'zs');
map.set('age', 18);

console.log(map.size); // 2

map.delete('age');
console.log(map.has('age')); // false

map.clear();
console.log(map.size); // 0

for (const item of map) {
    console.log(item); // ['name', 'zs'] ['age', 18]
}

for (const item in map) {
    console.log(item); // ['name', 'zs'] ['age', 18]
}
```

#### set 和 map 区别

-   `set` 集合，集合中没有重复的值
-   `map` 映射，映射中的键值对，键和值都可以是任意类型

