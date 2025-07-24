// 搜索插入位置
// https://leetcode.cn/leetbook/read/array-and-string/cxqdh/
var searchInsert = function(nums, target) {
    const l = nums.length;
    let left = 0;
    let right = l - 1;
    let i = 0;
    while(left <= right) {
        const mid = Math.floor(left + (right - left ) / 2);
        if(nums[mid] <= target) {
            left = mid + 1;
            i = mid
        } else {
            right = mid - 1
        }
    }
    if(target >= nums[i]) return i + 1;
    return i;
};

searchInsert([1,3,5,6],2)

// 暴力解决

function fun(arr, target) {
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] >= target) {
            return i;
        }
    }
    return arr.length;
}

console.log(fun([1,3,5,6],2))
