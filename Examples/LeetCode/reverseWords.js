// 反转字符串里的单词
// https://leetcode.cn/leetbook/read/array-and-string/crmp5/

var reverseWords = function(s) {
    s = s.trim();
    return s.split(" ").reverse().filter(v=>v).join(" ");
}