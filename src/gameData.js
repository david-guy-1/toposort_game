class gameData{
    constructor(rooms,items, finalRoom){
		if(rooms[finalRoom] == undefined){
			throw new Error("gameData without final room");
		}
        this.rooms = rooms;// hash table of name -> room
        this.items = items;// hash table of name of room -> set of items 
		this.finalRoom = finalRoom;
	}
}
export default gameData;