// ---------------------------------------    Set    ----------------------------------- 
const set = new Set();

set.add('a');
set.add('b');
set.add('c');

console.log(set.size); // 3

set.delete('a');

set.has('a') // false

set.clear();

console.log(set.size) // 0

// 更新某一项只能通过删除再添加

set.add('a');

set.delete('a');

set.add('d');
// 但是这个添加的地址不是相同位置的

for (let item of set) {
    console.log(item);
}


for(let item in set) {
    console.log(item);
}



// --------------------------------------  map ------------------------------------- 
const map = new Map();

map.set('a', 1);

map.get('a'); // 1

map.has('a'); // true   

map.delete('a');

map.size ; // 0 

map.set('a', 1);

map.set('b', 2);


for(let item of map) {
    console.log(item);
}

for(let item in map) {
    console.log(item)
}

map.clear();