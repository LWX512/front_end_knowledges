// 合并区间
// https://leetcode.cn/leetbook/read/array-and-string/c5tv3/

var merge = function (intervals) {
    intervals.sort((a, b) => a[0] - b[0])   //依次排序
    return intervals.reduce((prev, cur) => {
        let peek = prev[prev.length - 1]    //获取到prev中最后一项
        console.log(peek, cur, 'peek')
        if (peek && peek[1] >= cur[0]) {  //当前项和peek存在交集
            let left = peek[0]
            let right = peek[1] > cur[1] ? peek[1] : cur[1]
            prev[prev.length - 1] = [left, right]
        } else {
            prev.push(cur)
        }
        return prev
    }, [])
};
const intervals = [[1,3],[2,6],[8,10],[15,18]]
console.log(merge(intervals))