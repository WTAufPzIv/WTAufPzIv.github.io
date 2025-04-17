---
date: 2020-02-04
categories: [技术,前端,杂项]
---
# 关于react hook中数组state的更新
react hook只用了useState钩子函数来给函数（无状态）组件添加状态，今天在写一个小应用的时候就遇到了问题，我设置了一个状态为messagearr数组用来存储当前收到的消息，默认为空。当接收到新消息，则使用setMessagearr进行更新，但却遇到了问题
我们已经知道react hook更新数组不是往原数组里添加项目，而是要用一个新数组完全替代，所以不能直接这样写

>messagearr.push(newitem)
> setMessagearr(messagearr)

但是我用下面这个写法出现了问题
<!--more-->
```javascript
import React, { useEffect, useState } from 'react'
function Index(){
    const [messagearr, setMessagearr] = useState([])
    //接收到新消息时调用这个函数
    function changeMessageArr(e){
		 setMessagearr([...messagearr,{from:data.from, to:data.to, message:data.message}])
         console.log(messagearr)
	}
    return (
		
	)
}
export default Index
```
![](/images/assets/20200204140507726.png)
可以看到，每次接收到新消息，调用函数，明明已经向messagearr中添加新项目，但是打印出来全都是空数组
折腾了一番，用下面的写法勉强解决，但是最终原因还要进一步学习研究

```javascript
function changeMessageArr(e){
        // setMessagearr([...messagearr,{from:e.from, to:e.to, message:e.message}])
        setMessagearr(messagearr => {return [...messagearr,{from:e.from, to:e.to, 	message:e.message}]})
        console.log(messagearr)
   }
```
