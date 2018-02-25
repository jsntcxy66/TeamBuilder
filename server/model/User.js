class User {
    constructor(uid, uname, skill, rid) {
        this.uid = uid;
        this.uname = uname;
        this.skill = skill;
        this.rid = rid;
        this.socket = -1;
    }
}

module.exports = User;