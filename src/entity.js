 // name is just so it can be marked as done in game.
 
 // type is "chest", "monster", "up_machine", "portal"
 // no "item", dropped items are stored in game class
 // not "monster" either.
		// think of more types as we go.
		//portals are portal objects
		//displays are just images and locations.....
/*
data : 

chest : set of items (coords are are built in)

portal : triple [new location, new x, new y] , normal passages and keyed passages are also coded as portals.

npc : list of objects : {requirements, displayString, items}
displayString and reqs are ignored for npcs

will never give the same item twice.
*/
const validTypes = new Set(["chest","portal", "npc"]);

class entity{
	constructor(name,type,tlx,tly,brx,bry,displayString, data,reqs, img){
		if(!validTypes.has(type)){
			throw new Error("invalid type of entity : " + type);
		}
		// array to set
		if(type == "chest"){
			if(Array.isArray(data)){
				data = new Set(data);
			}
		}
		if(Array.isArray(reqs)){
			reqs = new Set(reqs);
		}
		
		this.name = name;
		this.type = type;
		this.tlx = tlx
		this.tly = tly
		this.brx = brx
		this.bry = bry
		this.displayString = displayString; // used when can't open chest or use object
		this.data = data
		this.reqs = reqs
		this.img = img; // image to be displayed when not activated yet. not used once activated.
		
	}
}

export default entity;