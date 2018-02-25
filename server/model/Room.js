class Room {
    constructor(rid, rname, location, current_num, total_num) {
        this.rid = rid;
        this.rname = rname;
        this.location = location;
        this.current_num = current_num;
        this.total_num = total_num;
        this.skill_list = [];
    }
}

module.exports = Room;