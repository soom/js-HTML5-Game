var arr = [];
var w = 8, h = 8;
var total = 8;
var size = 30;
var bordersize = 6;
var iszhong = false;
var flag = true;
var levarr = [{ w: 8, h: 8, total: 8 },
{ w: 15, h: 12, total: 20 },
{ w: 25, h: 15, total: 40 }
 ];
var leven = 0;
document.oncontextmenu = function () { return false; }
document.onmousewheel = function () { return false; }
window.onload = function () {
    init();
    var a_arr = document.getElementsByTagName("a");
    for (var i = 0; i < a_arr.length; i++) {
        (function (j) {
            a_arr[j].onclick = function () {
                w = levarr[j].w;
                h = levarr[j].h;
                total = levarr[j].total;
                arr = [];
                leven = j;
                init();
                flag = true;
            }
        })(i);
    }
}
function _D(id) {
    return document.getElementById(id);
}
function _N(tag, obj) {
    return obj.getElementsByTagName(tag);
}
function init() {
    createEl(h + 1, w + 1);
    RandDate();
    var Table = _D("main");
    var Tr = _N("tr", Table); //遍历数组
    for (var i = 0; i <= h+1; i++) {
        var Td = _N("td", Tr[i]);
        for (var j = 0; j <= w + 1; j++) {
            Td[j].style.background = "#ccc"; //背景色复制 color里面取值
            Td[j].style.width = size - 6 + 'px';
            Td[j].style.height = size + 'px';
            if (j == 0 || j == w + 1) Td[j].style.width = bordersize - 6 + 'px';  //改变四周的宽高
            if (i == 0 || i == h + 1) Td[j].style.height = bordersize + 'px';
            if ((i == 0 && j != w + 1) || (i == h + 1 && j != w + 1)) Td[j].style.borderRightWidth = "0px";
            if ((j == 0 && i != h + 1) || (j == w + 1 && i != h + 1))
                Td[j].style.borderBottomWidth = "0px";
        }
    }
    _D("lev").innerHTML = "第" + (leven + 1) + "关,剩余" + total + "个雷";
    var Tr = _N("tr", _D("main"));
    for (var j = 1; j < h + 1; j++) {
        var Td = _N("td", Tr[j]);
        for (var i = 1; i < w + 1; i++) {
            (function (t, m, n) {
                var bg = "";
                t.onmouseover = function () {
                    bg = this.style.backgroundColor;
                    if (this.style.backgroundColor != "red")
                        this.style.backgroundColor = "#bbb";
                }
                t.onmouseout = function () {
                    if (this.style.backgroundColor != "red")
                        this.style.backgroundColor = bg;
                    bg = "";
                }
                t.onmousedown = function (e) {
                    if (flag) {
                        e = e || window.event;
                        mainfun(m, n, e.button);
                        stopevent(e);
                        return false;
                    }
                }
                t.onmouseup = function () {
                    if (flag) {
                        if (iszhong == false) return;
                        for (var i = BB(m, "h", 1); i <= BB(m, "h", 2); i++) {
                            for (var j = BB(n, "w", 1); j <= BB(n, "w", 2); j++)
                                getTd(i, j).style.backgroundColor = "#ccc";
                        }
                        iszhong = false;
                    }
                }
            })(Td[i], j, i);
        }
    }
}
function createEl(h,w) {
    var tbody = document.getElementsByTagName("tbody")[0];
    if (tbody) _D("main").removeChild(tbody);
    var tbody = document.createElement("tbody");
    _D("main").appendChild(tbody);
    for (var i = 0; i <= h; i++) {
        var Tr = document.createElement("tr");
        tbody.appendChild(Tr);
        for (j = 0; j <= w; j++) {
            Tr.appendChild(document.createElement("td"));
        }
    }
}
function RandDate() {
    arr = [];
    for (var i = 0; i <= h; i++) {
        var t = [];
        for (var j = 0; j <= w; j++) {
            t.push([0, 0]);
        }
        arr.push(t);
    }
    var t = 0;
    while (t != total) {
        var w0 = parseInt(Math.random() * w + 1);
        var h0 = parseInt(Math.random() * h + 1);
        if (arr[h0][w0][0] == 0) { arr[h0][w0][0] = 9;  t++; }
    }
    for (i = 1; i <= h; i++) {
        for (j = 1; j <= w; j++) {
            if (arr[i][j][0] == 0) {
                t = 0;
                for(var m=BB(i,"h",1);m<=BB(i,"h",2);m++)
                {
                    for (var n = BB(j, "w", 1); n <= BB(j, "w", 2); n++)
                        if (arr[m][n][0] == 9) t++;
                }
                arr[i][j][0] = t;
            }
        }
    }
}
function stopevent(e) {
    if (e && e.stopPropagation) {
        e.stopPropagation(); //非IE
    } else {
        window.event.cancelBubble = true;
    }
}
function BB(v, f,type) {
    if (f == "w") {
        if (type == 1) {
            if (v == 1) return 1;
            else { return v - 1; }
        }
        else {
            if (v == w) { return w; }
            else {return v + 1;}
        }
    }
    else {
        if (type == 1) {
            if (v == 1) return 1;
            else { return v - 1; }
        }
        else {
            if (v == h) { return h; }
            else { return v + 1; }
        }
    }
}
function mainfun(m, n, t) {
    var sthis = getTd(m, n);
    var v = ! +[1, ] && t == 1 ? 0 : t;
    v = ! +[1, ] && t == 4 ? 1 : v;
    t = v;
    switch (t) {
        case 0: //左键
            if (arr[m][n][1] != 0) break;
            if (arr[m][n][0] != 9) {
                if (arr[m][n][0] == 0) run(m, n);
                sthis.innerHTML = "&nbsp;" + lable(arr[m][n][0]);
                arr[m][n][1] = 1;
            }
            else {
                over();
            }
            break;
        case 1: //中键
            if (arr[m][n][1] == 0) break;
            var c = 0;
            for (var i = BB(m, "h", 1); i <= BB(m, "h", 2); i++) {
                for (var j = BB(n, "w", 1); j <= BB(n, "w", 2); j++)
                    if (arr[i][j][1] == 10) c++;
            }
            if (c == arr[m][n][0]) {
                for (var i = BB(m, "h", 1); i <= BB(m, "h", 2); i++) {
                    for (var j = BB(n, "w", 1); j <= BB(n, "w", 2); j++)
                    if (arr[i][j][1] == 0) {
                        if (arr[i][j][0] == 9) over();
                        else {
                            getTd(i, j).innerHTML = "&nbsp;" + lable(arr[i][j][0]);
                            arr[i][j][1] = 1;
                            if (arr[i][j][0] == 0) run(i, j);
                        }
                        }
                }
            }
            else {
                for (var i = BB(m, "h", 1); i <= BB(m, "h", 2); i++) {
                    for (var j = BB(n, "w", 1); j <= BB(n, "w", 2); j++)
                        getTd(i, j).style.backgroundColor = "#aaa";
                }
                iszhong = true;
            }
            break;
        case 2: //右键
            if (arr[m][n][1] == 0) {
                sthis.innerHTML = "&nbsp;P";
                arr[m][n][1] = 10;
                total--;
                _D("lev").innerHTML = "第" + (leven + 1) + "关,剩余" + total + "个雷";
                issuccess();
                break;
            }
            if (arr[m][n][1] == 10) {
                arr[m][n][1] = 0;
                total++;
                sthis.innerHTML = "";
                _D("lev").innerHTML = "第" + (leven + 1) + "关,剩余" + total + "个雷";
                break;
            }
            
    }
}
function getTd(m, n) {
    return _N("td", _D("main"))[m*(w+2)+n];
}
function run(i, j) {
    for (var m = BB(i, "h", 1); m <= BB(i, "h", 2); m++) {
        for (var n = BB(j, "w", 1); n <= BB(j, "w", 2); n++)
            if (arr[m][n][1] == 0) {
                if (arr[m][n][0] == 9) over();
                else {
                    getTd(m, n).innerHTML = "&nbsp;" + lable(arr[m][n][0]);
                    arr[m][n][1] = 1;
                    if (arr[m][n][0] == 0) run(m, n);
                }
            }
    }
    }
