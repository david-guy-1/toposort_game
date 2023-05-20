
class map { // each room optionally has a map, a map can have multiple rooms 
    constructor(maze,size, name = "") { // size is x,y
        this.maze = maze;
        this.size = size ; 
        this.rooms = {}; // room is : x , y -> room string (not obj)
        this.name = name;
    }
    addRoom(x,y, room){
        if(this.rooms[`${x} ${y}`] !== undefined ){
            throw " room already exists in map " + this.name
        }
        if(room.map !== undefined){
            throw " room is already assigned to a map " + room.name + " : " + room.map.name; 
        }
        room.map = this.name;
        this.rooms[`${x} ${y}`] = room.name;

    }
    isRoomIn(room_name){ // only the name
        for(var item of Object.keys(this.rooms)){
            var room = this.rooms[item];
            if(room.name == room_name){
                return true;
            }
        }
        return false;
    }

}

export default map;