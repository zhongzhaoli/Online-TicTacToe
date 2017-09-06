var ex = require('express')();  //加载模块
var http = require('http').Server(ex);
var io = require('socket.io')(http);  //加载socket 模块
var https = require('http');//引入核心HTTP模块

/* 变量列表 */

//在大厅用户
var user_l = {};
//匹配列表
var pipei_l = {};
//成功匹配房间
var pipei_s = {};
//匹配成功的人的房间
var user_s_room = {};
//匹配成功的人的房间：+chr
var user_s_room_f = {};



var server = https.createServer(function (req, res) {
    res.writeHead(200, { "Content-type": 'text/html' }); //创建一个web服务器
    res.end('');
});

server.listen(9800, '10.50.102.135', function () {
    console.log('服务器创建成成功:10.1.29.150:9800');
});

http.listen(9801, function () { //建立服务
    console.log('127.0.0.1:9801'); //打印 //创建一个nodejs服务器
})

io.on('connection', function (socket) {
    //登录
    socket.on('user_up', function (e) {
        socket.name = e;
        user_l[e] = e;
        console.log(e + '已登录');
        console.log(user_l);
        io.emit('people', user_l);
    })
    //匹配
    socket.on('pipei_star', function (e) {
        if (!pipei_l.hasOwnProperty(e)) {
            pipei_l[e] = e;
            console.log(e + '加入匹配列表');
            var a = 0;
            for (var key in pipei_l) {
                a = a + 1;
            }
            if (a == 2) {
                var room_id = "";
                for (var key in pipei_l) {
                    room_id = room_id + "|" + pipei_l[key];
                }

                for (var key in pipei_l) {
                    user_s_room[pipei_l[key]] = room_id;
                    console.log(pipei_l[key] + '已匹配成功')
                    console.log('房间号' + room_id);
                    delete user_l[pipei_l[key]];
                    delete pipei_l[pipei_l[key]];
                }
                io.emit('pipei_sus', room_id);
                io.emit('people', user_l);

            }
        }
    })

    socket.on('down_z', function (e) {
        var a = e.room_id;
        var b = e.Checkerboard;
        var c = e.user_id;
        var ab = a.split('|')[1];
        var ac = a.split('|')[2].split('che')[0];
        console.log(ab);
        console.log(ac);
        io.emit(a + ab, { 'Checkerboard': b, 'user_id': c });
        io.emit(a + ac, { 'Checkerboard': b, 'user_id': c });
    })

    // for (var zio in user_s_room_f) {
    //     var aczx = user_s_room_f[zio];
    //     socket.on(aczx, function (e) {
    //         var gettype = Object.prototype.toString
    //         if (gettype.call(e) == "[object Object]") {
    //             var a = 'ch' + aczx;
    //             io.emit(a, e);
    //         }
    //         else {
    //             delete user_s_room[e];
    //         }
    //     })
    // }


    socket.on('dele_out',function(e){
        delete user_s_room[e];
    })

    socket.on('suff', function (e) {
        if (!pipei_s.hasOwnProperty(e)) {
            pipei_s[e] = e;
            var ec = e + 'che'
            user_s_room_f[ec] = ec;
            for (var key in pipei_s) {
                var a = pipei_s[key];
                socket.on(pipei_s[key], function (e) {
                    console.log(a + "-66666");
                    io.emit(a, e);
                })
            }
        }

    })

    //离开
    socket.on('disconnect', function () {
        if (!socket.name) {
            return;
        }
        else {
            console.log(socket.name + '已退出');
            if (user_s_room.hasOwnProperty(socket.name)) {
                io.emit(user_s_room[socket.name].split("|")[1], 'out');
                io.emit(user_s_room[socket.name].split("|")[2], 'out');
                console.log(user_s_room[socket.name]);
            }
            delete user_s_room[socket.name];
            delete pipei_l[socket.name];
            delete user_l[socket.name];
            io.emit('people', user_l);
        }
    });
})
