// 移除元素

var removeElement = function(nums, val) {
    let slow = 0;
    let fast = nums.length - 1;
    let count = 0;
    while (slow <= fast) {
        if (nums[slow] === val) {
            while(nums[fast] === val && fast > slow) {
                fast--;
                count++;
            }
            nums[slow] = nums[fast--];
            count++;
        }
        slow++;

    }
    return nums.length - count;
}