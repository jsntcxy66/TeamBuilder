var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var Location = require('./model/Location');
var User = require('./model/User');
var Room = require('./model/Room');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var Users = new Map();
var Rooms = new Map();
var Skill_Room = new Map();
var Room_Skill = new Map();

var user_num = 0;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log("connection set up.");
    socket.on('receive_id', function(uid) {
        Users.get(uid).socket = socket;
        var _id = parseInt(uid);
        var rid = String(Users.get(_id).rid);
        socket.join(rid);
        console.log(uid + ' joint the room ' + rid);
        socket.on('chat_msg', (message) => {
            io.in(rid).emit('room_msg', message);
        });
        socket.on('disconnect', leave(_id,socket));
    })
});

app.post('/api/new_room', (req, res) => {
    console.log('creating new room');
    var _id = req.body.uid;
    var ret = { status: 0, mgs: '' };
    var loc = new Location(1, _id, Users.get(_id).uname, [""]);
    var room = new Room(_id, req.body.rname, [loc], 1, 1);
    Rooms.set(_id, room);
    Users.get(_id).lid = 1;
    Users.get(_id).rid = _id;
    console.log('return room',ret);
    res.send(ret);
});

app.post('/api/new_user', function(req, res) {
    user_num = user_num + 1;
    var user = new User(user_num, req.body.uname, req.body.skill);
    var room = new Set();
    Users.set(user_num, user);
    var arr = [];
    for (key of Rooms.keys()) {
        arr.push(Rooms.get(key));
    }
    var retext = {
        uid: user.uid,
        name: user.uname,
        skill: user.skill,
        room: arr
    }
    res.send(retext);
});

app.post('/api/add_teammate', function(req, res) {
    var uid = req.body.uid;
    var skills = req.body.skill;
    var loc = {
        lid: Rooms.get(uid).location.length,
        uid: -1,
        name: "",
        skill: skills
    };
    for(sk of skills){
        if(Rooms.get(uid).skill_list.has(sk) == false){
            Room.get(uid).skill_list.add(sk);
        }
    }        
    Rooms.get(uid).location.push(loc);
    for (sk of skills) {
        if (Skill_Room.has(sk)) {
            room = Skill_Room.get(sk);
            if (room.has(uid) == false) {
                room.add(uid);
            }
        } else {
            Skill_Room.set(sk, new Set([uid]));
        }
    }
    var needlist = Room_Skill.get(uid);
    for (sk of skills) {
        if (needlist.has(sk)) {
            needlist.set(sk, needlist.get(sk) + 1);
        } else {
            needlist.set(sk, 1);
        }
    }
    Room_Skill.set(uid, needlist);
    io.in(rid).emit('room_list_change', Rooms.get(uid));
    var arr = [];
    for (key of Rooms.keys()) {
        arr.push(Rooms.get(key));
    }
    io.emit(arr);
    res.send({ status: 0, msgs: 'success' });
});

app.get('/api/enter_room', (req, res) => {
    var rid = parseInt(req.query.rid);
    var uid = parseInt(req.query.uid);
    if (Rooms.get(rid) == undefined) {
        res.send({ status: -1, msgs: 'no such room' });
        return;
    }
    var room = Rooms.get(rid);
    if (room.current_num == room.total_num) {
        res.send({ status: -2, msgs: 'room is full' });
        return;
    }
    var skills_of_room = Room_Skill.get(rid);
    var flag_has = false;
    for (u_skill of Users.get(uid).skill) {
        if (skills_of_room.get(u_skill) != undefined && skills_of_room.get(u_skill) != 0) {
            flag_has = true;
            break;
        }
    }
    if (flag_has == false) {
        res.send({ status: -3, msgs: 'do not meet the requirements' });
        return;
    }

    var loc;
    for (location of room.location) {
        if (location.uid != -1) continue;
        var flag1 = false;
        for (l_skill of location.skill) {
            var flag2 = false;
            for (u_skill of Users.get(uid).skill) {
                if (l_skill == u_skill) {
                    location.uid = uid;
                    Users.get(uid).rid = rid;
                    location.name = Users.get(uid).uname;
                    room.current_num++;
                    loc = location;
                    flag1 = true;
                    falg2 = true;
                    break;
                }
            }
            if (flag2 == true) break;
        }
        if (flag1 == true) break;
    }

    for (skill of loc.skill) {
        skill_num = skills_of_room.get(skill);
        Room_Skill.get(rid).set(skill, --skill_num);
        if (skill_num == 0) {
            Skill_Room.get(skill).delete(rid);
        }
    }
    io.in(rid).emit('room_list_change', room);
    var arr = [];
    for (key of Rooms.keys()) {
        arr.push(Rooms.get(key));
    }
    io.emit('all_room',arr);
    res.send({ status: 0, msgs: 'succeed' });
});

http.listen(port, function() {
    console.log('listening on *:' + port);
});

function leave(uid,socket) {
    console.log('leaving');
    var user = users.get(uid);
    var rid = user.rid;
    if (uid == rid) {
        io.in(rid).emit('room_list_change', '');
        for (sk of Skill_Room.keys()) {
            if (Skill_Room.get(sk).has(rid)) {
                Skill_Room.get(sk).delete(rid);
            }
        }
        if (Room_Skill.has(rid)) {
            Room_Skill.delete(rid);
        }
        for(loc of Rooms.get(rid).location){
            if(loc.uid > 0){
                Users.get(loc.uid).socket.leave(rid);
                Users.get(loc.uid).rid = -1;
            }
        }
        Rooms.delete(rid);
        var arr = [];
        for (key of Rooms.keys()) {
            arr.push(Rooms.get(key));
        }
        io.emit('all_room',arr);
    } else {
        for (loc in Rooms.get(rid).location) {
            if (Rooms.get(rid).location[loc].uid == uid) {
                var skil = Rooms.get(rid).location[loc].skill;
                for (sk of skil) {
                    if (Skill_Room.has(sk)) {
                        if (Skill_Room.get(sk).has(rid) == false) {
                            Skill_Room.get(sk).push(rid);
                        }
                    } else {
                        Skill_Room.set(sk, new Set([rid]));
                    }
                }
                if (Room_Skill.has(rid)) {
                    for (sk of skil) {
                        if (Room_Skill.has(sk)) {
                            Room_Skill.get(rid).set(sk, Room_Skill.get(rid).get(sk) + 1);
                        } else {
                            Room_Skill.get(rid).set(sk, 1);
                        }
                    }
                } else {
                    Room_Skill.set(rid, new Map());
                    for (sk of skil) {
                        Room_Skill.get(rid).set(sk, 1);
                    }
                }
                Users.get(uid).socket.leave(rid);
                Users.get(uid).rid = -1;
                Rooms.get(rid).location[loc].uid = 0;
                Rooms.get(rid).location[loc].name = "";
                Rooms.get(rid).location[loc].skill = [];
                Rooms.get(rid).current_num = Rooms.get(rid).current_num - 1;
                io.in(rid).emit('room_list_change', Rooms.get(rid));
                var arr = [];
                for (key of Rooms.keys()) {
                    arr.push(Rooms.get(key));
                }
                io.emit('all_room',arr);
                break;
            }
        }
    }
}