var user_id = "";
var room_id_zzxzx = "";
var is_you = 0;
var XO = "";
var ping = 0;
var Checkerboardz = {};
var ip = "http://10.50.102.135:9801";
var ip2 = "http://10.50.102.135:9800";

window.onload = function () {

    //服务器是否开启
    $.ajax({
        type: 'get',
        url: ip2,
        cache: false,
        dataType: "jsonp",  //跨域采用jsonp方式  
        processData: false,
        timeout: 10000, //超时时间，毫秒
        complete: function (e) {
            if (e.status == 404) {
                alert('服务器正在维护');
                return;
            }
            else if (e.status == 200) {
                onlo();
            }
            else {
                alert('出错');
                return;
            }
        }
    })
}
//window.onload
function onlo() {
    user_id = getID();
    pipei_star();
    var socket = io(ip);//连接
    //人数
    socket.on('people', function (e) {
        var num = people(e);
        //写入
        $('#online_people')[0].innerHTML = "<br/>" + "当前在线人数" + num + "人";
    })
    socket.on('pipei_sus', function (e) {
        var a = e.split('|')[1];
        var b = e.split('|')[2];
        if (b == user_id || a == user_id) {
            room_id_zzxzx = e;
            alert('匹配成功');
            $('#center_box')[0].style.display = "none";
            $('#chuli')[0].style.display = "block";
            socket.emit('suff', room_id_zzxzx);

            //判断谁先
            var first = who_first();
            if (first == 'f') {
                socket.emit(room_id_zzxzx, room_id_zzxzx.split('|')[1]);
            }
            else {
                socket.emit(room_id_zzxzx, room_id_zzxzx.split('|')[2]);
            }

            socket.on(room_id_zzxzx, function (e) {

                init();

                if (e == user_id) {
                    is_you = 0;
                    $('#who')[0].innerHTML = "等待对方下棋"
                    $('#XO')[0].style.background = "url(img/O.png)";
                    XO = "O";
                    $('#pizz_box')[0].style.display = "block"
                    $('#chuli')[0].style.display = "none";
                }
                else {
                    is_you = 1;
                    $('#who')[0].innerHTML = "轮到你下棋了"
                    $('#XO')[0].style.background = "url(img/X.png)";
                    XO = "X";
                    $('#pizz_box')[0].style.display = "block"
                    $('#chuli')[0].style.display = "none";
                }
            })
            jzq_div();
        }
        socket.on('down_z_z', function (e) {

        })
        socket.on(room_id_zzxzx + 'che' + user_id, function (e) {
            make_check(e);
        })
    })


    socket.on(user_id, function (e) {
        alert('对方已退出');
        window.location.reload();
    })
}

/*匹配按钮*/
function pipei() {
    $('#pipei_btn')[0].style.display = "none";
    $('#pipei_text')[0].style.display = "block";
    var socket = io(ip);//连接
    socket.emit('pipei_star', user_id);
}

/*上线*/
function pipei_star() {
    var socket = io(ip);
    socket.emit('user_up', user_id);
}

/*ID随机*/
function getID() {
    return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
}

/*人数统计*/
function people(e) {
    var people_num = 0;
    for (var key in e) {
        people_num++
    }
    return people_num;
}

//下棋
function jzq_div() {
    var socket = io(ip);//连接
    for (var i = 1; i < 10; i++) {
        var a = "#jzq_" + i;
        $(a)[0].onclick = function () {
            if (!is_you == 1) {
                alert('还没轮到你呢');
                return;
            }
            else {
                var a = this.id;
                var b = a.split('_')[1];
                if (Checkerboardz[b] == "") {

                    Checkerboardz[b] = XO;
                    is_you = 0;
                    fun_is_you();
                    var c = room_id_zzxzx + 'che';
                    socket.emit('down_z', { 'Checkerboard': Checkerboardz, 'user_id': user_id, 'room_id': c });
                }
                else {
                    alert('这里已经下过了');
                }
            }
        }
    }
}

//判断谁先
function who_first() {
    var a = Math.floor(Math.random() * 10);
    if (a <= 5) {
        return "f";
    }
    else if (a > 5) {
        return "s";
    }
}

//判断是不是你
function fun_is_you() {
    if (is_you) {
        $('#who')[0].innerHTML = "轮到你下棋了"
    }
    else {
        $('#who')[0].innerHTML = "等待对方下棋"
    }
}
//初始化棋盘
function init() {
    for (var i = 1; i < 10; i++) {
        Checkerboardz[i] = "";
    }
}
//清除div棋盘
function cz_che() {
    for (var i = 1; i < 10; i++) {
        var a = '#jzq_' + i;
        $(a)[0].innerHTML = "";
    }
}

//制作棋盘
function make_check(e) {
    // init();
    cz_che();
    console.log(e.Checkerboard);
    var aaa = e.Checkerboard
    Checkerboardz = aaa;
    make_check_main(aaa, e);
    pd_win(aaa, e.user_id);
}
//判断输赢
function pd_win(aaa, bbb) {
    var win_a = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]
    ]
    for (var i = 0; i < win_a.length; i++) {
        var a = win_a[i][0];
        var b = win_a[i][1];
        var c = win_a[i][2];
        if (aaa[a] == aaa[b] && aaa[b] == aaa[c] && aaa[a] != "" && aaa[b] != "" && aaa[c] != "") {
            if (bbb == user_id) {
                $('#mengban_')[0].style.display = "block";
                $('#win_h1')[0].innerHTML = "你赢了";
                $('#win')[0].style.display = "block";
                $('#retuen_btn')[0].style.display = "block";
                dele_out();
                return;
            }
            else {
                $('#mengban_')[0].style.display = "block";
                $('#win_h1')[0].innerHTML = "你输了";
                $('#win')[0].style.display = "block";
                $('#retuen_btn')[0].style.display = "block";
                dele_out();
                return;
            }
        }
        else {

        }
    }
    pd_ping(aaa);
}

//判断平手
function pd_ping(aaa) {
    for (var zi in aaa) {
        if (aaa[zi] !== "") {
            ping++;
            if (ping >= 9) { //打平手
                dele_out();
                $('#mengban_')[0].style.display = "block";
                $('#win_h1')[0].innerHTML = "打平手";
                $('#win')[0].style.display = "block";
                $('#retuen_btn')[0].style.display = "block";
                ping = 0;
                return;
            }
        }
    }
    ping = 0;
}

//制作棋盘 Main
function make_check_main(aaa, e) {
    for (var key in aaa) {
        if (!aaa[key] == "") {
            var a = "#" + 'jzq_' + key;
            if (aaa[key] == "X") {
                $("<div style='background:url(img/X.png);width:50px;height:50px;margin:25px;'></div>").appendTo($(a)[0]);
                if (e.user_id != user_id) {
                    is_you = 1;
                    fun_is_you();
                }
                else {
                    is_you = 0;
                    fun_is_you();
                }
            }
            else {
                $("<div style='background:url(img/O.png);width:50px;height:50px;margin:25px;'></div>").appendTo($(a)[0]);
                if (e.user_id != user_id) {
                    is_you = 1;
                    fun_is_you();
                }
                else {
                    is_you = 0;
                    fun_is_you();
                }
            }
        }
    }
}

//输赢平 取消提示退出
function dele_out() {
    var socket = io(ip);//连接
    socket.emit('dele_out', user_id);
}