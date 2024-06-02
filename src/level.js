import * as l from "./lines.js"
// one single screen
class level{
	constructor(game, walls,items,entities,imgs,reqImgs,monsters,background,x, y, music){
		if(Array.isArray(monsters)){
			monsters = new Set(monsters);
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
		if(Array.isArray(items)){
			items = new Set(items);
		}
		this.game = game;
		this.music = music;
		this.x = x;
		this.y = y;
		this.walls = walls; // quadruples : tlx, tly, brx, bry. // is a set
		// border walls always exist
		this.walls = l.union(this.walls, new Set([[0,0,1000,0],[1000,0,1000,600],[1000,600,0,600],[0,600,0,0]]))
		this.items = items; // quadruples : name, image, x, y. These are sets
		this.facingDirection = "left";
		// coded as 40x40
		this.entities = entities; // set of entity objects
		this.imgs = imgs; // images to display. 
		this.reqImgs = reqImgs;
		this.background = background;
		// monsters
		this.monsters = [];
		this.monsterX = [];
		this.monsterY = [];
		this.monsterHP = [];
		this.monsterAngle = []; // angle monster is facing, used for movement
		for(var monster of monsters){
			this.monsters.push(monster[2]);
			this.monsterX.push(monster[0]);
			this.monsterY.push(monster[1]);
			this.monsterHP.push(monster[2].hp);
			this.monsterAngle.push(Math.random() * 2 * Math.PI);
		}
		
	}
	// returns the monsters as a list of objects
	// includes dead monsters
	getMonsters(){
		var monsters = []
		for(var i=0 ; i<this.monsters.length; i++){
			monsters.push({
				monster : this.monsters[i],
				x : this.monsterX[i],
				y : this.monsterY[i],
				hp : this.monsterHP[i],
				index : i,
			})
		}
		return monsters;
	}
	// returns whether or not all monsters are dead
	allDead(){
		for(var i=0; i<this.monsters.length; i++){
			if(this.monsterHP[i] > 0){
				return false;
			}
		}
		return true;
	}
	// attempts to move that way. If there is a wall, return false. else, return true
	move(x,y,maxLength){
		if(x > 0){
			this.facingDirection = "right"
		} else if (x < 0){
			this.facingDirection = "left";
		}
		if(x == 0 && y == 0){
			return true;
		}
		var result = this.pointInDirection(this.x, this.y, x, y, maxLength);
		if(result[2] == true){
			return false
		}
		this.x = result[0];
		this.y = result[1];
		return true;
	}
	// returns the point in that direction, and whether or not it goes into a wall
	pointInDirection(curX, curY, x, y, maxLength){
		var length = Math.sqrt(x*x + y*y)
		// want vector to have length maxLnegth. 
		if(length < maxLength){
			maxLength = length;
		}
		var newX = curX + x * maxLength / length;
		var newY = curY + y * maxLength / length;
		// check if newX, newY is in a wall
		for (var wall of this.walls){
			if(l.doLinesIntersect([curX, curY, newX, newY], wall)){
				return [newX, newY, true];
			}
		}
		return [newX, newY, false]
		
	}
	//move to a point
	moveToPoint(x,y,maxLength){
		return this.move(x - this.x, y -this.y, maxLength);
	}
	
	//item functions
	addItem(item){
		if(this.getItemByName(item.name) != undefined){
			throw new Error("duplicate item");
		}
		this.items.add(item);
	}
	
	getItemsByLocation(x,y){
		var lst = [];
		for(var item of this.items){
			if(l.pointInsideRectangle(x,y,item.x,item.y, 40, 40)){
				lst.push(item);
			}
		}
		return lst;
	}
	getItemByName(name){
		for(var item of this.items){
			if(item[0] == name){
				return item;
			}
		}
		return undefined;
	}
	removeItem(name){
		this.items.delete(this.getItemByName(name));
	}
	
	
	
	//entity functions
	addEntity(entity){
		if(this.getEntityByName(entity.name) != undefined){
			throw new Error("duplicate item");
		}
		this.entities.add(entity);
	}
	
	
	getEntitiesByLocation(x,y){
		var lst = [];
		for(var entity of this.entities){
			if(l.pointInsideRectangle(x,y,entity.tlx, entity.tly, entity.brx-entity.tlx, entity.bry - entity.tly)){
				lst.push(entity);
			}
		}
		return lst;
	}
	getEntityByName(name){
		for(var entity of this.entities){
			if(entity[0] == name){
				return entity;
			}
		}
		return undefined;
	}
	removeEntity(name){
		this.entities.delete(this.getEntityByName(name));
	}
	// uses the player's location and facing direction to attack monsters
	//returns a list of indices of attacked monsters, regardless of if player meets requirements to damage them.
	attack(){
		// check 45 pixels in front of player.
		var points = []
		if(this.facingDirection == "left"){
			for(var i=0; i<=45; i+=5){
				points.push([this.x-i, this.y])
			}
		} else if (this.facingDirection == "right"){
			for(var i=0; i<=45; i+=5){
				points.push([this.x+i, this.y])
			}
		}
		var monsters = []
		for(var i=0; i<this.monsters.length; i++){
			if(this.monsterHP[i] <= 0){
				continue; // ignore dead monsters
			}
			var x = this.monsterX[i] ;
			var y = this.monsterY[i] ; 
			for(var point of points){
				if(l.pointInsideRectangle(point[0], point[1], x, y, this.monsters[i].width,this.monsters[i].height)){
					monsters.push(i);
					break;
				}
			}
		}
		return monsters;
	}
	//make monsters randomly move
	monsterStep(speed){
		for(var i=0; i<this.monsters.length; i++){
			var angle =  this.monsterAngle[i];
			var x = this.monsterX[i];
			var y = this.monsterY[i];
			var xBR = this.monsters[i].width +  this.monsterX[i];
			var yBR = this.monsters[i].height +  this.monsterY[i];
			var result = this.pointInDirection(x, y, Math.cos(angle)*speed, Math.sin(angle)*speed , speed);
			var result2 = this.pointInDirection(xBR, yBR, Math.cos(angle)*speed, Math.sin(angle)*speed , speed);
			if(result[2] == false && result2[2] == false){ // no wall
				this.monsterX[i] = result[0];
				this.monsterY[i] = result[1];
			} else {
				this.monsterAngle[i] += Math.PI;
			}
			// turn around randomly
			this.monsterAngle[i] += Math.random() * 0.6 - 0.25; // slight bias towards rotating counterclockwise
		}
	}
	
}

export default level;