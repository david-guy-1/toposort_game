import level from "./level.js";
import * as l from "./lines.js"

const _ = require("lodash");

class game{
	constructor(gd, dag, reverseDict, hintStrings, maps){
		this.gameData = _.cloneDeep(gd);
		this.maps = maps;
		// setify the items;
		for(var key of Object.keys(this.gameData.items)){
			if(Array.isArray(this.gameData.items[key] )){
				this.gameData.items[key]  = new Set(this.gameData.items[key] );
			}
		}
		
		// load all images
		// fix all room names
		
		this.startTime = Date.now();
		this.lastEnteredTime = Date.now();
		this.sort = [];
		this.times = [];
		this.currentRoom = "root";
		this.canvasTL = [30,80]
		this.inventory = new Set();// pairs. just the name and image. no x or y coords
		this.items = this.gameData.items; // hash table of name of room -> set of items
		this.completedEntities = new Set(); // list of strings
		this.completedMonsters = new Set();
		this.nextLocation = undefined // set by activateEntities when stepping on a portal. used by synchronize.
		this.lastAttacked = Date.now();
		this.level = this.computeLevel(400,400);
		this.dag = dag;
		this.reverseDict = reverseDict;
		this.hintStrings = hintStrings;
	}
	isRoomCompleted(room){
		var roomObj = this.gameData.rooms[room]
		var inventoryNames = [...this.inventory].map((x) => x[0]);
		if(this.items[room].size !== 0){ // did not pick up item
			return false;
		}
		if(roomObj.monsters.size !== 0 && this.completedMonsters.has(room) === false){ // monster not killed
			return false 
		}
		var roomEntities = this.gameData.rooms[room].entities;
		for(var entity of roomEntities){
			switch(entity.type){
				case "chest":
					if(this.completedEntities.has(entity.name) == false){
						return false; 
					}
				break;
				case "npc":
					// for each item it can drop, see if it's in the inventory
					// if not, then this room is not done yet
					var drops = entity.data.flatMap((x) => x.items);
					
					for(var item of drops){
						// npc drops item that we don't have yet
						if(inventoryNames.indexOf(item.name) == -1 ){
							return false; 
						}
					}
				break;
			}
		}
		return true;
	}
	// get vertices that can be reached immediately
	getExposedVertices(){
		return this.dag.get_exposed_vertices(new Set(Array.from(this.inventory).map(x => this.reverseDict[x[0]])))
	}
	// can return undefined if nothing to hint at.
	hintAtRandom(){
		var choice = Array.from(this.getExposedVertices());
		choice = choice[Math.floor(Math.random() *  choice.length )];
		return this.hintStrings[choice];
		
	}
	getLevel(){
		return this.level;
	}
	computeLevel(x,y){
		// compute level based on the image and provided x and y
		var room = this.gameData.rooms[this.currentRoom];
		var items = this.items[this.currentRoom];
		var walls = room.walls;
		var entities = l.filter(room.entities,function(x){return !this.completedEntities.has(x.name)}.bind(this));
		//// list of triples: startX, startY, monster
		var monsters = this.completedMonsters.has(room.name) ? [] : room.monsters;
		var displays = room.displays;
		var background = room.background;
		var imgs = room.imgs;
		var reqImgs = room.reqImgs;
		return new level(this, walls,items,entities,imgs,reqImgs, monsters,background,x,y);
		
	}
	//returns a single string completely saying where the player is in the dungeon.
	// used for rendering background
	getLocation(){
		return this.currentRoom;
	}
	tick(mouseX, mouseY, mouseDown){
		/*
		returns:
		list of items picked up
		list of entities activated
		list of entities tried to activate, but failed due to not meeting requirements
		indices of monsters attacked
		indices of monsters failed to attack
		new room, if applicable.
		*/
		if(mouseX == undefined){
			throw 1
		}
		//console.log([mouseX, mouseY, mouseDown]);
		// move player
		this.getLevel().moveToPoint(mouseX-this.canvasTL[0], mouseY-this.canvasTL[1], 20 + Math.random() * 1);
		var a = this.pickUpItems();
		var b = this.activateEntities();
		this.level.monsterStep(this.gameData.rooms[this.currentRoom].speed + Math.random() * 0.1);
		var now = Date.now();
		var c = undefined
		var attackedThisTick = false;
		if(now > this.lastAttacked + 300 && mouseDown){ // delay in attack: 300 milliseconds
			c = this.attack();
			// only set a cooldown if attack dealt damage
			if(c[0].length > 0){
				this.lastAttacked = now;
			}
			attackedThisTick = true;
		}

		var d =this.synchronize();
		return {
			"items" : a,
			"entitiesActivated" : b[0],
			"entitiesFailed" : b[1],
			"npcChat" : b[2],
			"npcShowItems" : b[3],
			"monstersAttacked" : c == undefined ? [] : c[0],
			"monstersFailed" : c == undefined ? [] : c[1],
			"newRoom"  : d,
			"attackedThisTick" : attackedThisTick,
		}
	}
	// pick up items in the current level;
	pickUpItems(){
		var level = this.level;
		var items = level.getItemsByLocation(level.x, level.y);
		var items_picked_up = [];
		for(var item of items){
			this.inventory.add([item.name, item.image]);
			this.sort.push(item.name);
			this.times.push(Date.now()-this.startTime);
			this.items[this.currentRoom].delete(item);
			items_picked_up.push(item);
		}
		return items_picked_up;
	}
	//
	meetRequirements(reqs){ // reqs is a set of strings
		if(Array.isArray(reqs)){
			return this.meetRequirements(new Set(reqs));
		}
		for(var req of reqs){
			var met = false;
			for(var item of this.inventory){
				if(item[0] == req){
					met = true;
					continue
				}
			}
			if(met == false){
				return false;
			}
		}
		return true;
	}
	// activate every entity that the player is on
	activateEntities(){
		var level = this.level;
		var entities = level.getEntitiesByLocation(level.x, level.y);
		//for every entity:
		var activated = [];
		var failed = [];
		var npcChat  = [];
		var npcShowItems = [];
		for(var entity of entities){
			// don't meet requirements? continue;
			if(!this.meetRequirements(entity.reqs)){
				failed.push(entity)
				continue;
			} 
			activated.push(entity);
			switch(entity.type){
				case "chest":
					// open the chest;
					this.completedEntities.add(entity.name)
					this.items[this.currentRoom] = l.union(this.items[this.currentRoom], entity.data)
				break;
				case "portal":
					if(Date.now() - this.lastEnteredTime  > 500){
						this.nextLocation = entity.data;
					}
				break;
				case "npc":
					var thing = entity.data;
					for(var thing2 of thing){
						// thing2 = {requirements, displayString, items}
						// the first one in the list gets activated. 
						if(this.meetRequirements(thing2.requirements)){
							// activate!
							npcChat.push(thing2.displayString);
							if(thing2.showItems.length != 0){
								npcShowItems = thing2.showItems; // new ones override old ones
							}
							for(var item of thing2.items){
								if(!this.completedEntities.has(entity.name + item.name)){
									this.completedEntities.add(entity.name + item.name)
									this.items[this.currentRoom].add(item)
								}
							}
							break;
						}
					}
				break;
			}
		}
		return [activated, failed, npcChat, npcShowItems];
	}
	
