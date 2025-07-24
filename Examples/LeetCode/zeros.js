// 零矩阵
// https://leetcode.cn/leetbook/read/array-and-string/ciekh/



const setZeros = function(matrix) {
    const n = matrix.length;
    const m = matrix[0].length;
    const rows = {};
    const cols = {};

    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++){
            const cur = matrix[i][j];
            if(cur === 0) {
                rows[i] = true;
                cols[j] = true;
            }
        }
    }

    console.log(rows, cols, 'rows cols');

    Object.keys(rows).forEach(key => {
        matrix[key].fill(0);
    })
    console.log(matrix);

    Object.keys(cols).forEach(key => {
        for(let i = 0; i < n; i++) {
            matrix[i][key] = 0;
        }
    })
    console.log(matrix);
}
setZeros([[1,1,1],[1,0,1],[1,1,1]])