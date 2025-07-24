//  最长公共字符串
// https://leetcode.cn/leetbook/read/array-and-string/ceda1/


var longestCommonPrefix = function(strs) {
    let minStr = strs.reduce((a,b) => a.length < b.length ? a : b);

    while(minStr.length > 0) {
        let isPrefix = strs.every(str => str.startsWith(minStr));
        if(isPrefix) {
            return minStr;
        } else {
            minStr = minStr.slice(0, -1);
        }
    }
};