	attack(){
		var room = this.gameData.rooms[this.currentRoom];
		var indices = this.level.attack();
		var monsters = this.level.getMonsters();
		var attacked = [];
		var failed = [];
		for(var i of indices){
			var monster = monsters[i];
			// if meets requirements, reduce monster HP;
			if(this.meetRequirements(monster.monster.reqs)){
				this.level.monsterHP[i] -= 1;
				attacked.push(i);
			} else {
				failed.push(i);
			}
			if(this.level.allDead() && !this.completedMonsters.has(this.currentRoom)){
				this.completedMonsters.add(this.currentRoom);
				this.items[this.currentRoom] = l.union(this.items[this.currentRoom], room.drops)
			}
		}
		return [attacked , failed]
	}
	
	synchronize(){
		var room = this.gameData.rooms[this.currentRoom];
		if(this.nextLocation != undefined){
			this.currentRoom = this.nextLocation[0];
			this.level = this.computeLevel(this.nextLocation[1], this.nextLocation[2]);
			this.nextLocation = undefined;
			this.lastEnteredTime = Date.now();
			return this.currentRoom;
		} else {
			var entities = l.filter(room.entities,function(x){return !this.completedEntities.has(x.name)}.bind(this));
		//// list of triples: startX, startY, monster
			this.level.entities = entities;
			this.level.items = this.items[this.currentRoom];
			return undefined;
		}
	}
}

export default game;