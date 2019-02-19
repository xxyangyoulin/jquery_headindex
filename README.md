# jquery_headindex
jQuery插件，自动生成文章目录索引，手风琴式折叠显示，自动定位当前位置。  

[查看演示](https://mnnyang.github.io/jquery_headindex/test)
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
        scrollSelector: 'body,html',/*滑动元素的选择器*/
        scrollWrap: window,/*能够监听到scrollSelector滑动的选择器*/

        subItemBoxClass: "index-subItem-box",
        itemClass: "index-item",
        linkClass: "index-link",
        offset: 0,/*滑动偏移量 按需求进行偏移*/
}
```