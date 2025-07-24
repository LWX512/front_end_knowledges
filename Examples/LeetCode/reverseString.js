// 反转字符串
// https://leetcode.cn/leetbook/read/array-and-string/cacxi/

// 解法1：双指针
var reverseString = function(s) {
    let l = 0;
    let r = s.length - 1;
    let temp;
    while (l < r) {
        temp = s[l];
        s[l] = s[r];
        s[r] = temp;
        l++;
        r--;
    }
};

// 解法2：反转
var reverseString = function(s) {
    return s.reverse();
}