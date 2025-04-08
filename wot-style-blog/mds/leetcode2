# 罗马数字与阿拉伯数字互相转换（难度：中等）
罗马数字包含以下七种字符： I， V， X， L，C，D 和 M。
![](/images/assets/20200407223717641.png)
 罗马数字 2 写做 II ，即为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 
 
 通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：

I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。 
C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。

<!--more-->

## 阿拉伯数字转罗马数字
核心的思想就是使用贪心算法，考虑到题目中所说存在左边的罗马数字小于右边的罗马数字的特殊情况，我们使用一个哈希表来存贮所有可能的元组合。然后实行贪心算法

代码如下：

```javascript
var intToRoman = function(num) {
    let n = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
    str = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'],
    res = ''
    while(num > 0){
        if(num < n[0]){
            n.shift()
            str.shift()
            continue
        }
        num -= n[0]
        res += str[0]
    }
    return res
};
```

## 罗马数字转阿拉伯数字
遍历传入的字串，但是每次遍历要往后多看一位，如果当前罗马字母代表的数字小于下一个罗马字母代表的数字，那么需要作减法之后加到结果上，否则直接加到结果上

代码如下：

```javascript
var romanToInt = function(s) {
    let str = {
        'M' : 1000, 
        'CM' : 900, 
        'D' : 500, 
        'CD' : 400, 
        'C' : 100, 
        'XC' : 90, 
        'L' : 50, 
        'XL' : 40, 
        'X' : 10, 
        'IX' :9, 
        'V' : 5, 
        'IV' : 4, 
        'I' : 1,
    },
    res = 0

    let arr = s.split('')
    while(arr.length > 0){
        if(str[arr[0]] < (str[arr[1]] || 0)){
            res += (str[arr[1]] - str[arr[0]])
            arr.shift()
            arr.shift()
        }
        else{
            res += str[arr[0]]
            arr.shift()
        }
    }
    return res
};
```
