/// <reference path="../SSlib_V2.0/SSlibV2.js" />
var boxdate = [
    [0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0], [0, -1, -1, -1, 0, 0, 1, 0, 1, 1, 2],
    [0, -1, 0, 0, -1, 0, -1, 1, 1, 0, 1], [1, -1, 0, -1, 0, 0, -1, 0, 1, 1, 4],
    [-1, -1, -1, 0, 0, 0, 0, 1, 1, 0, 3], [-1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 8],
    [0, -1, 0, 0, 0, 1, -1, 1, 1, 0, 5], [1, 0, 0, 0, -1, 0, -1, -1, 1, 1, 6],
    [1, -1, 0, -1, 0, 0, 0, 1, 0, 1, 7], [1, -1, 1, 0, 0, 0, -1, 0, 1, 1, 12],
    [0, -1, 0, 0, 0, 1, 1, 1, 0, 1, 9], [1, 0, 0, 0, -1, 0, -1, 1, 1, 1, 10],
    [-1, -1, 0, -1, 0, 0, 0, 1, 1, 0, 11], [0, -1, 0, 0, 0, 1, 1, 0, 0, 1, 16],
    [-1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 13], [0, -1, 0, 0, 0, 1, -1, 0, 1, 0, 14],
    [-1, 0, 0, 0, 1, 0, 0, -1, 1, 1, 15], [2, 0, 1, 0, 0, 0, -1, 0, 1, 2, 18],
    [0, -1, 0, 0, 0, 1, 0, 2, 0, 0, 17]];