function over() {
    for (var i = 1; i <= h; i++) {
        for (var j = 1; j <= w; j++) {
            if (arr[i][j][0] == 9) {
                getTd(i, j).innerHTML = "&nbsp;*" ;
                getTd(i, j).style.backgroundColor = "red";
            }
        }
    }
    flag = false;
}
function issuccess() {
    var t = 0;
    for (var i = 1; i <= h; i++) {
        for (var j = 1; j <= w; j++) {
            if (arr[i][j][0] == 9 && arr[i][j][1] == 10) {
                t++;
            }
            else {
                if (arr[i][j][1] == 10 && arr[i][j][0] != 9) return;
            }
        }
    }
    if (t == levarr[leven].total) {
        alert("恭喜通过" + (leven + 1) + "关");
        leven++;
        if (leven == levarr.length) { alert('通关了！'); }
        else {
            w = levarr[leven].w;
            h = levarr[leven].h;
            total = levarr[leven].total;
            arr = [];
            init();
            flag = true;
        }
    }
}
function lable(v) {
    switch (v) {
        case 0: return "<font style='color:black'>0</font>";
        case 1: return "<font style='color:green'>1</font>";
        case 2: return "<font style='color:green'>2</font>";
        case 3: return "<font style='color:green'>3</font>";
        case 4: return "<font style='color:green'>4</font>";
        case 5: return "<font style='color:green'>5</font>";
        case 6: return "<font style='color:green'>6</font>";
        case 7: return "<font style='color:green'>7</font>";
        case 8: return "<font style='color:green'>8</font>";
    }
}