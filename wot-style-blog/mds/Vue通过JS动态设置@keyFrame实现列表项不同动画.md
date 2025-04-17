---
date: 2020-07-23
categories: [技术,前端,Vue]
toc: true
---

# 预期效果
![](/images/assets/20200723213259494.gif)
对于这个效果，可以选择height配合transition实现，但是css3提供了更流畅的animation，我们就用它来实现这个需求吧

可以看到每一项animation的keyframe都不一样，也就是每一项需要动态使用不同的关键帧。所以主要使用的方法就是动态地往document里插入具有不同关键帧的styleElement，然后在触发动画的地方将animation属性赋给对应的元素。

<!--more-->

html代码

```html
<div :style="pillarAnimationStyle">
	<span>{{ pillar.usedCount }}</span>
</div>
```

pillarAnimationStyle是该组件的一个data。
pillarHeight也是当前组件的data，表示当前项需要它渲染到的高度。
index代表当前组件的序号，用来区分不同的关键帧

于是在需要触发动画的地方的代码如下：

```javascript
const style = document.createElement('style');
style.setAttribute('type', 'text/css');
document.head.appendChild(style);

const sheet = style.sheet;
sheet.insertRule(
    `@keyframes pillarAnimation` + this.index + `{
        from {
            height: 0px;
        }
        to {
            height: ` + this.pillarHeight + `px;
        }
    }`, 0
);
this.pillarAnimationStyle = {
    animation: 'pillarAnimation' + this.index + ' .8s forwards',
};
```

解决！！！
