;(function ($) {
    var headIndex = (function () {
        function headIndex(element, options) {
            this.settings = $.extend(true, $.fn.headIndex.default, options || {});
            this.element = element;
            this.init();
        }

        headIndex.prototype = {
            init: function () {
                var articleWrap = $(this.settings.articleWrap);
                this.headerList = articleWrap.find(':header');
                this.indexBox = $(this.settings.indexBox);
                this.scrollBody = $(this.settings.scrollSelector);
                this.manual = false;

                if (this.indexBox.length === 0 || this.headerList.length === 0) {
                    return null;
                }

                this.initHeader();
                this.event();
            },

            initHeader: function () {
                for (var i = 0; i < this.headerList.length; i++, this.autoId++) {
                    //文章header添加id和计算高度
                    this.headerList[i].id = this.headerList[i].id || "header-id-" + this.autoId;
                    this.headerList[i].topHeight = this.offsetTop(this.headerList[i]);
                    this.headerList[i].h = Number(this.headerList[i].tagName.charAt(1));
                }

                this.indexTree = [];
                this.indexHtml = '';
                this.buildTree();
                this.buildHtml(this.indexTree);

                if (this.indexHtml) {
                    var res = '<ul>' + this.indexHtml + '</ul>';
                    this.indexBox.html(res);
                }
                // this.indexBox.html(this.indexHtml);
            },

            updateTopHeight: function () {
                var length = this.headerList.length;
                var i;
                if (length === 0) return;

                if (this.headerList[0].topHeight === this.offsetTop(this.headerList[0])
                    && this.headerList[length - 1].topHeight === this.offsetTop(this.headerList[length - 1])) {
                    return;
                }

                if ((this.headerList[0].topHeight - this.offsetTop(this.headerList[0]))
                    === (this.headerList[length - 1].topHeight - this.offsetTop(this.headerList[length - 1]))) {

                    var hx = this.offsetTop(this.headerList[0]) - this.headerList[0].topHeight;
                    for (i = 0; i < this.headerList.length; i++, this.autoId++) {
                        this.headerList[i].topHeight += hx;
                    }
                    return;
                }

                for (i = 0; i < this.headerList.length; i++, this.autoId++) {
                    this.headerList[i].topHeight = this.offsetTop(this.headerList[i]);
                }
            },

            event: function () {
                var that = this;
                var manualValTimer = null;
                this.indexBox.on('click.headindex', function (event) {
                    var target = $(event.target);
                    if (target.hasClass(that.settings.linkClass)) {
                        event.preventDefault();
                        var indexItem = target.parent('.' + that.settings.itemClass);

                        that.manual = true;
                        if (manualValTimer) {
                            clearTimeout(manualValTimer);
                            manualValTimer = null;
                        }
                        manualValTimer = setTimeout(function () {
                            that.manual = false;
                        }, 300);
                        that.current(indexItem);

                        //滚动到当前的标题
                        that.scrollBody.stop().animate({
                            scrollTop: that.offsetTop(document.querySelector(event.target.getAttribute('href')))
                        }, 'fast');
                    }

                });

                $(window).scroll(function () {
                    if (that.manual) return;

                    var scrollTop = that.scrollBody.scrollTop();
                    that.updateTopHeight();

                    var find = that.search(0, that.headerList.length, scrollTop);//
                    if (!find) {
                        return;
                    }

                    var indexItem = that.indexBox.find('a[href="#' + find.id + '"]').parent('li.' + that.settings.itemClass);

                    that.current(indexItem);

                });
            },

            current: function (indexItem) {
                var subBox,
                    currentClass = 'current';

                if (!indexItem.hasClass(currentClass)) {
                    //移除其他位置的current类
                    var otherCurrent = this.indexBox.find('li.' + currentClass);
                    if (otherCurrent.length > 0) {
                        otherCurrent.removeClass(currentClass);
                    }
                    //先清除全部的open标记
                    this.indexBox.find('ul.open').removeClass('open');

                    //打开当前下级别的subItemBox
                    subBox = indexItem.children('.' + this.settings.subItemBoxClass);
                    if (subBox.length > 0) {
                        subBox.addClass('open').slideDown();
                    }

                    //为了应对非常快速滑动的时候，scroll函数略过父级的box
                    var parentsBox = indexItem.parents('ul.' + this.settings.subItemBoxClass);
                    if (parentsBox.length > 0) {
                        parentsBox.addClass('open').slideDown()
                    }

                    //关闭其他位置打开的subItemBox 排除当前父级上的subItemBox
                    subBox = this.indexBox.find('ul.' + this.settings.subItemBoxClass).not('.open');
                    if (subBox.length > 0) {
                        subBox.slideUp()
                    }

                    //为当前添加current类
                    indexItem.addClass(currentClass);


                }
            },

            buildHtml: function (tree) {
                if (tree === undefined || tree.length === 0) return;

                for (var i = 0; i < tree.length; i++) {
                    this.indexHtml += "<li class='" + this.settings.itemClass + "'>"
                        + "<a class='" + this.settings.linkClass + "' href='#" + tree[i].item.id + "'>"
                        + tree[i].item.innerText + "</a>";

                    if (tree[i].children.length !== 0) {
                        this.indexHtml += "<ul class='" + this.settings.subItemBoxClass + "'>";
                        this.buildHtml(tree[i].children);
                        this.indexHtml += "</ul>";
                    }
                    this.indexHtml += "</li>"
                }
            },
            buildTree: function () {
                var current = null;
                var tempCur;
                for (var i = 0; i < this.headerList.length; i++) {
                    if (current == null) {
                        current = {
                            item: this.headerList[i],
                            parent: null,
                            children: [],
                        };
                        this.indexTree.push(current);

                    } else {
                        if (current.item.h < this.headerList[i].h) {
                            tempCur = {
                                item: this.headerList[i],
                                parent: current,
                                children: [],
                            };
                            current.children.push(tempCur);
                            current = tempCur;

                        } else if (current.item.h === this.headerList[i].h) {
                            tempCur = {
                                item: this.headerList[i],
                                parent: current.parent,
                                children: [],
                            };
                            ((current.parent && current.parent.children) || this.indexTree).push(tempCur);
                            current = tempCur;
                        } else {

                            while (current != null && current.item.h > this.headerList[i].h) {
                                current = current.parent;
                            }

                            if (current == null) {
                                current = {
                                    item: this.headerList[i],
                                    parent: null,
                                    children: [],
                                };
                                this.indexTree.push(current);

                            } else {
                                if (current.item.h < this.headerList[i].h) {
                                    tempCur = {
                                        item: this.headerList[i],
                                        parent: current,
                                        children: [],
                                    };
                                    current.children.push(tempCur);
                                    current = tempCur;

                                } else if (current.item.h === this.headerList[i].h) {
                                    tempCur = {
                                        item: this.headerList[i],
                                        parent: current.parent,
                                        children: [],
                                    };
                                    ((current.parent && current.parent.children) || this.indexTree).push(tempCur);
                                    current = tempCur;
                                }
                            }
                        }
                    }
                }
            },
            search: function (start, end, findValue) {
                if (this.headerList.length === 0) return null;

                if (end - start <= 1) {
                    if (this.headerList[end].topHeight < findValue) {
                        return this.headerList[end];
                    }
                    return this.headerList[start];
                }

                if (start < end) {
                    var middleIndex = parseInt((start + end) / 2);
                    var middleValue = this.headerList[middleIndex].topHeight;
                    if (findValue < middleValue) {
                        end = middleIndex;
                    } else if (findValue > middleValue) {
                        start = middleIndex
                    } else {
                        return this.headerList[middleIndex];
                    }
                    return this.search(start, end, findValue)
                }
            },

            offsetTop: function (elem) {
                var rect, win;
                if (!elem) {
                    return;
                }
                // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
                // Support: IE <=11 only
                // Running getBoundingClientRect on a
                // disconnected node in IE throws an error
                if (!elem.getClientRects().length) {
                    return {top: 0, left: 0};
                }

                // Get document-relative position by adding viewport scroll to viewport-relative gBCR
                rect = elem.getBoundingClientRect();
                win = elem.ownerDocument.defaultView;
                return parseInt(rect.top + win.pageYOffset);
            },

        };

        headIndex.prototype.autoId = 1;

        return headIndex;
    })();

    //-----------------------------------
    // 插件一般模板
    //-----------------------------------
    $.fn.headIndex = function (options) {
        return this.each(function () {
            var $this = $(this),
                instance = $this.data("headIndex");
            if (!instance) {
                instance = new headIndex($this, options);
                $this.data("headIndex", instance);
            }
            if ($.type(options) === "string") return instance[options]();
        });
    }

    $.fn.headIndex.default = {
        articleWrap: ".article-wrap",
        indexBox: ".index-box",
        scrollSelector: 'body,html',
        subItemBoxClass: "index-subItem-box",
        itemClass: "index-item",
        linkClass: "index-link",
    }
})(jQuery);
