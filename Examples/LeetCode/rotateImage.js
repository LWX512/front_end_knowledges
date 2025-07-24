// 旋转矩阵
// https://leetcode.cn/leetbook/read/array-and-string/clpgd/

var rotate = function(matrix) {
    const l = matrix.length;
    for(let i = 0; i < l / 2; i++) {
        const temp = matrix[i];
        matrix[i] = matrix[l - i - 1];
        matrix[l - i - 1] = temp;
        console.log(l, i, 'l i')
    }

    console.log(matrix);

    for(let i = 0; i < l; ++i) {
        for(let j = i + 1; j < l; ++j) {
            console.log(matrix[i][j], matrix[j][i], 'matrix[i][j] matrix[j][i]')
            const temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    console.log(matrix);
    return matrix;
};

const arr = [[1,2,3],[4,5,6],[7,8,9]];
rotate(arr)