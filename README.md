# jquery_headindex
jQuery插件，自动生成文章目录索引，手风琴式折叠显示，自动定位当前位置。

## 怎么使用？
step 1. 导入jquery和jquery.headindex
```js
<script src="./js/jquery.3.3.1.js"></script>
<script src="../jquery.headindex.min.js"></script>
```

setp2. 
```js
$(function () {
    $('.article-wrap').headIndex({
        articleWrap: '.article-content',//包裹文章的元素的选择器
        indexBox: '.index-box',//用来放目录索引的元素的选择器
        //other options
    })
})
```