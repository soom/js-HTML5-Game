/// <reference path="SSlibV2.js" />

(function () {
    var window = this,
undefined,
$ = window.$ = SS = window.SS = function (selector, thisobj) {
    if (selector instanceof SS.init) return selector;
    return new SS.init(selector, thisobj);
};
    SS.ie = (function () {
        var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
        while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );
        return v > 4 ? v : undef;
    })();
    SS.meSelect = SS.ie <= 7;
    SS.init = function (selector, thisobj) {
        var arr = document;
        if (SS.fn.Type.call(selector) == "Array") {
            this.dom = selector;
            if (this.dom) this.length = this.dom.length;
            return this;
        }
        if (SS.fn.Type.call(selector).indexOf("Element") != -1 || selector === window || SS.fn.Type.call(selector) == "Object") {
            this.dom = selector;
            this.length = 1;
            return this;
        }
        if (arguments.length == 2 && thisobj != undefined) { arr = thisobj instanceof SS.init ? thisobj.dom : thisobj; }
        if (SS.fn.Type.call(arr) == "String") { arr = SS(arr); }
        if (SS.fn.HasChild.call(arr) == true) {
            if (SS.fn.Type.call(selector) == "String") {
                if (SS.meSelect == true) {
                    selector = selector.trim();
                    var splitchar = [" ", ",", "+"];
                    for (var i = 0; i < splitchar.length; i++) {
                        switch (splitchar[i]) {
                            case " ":
                                {
                                    var keyarr = selector.split(" ");
                                    if (keyarr.length > 1) return SS(keyarr[0], thisobj).s(keyarr.remove(0, "Index").toString(" "));
                                    break;
                                }
                            case ",":
                                {
                                    var keyarr = selector.split(",");
                                    if (keyarr.length > 1) {
                                        var objarr = [];
                                        var sum = [], t = [];
                                        keyarr.each(function (j) { t = SS(j, arr).dom; t.length != 0 ? objarr.push(t) : 1; });
                                        objarr.each(function () {
                                            var _tmp = SS.Tools.ToArray(this);
                                            sum = sum.concat(_tmp);
                                        });
                                        this.dom = sum;
                                        this.length = this.dom.length;
                                        if (this.length == 1) { this.dom = this.dom[0]; }
                                        return this;
                                    }
                                }
                            case "+":
                                {
                                    keyarr = selector.split("+");
                                    if (keyarr.length > 1) {
                                        var _tmp = [];
                                        SS(keyarr[0], arr).each(function () {
                                            var _t = this, _ta = keyarr.remove(0, "Index");
                                            _ta.each(function (a, b, c) {
                                                _t = SS.fn.next.call(_t);
                                                _t != null && _t.dom.nodeName == a.toLocaleUpperCase() ? 1 : _t = null;
                                                if (_t == null) return false;
                                                if (b == c.length - 1) _tmp.push(_t.dom);
                                            });
                                        });
                                        return SS(_tmp);
                                    }
                                }
                        }
                    };
                    switch (selector.substring(0, 1)) {
                        case "#":
                            {
                                this.dom = arr.getElementById(selector.substring(1, selector.length));
                                if (this.dom) this.length = 1;
                                break;
                            }
                        case "N":
                            {
                                this.dom = SS.Tools.ToArray(arr.getElementsByName(selector.substring(1, selector.length)));
                                if (this.dom) this.length = this.dom.length;
                                break;
                            }
                        case "*":
                            {
                                this.dom = SS.Tools.ToArray((arr == document ? document.body : arr).childNodes);
                                if (this.dom) this.length = this.dom.length;
                                break;
                            }
                        case ".":
                            {
                                var _tmp = SS("*", arr == document ? document.body : arr);
                                this.dom = SS.fn.select.call(_tmp, function () { if (SS(this).hasClass(selector.substring(1, selector.length))) return true; }).dom;
                                if (this.dom) this.length = this.dom.length;
                                break;
                            }
                        default:
                            {

                                if (selector.indexOf(".") != -1) {
                                    var _tmp = selector.split(".");
                                    this.dom = SS.fn.select.call(SS(_tmp[0]), function () { if (SS(this).hasClass(_tmp[1])) return true; }).dom;
                                    if (this.dom) this.length = this.dom.length;
                                }
                                else {
                                    this.dom = SS.Tools.ToArray(arr.getElementsByTagName(selector));
                                    if (this.dom) this.length = this.dom.length;
                                }
                                break;
                            }
                    }
                }
                else {
                    var tmp = selector.split(' ');
                    for (var n = 0; n < tmp.length; n++) {
                        if (tmp[n].substring(0, 1) == "N") tmp[n] = "[name=" + tmp[n].substring(1, tmp[n].length) + "]";
                    }
                    selector = tmp.toString(" ");
                    this.dom = SS.Tools.ToArray(arr.querySelectorAll(selector));
                    this.length = this.dom.length;
                    if (this.length == 1) { this.dom = this.dom[0]; }
                }
            }
        }
        return this;
    }
    SS.fn = {
        length: 0,
        dom: null,
        //获取单元素
        This: function () {
            var sthis = this instanceof SS.init ? this.dom : this;
            if (SS.fn.Type.call(sthis) == "Array") {
                sthis = sthis[0];
            }
            return sthis;
        },
        AddItem: function (item) {
            switch (SS.fn.Type.call(item)) {
                case "Object":
                    {
                        if (item instanceof SS.init) {
                            var item1 = new Array(this.dom);
                            var item2 = new Array(item.dom);
                            item1 = item1.concat(item2);
                            this.dom = item1;
                            this.length = item1.length;
                            break;
                        }
                    }
                case "Array":
                    {
                        var item1 = new Array(this.dom);
                        item1 = item1.concat(item);
                        this.dom = item1;
                        this.length = item1.length;
                        break;
                    }
                default:
                    {
                        if (SS.fn.Type.call(item) === "Object") {
                            var item1 = new Array(this.dom);
                            item1 = item1.push(item);
                            this.dom = item1;
                            this.length = item1.length;
                            break;
                        }
                    }
            }
        },
        Array: function (i) {
            if (this.length <= i) {
                return null;
            }
            else if (this.length == 1 && i == 0) {
                var newSS = new SS.init();
                newSS.dom = SS.fn.Type.call(this.dom) == "Array" ? this.dom[0] : this.dom;
                newSS.length = 1;
                return newSS;
            }
            else {
                var newSS = new SS.init();
                newSS.dom = this.dom[i];
                newSS.length = 1;
                return newSS;
            }
        },
        s: function (str) {

            if (this.Type().IsIn(["Array", "HTMLCollection", "NodeList"])) {
                var tmp = [];
                this.each(function (i) {
                    SS.fn.each.call(SS(str, i), (function (j) {
                        tmp.push(j);
                    }));
                });
                return SS(tmp);
            }
            return SS(str, this);
        },
        HasChild: function (sobj) {
            var sthis = SS.fn.This.call(this);
            var stat = false;
            if (SS.fn.Type.call(sthis.hasChildNodes).IsIn(["Object", "Function"]) && sthis.hasChildNodes()) {
                SS.fn.each.call(sthis.childNodes, function (i) { if (SS.fn.Type.call(i) != "Text") { stat = true; return false; } });
            }
            return stat;
        },
        Type: function () {
            var sthis = this instanceof SS.init ? this.dom : this;
            return Object.prototype.toString.apply(sthis).split("[object ")[1].split("]")[0];
        },
        each: function (fn) {
            var sobj = this instanceof SS.init ? this.dom : this;
            if (sobj && SS.fn.Type.call(sobj).IsIn(["Array", "HTMLCollection", "NodeList", "Object"])) {
                var obj = [];
                var flg = true;
                var i;
                for (i = 0; i < sobj.length && flg; i++) {
                    var tmp = fn.call(sobj[i], sobj[i], i, sobj);
                    if (tmp != undefined && typeof (tmp) == "boolean") {
                        flg = false;
                    }
                    if (SS.fn.Type.call(sobj[i]) != "Text") obj.push(sobj[i]);
                }
                if (flg == false) {
                    for (; i < sobj.length; i++) {
                        if (SS.fn.Type.call(sobj[i]) != "Text") obj.push(sobj[i]);
                    }
                }
                return SS(obj);
            }
            else if (this instanceof SS.init && this.length == 1) {
                fn.call(this.dom, this.dom, 0, this.dom);
                return this;
            }
        },
        select: function (fn) {
            var sobj = this instanceof SS.init ? this.dom : this;
            if (SS.fn.Type.call(sobj).IsIn(["Array", "HTMLCollection", "NodeList", "Object"])) {
                var obj = [];
                for (var i = 0; i < sobj.length; i++) {
                    if (fn.call(sobj[i], sobj[i], i, sobj) == true) {
                        if (SS.fn.Type.call(sobj[i]) != "Text") obj.push(sobj[i]);
                    }
                }
                return SS(obj);
            }
            else {
                return SS(sobj);
            }
        },
        parent: function (tag) {
            var sthis = SS.fn.This.call(this);
            if (typeof (tag) == "string") tag = tag.toLocaleUpperCase();
            if (sthis.parentNode != undefined) {
                if (typeof (tag) != "string") { return SS(sthis.parentNode); }
                if (sthis.parentNode.nodeName == tag) return SS(sthis.parentNode);
                else return SS.fn.parent.call(sthis.parentNode, tag);
            }
            else {
                return null;
            }
        },
        //寻找指定tag的下一个元素
        next: function (tag) {
            var sthis = SS.fn.This.call(this);
            var tmp = sthis.nextSibling;
            if (typeof (tag) == "string") tag = tag.toLocaleUpperCase();
            while (tmp != undefined) {
                if (tag != undefined && tmp.nodeName == tag) {
                    return SS(tmp);
                }
                else if (tag == undefined && SS.fn.Type.call(tmp) != "Text") {
                    return SS(tmp);
                }
                else {
                    tmp = tmp.nextSibling;
                }
            }
            return null;
        },
        del: function () {
            var sthis = SS.fn.This.call(this);
            sthis.parentNode.removeChild(sthis);
        },
        //添加子元素，可以是数组数组
        addchild: function (child, config) {
            var sthis = SS.fn.This.call(this);
            if (SS.fn.Type.call(child) == "String") {
                child = document.createElement(child.toLocaleUpperCase());
                sthis.appendChild(child);
                for (var i in config) {
                    child[i] = config[i];
                }
            }
            else if (SS.fn.Type.call(child).IsIn(["Array", "HTMLCollection", "NodeList", "Object"])) {
                child.each(function (i) { SS.fn.addchild.call(sthis, i); });
            }
            else {
                sthis.appendChild(child);
            }
            return SS(child);
        },
        //子元素添加到nowchild之前
        insertBefore: function (child, nowchild, sobj) {
            var sthis = SS.fn.This.call(this);
            if (SS.fn.Type.call(child) == "String") {
                child = document.createElement(child.toLocaleUpperCase());
                sthis.insertBefore(child, nowchild);
            }
            else if (SS.fn.Type.call(child) == "Array") {
                child.each(function (i) { SS.fn.insertBefore.call(sthis, i, nowchild); });
            }
            else {
                sthis.insertBefore(child, nowchild);
            }
            return SS(child);
        },
        //arrt属性获取
        GetArrt: function (name) {
            var sthis = SS.fn.This.call(this);
            if (sthis.getAttributeNode(name)) {
                return sthis.getAttributeNode(name).value;
            }
            else if ((typeof sthis[name]) != "undefined") {
                return sthis[name];
            } else {
                return null;
            }
        },
        //arrt属性设置
        SetArrt: function (name, value) {
            var sthis = SS.fn.This.call(this);
            if (SS.fn.Type.call(name) == "String") {
                var _tmp = document.createAttribute(name);
                _tmp.value = value;
                sthis.setAttributeNode(_tmp);
            }
            else if (SS.fn.Type.call(name) == "Object") {
                for (var i in name) {
                    var _tmp = document.createAttribute(i);
                    _tmp.value = name[i];
                    sthis.setAttributeNode(_tmp);
                }
            }
            return SS(sthis);
        },
        //arrt属性删除
        removeArrt: function (name) {
            var sthis = SS.fn.This.call(this);
            if (SS.fn.Type.call(name) == "String") {
                if (SS.fn.GetArrt.call(sthis, name) != null) {
                    sthis.removeAttributeNode(sthis.getAttributeNode(name));
                }
            }
            else if (SS.fn.Type.call(name) == "Array") {
                name.each(function (i) {
                    if (SS.fn.GetArrt.call(sthis, i) != null) {
                        sthis.removeAttributeNode(sthis.getAttributeNode(i));
                    }
                });
            }
            return SS(sthis);
        },
        prop: function (n, vl) {
            var o = SS.fn.This.call(this);
            if (typeof vl != "undefined") {
                o[n] = vl;
            } else {
                return o[n];
            }
            return this;
        },
        //获取或设置HTML
        html: function (vl) {
            return SS.fn.prop.call(this, 'innerHTML', vl);
        },
        //获取、设置对象文本
        text: function (vl) {
            return SS.fn.prop.call(this, this.innerText ? "innerText" : "textContent", vl);
        },
        attr: function (n, vl) {
            var o = SS.fn.This.call(this);
            var b = typeof vl != "undefined";
            switch (n) {
                case "style":
                    if (b) o.style.cssText = vl;
                    else res = o.style.cssText;
                    break;
                case "class":
                    if (b) o.className = vl;
                    else res = o.className;
                case "for":
                    if (b) o.setAttribute(ds.isIE ? "htmlFor" : "for", vl);
                    else res = o.getAttribute(ds.isIE ? "htmlFor" : "for");
                default:
                    if (b) o.setAttribute(n, vl);
                    else res = o.getAttribute(n);
            }
            if (b) return this;
            else return res;
        },
        //获取、设置表单元素的值
        val: function (vl) {
            var sthis = SS.fn.This.call(this);
            if (typeof vl != "undefined") SS.fn.prop.call(sthis, 'value', vl);
            else return SS.fn.prop.call(sthis, 'value');
            return this;
        },
        addClass: function (vl) {
            var o = SS.fn.This.call(this);
            if (o && s.indexOf(vl) == -1) {
                if (s != '' && s.substring(s.length - 1) != ' ') s += ' ';
                s += vl;
                o.className = s;
            }
            return this;
        },
        removeClass: function (vl, sobj) {
            var o = SS.fn.This.call(this);
            if (o && o.className.indexOf(vl) != -1) {
                var re = new RegExp('\s*' + vl + '\s*');
                o.className = o.className.replace(re, '');
            }
            return this;
        },
        hasClass: function (vl) {
            var sthis = SS.fn.This.call(this);
            return sthis.className.indexOf(vl) != -1;
        },
        //CSS操作
        css: function () {
            var o = SS.fn.This.call(this);
            switch (arguments.length) {
                case 1:
                    {
                        if (typeof (arguments[0]) == "string") {
                            if (arguments[0] == 'float') arguments[0] = SS.IsIE ? 'styleFloat' : 'cssFloat';
                            if (SS.isIE)
                                return o.currentStyle[arguments[0]];
                            else
                                return document.defaultView.getComputedStyle(o, "")[arguments[0]];
                        }
                        else {
                            for (var tmp in arguments[0]) {
                                if (tmp == 'float') tmp = SS.IsIE ? 'styleFloat' : 'cssFloat';
                                if (!arguments[0].hasOwnProperty(tmp)) continue;
                                if (o.style.setProperty) {
                                    o.style.setProperty(hyphenize(tmp), arguments[0][tmp], null);
                                } else {
                                    o.style[tmp] = arguments[0][tmp];
                                }
                            }
                        }
                        break;
                    }
                case 2:
                    {
                        if (arguments[0] == 'float') arguments[0] = SS.IsIE ? 'styleFloat' : 'cssFloat';
                        o.style[arguments[0]] = arguments[1];
                        break;
                        return this;
                    }
            }
            return SS(o);
        },
        width: function (vl, sobj) {
            var o = SS.fn.This.call(this);
            if (vl) o.style.width = vl + 'px';
            else return o.offsetWidth;
            return this;
        },
        height: function (vl, sobj) {
            var o = SS.fn.This.call(this);
            if (vl) o.style.height = vl + 'px';
            else return o.offsetHeight;
            return this;
        },
        innerWidth: function (sobj) {
            var o = SS.fn.This.call(this);
            var w = SS.fn.width.call(o);
            var bl = SS.fn.css.apply(o, 'borderLeftWidth'), br = SS.fn.css.apply(o, 'borderRightWidth');
            var pl = SS.fn.css.apply(o, 'paddingLeft'), pr = SS.fn.css.apply(o, 'paddingRight');
            return w - parseInt(bl) - parseInt(br) - parseInt(pl) - parseInt(pr);
        },
        innerHeight: function (sobj) {
            var o = SS.fn.This.call(this);
            var h = SS.fn.height.call(o);
            var bt = SS.fn.css.apply(o, 'borderTopWidth'), btm = SS.fn.css.apply(o, 'borderBottomWidth');
            var pt = SS.fn.css.apply(o, 'paddingTop'), ptm = SS.fn.css.apply(o, 'paddingBottom');
            return h - parseInt(bt) - parseInt(btm) - parseInt(pt) - parseInt(ptm);
        },
        outerWidth: function (sobj) {
            var o = SS.fn.This.call(this);
            var w = SS.fn.width.call(o);
            var ml = SS.fn.css.apply(o, 'marginLeft'), mr = SS.fn.css.apply(o, 'marginRight');
            return w + parseInt(ml) + parseInt(mr);
        },
        outerHeight: function (sobj) {
            var o = SS.fn.This.call(this);
            var h = SS.fn.height.call(o);
            var mt = SS.fn.css.apply(o, 'marginTop'), mtm = SS.fn.css.apply(o, 'marginBottom');
            return h + parseInt(mt) + parseInt(mtm);
        },
        //显示隐藏元素
        hidden: function (sobj) {
            var o = SS.fn.This.call(this);
            o.style.display = 'none';
            return this;
        },
        show: function (vl, sobj) {
            var o = SS.fn.This.call(this);
            o.style.display = vl ? vl : '';
            return this;
        },
        //显示隐藏切换
        toggle: function (sobj) {
            var sthis = SS.fn.This.call(this);
            if (o.style.display == "none") SS.fn.show.call(sthis);
            else { SS.fn.hidden.call(sthis); }
            return this;
        },
        pos: function () {
            var left = 0, top = 0,
            el = SS.fn.This.call(this);
            do {
                left += el.offsetLeft;
                top += el.offsetTop;
            } while (el = el.offsetParent);
            return { left: left, top: top };
        },
        bind: function (n, fn) {
            SS.event.on(this, n, fn);
            return this;
        },
        ubind: function (n, fn) {
            SS.event.un(this, n, fn);
            return this;
        },
        ubindall: function (n) {
            SS.event.unall(this, n);
            return this;
        },
        click: function (fn) {
            SS.event.on(this, 'click', fn);
            return this;
        },
        dblclick: function (fn) {
            SS.event.on(this, 'dblclick', fn);
            return this;
        },
        load: function (fn) {
            SS.event.on(this, 'load', fn);
            return this;
        },
        change: function (fn) {
            SS.event.on(this, 'change', fn);
            return this;
        },
        focus: function () {
            SS.fn.This.call(this).focus();
            return this;
        },
        runEvent: function (name, i) {
            if (typeof this.dom.Sevent != "undefined") {
                if (SS.fn.Type.call(this.dom.Sevent[name]) != "Array") {
                    return "Error!";
                }
                else if (typeof i == "number") {
                    return this.dom.Sevent[name][i].call(this.dom);
                } else {
                    //执行队列
                    var returnvaule = undefined;
                    for (var t = 0; t < this.dom.Sevent[name].length; t++) {
                        var tmp = this.dom.Sevent[name][t].call(this.dom);
                        if (typeof tmp == "boolean") {
                            returnvaule = tmp;
                        }
                    }
                    if (typeof returnvaule == "boolean") {
                        return returnvaule;
                    }
                }
            }
            else {
                return "Error!";
            }
        },
        center: function () {
            SS.fn.css.call(this, { position: "absolute", left: (SS.size().width - SS.fn.width.call(this) - SS.scroll().left) / 2 + "px", top: (SS.size().height - SS.fn.height.call(this) - SS.scroll().top) / 2 + "px" });
        },
        dd: function (Cursorconfig) {
            var sthis = this;
            var doc = document;
            doc.state = false;
            sthis.dom.ddinit = true;
            sthis.dom.Cursorconfig = Cursorconfig || "";
            doc.resize = false;
            doc.CursorStr = "";
            function find(el) {
                for (; el != null && typeof el.ddinit != "boolean"; ) {
                    if (el == null || el == doc.body) return doc.body;
                    el = el.parentNode
                }
                if (el == null || el == doc.body) return doc.body;
                return el;
            }
            this.bind("mousedown", function (e) {
                doc.state = true;
                doc.tpos = { x: 0, y: 0 };
                doc.tpos.x = SS.event.pos(e).x - sthis.pos().left;
                doc.tpos.y = SS.event.pos(e).y - sthis.pos().top;
                doc.ddobj = sthis;
                // doc.body.onselectstart = function() { return false; };
            })
            .bind("mouseup", function () {
                SS(this).css("cursor", "default");
            });
            doc.onmouseup = function () {
                doc.state = false;
                //doc.body.onselectstart = function() { };
                doc.resize = false;
            };
            doc.onmousemove = function (e) {
                var obj = SS.event.pos(e);
                var str = "";
                var targetobj = SS(find(SS.event.target(e)));
                if (typeof targetobj.dom.ddinit == "boolean" && doc.resize == false) {
                    if (Math.abs(obj.y - targetobj.pos().top - targetobj.height()) < 10) str += "s";
                    if (Math.abs(obj.x - targetobj.pos().left - targetobj.width()) < 10) str += "e";
                    if (str == "") str = "default"; else if (targetobj.dom.Cursorconfig.indexOf(str) != -1) { str += "-resize"; } else { str = "default"; }
                    targetobj.css("cursor", str);
                }
                if (doc.state == true) {
                    if (doc.resize || (str != "" && str != "default" && str != "move")) {
                        ww = obj.x - doc.ddobj.pos().left;
                        hh = obj.y - doc.ddobj.pos().top;
                        ww = ww > 0 ? ww : 0; hh = hh > 0 ? hh : 0;
                        if (doc.resize == false) { doc.resize = true; doc.CursorStr = str; }
                        switch (doc.CursorStr) {
                            case "e-resize": doc.ddobj.css({ "width": ww + "px", "overflow": "hidden" }); break;
                            case "s-resize": doc.ddobj.css({ "height": hh + "px", "overflow": "hidden" }); break;
                            case "se-resize": doc.ddobj.css({ "height": hh + "px", "width": ww + "px", "overflow": "hidden" }); break;
                        }
                    }
                    else {
                        doc.ddobj.css({ position: "absolute", top: obj.y - doc.tpos.y + "px", left: obj.x - doc.tpos.x + "px", Zindex: 100000 });
                    }
                }
            };
            this.bind("mouseout", function () { });
            this.s("input,textarea").each(function () {
                SS(this).bind("mousedown", function (e) {
                    SS.event.stopPop(e);
                });
            });

        }
    }
    for (var tmp in SS.fn) {
        SS.init.prototype[tmp] = SS.fn[tmp];
    }
    SS.event = {
        on: function (o, type, fn) {
            if (typeof o.dom.Sevent == "undefined") { o.dom.Sevent = {}; }
            if (SS.fn.Type.call(o.dom.Sevent[type]) != "Array") {
                o.dom.Sevent[type] = [];
                o.dom.Sevent[type].push(fn);
            }
            else {
                o.dom.Sevent[type].push(fn);
            }
            if (SS.fn.Type.call(o.dom.Sevent["on" + type]) == "Function") {
                o.dom.Sevent[type].push(o.dom["on" + type]);
            }
            o.dom["on" + type] = function (e) {
                var returnvaule = undefined;
                for (var t = 0; SS.fn.Type.call(o.dom.Sevent[type]) == "Array" && t < o.dom.Sevent[type].length; t++) {
                    var tmp = o.dom.Sevent[type][t].call(o.dom, e);
                    if (tmp != undefined && typeof (tmp) == "boolean") {
                        returnvaule = tmp;
                    }
                }
                if (returnvaule != undefined && typeof (returnvaule) == "boolean") {
                    return returnvaule;
                }
            }
        },
        un: function (o, type, fn) {
            if (typeof o.dom.Sevent == "undefined") {
                o.dom.Sevent = {};
            }
            if (SS.fn.Type.call(o.dom.Sevent[type]) == "Array") {
                o.dom.Sevent[type] = [];
            }
            else {
                o.dom.Sevent[type] = o.dom.Sevent[type].remove(fn, "Index");
            }
        },
        unall: function (o, type) {
            if (typeof o.dom.Sevent == "undefined") {
                o.dom.Sevent = {};
            }
            if (typeof o.dom.Sevent[type] == "array") {
                o.dom.Sevent[type] = [];
            }
        },
        //阻止事件冒泡
        stopPop: function (e) {
            if (e && e.stopPropagation) {
                e.stopPropagation(); //非IE
            } else {
                window.event.cancelBubble = true;
            }
        },
        //取消浏览器默认行为
        stop: function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();  //非IE
            } else {
                window.event.returnValue = false;
                return false;
            }
        },
        target: function (e) {
            return e ? e.target || e.srcElement : event.srcElement;
        },
        pos: function (e) {
            if (SS.isFF) {
                return {
                    x: e.pageX,
                    y: e.pageY
                };
            }
            else if (SS.isIE) {
                e = event;
            }
            return {
                x: e.clientX + SS.scroll().left,
                y: e.clientY + SS.scroll().top
            };
        }
    }
    SS.Tools = {
        ToArray: function (inobj) {
            var arr = [];
            if (typeof inobj.length === "number") {
                for (var i = 0; i < inobj.length; i++) {
                    if (SS.fn.Type.call(inobj[i]) != "Text")
                        arr.push(inobj[i]);
                }
            }
            else {
                arr.push(inobj);
            }
            return arr;
        },
        GetXMLHttpRequst: function () {
            var obj = null;
            if (window.ActiveXObject) {
                try {
                    obj = new ActiveXObject("Micorsoft.XMLHttp");
                }
                catch (e) {
                    obj = new ActiveXObject("Msxml2.XMLHTTP");
                }
            }
            else {
                obj = new XMLHttpRequest();
            }
            return obj;
        }
    };
    SS.apply = function (o, c, defaults) {
        if (defaults) {
            SS.apply(o, defaults);
        }
        if (o && c && typeof c == 'object') {
            for (var p in c) {
                o[p] = c[p];
            }
        }
        return o;
    };
    SS._Ajax = [];
    SS.Ajax = function (url, obj) {
        if (SS._Ajax.length > 0) {
            SS._Ajax.push([url, obj]);
        }
        else {
            SS._Ajax.push([url, obj]);
            SS._Ajaxrun(url, obj);
        }
    }
    SS._Ajaxrun = function (url, obj) {
        var xmlobj = SS.Tools.GetXMLHttpRequst();
        xmlobj.open("GET", url, true);
        xmlobj.send(null);
        xmlobj.onreadystatechange = function () {
            if (xmlobj.readyState == 4) {
                if (xmlobj.status == 200) {
                    if (typeof (obj.success) != undefined && SS.fn.Type.call(obj.success) == "Function") {
                        obj.success(xmlobj.responseText, this);
                    }
                }
                else {
                    if (typeof (obj.error) != undefined && SS.fn.Type.call(obj.error) == "Function") { obj.error(this); }
                }
                SS._Ajax.shift();
                if (SS._Ajax.length > 0) {
                    var tmp = SS._Ajax[0];
                    SS._Ajaxrun(tmp[0], tmp[1]);
                }
            }
        }
    };
    SS.cookie = function (n, vl, ex) {
        if (!n) {
            if (vl) {
                var d = new Date();
                if (ex) d.setTime(d.getTime() + (ex * 60 * 60 * 1000));
                ds.setCookie(n, vl, ex);
            } else {
                return ds.getCookie(n);
            }
        }
    }
    SS.getCookie = window.getCookie = function (n) {
        var txts = document.cookie.split('; ');
        for (var i = 0; i < txts.length; i++) {
            if (txts[i].split('=')[0] == n) return unescape(txts[i].split('=')[1]);
        }
        return "";
    }
    //设置cookie ，ex-时间，单位：小时
    SS.setCookie = function (n, vl, ex) {
        var c = n + '=' + escape(vl) + ';path=/';
        var d = new Date();
        if (ex) d.setTime(d.getTime() + (ex * 60 * 60 * 1000));
        document.cookie = c + ';expries=' + d.toGMTString();
    }
    SS.delCookie = function (n) {
        SS.setCookie(n, '', 0);
    }
    SS.isIE = ! +[1, ];
    SS.isIE6 = navigator.userAgent.toLowerCase().indexOf("msie 6.0") != -1;
    SS.isFF = navigator.userAgent.toLowerCase().indexOf("firefox") != -1;
    //返回文档的大小
    SS.size = function () {
        return { width: (document.documentElement.clientWidth || document.body.clientWidth) || self.innerWidth,
            height: document.documentElement.clientHeight || self.innerHeight || document.body.clientHeight
        };
    };
    //返回当前滚动条的位置
    SS.scroll = function () {
        return { left: (document.documentElement.scrollLeft || document.body.scrollLeft),
            top: (document.documentElement.scrollTop || document.body.scrollTop)
        }
    };
    SS.deferTimer = [];
    String.prototype.IsIn = function (arr) {
        if (arr.indexOf(this) != -1) return true;
        else
            return false;
    }
    Array.prototype.indexOf = function (v) {
        if (v == null) {
            return -1;
        }
        else {
            var j = -1;
            for (var i = 0; i < this.length; i++) {
                if (this[i] == v) {
                    j = i;
                    break;
                }
            }
            return j;
        }
    }
    Array.prototype.each = SS.fn.each;
    Array.prototype.remove = function (v) {
        var v_index = this.indexOf(v);
        if (typeof (v) == "number") {
            if (arguments.length == 2 && arguments[1] == "Index")
                v_index = v;
        }
        if (v_index > -1) {
            //最后一个元素
            if (v_index == this.length - 1) {
                return this.slice(0, v_index);
            }
            else if (v_index == 0)//第一个元素
            {
                return this.slice(v_index + 1, this.length);
            }
            else {
                //slice方法不包括end元素
                return this.slice(0, v_index).concat(this.slice(v_index + 1, this.length));
            }
        }
        else {
            return this;
        }
    }
    Array.prototype.toString = function (c) {
        var splitchar = c || ",";
        var outtxt = "";
        for (var i = 0; i < this.length; i++) {
            outtxt += this[i] + splitchar;
        }
        if (this.length == 0) {
            return null;
        }
        else {
            return outtxt.substring(0, outtxt.length - splitchar.length);
        }
    }
    String.prototype.trim = function () {
        var s = this.replace(/^\s\s*/, '');
        var i = s.length;
        while (/\s/.test(s.charAt(--i)));
        return s.substring(0, i + 1);
    }
    String.prototype.removeHTML = function () {
        return this.replace(/<\/?[^>]+>/gi, '');
    }
    String.prototype.toInt = function () {
        return parseInt(this);
    }
    Function.prototype.defer = function (millis, obj, args, callback) {
        var sthis = this;
        var fn = function () {
            sthis.apply(obj || sthis, args || []);
            if (typeof callback == "function") callback();
        }
        if (millis > 0) {
            var v = setTimeout(fn, millis);
            SS.deferTimer.unshift(v);
            return v;
        }
        fn();
        return 0;
    }
    var hyphenize = function (name) {
        return name.replace(/([A-Z])/g, "-$1").toLowerCase();
    }
    var capitalize = function (prop) {
        return prop.replace(/\b[a-z]/g, function (match) {
            return match.toUpperCase();
        });
    }
})();