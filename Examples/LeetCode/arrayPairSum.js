// 数组拆分
// https://leetcode.cn/leetbook/read/array-and-string/c24he/

// 解法1：sort 快排
var arrayPairSum = function (nums) {
    nums.sort((a, b) => a - b);
    let ans = 0;
    // for (let i = 0; i < nums.length; i += 2) {
    //     ans += nums[i];
    // }
    let i = 0;
    while (i < nums.length) {
        ans += nums[i];
        i += 2;
    }
    return ans;
};

// 解法2：实现sort 快排
// 快排sort
var quickSort = function(nums, left, right) {
    if (left > right) return;
    let pivot = nums[left];
    let i = left, j = right;
    while (i < j) {
        // 从右边开始，找第一个小于基准数的位置
        while (i < j && nums[j] >= pivot) j--;
        // 从左边开始，找第一个大于等于基准数的位置
        while (i < j && nums[i] <= pivot) i++;
        if(i < j) {
            let temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
        }
    }
    // 基准数归位
    nums[left] = nums[i];
    nums[i] = pivot;
    // 递归处理左边
    quickSort(nums, left, i - 1);
    // 递归处理右边
    quickSort(nums, i + 1, right);
}

var arrayPairSum = function (nums) {
    let left = 0,
        right = 1;
    let ans = 0;
    while (left < right) {
        ans += Math.max(nums[left], nums[right]);
        left+=2;
        right = left + 1;
    }
    return ans;
};
