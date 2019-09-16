'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (win, factory) {
    if (typeof define === 'function' && define.amd) {
        define('gameManager', factory);
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        module.exports = factory();
    } else {
        win.GameManager = factory();
    }
})(window, function () {
    var i;
    function GameManager() {
        this.version = '1.0';
        this.def = {
            content: tool.getDom(arguments[0]),
            menu: tool.getDom('title'),
            start: tool.getDom('start'),
            repeat: tool.getDom('repeat'),
            level: 1,
            data: null,
            score: 0,
            hard: 3,
            curtain: 0 //当前没有被找出的方块
        };
        this.init();
    };

    var proto = GameManager.prototype;
    proto.constructor = GameManager;
    /**
     * 等待游戏开始
     */
    proto.waiting = function () {
        var _this = this;
        tool.addEvent(_this.def.start, 'click', function () {
            tool.setAttr(_this.def.start.parentNode, { 'style': 'display: none' });
            tool.setAttr(_this.def.start.parentNode.parentNode, { 'style': 'display: none' });
            _this.init();
        });
    };
    /**
     * 初始化游戏界面
     */
    proto.init = function () {
        var def = this.def;
        def.data = this.getRandom(def.hard);
        def.curtain = def.hard;
        this.create(def, def.data);
        def.level === 1 && this.addEvent(def); //事件委托后只生成一次监听程序
        this.score(def);
    };

    //得分管理
    proto.score = function () {
        var arg = arguments[0];
        if (!arg && arg !== 0) {
            return;
        }
        var def = this.def;
        if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object') {
            arg.data.score = 0;
            arg.data.level = 1;
        } else if (!isNaN(arg)) {
            if (def.data[arg].isTarg) {
                def.score += def.hard;
                --def.curtain;
            }
        }
        tool.html(tool.getDom('level'), def.level);
        tool.html(tool.getDom('score'), def.score + '');
        this.data();
    };

    proto.data = function () {
        var def = this.def,
            _this = this;
        if (!def.curtain) {
            if (def.hard === def.level) ++def.hard;
            ++def.level;
            _this.remove();
        }
    };
    //创建内容
    proto.create = function (def, data) {
        for (i = 0; i < data.length; i++) {
            var img = tool.createDom('img'),
                attrVal = {};
            attrVal = data[i].isTarg ? {
                'src': 'image/1_09.png',
                'draggable': false,
                'style': 'width: ' + 100 / parseInt(def.hard) + '%',
                'id': i
            } : {
                'src': 'image/1_03.png',
                'draggable': false,
                'style': 'width: ' + 100 / parseInt(def.hard) + '%',
                'id': i
            };
            tool.setAttr(img, attrVal);
            tool.addClass(img, 'rotate90');
            def.content.appendChild(img);
        }
    };
    proto.remove = function () {
        var _this = this;
        tool.removeDom(_this.def.content);
        _this.init();
    };
    //点击事件管理
    proto.addEvent = function (data) {
        var _this = this;
        tool.addEvent(data.content, 'click', function (ev) {
            var e = ev || window.event;
            var t = e.target || e.srcElement;
            if (t.nodeName.toLowerCase() === 'img') {
                tool.removeClass(t, 'rotate360');
                tool.addClass(t, 'front');
                setTimeout(function () {
                    // tool.setAttr(t.nextElementSibling, { 'style': 'z-index:2'});
                }, 350);
            }
            var id = t.parentNode.id;
            _this.score(id);
        });
    };

    // 生成随机数
    proto.getRandom = function (h) {
        var a = [];
        var arr = Object.keys(String(Array(h * h + 1))).map(function (e, i) {
            return i;
        }).sort(function () {
            return 0.5 - Math.random();
        }).slice(0, h).toString();
        // arr = arr.sort(function () { return 0.5 - Math.random()})
        //     .slice(0, h).toString();
        for (i = 0; i < h * h; i++) {
            a.push({
                id: i,
                isTarg: !!arr.match(new RegExp('(^|,)' + i + '(,|$)'))
            });
        }
        return a;
    };
    return GameManager;
});
/**
 * 工具管理对象
 */
var tool = {
    getDom: function getDom() {
        return document.getElementById(arguments[0]);
    },
    createDom: function createDom() {
        return document.createElement(arguments[0]);
    },
    removeDom: function removeDom(ele) {
        while (ele.hasChildNodes()) {
            ele.removeChild(ele.lastChild);
        }
    },
    setAttr: function setAttr(ele, targ) {
        //targ 为键值对参数，可以同时设置多个参数
        //示例：{ 'id' : '1', 'class': 'xx xx'}
        for (var i in targ) {
            ele.setAttribute(i, targ[i]);
        }
        return ele;
    },
    html: function html() {
        //传入两条参数修改文本 一条参数获取文本
        return arguments[1] ? arguments[0].innerHTML = arguments[1] : arguments[0].innerHTML;
    },
    hasClass: function hasClass(ele, targ) {
        return new RegExp('(^|\\s)' + targ + '(\\s|$)').test(ele.className);
    },
    addClass: function addClass(ele, targ) {
        this.hasClass(ele, targ) || (ele.className += ' ' + targ);
    },
    removeClass: function removeClass(ele, targ) {
        if (this.hasClass(ele, targ)) {
            ele.className = ele.className.replace(new RegExp('(^|\\s)' + targ + '(\\s|$)'), ' ');
        }
    },
    addAnimation: function addAnimation(ele, targ) {
        ele.style.animation = targ;
    },
    addEvent: function addEvent(ele, type, fn, cap) {
        //cap是否冒泡
        if (ele.addEventListener) {
            ele.addEventListener(type, fn, cap || false);
        } else if (ele.attachEvent) {
            ele.attachEvent('on' + type, fn);
        }
    },
    removeEVent: function removeEVent(ele, type, fn) {
        if (ele.removeEventListener) {
            ele.removeEventListener(type, fn, false);
        } else if (ele.detachEvent) {
            ele.detachEvent('on' + type, fn);
        }
    },
    delay: function delay(fn, t) {
        setTimeout(fn, t);
    }
};

new GameManager('content');

//# sourceMappingURL=h5-compile.js.map