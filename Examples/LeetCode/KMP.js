// KMP 算法
// https://leetcode.cn/leetbook/read/array-and-string/cm5e2/

// KMP 讲解 https://blog.csdn.net/yyzsir/article/details/89462339

// KMP next 讲解 https://blog.csdn.net/Ruiren_/article/details/129595037

function getNext(str) {
    let next = []
    let k = -1
    let j = 0
    next[0] = k
    while (j < str.length - 1) {
        if (k === -1 || str[j] === str[k]) {
            k++
            j++
            next[j] = k
            console.log(j, k, next[j], str[j], str[k], 'j k next')
            
        } else {
            k = next[k]
        }
    }
    return next
}
4
var strStr = function(haystack, needle) {
    if (needle.length === 0) return 0
    let next = getNext(needle)
    let i = 0
    let j = 0
    while (i < haystack.length) {
        if (haystack[i] === needle[j]) {
            i++
            j++
        }
        if (j === needle.length) {
            return i - j
        } else if (i < haystack.length && haystack[i] !== needle[j]) {
            if (j !== 0) {
                j = next[j - 1]
            } else {
                i++
            }
        }   
    }
}

strStr('sabbutsad', 'sad')