import level from "./level.js";
import * as l from "./lines.js"

const _ = require("lodash");

class game{
	constructor(gd, dag, reverseDict, hintStrings){
		this.gameData = _.cloneDeep(gd);
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
		this.current = "root";
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
		var room = this.gameData.rooms[this.current];
		var items = this.items[this.current];
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
		return this.current;
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
		this.level.monsterStep(this.gameData.rooms[this.current].speed + Math.random() * 0.1);
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
			this.items[this.current].delete(item);
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
					this.items[this.current] = l.union(this.items[this.current], entity.data)
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
						if(this.meetRequirements(thing2.requirements)){
							// activate!
							npcChat.push(thing2.displayString);
							for(var item of thing2.items){
								if(!this.completedEntities.has(entity.name + item.name)){
									this.completedEntities.add(entity.name + item.name)
									this.items[this.current].add(item)
								}
							}
							break;
						}
					}
				break;
			}
		}
		return [activated, failed, npcChat];
	}
	
	attack(){
		var room = this.gameData.rooms[this.current];
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
			if(this.level.allDead() && !this.completedMonsters.has(this.current)){
				this.completedMonsters.add(this.current);
				this.items[this.current] = l.union(this.items[this.current], room.drops)
			}
		}
		return [attacked , failed]
	}
	
	synchronize(){
		var room = this.gameData.rooms[this.current];
		if(this.nextLocation != undefined){
			this.current = this.nextLocation[0];
			this.level = this.computeLevel(this.nextLocation[1], this.nextLocation[2]);
			this.nextLocation = undefined;
			this.lastEnteredTime = Date.now();
			return this.current;
		} else {
			var entities = l.filter(room.entities,function(x){return !this.completedEntities.has(x.name)}.bind(this));
		//// list of triples: startX, startY, monster
			this.level.entities = entities;
			this.level.items = this.items[this.current];
			return undefined;
		}
	}
}

export default game;