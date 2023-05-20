class room{ // part of gameData
    constructor(name,entities,walls,imgs,reqImgs, monsters, drops, background, speed=1.5, map=undefined){
		if(Array.isArray(monsters)){
			monsters = new Set(monsters);
		}
		if(Array.isArray(drops)){
			drops = new Set(drops);
		}
		if(Array.isArray(walls)){
			walls = new Set(walls);
		}
		if(Array.isArray(imgs)){
			imgs = new Set(imgs);
		}
		if(Array.isArray(reqImgs)){
			reqImgs = new Set(reqImgs);
		}
		if(Array.isArray(monsters)){
			monsters = new Set(monsters);
		}
		if(Array.isArray(entities)){
			entities = new Set(entities);
		}
		this.name = name;
        this.entities = entities
        this.walls = walls // quadruples, are lines
        this.imgs = imgs // X and Y are already in the object itself
		this.reqImgs = reqImgs
		this.background = background;
		this.monsters = monsters; // set of triples: startX, startY, monster
		this.drops = drops; // set of items, added when monsters are all killed
		this.speed = speed; // monster speed, in pixels per frame
		this.map = map; // map that this is a part of (as a string)
    }
}
export default room