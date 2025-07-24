// 对角线遍历
// https://leetcode.cn/leetbook/read/array-and-string/cuxq3/

const findDiagonalOrder = function(mat) {
    const n = mat.length - 1;
    const m = mat[0].length - 1;
    let k = 0;
    let l = 0;
    const arr = [];

    for(let i = 0; i <= n + m; i++) {
        if(i % 2 === 0) {
            for(let j = k; j >= i - l; j--) {
                arr.push(mat[j][i - j]);
            }
        } else {
            for(let j = l; j >= i - k; j--) {
                arr.push(mat[i - j][j]);
            }
        }
        k = k < n ? k + 1 : n;
        l = l < m ? l + 1 : m;
    }

    console.log(arr);
}

const arr = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
]
findDiagonalOrder(arr)