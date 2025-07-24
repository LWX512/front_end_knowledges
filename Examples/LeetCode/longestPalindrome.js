

 /**
  * 最长回文字符串
  * 这个方法分析两个情况：
  * 1. -----a...a------- （单字母序列）
  * 2. -----aba------
  * 当程序捕获到以上两种情况时，利用left和right两个下标指向两端，
  * 然后向两边扩散来获取回文子串。
  */
 var longestPalindrome = function(s) {
    let sLen = s.length // 存放目标字符串的长度，避免后面重复获取
    if (sLen === 0) return s   // 如果空字符串，直接返回
    let longestPalindromicSubstring = s[0] // 最长回文子串，默认为首字母
    let longestPalindromicSubstringLen = 1  // 最长回文子串的长度，初始化为1
    let index = 0   // 游标，用于遍历目标字符串
    while (index < sLen) {
        let left  = index
        let right = index
        index++
        let someCharStringLen = getSomeCharStringLen(s, left);
        if (someCharStringLen !== 1) {
            // 分析情况一
            right += someCharStringLen - 1
        } else {
            // 分析情况2
            right += 2
        }
        console.log(left, right, index, 'left right')
        if (s[left] === s[right]) {
            let {len, begin, end} = divergency(s, left, right)
            if (len > longestPalindromicSubstringLen) {
                longestPalindromicSubstringLen = len
                longestPalindromicSubstring = s.slice(begin, end + 1)
            }
        } else {
            continue
        }
    }
    return longestPalindromicSubstring
}
// 发散操作
var divergency = function (s, left, right) {
    let lastIndex = s.length - 1
    while (s[left - 1] === s[right + 1] 
            && left > 0 && right < lastIndex) {
                console.log(left, right, s[left - 1], s[right + 1], 'left right')
        left--
        right++
    }
    let len = right - left + 1
    return {
        begin: left,        
        end: right,
        len
    }
}
// 获取单字母序列的长度
var getSomeCharStringLen = function (s, beginIndex = 0) {
    let index = beginIndex
    let len = 1
    while (s[index] === s[++index]) {
        console.log(index, index - 1, s[index], s[index - 1]);
        len++
    }
    return len
}  

longestPalindrome('adebcbeda')