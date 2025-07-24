// 输入有序数组
// https://leetcode.cn/leetbook/read/array-and-string/cnkjg/

// 双指针
// but 会超出时间限制
var towSum = function (numbers, target) {
    let left = 0;
    let right = 1;
    while (left < numbers.length) {
        if (numbers[left] + numbers[right] === target) {
            return [left + 1, right + 1];
        }

        if(right >= numbers.length - 1) {
            left++;
            right = left + 1;
            continue;
        }
        right++;
    }
}


var towSum = function (numbers, target) {
    let l = 0;
    let r = numbers.length - 1;
    while (l < r) {
        const num = numbers[l] + numbers[r];
        if(num < target) {
            l++;
        } else if(num > target) {
            r--;
        } else {
            return [l + 1, r + 1];
        }
    }
}