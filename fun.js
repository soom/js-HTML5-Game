var date = [
{ arr: [
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 0, 1, 0, 0, 4, 0, 3],
    [3, 0, 0, 2, 0, 3, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 2, 0, 3, 0, 0, 3],
    [3, 0, 2, 0, 3, 0, 2, 3],
    [3, 0, 0, 4, 4, 0, 4, 3],
    [3, 3, 3, 3, 3, 3, 3, 3]
    ],
    size: "30px",
    bordersize: "6px"
},
{ arr: [
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 3, 3, 3, 3, 3, 3, 3]
    ],
    size: "30px",
    bordersize: "6px"
}
];

var arr = [];
var box = [];
var level = 0;
var size = "30px";
var bordersize = "6px";
var now = { x: 0, y: 0 };
var color = ["white", "Blue", "red", "Gray", "Yellow", "green", "Blue"];
var len = arr.length - 1;
window.onload = function() {
    init();
    document.onkeydown = function(event) {
        var e = event || window.event;
        var flag = false;
        switch (e.keyCode) {
            case 37: //左
                {
                    var _now = { x: now.x, y: BB(now.y, -1) };
                    flag = mainfun(now, _now, "y", -1);
                    if (flag) { fun({ x: now.x, y: now.y }, "y", -1); now.y = _now.y; }
                    break;
                }
            case 38: //上
                {
                    var _now = { x: BB(now.x, -1), y: now.y };
                    flag = mainfun(now, _now, "x", -1);
                    if (flag) { fun({ x: now.x, y: now.y }, "x", -1); now.x = _now.x; }
                    break;
                }
            case 39: //右
                {
                    var _now = { x: now.x, y: BB(now.y, 1) };
                    flag = mainfun(now, _now, "y", 1);
                    if (flag) { fun({ x: now.x, y: now.y }, "y", 1); now.y = _now.y; }
                    break;
                }
            case 40: //下
                {
                    var _now = { x: BB(now.x, 1), y: now.y };
                    flag = mainfun(now, _now, "x", 1);
                    if (flag) { fun({ x: now.x, y: now.y }, "x", 1); now.x = _now.x; }
                    break;
                }
        }
        chk();
        return false;
    }
    init();
}
function _D(id) {
    return document.getElementById(id);
}
function _N(tag, obj) {
    return obj.getElementsByTagName(tag);
}
function init() {
    loadmap();
    createEl();
    var Table = _D("main");
    var Tr = _N("tr", Table);//遍历数组
    for (var i = 0; i <= len; i++) {
        var Td = _N("td", Tr[i]);
        for (var j = 0; j <= len; j++) {
            Td[j].style.background = color[arr[i][j]]; //背景色复制 color里面取值
            Td[j].style.width = size;
            Td[j].style.height = size;
            if (j == 0 || j == len) Td[j].style.width = bordersize;  //改变四周的宽高
            if (i == 0 || i == len) Td[j].style.height = bordersize;
            if ((i == 0 && j != len) || (i == len && j != len)) Td[j].style.borderRightWidth = "0px";
            if ((j == 0 && i != len) || (j == len && i != len)) Td[j].style.borderBottomWidth = "0px";
            if (arr[i][j] == 4) { box.push(new Array(i,j));}
            if(arr[i][j]==1){now.x=i;now.y=j;}
        }
    }
    _D("lev").innerHTML = "第" + (level+1) + "关";
}
function chk() {
    for (var i = 0; i < box.length; i++)
        if (arr[box[i][0]][box[i][1]] == 4) return;
    level++;
    alert("恭喜通过第" + level + "关!");
    init();
}
function change(i, j) {
        var t = arr[i.x][i.y];
        if (t == 4 || t == 5) t = 0;
        arr[i.x][i.y] = arr[j.x][j.y];
        arr[j.x][j.y] = isbox(j) ? 4 : t;
    }
function otxt(txt) {
        document.getElementById("outtxt").innerHTML += txt + "<br/>";
    }
    function BB(val, i) {
        if (val + i == len || val + i == 0) return val;
        else {
            return val + i;
        }
    }
function isbox(j) {
        for (var h = 0; h < box.length; h++) {
            if (box[h][0] == j.x && box[h][1] == j.y) {
                return true;
                break;
            }
        }
        return false;
}
function fun(now, f, val) {
        var Table = _D("main");
        var Tr = _N("tr", Table);
        _N("td", Tr[now.x])[now.y].style.background = color[arr[now.x][now.y]];
        if (f == "x") now.x += val;
        else now.y += val;
        _N("td", Tr[now.x])[now.y].style.background = color[arr[now.x][now.y]];
        if (f == "x") now.x += val;
        else now.y += val;
        _N("td", Tr[now.x])[now.y].style.background = color[arr[now.x][now.y]];
    }
function mainfun(n, _n, f, val) {
        var flag = false;
        var __n = { x: n.x, y: n.y };
        if (f == "x") __n.x += val * 2;
        else __n.y += val  * 2;
        switch (arr[_n.x][_n.y]) {
            case 0: case 4: change(_n, n); flag = true; break;
            case 2:
                {
                    switch (arr[__n.x][__n.y]) {
                        case 0: change(__n, _n); change(_n, n); flag = true; break;
                        case 4: arr[__n.x][__n.y] = 5; arr[n.x][n.y] = 0; arr[_n.x][_n.y] = 1; flag = true; break;
                    }
                    break;
                }
            case 5:
                {
                    switch (arr[__n.x][__n.y]) {
                        case 0: arr[__n.x][__n.y] = 2; change(_n, n); flag = true; break;
                        case 4: arr[__n.x][__n.y] = 5; arr[now.x][now.y] = isbox(n) ? 4 : 0; arr[_n.x][_n.y] = 1; flag = true; break;
                    }
                    break;
                }
        }
        return flag;
    }
    function createEl() {
        var tbody = document.getElementsByTagName("tbody")[0];
        if(tbody) _D("main").removeChild(tbody);
        var tbody = document.createElement("tbody");
        _D("main").appendChild(tbody);
        for (var i = 0; i <= len; i++) {
            var Tr = document.createElement("tr");
            tbody.appendChild(Tr);
            for (j = 0; j <= len; j++) {
                Tr.appendChild(document.createElement("td"));
            }
        }
    }
    function loadmap() {
        if (date.length > level) {
            size = date[level].size;
            bordersize = date[level].bordersize;
            arr = [];
            for (var i = 0; i < date[level].arr.length; i++) {
                arr.push(date[level].arr[i]);
            }
            len = arr.length - 1;
        }
        else {
            alert('恭喜您已经通过全关！！');
            level = 998;
        }
    }