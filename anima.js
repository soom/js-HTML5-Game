/// <reference path="SSlib_V2.0/SSlibV2.js" />
SS.anima = anima = window.anima = {}
//幻灯片
SS.anima.split = 20;
SS.anima.fn = {
    move: function (nowtime, count, NowPoint, GoalPoint) {
        if (nowtime == count)
            return GoalPoint;
        return { x: NowPoint.x + (GoalPoint.x - NowPoint.x) * nowtime / count, y: NowPoint.y + (GoalPoint.y - NowPoint.y) * nowtime / count };
    },
    Alpha: function (nowtime, count, Now, Goal) {
        if (nowtime == count)
            return Goal;
        return Now + (Goal - Now) * nowtime / count;
    },
    size: function (nowtime, count, Now, Goal) {
        if (nowtime == count)
            return Goal;
        return { h: Now.h + (Goal.h - Now.h) * nowtime / count, w: Now.w + (Goal.w - Now.w) * nowtime / count };
    },
    OneObj: function (nowtime, count, Now, Goal) {
        if (nowtime == count)
            return Goal;
        return Now + (Goal - Now) * nowtime / count;
    },
    anima: function (nowtime, count, Now, Goal) {
        var returnValue = {};
        for (var name in Goal) {
            returnValue[name] = SS.anima.fn.OneObj(nowtime, count, Now[name], Goal[name]);
        }
        return returnValue;
    }
}
SS.anima.fader = function() { }
SS.anima.stop = function(timer) {
    var arr = timer || SS.deferTimer;
    while (clearTimeout(arr.shift()), arr.length != 0);
}
SS.anima.fader.prototype = {
    li: [],
    subi: [],
    autosplit: 1000,
    index: 0,
    z: 0,
    timer: null,
    timerfade: null,
    titlea: null,
    init: function (options) {
        var box = SS("#" + options.id);
        box = box || options.ss;
        this.li = SS(" ul li", box).dom;
        this.autosplit = options.split || 1000;
        this.index = options.index || 0;
        this.z = 0;
        var subspan = SS("span.sub", box);
        for (var i = 1; i <= this.li.length; i++) {
            var sthis = this;
            (function (j) {
                subspan.addchild("i", { innerHTML: j, href: "#" }).click(function () {
                    sthis.pos(j - 1);
                    return false;
                });
            })(i);
        }
        this.subi = SS("span.sub i", box).dom;
        this.titlea = SS("span.sub a", box).Array(0);
        this.subi[0].style.background = "#666";
        this.titlea.html(SS("img", this.li[0]).GetArrt("alt"));
        this.titlea.prop("href", SS("img", this.li[0]).GetArrt("_href"));
        this.run();
    },
    run: function () {
        this.timer = this.move.defer(this.autosplit, this, [1]);
    },
    move: function (i) {
        this.index += i;
        if (this.index >= this.li.length) { this.index = 0; }
        if (this.index < 0) { this.index = this.li.length - 1; }
        this.pos(this.index);
    },
    pos: function (i) {
        if (this.z > 80 + this.li.length) {
            this.li.each(function () { this.style.zIndex = 0; })
            this.z = 1;
        }
        this.z++;
        this.index = i;
        this.opacity = 0;
        this.li[i].style.zIndex = this.z;
        this.li[i].style.opacity = 0;
        this.li[i].style.filter = "Alpha(opacity=0)";
        this.subi.each(function () { SS(this).css("background", ""); });
        this.subi[i].style.background = "#666";
        this.titlea.html(SS("img", this.li[i]).GetArrt("alt"));
        this.titlea.prop("href", SS("img", this.li[i]).GetArrt("_href"));
        this.fadeout(i);
    },
    fadeout: function (i) {
        clearTimeout(this.timer);
        this.timer = null;
        clearTimeout(this.timerfade);
        this.timerfade = null;
        if (this.opacity >= 100)
        { this.run(); 
        }
        else {
            this.opacity += 5;
            this.li[i].style.opacity = this.opacity / 100;
            this.li[i].style.filter = "Alpha(opacity=" + this.opacity + ")";
            this.timerfade = this.fadeout.defer(anima.split, this, [i]);
        }
    }
}
//闪烁
SS.anima.flicker = function(options) {
    var times = options.times || 3;
    var splittime = options.split || 200;
    var flag = false;
    var box = SS("#" + options.id);
    box = options.ss || box;
    var borderColor = options.color || box.css("borderColor");
    if (borderColor == "") { box.css("border", "1px solid white"); flag = true; borderColor = "white" }
    for (var i = 1; i <= times; i++) {
        box.css.defer(i * splittime, box, ["borderColor", "red"]);
        box.css.defer(i * splittime + splittime/2, box, ["borderColor", borderColor]);
    }
    if (flag) box.css.defer((times+1)* splittime, box, ["border", ""]);
}
SS.anima.move = function(options) {
    var sthis = this;
    var box = SS("#" + options.id);
    box = options.ss || box;
    var totaltime = options.split || 200;
    var GoalPoint = options.goal || { x: 0, y: 0 };
    var NowPoint = options.now || { x: box.pos().left, y: box.pos().top };
    var count = parseInt(totaltime / SS.anima.split);
    var nowtime = 0;
    while ((function(now) {
        function run() {
            var Point = SS.anima.fn.move(now, count, NowPoint, GoalPoint);
            box.css({ position: "absolute", top: Point.y + "px", left: Point.x + "px" });
            if (typeof options.phase == "function") { options.phase(); }
            if (typeof options.callback == "function" && now == count) { options.callback(); }
        };
        run.defer(SS.anima.split * now, sthis);
    })(++nowtime), nowtime < count);
}
SS.anima.Alpha = function(options) {
    var sthis = this;
    var box = SS("#" + options.id);
    box = options.ss || box;
    var totaltime = options.split || 200;
    var Goal = options.goal || 0;
    var Now = options.now;
    var count = parseInt(totaltime / SS.anima.split);
    var nowtime = 0;
    if (typeof Now != "undefined") {
        if (Now > 0 && Now < 1) { Now *= 100; }
        if (Now > 100) { Now = 1; }
    } else { Now = box.dom.style.opacity; if (!Now) { Now = 100; } }
    if (SS.isIE) {
        if (options.now) if (Goal == 0) Now = 100; else Now = 0;
        else Now = options.now;
    }
    box.dom.style.opacity = Now / 100;
    box.dom.style.filter = "Alpha(opacity=" + Now + ")";
    while ((function(now) {
        function run() {
            var val = SS.anima.fn.Alpha(now, count, Now, Goal);
            box.dom.style.opacity = val / 100;
            box.dom.style.filter = "Alpha(opacity=" + val + ")";
            if (typeof options.phase == "function") { options.phase(); }
            if (typeof options.callback == "function" && now == count) { options.callback(); }
        };
        run.defer(SS.anima.split * now, sthis);
    })(++nowtime), nowtime < count);
}
SS.anima.size = function(options) {
    var sthis = this;
    var box = SS("#" + options.id);
    box = options.ss || box;
    var totaltime = options.split || 200;
    var Goal = options.goal || { w: 100, h: 100 };
    var Now = options.now || { w: box.width(), h: box.height() };
    var count = parseInt(totaltime / SS.anima.split);
    var nowtime = 0;
    while ((function(now) {
        function run() {
            var Point = SS.anima.fn.size(now, count, Now, Goal);
            box.css({ width: Point.w + "px", height: Point.h + "px" });
            if (typeof options.phase == "function") { options.phase(); }
            if (typeof options.callback == "function" && now == count-1) { options.callback(); }
        };
        run.defer(SS.anima.split * now, sthis);
    })(++nowtime), nowtime < count);
}
SS.anima.anima = function (options) {
    var sthis = this;
    var box = SS("#" + options.id);
    box = options.ss || box;
    var totaltime = options.split || 200;
    var Goal = options.goal;
    var Now = options.now;
    var count = parseInt(totaltime / SS.anima.split);
    var nowtime = 0;
    if (!Now) {
        Now = {};
        for (var name in Goal) {
            Now[name] = parseInt(box.css(name));
            Now[name] = Now[name] ? Now[name] : 0;
        }
    }
    while ((function (now) {
        function run() {
            var state = SS.anima.fn.anima(now, count, Now, Goal);
            for (var name in state) {
                box.css(name, state[name] + "px");
            }
            if (typeof options.phase == "function") { options.phase(); }
            if (typeof options.callback == "function" && now == count - 1) { options.callback(); }
        };
        run.defer(SS.anima.split * now, sthis);
    })(++nowtime), nowtime < count);
}
