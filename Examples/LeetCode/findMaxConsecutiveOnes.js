// 最大连续1数
// https://leetcode.cn/leetbook/read/array-and-string/cd71t/

var findMaxConsecutiveOnes = function (nums, target = 1) {
    let zero = 0;
    let ans = 0;
    let temp = 0;
    while (zero < nums.length) {
        if(nums[zero] === target) {
            temp++;
        } else {
            temp = 0;
        }
        zero++;
        ans = Math.max(ans, temp);
    }
    return ans;
}

    var minSubArrayLen = function(target, nums) {
        let fast = slow = 0,
        sum = 0,
        min = 0;
        while(fast < nums.length){  //快指针超出数组范围后跳出循环
            sum = sum + nums[fast];
            if(sum >= target){
                while(sum - nums[slow] >= target){  //收缩慢指针的条件
                    sum = sum -nums[slow];  //收缩慢指针
                    slow++;
                }
                min = min===0?fast - slow + 1:Math.min(min,fast - slow + 1);
                //更新最小值，注意min为0时需要初始化min
            }
            fast++;
        }
        return min;
    }