var date = [];
var nowbox = [];
var nowpix = { x: 5, y: 17 ,d:0}
var dateL = 8, dateR = 9, dateNext = 10;
var runing = false;
var split = 800, total = 1000;
var oldtime, oldtype, times;
var nextboxshow = null;
var lev = 0;
var levarr = [
{   total: 1000,    split: 800},
{   total: 2500,    split: 500},
{   total: 5000,    split: 350},
{   total: 10000,   split: 250}
];
SS(window).load(function () {
    date = [];
    for (var i = 0; i < 18; i++) {
        var t = [];
        for (var j = 0; j < 11; j++) {
            t.push(0);
        }
        date.push(t);
    }
    SS("#start").click(function () {
        addmain(parseInt(Math.random() * 18), randomColor());
        addnext();
        this.blur();
        this.disabled = true;
        runing = true;
        SS("#state").html("运行");
        autorun.defer(split);
        SS("#Nexttotal").html(total);
        SS("#nowsplit").html(split);
        SS("#lev").html("第" + (lev + 1) + "关");
    });
    SS("#pause").click(function () {
        if (runing == false) {
            SS("#state").html("运行");
            this.value = "暂停";
            runing = true;
            autorun.defer(100);
        }
        else {
            SS("#state").html("暂停");
            this.value = "运行";
            runing = false;
        }
    });
    loadevent();
})
function randomColor() {
    var c = "123456789abcdef";
    var t = "";
    for (var i = 0; i <= 5; i++) {
        t += c.charAt(parseInt(Math.random() * 15));
    }
    return "#" + t;
}
function addnext() {
    if (nextboxshow != null)
        addmain(nextboxshow.d, nextboxshow.c);
    nextboxshow = {};
    nextboxshow.d = parseInt(Math.random() * 18);
    nextboxshow.c = randomColor();
    SS("#nextBox").html("");
    for (var j = 0; j < 4; j++) {
        var span = SS("#nextBox").addchild("span");
        var m = boxdate[nextboxshow.d][j * 2] + 1;
        var n = boxdate[nextboxshow.d][j * 2 + 1] + 1;
        span.css({ left: m * 20 + m + "px", bottom: n * 20 + n + "px", backgroundColor: nextboxshow.c });
    }
}
function addmain(i,c) {
    var color = c;
    nowbox = [];
    for (var j = 0; j < 4; j++) {
        var span = SS("#mainBox").addchild("span");
        var m = boxdate[i][j * 2] + 5;
        var n = boxdate[i][j * 2 + 1] + 17;
        span.css({ left: m * 20 + m + "px", bottom: n * 20 + n + "px", backgroundColor: color });
        if (n <= 17 && date[n][m] && runing) { alert("over"); runing = false; }
        nowbox.push(span);
    }
    nowpix = { x: 5, y: 17, d: i }  
}
function loadevent() {
    document.onkeydown = function (event) {
        var e = event || window.event;
        if (runing) {
            switch (e.keyCode) {
                case 37: //左
                    if (nowpix.x - boxdate[nowpix.d][dateL] > 0) {
                        showbox("x--");
                    }
                    break;
                case 39: //右
                    if (nowpix.x + boxdate[nowpix.d][dateR] < 10) {
                        showbox("x++");
                    }
                    break;
                case 40: //下
                    showbox("y--");
                    break;
                case 32: case 38: //变形
                   showbox("next");
                    break;

            }
        }
        return false;
    }
}
function showbox(type) {
    if (cheack(type)) {
        for (var j = 0; j < 4; j++) {
            var m = boxdate[nowpix.d][j * 2] + nowpix.x;
            var n = boxdate[nowpix.d][j * 2 + 1] + nowpix.y;
            nowbox[j].css({ left: m * 20 + m + "px", bottom: n * 20 + n + "px" });
        }
    }
    if (oldtype != type) { oldtime = new Date(); oldtype = type;times = 0; }
    else {
        times++;
        var t = ((new Date()).getTime() - oldtime.getTime());
        if (t > split + 10 && split - 10 < t && times > 3) {
            oldtime = new Date();
            times = 0;
            autorun();
        }
    }
    anima.stop();
    autorun.defer(split);
}
function cheack(type) {
    switch (type) {
        case "x++": nowpix.x++; if (mode()) return true; else { nowpix.x--; return false; } break;
        case "x--": nowpix.x--; if (mode()) return true; else { nowpix.x++; return false; } break;
        case "y--": nowpix.y--; if (mode()) return true; else { nowpix.y++; adddate(); return false; } break;
        case "next": var t = nowpix.d; nowpix.d = boxdate[nowpix.d][dateNext]; if (mode()) return true; else { nowpix.d = t; return false; } break;
    }
    return true;
}
function mode() {
    var flag = true;
    for (var j = 0; j < 4; j++) { 
       var m = boxdate[nowpix.d][j * 2] + nowpix.x;
       var n = boxdate[nowpix.d][j * 2 + 1] + nowpix.y ;
       if (n >=17) continue;
       if ( (n>=0 && date[n][m] != 0) || n<0) 
          flag = false;
   }
   return flag;
}
function adddate() {
    for (var j = 0; j < 4; j++) {
        var m = boxdate[nowpix.d][j * 2] + nowpix.x;
        var n = boxdate[nowpix.d][j * 2 + 1] + nowpix.y;
        if (n >= 17) { alert("over"); runing = false;return;}
        date[n][m] = nowbox[j];
    }
    var hang = 0;
    for (var i = 0; i < 18; i++) {
        var f = true;
        for (var j = 0; j < 11; j++) {
            if (!date[i][j]) f = false;
        }
        if (f) {
            hang++;
            for (var j = 0; j < 11; j++) { date[i][j].del(); date[i][j] = 0; }
            for (var n = i+1 ; n < 18; n++) {
                for (var m = 0; m < 11; m++) {
                    if (date[n][m]) {
                        date[n][m].css({ bottom: (n - 1) * 20 + n - 1 + "px" });
                        date[n - 1][m] = date[n][m];
                        date[n][m] = 0;
                    }
                   }
            }
            i--;
        }
    }
    if (hang == 0) { addnext(); return; }
    var _total = parseInt(SS("#fen").html());
    switch (hang) {
        case 1: _total += 10; break;
        case 2: _total += 30; break;
        case 3: _total += 50; break;
        case 4: _total += 70; break;
    }
    SS("#fen").html(_total);
    //过关
    if (_total >= total) {
        lev++;
        split = levarr[lev].split;
        total = levarr[lev].total;
        alert("第" + (lev + 1) + "关");
        SS("#lev").html("第" + (lev + 1) + "关");
        SS("#Nexttotal").html(total);
        SS("#nowsplit").html(split);
        SS("#fen").html("0");
        for (var i = 0; i < 18; i++) {
            for (var j = 0; j < 11; j++) {
                if (date[i][j]) {
                    date[i][j].del();
                    date[i][j] = 0;
                }
            }
        }
    }
    addnext();
}
function autorun() {
        if (runing)
            showbox("y--");
        times = 0;
}