// 长度最小的字数组
// https://leetcode.cn/leetbook/read/array-and-string/c0w4r/


var minSubArrayLen = function(target, nums) {
    let fast = slow = 0,
    sum = 0,
    min = 0;
    while(fast < nums.length){  //快指针超出数组范围后跳出循环
        sum = sum + nums[fast];
        console.log(sum, nums[fast], fast, 'fast');
        if(sum >= target){
            while(sum - nums[slow] >= target){  //收缩慢指针的条件
                sum = sum -nums[slow];  //收缩慢指针
                slow++;
                console.log(sum, nums[slow], slow, 'slow');
            }
            min = min===0?fast - slow + 1:Math.min(min,fast - slow + 1);
            //更新最小值，注意min为0时需要初始化min
        }
        fast++;
    }
    return min;
}