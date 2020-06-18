# jquery_headindex
jQuery插件，自动生成文章目录索引，手风琴式折叠显示，自动定位当前位置，排除不要的标题；  
jQuery plugin, automatically generate article directory index, accordion-style folding display, automatically locate the current position, excluding unwanted titles;  

[查看Demo](https://xxyangyoulin.github.io/jquery_headindex/test)
## 怎么使用？
step 1. 导入jquery和jquery.headindex
```js
<script src="./js/jquery.3.3.1.js"></script>
<script src="../jquery.headindex.min.js"></script>
```

setp2. 
```js
$(function () {
    $(document).headIndex({
                articleWrapSelector: '.article-wrap',//包裹文章的元素的选择器
                indexBoxSelector: '.index-box',//用来放目录索引的元素的选择器
            });
})
```

默认参数
```js
defaultOptions = {
        articleWrapSelector: ".article-wrap",/*包裹文章的选择器*/
        indexBoxSelector: ".index-box",/*包裹目录索引的选择器*/
        indexBoxWrap: null,/*包裹目录索引的选择器,有目录的时候显示该控件，没有目录的时候隐藏该控件。*/
        scrollSelector: 'body,html',/*滑动元素的选择器*/
        scrollWrap: window,/*能够监听到scrollSelector滑动的选择器*/
        hasDynamicEffect: true,/*是否有动态手风琴效果*/
        excludeSelector: null,/*排除标题的选择器*/
        offset: 0,/*滑动偏移量 按需求进行偏移*/
        subItemBoxClass: "index-subItem-box",
        itemClass: "index-item",
        linkClass: "index-link",
}
```
某些布局下，滚动时位置不准确的问题  
这个需要自己手动适配一下，重写方法：
```js
offsetTop: function (elem) {
    

```
届时，`offset`可能失效。
