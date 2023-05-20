import room from "./room.js";
import item from "./item.js";
import entity from "./entity.js";
import monster from "./monster.js";
import img from "./img.js";
import reqImg from "./reqImg.js";
//import dag from "./dag.js";
import gameData from "./gameData.js";
import {union} from "./lines.js";
import processString from "./processString.js";
import {random, randint, choice, reset_, shuffle } from "./random.js";
import * as P from "./itemPool.js";
import themeData from "./themeData.js";
import {getProportions, interpret} from "./interpret.js";
import {allHintStrings, addHintStrings} from "./hintStrings.js";
import map from "./map.js"

const _ = require("lodash");


// list utilities
function point_on_circle(distance, seed) {
    var angle = random(seed) * 2 * Math.PI;
    return ([Math.floor(distance * Math.cos(angle)), Math.floor(distance * Math.sin(angle))]);
}
function array_equal(a, b) {
    if (a === b)
        return true;
    if (a.length != b.length)
        return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}



function is_valid_move(rows, cols, walls, x, y, direction) {
    // move off the map?
    if (x == 0 && direction == "left") {
        return false;
    }
    if (y == 0 && direction == "up") {
        return false;
    }
    if (x == cols - 1 && direction == "right") {
        return false;
    }
    if (y == rows - 1 && direction == "down") {
        return false;
    }
    for (var wall of walls) {
        // check if this wall prevents movement
        switch (direction) {
            case "up":
                if (array_equal([x, y - 1, "down"], wall)) {
                    return false;
                }
                break;
            case "down":
                if (array_equal([x, y, "down"], wall)) {
                    return false;
                }
                break;
            case "left":
                if (array_equal([x - 1, y, "right"], wall)) {
                    return false;
                }
                break;
            case "right":
                if (array_equal([x, y, "right"], wall)) {
                    return false;
                }
                break;
        }
    }
    return true;
}
// returns a list of "reachable" locations  (as space-separated string), and the walls that are part of the "frontier". Both are sets
export function bfs(rows, cols, walls, start_x, start_y) {
    var unsearched = new Set([start_x + " " + start_y]);
    var reachable = new Set([start_x + " " + start_y]);
    while (unsearched.size != 0) {
        // iterate over unsearched 
        var new_unsearched = new Set();
        unsearched.forEach(function (point) {
            var split_point = point.split(" ");
            var x = parseInt(split_point[0]);
            var y = parseInt(split_point[1]);
            if (!reachable.has((x - 1) + " " + y) && is_valid_move(rows, cols, walls, x, y, "left")) {
                new_unsearched.add((x - 1) + " " + y);
            }
            if (!reachable.has((x + 1) + " " + y) && is_valid_move(rows, cols, walls, x, y, "right")) {
                new_unsearched.add((x + 1) + " " + y);
            }
            if (!reachable.has(x + " " + (y - 1)) && is_valid_move(rows, cols, walls, x, y, "up")) {
                new_unsearched.add(x + " " + (y - 1));
            }
            if (!reachable.has(x + " " + (y + 1)) && is_valid_move(rows, cols, walls, x, y, "down")) {
                new_unsearched.add(x + " " + (y + 1));
            }
        });
        unsearched = new_unsearched;
        // union unsearched and reachable
        reachable = union(reachable, unsearched);
    }
    var frontier_walls = new Set();
    walls.forEach(function (wall) {
        // check if the wall is at the edge of the dungeon
        if (wall[1] == rows - 1 && walls[2] == "down") {
            return;
        }
        if (wall[0] == cols - 1 && walls[2] == "right") {
            return;
        }
        if (wall[2] == "right" && reachable.has(wall[0] + " " + wall[1]) != reachable.has((wall[0] + 1) + " " + wall[1])) {
            frontier_walls.add(wall);
        }
        if (wall[2] == "down" && reachable.has(wall[0] + " " + wall[1]) != reachable.has(wall[0] + " " + (wall[1] + 1))) {
            frontier_walls.add(wall);
        }
    });
    return [reachable, frontier_walls];
}


function generateMaze(rows, cols, wallDensity, seed){
	var walls = [];
	for(var i=0; i<rows;i++){
		for(var j=0; j<cols; j++){
			if(random(seed + " generate wall " + i + " " + j)< wallDensity){
				// add a wall
				var n = randint(0,3,seed + "choose wall" + i + " " + j) // 0,1,2
				switch(n){
					case 2:
						walls.push([j, i, "right"])
						//fall through
					case 1:
						walls.push([j, i, "down"])
						break;
					case 0:
						walls.push([j, i, "right"])
						break;
				}
				
			}
		}
	}
	return walls;
}

function addObject(obj1, obj2) {
    if (typeof (obj1) != "object" || typeof (obj2) != "object") {
        throw "addObject for non-objects";
    }
    Object.keys(obj2).forEach(function (key) {
        if (obj1[key] == undefined) {
            obj1[key] = obj2[key];
        }
        else {
            obj1[key] += obj2[key];
        }
    });
}

// shift walls based on x and y
function wallShift(walls, x, y){
	var newWalls = [];
	for(var wall of walls){
		newWalls.push([wall[0]+x, wall[1]+y, wall[2]+x, wall[3]+y])
	}
	return newWalls;
	
}

// inputs are destinations, if they are undefined then that indicates a wall in that area.
// otherwise, it's a string indicating the name of the next room to go to


export function walledRoom(name, left, right, up, down, theme, seed){
// constants
    if(name == undefined){
		throw new Error("name is undefined");
	}
	var wallImgSize = [80,80]; // width, height
	/*
	these can be constructed from some "theme".
	*/
	var theme = themeData[theme];
	if(theme == undefined){
		throw new Error("undefined theme");
	}
	
	// initialize image strings;
	var background = "./images/" + theme.background;
	var wallImgString = _.cloneDeep(theme.wallImgString);
	for(var word of ["left","right","up","down"]){
		for (var i=0; i<wallImgString[word].length; i++){
			if(wallImgString[word][i] == undefined){
				throw new Error("undefined wall image" + theme.name + " " + word);
			}
			wallImgString[word][i] = "./images/" + wallImgString[word][i];
		}
	}
	var imagePool = theme.decorations.map((x) => "./images/" + x);
	var blockPool = theme.blockingDecorations;
	// do not spawn chests, monsters or npcs here.
	
	
	// room size is 1000 x 600
	//walls are just quadruples : tlx tly brx bry
	var walls = new Set();
	var imgs = new Set();
	var entities = new Set();
	
	// left
	
	if(left == undefined){
		//draw left side
		walls.add([50, 0, 50, 600])
		imgs.add(new img(choice(wallImgString.left, seed + " left wall"), 0, 0))
	} else {
		entities.add(new entity(name + " left door", "portal", 0, 0, 80, 600, "", [left.destination, 910, 300],[],undefined))
	}
	

	//right
	
	if(right == undefined){
		//draw right side
		walls.add([950, 0, 950, 600])
		imgs.add(new img(choice(wallImgString.right, seed + " right wall"), 0, 0))
	} else {
		entities.add(new entity(name + " right door", "portal", 920, 0, 1000, 600, "", [right.destination, 90, 300],[],undefined))
	}
	
	//up
	
	if(up == undefined){
		//draw up side
		walls.add([0, 25, 1000, 25])
		imgs.add(new img(choice(wallImgString.up, seed + " up wall"), 0, 0))
	} else {
		entities.add(new entity(name + " up door", "portal", 0, 0, 1000, 45, "", [up.destination, 500, 530],[],undefined))
	}
	
		//down
	
	if(down == undefined){
		//draw down side
		walls.add([0, 575, 1000, 575])
		imgs.add(new img(choice(wallImgString.down, seed + " down wall"), 0, 0))
	} else {
		entities.add(new entity(name + " down door", "portal", 0, 555, 1000, 600, "", [down.destination, 500, 70],[],undefined))
	}
	
	
	// randomly add images
	if(imagePool.length != 0){
		var numImages = randint(0, 3, seed + name + " random images count" )
		for(var i=0; i<numImages; i++){
			imgs.add(new img(choice(imagePool, seed + name + " random images number" + i ), randint(100, 900, seed + name + " random images x " + i), randint(100, 500, seed + name + " random images y " + i )))
		}
	}
	// add blocking decorations
	if(blockPool.length != 0){
		var numBlocks = randint(0, 3, seed + name + " random blocking images count" )
		for(var i=0; i<numBlocks; i++){
			//choose a blocking decoration at random
			var location_ = chooseXYBlock(name, seed + " choose block location" + i)
			var decor = choice(blockPool, seed + name + " random block number" + i)
			
			// add in walls
			for (var wall of wallShift(decor.walls, location_[0]-50, location_[1] - 50)){
				walls.add(wall)
			}
			// add in images
			for(var img_ of decor.images){
				var imageName = "./images/" + img_[2];
				var imageX = location_[0] - 50 + img_[0]
				var imageY = location_[1] - 50 + img_[1]
				imgs.add(new img(imageName, imageX, imageY))
			}
		}
	}
	return new room(name, entities, walls, imgs, [], [],[], background);
}


export function rootRoom(dest){
	return new room("root", 
	[new entity("root portal", "portal", 600, 300, 800, 400,"", [dest, 500, 300], [], "./images/cave.png")], // entities - "1 1 1" or "gen"
	[], // walls
	[], // images
	[], // reqImgs
	[], // monsters
	[], // drops
	"./images/outside.png", //background
	)
}
 

// returns a suitable area for items
// guarantee : 100x100 region (50 on both sides) will not overlap with any 100x100 region centered
// on something returned by chooseXYBlock with the same name


// given an x and y coordinate , determine if it's in a zone that chooseXYBlock returns
 

function isForbidden(name, x, y){
	if(x % 50 != 0 || y % 50 != 0){
		throw new Error("x and y must be a multiple of 50");
	}
	
	for(var i=0; i<7; i++){
		var xNew = randint(1, 9, name + " determiner x" + "count x" +i );
		var yNew = randint(1, 4, name + " determiner y" + "count y" + i);	
	
		if(100*xNew + 50 == x && 100*yNew + 50 == y){
			return true;
		}
	}
	return false;
}

function chooseXY(name,seed){
	// number [1, ... 8] for x
	// number [1, ... 4] for y
	// return 100*value + 50
	//console.log("choose x y called " + seed);
	var i=0
	while(true){
		var x = 100*randint(1, 9, seed + " choose x y" + i )+50;
		var y = 100*randint(1, 4, seed + "choose x y 2" + i)+50;
		if(!isForbidden(name,x,y)){
			return [x,y];
		}
		i+=1;
	}	
} 

function chooseXYBlock(name,seed){
	var list = [];
	for(var i=0; i<7; i++){
		var xNew = randint(1, 9, name + " determiner x" + "count x" +i );
		var yNew = randint(1, 4, name + " determiner y" + "count y" + i);	
		list.push([100*xNew+50, 100*yNew+50]);
	}
	if(!isForbidden(name,list[0][0], list[0][1])){
		throw new Error("choose not forbidden");
	}
	return choice(list, seed)
} // returns a suitable area for walls.
// no guarantee on item being surrounded though, so do not call more than 3 times with same name




/*

makes some stuff up about a generic object.

type = chest, monster, npc, key,  portal, (misc = amulet, scroll, etc. think of more)

returned object always has key "name", type, image, theme, color


extra keys:
	- subtype1 = ring/amulet/scroll, etc. 

	- subtype2 = undefined usually, but sometimes the symbol for scroll or the gem color for rings


so object pool needs to provide the following:
name, image, subtype1, subtype2 (possibly), color (cannot match theme's background color)
if type is portal, then image is a pair of images (unopened, opened)
*/

function makeItemData(type, theme, seed){ // some other data might be needed

	var theme = themeData[theme]
	if(theme == undefined){
		throw new Error("theme is undefined");
	}
	var choice;
	switch(type){
		case "misc":
			choice = P.getMiscItem(theme.bgColor, [], seed);
		break;
		case "monster":
			choice = P.getMonster(theme.bgColor,theme.monsters, seed);
		break;
		case "npc":
			choice = P.getNpc(theme.bgColor,theme.npcs, seed);
		break;
		case "chest":
			choice = P.getChest(theme.bgColor,theme.chests, seed);
		break;
		case "portal":
			choice = P.getPortal(theme.bgColor,theme.portals, seed);
		break;
		case "key":
			choice = P.getKey(theme.bgColor,[], seed)
		break;
		default:
			throw new Error("makeItemData with invalid type " + type.toString());
		break;
	}
	
	// if we seen it, we need to change name
	var seen = choice[1]
	// now add aux data
	choice = _.cloneDeep(choice[2])
	choice.type = type;
	choice.theme = theme.name;
	if(seen){
		var extraName = Math.random();
		choice.name = choice.name + extraName.toString();
	}
	//return it.
	return choice
		
	
	
	// DEBUG FROM HERE ON OUT!!!
	/*
	var image_ = "";
	switch(type){
		case "chest":
			image_ =  "chest.png"
		break;
		case "npc":
			image_ =  "npc_1.png"
		break;
		case "key":
			image_ =  "gold_key.png"
		break;			image_ =  "demon_ring.png"
		break;
		case "portal": // multiple images, for unopened and opened
			image_ = ["./shapes/red_circle.png", "./shapes/green_circle.png"]
		break;
		
	}
	return {"name":"item_" + Math.random(), "type":type, "theme": theme, "image": image_};
	
	*/
}

// if makeItemData is not called using "monster", we can use it here 
//use makeItemData stuff to make 
// returns a pair of info.type == portal (for unopened and opened)
export function getImage(info){ // some other data might be needed
	switch(info.type){
		case "chest":
			return "./images/chests/" + info.image
		break;
		case "monster":
			return "./images/monsters/" + info.image
		break;
		case "npc":
			return "./images/npcs/" + info.image
		break;
		case "key":
			return "./images/items/" + info.image
		break;
		case "portal": // multiple images, for unopened and opened
			return ["./images/portals/" + info.image[0], "./images/portals/" + info.image[1]]
		break;
		case "misc":
			return "./images/items/" + info.image
		break;
		default :
			throw new Error("can't get image");
		
	}
	
	return "./images/green_potion.png"
}


// turns a dag into a gameData object
//renders one "piece" of the DAG
// renders only vertices in renderThese
// renderThese and assumeHas are both sets of strings.
// assumeHas vertices have already been collected by the time we get here

// dungeonSize should be  around sqrt(dag's number of vertices) + 2
export function compileOne(dag, name, renderThese, assumeHas,dict,interpretations,seed, theme="default", slice=0, last=false, dungeonSize = 4){
	// slice is used for itemHeldBy, used for hint strings
	
	// first, check none of these items have been rendered before
	var theme = themeData[theme]; // get  using a theme instead. 
	if(theme == undefined){
		throw new Error("undefined theme");
	}
	for(var item_ of renderThese){
		//////console.log(item_)
		if(dict[item_] != undefined){
			throw new Error("repeat render");
		}
	}
	//var numVertices = dag.vertices.size;
	var size = last ? 3 : dungeonSize;
	// start is 4,4
	// add to both at the SAME TIME!!!!
	var rooms = {};
	var items = {};
	var dictionary = _.cloneDeep(dict); // dag vertex names to game vertex names;
	var start = Math.floor(size/2);
	// generate a maze
	var result = undefined;
	// at laest 4 rooms needed
	var counter = 0;
	while(result == undefined || result.size < 4){
		counter++;
		var maze = generateMaze(size, size, last ? 0.3 : 0.6, seed + " generate maze" + name + " " + counter);
		result = bfs(size, size, maze, start, start)[0]; // mazes are square, and start in the middle  
	}
	var thisMap = new map(maze, [dungeonSize, dungeonSize], name  + " map");
	////console.log(result.size)
	// turn the maze into walledRoom
	for(var point of result){
		var x = parseInt(point.split(" ")[0])
		var y = parseInt(point.split(" ")[1])
		var moves = [];
		
		for(var move of ["left","right","up","down"]){
			if(is_valid_move(size, size, maze, x, y, move)){
				// don't add a wall
				switch(move){
					case "left":
						moves.push({"destination" : name + " " + (x-1) + " " + y, "reqs" : []})
					break;
					case "right":
						moves.push({"destination" : name + " " + (x+1) + " " + y, "reqs" : []})
					break;
					case "up":
						moves.push({"destination" : name + " " + x + " " + (y-1), "reqs" : []})
					break;
					case "down":
						moves.push({"destination" : name + " " + x + " " + (y+1), "reqs" : []})
					break;
				}
			}else{
				moves.push(undefined)
			}
		}
		rooms[name + " " + x + " " + y] = walledRoom(name + " " + x + " " + y, moves[0], moves[1], moves[2], moves[3], theme.name, seed + " walled room" + point)
		items[name + " " + x + " " + y] = [];
		thisMap.addRoom(x, y, rooms[name + " " + x + " " + y]); 
	}
	var vertexList = dag.get_vertices();
	// used or unused
	// "result" still exists
	//NONE of these have names at the start
	var cannotUse = choice(result, seed + "cannot use"); // a room that cannot be used so there is always at least one unused room
	var unused = _.cloneDeep(result);
	var used = new Set()
	//do not render any items for the last vertex
	if(last){
		return [rooms, items, dictionary, unused, {}, {}, thisMap];
	}
	// all vertex lists are names (strings) not vertex objects
	
	//the next two variables are for hint strings. 
	// key : vertex name, value : returned by makeItemData
	var itemData = {}; 
	// key : vertex name, value : {"location"  : name of room, "holderType" : (item, monster, chest, npc ), "data" :  undefined if holderType  == item, else returned by makeItemData, theme, slice, x, y, holderObj, size of the room it's in}
	var itemHeldBy = {};
	
	//set of vertices that have not been added yet
	var unAdded = new Set(renderThese)
	var counter = 0;
	//loop to add in the vertices
	while(unAdded.size != 0){
		counter += 1;
		var vertex = choice(unAdded,seed + " adding vertex " + counter);
		// if it has an unrendered predecessors
		var hasUnrenderedPred = false;
		for(var item_ of dag.get_vertex_by_name(vertex).pred){
			if(dictionary[item_.name] == undefined){
				hasUnrenderedPred = true;
			}
		}
		if(hasUnrenderedPred){
			continue;
		}
		// try to add this vertex. 
		
		
		unAdded.delete(vertex);
		var vertexIntSource = interpretations[0][vertex];
		var vertexIntType = interpretations[1][vertex];
		if(vertexIntSource == undefined){
			throw new Error("undefined int");
		}
		//source is "item" "chest", "monster", "npc"
		//type is "key", "misc" 
		
		//source=portal are rendered as items.
		if(vertexIntSource == "portal"){
			vertexIntSource = "item";
		}
		//get "true" predecessors (remove vertices in assumeHas);
		var vertexObj = dag.get_vertex_by_name(vertex);
		var truePrev = new Set(Array.from(vertexObj.prev).map((x) => x.name));
		for(var item_ of assumeHas){
			truePrev.delete(item_);
		}
		
		// choose a room to add it in
		var roomToAdd0 = undefined;
		var counter2 = 0;
		while(roomToAdd0 == undefined || roomToAdd0 == cannotUse){
			counter2++;
			roomToAdd0 = choice(result, seed + " adding room" + counter + " "  + counter2 )
		}
		used.add(roomToAdd0);
		unused.delete(roomToAdd0);
		var roomToAdd = name + " " + roomToAdd0;
		
		//choose where in the room to add it
		//console.log([seed, counter]);
		var location_ = chooseXY(roomToAdd, seed + "where in room" + counter);

		//console.log([seed, counter, "end"]);
		// get item data 
		var thisItemData = makeItemData( vertexIntType, theme.name, seed + " item data " + counter);
		dictionary[vertex] = thisItemData.name
		itemData[vertex] = thisItemData;
		// initialize last variables before adding item
		
		var reqString = Array.from(truePrev).map((x) => dictionary[x]); // list of requirements for this item
		
		//create the item object that will be added
		var itemPickUpString = "You got $1" // again, change this
		var itemToAdd = new item(thisItemData.name, getImage(thisItemData), location_[0]+randint(-10, 10,seed + "dispX" + counter), location_[1]+randint(-10, 10,seed+ "dispY" + counter), itemPickUpString)
		
		// choose what the holder of the item will be
		var choice_ = new Set()
		// npc is "fallback", npcs can hold any item.
		choice_.add("npc")
		// no monster? add that
		if(rooms[roomToAdd].monsters.size == 0 && vertexIntSource == "monster"){
				choice_.add("monster")
		}
		if(truePrev.size == 0){
			// make an item instance
			choice_.add("item")
		} else if(truePrev.size == 1 && vertexIntSource == "chest"){
			//make it a chest
			choice_.add("chest")
		}
		if(!choice_.has(vertexIntSource)){
			console.log("warning: vertexIntSource failed "  + vertexIntSource);
		}
		var chosen = choice_.has(vertexIntSource) ? vertexIntSource : choice(choice_, seed + "choice2" + counter);
		//if the holder is not "item", then the holder has data along with it too.
		if(chosen != "item"){
			var thisHolderData = makeItemData(chosen, theme.name , seed + " holder " + counter);
			if(chosen != "monster"){ // monster is special
				var thisHolderImage = getImage(thisHolderData);
			}
		} else {
			var thisHolderData = undefined;
			var thisHolderImage = undefined;
		}
		/* itemHeldBy[vertex] will also get a "holderObj" key.
		
		if it's in a chest or npc, holderObj will be the entity itself (an instance of the entity class)
		if it's a monster, then this will be the list of monsters.
		this is to make hint strings easy. 
		*/
		itemHeldBy[vertex] = {"location":roomToAdd, "holderType":chosen,"data":thisHolderData, theme:theme.name, slice:slice, x : parseInt(roomToAdd0.split(" ")[0]),y : parseInt(roomToAdd0.split(" ")[1]), size:dungeonSize};
		
		
		// finally, add in the item
		var inst = undefined;
		switch(chosen){ 
			case "item":
				items[roomToAdd].push(itemToAdd)
			break;
			case "chest":
				var location2 = [location_[0] + randint(-20, 20, seed + "chest shift" + counter),location_[1] + randint(-20, 20, seed + "chest shift 2 " + counter)];
				var inst = new entity(roomToAdd + " chest " + rooms[roomToAdd].entities.size, "chest", location2[0]-20, location2[1]-20, location2[0]-20+thisHolderData.width, location2[1]-20+thisHolderData.height, "You need $1", [itemToAdd], [dictionary[Array.from(truePrev)[0]]],  thisHolderImage);
				
				rooms[roomToAdd].entities.add(inst)  
			break;
			case "monster":
				// makeItemData for monster is a bit different
				// it's has a key "images", whose value is a list of objects "link" and "color"
				var monsterCount = randint(2, 5, seed + "choice3" + counter);
				var inst = [];
				for(var i=0; i<monsterCount; i++){
					// choose an image
					var imageName = choice(thisHolderData.images.filter((x) => x.color != theme.bgColor), seed + " choose image " + counter + " " + i).link;
					// add in the monster
					var locationX = location_[0]-50+randint(0,100 - thisHolderData.width, seed+ "choice4" + counter + " " + i)
					var locationY = location_[1]-50+randint(0,100 - thisHolderData.height, seed+ "choice5" + counter + " " + i)
					inst.push(new monster(roomToAdd + " monster " + i, "You need $1 to kill this monster", ["./images/monsters/" +imageName[0],"./images/monsters/" +imageName[1]], reqString, 3, thisHolderData.width, thisHolderData.height))
					rooms[roomToAdd].monsters.add([locationX, locationY, inst[inst.length-1]])
					rooms[roomToAdd].speed = thisHolderData.speed;
				}
				rooms[roomToAdd].drops.add(itemToAdd);
			break;
			case "npc":
				// add in the indicator above the npc
				var locationNPC = chooseXY(roomToAdd, seed + "where in room npc " + counter);
				locationNPC[0] += randint(-20, 20, seed + " npc shift x " + counter);
				locationNPC[1] += randint(-20, 20, seed + " npc shift y " + counter); 
				rooms[roomToAdd].reqImgs.add(new reqImg([
				{requirements: [itemToAdd.name], "image": undefined},
				{requirements: reqString, "image": "./images/exclam.png"},
				{requirements: [], "image": "./images/question.png"},
				], locationNPC[0]-10, locationNPC[1]-60));
				
				// add in the npc
				
				var entityName = roomToAdd + " npc " + rooms[roomToAdd].entities.size
				
				var npcData = [{"requirements": [itemToAdd.name] , "displayString" : "You have already activated this statue", "items":[], showItems : []},{"requirements" : reqString, "displayString" : "You activate the statue, it drops an item", items:[itemToAdd], showItems : []},{"requirements" : [], "displayString" : processString("This statue is activated by $1", reqString), "items":[], showItems : reqString}];
				
				var inst = new entity(entityName, "npc",  locationNPC[0]-20, locationNPC[1]-20, locationNPC[0]-20 + thisHolderData.width, locationNPC[1]-20 + thisHolderData.height, "", npcData, [], thisHolderImage);
				rooms[roomToAdd].entities.add(inst);
			break;
			default:
				throw new Error("adding item failed")
			break;
			
		}
		itemHeldBy[vertex].holderObj = inst;
	}
	


	return [rooms, items,dictionary, unused, itemData, itemHeldBy, thisMap];
	
}
// returns all pairs (x, y) that are incomparable, and are in different chunks.
// none of them can be the final vertex.
// slices starts at 0 and ends with sort.length. 
// note that "sort" is NOT guaranteed to be a topological sort of the dag.
function findBackwardsEdge(dag, sort, slices){
	var slicedSort = [];
	var numChunks = slices.length -2; // does not include final vertex
	for(var i=0; i<numChunks; i++){
		slicedSort.push(sort.slice(slices[i], slices[i+1]));
	}
	var pairs = [];
	for(var i=1; i < numChunks; i++){
		for(var j=0; j<i ; j++){
			// search for an incomparable pair in slicedSort[i] and slicedSort[j]. The j one will come first. 
			for(var startVertex of slicedSort[j]){
				for(var endVertex of slicedSort[i]){
					var startVertexObj = dag.get_vertex_by_name(startVertex);
					var endVertexObj = dag.get_vertex_by_name(endVertex);
					if(!startVertexObj.succ.has(endVertexObj) && ! endVertexObj.succ.has(startVertexObj)){
						pairs.push([startVertex, endVertex])
					}
				}
			}
		}
	}
	return pairs;
}

export function compile(dag, seed, name="compileNAME", chunkSizeMin = 6, chunkSizeMax = 13, backEdges = 5){
	// reset the seen stuff
	P.reset_();
	reset_(); // random
	if(name == ""){
		name = seed; // unlike seed, this will not be changed
	}
	var rooms = {}; 	
	var items = {"root":[]};
	var dictionary  = {}
	//last object in topological sort will never appear in itemData or itemHeldBy
	// key : vertex name, value : returned by makeItemData
	var itemData = {}; 
	// key : vertex name, value : {"location"  : name of room,theme : theme of room item  is in, "holderType" : (item, monster, chest, npc ), 
	var itemHeldBy = {};
	var unused = [];
	var sort = dag.toposort();
	var slices = [];
	var themes = [];
	var portals = []; // keys : source (entity inst ), destination (entity inst ), section (number). destination chunk number is always index+1	
	var portalRooms = new Set(); // set of rooms that have portals in them 
	var roomSizes = [];
	var maps = {}; // key = name
	for(var i=0; i<sort.length-1; i += randint(chunkSizeMin, chunkSizeMax+1, seed + "slicing " + i)){
		slices.push(i)
	}  
	slices.push(sort.length-1) // last element must be in its own section
	slices.push(sort.length) 
	//choose themes
	var counter = 0;
	while(themes.length < slices.length-1){
		counter ++;
		themes = themes.concat(shuffle(Object.keys(themeData), seed + "theme " + themes.length))
	}
	themes = themes.slice(0,slices.length-1);
	
	// interpret the DAG
	var int_ = interpret(dag, sort, slices, seed + "interpret");
	console.log("proportions are")
	console.log(getProportions(int_[0], int_[1]))

	// since slicing adds new edges, clone the dag and mutate it.
	var newDag = _.cloneDeep(dag);
	
	/*
	given a chunk:
	assume you have everything needed for the first item of the chunk
	render the entire chunk (including the first item)
	if not the first chunk: 
		if an unused room exists in both:
			choose an unused room in ANY previous chunk and an unused room in this chunk
			connect them using a portal whose requirements are the first item's prev.
		if no unused room exists in one of them:
			add a downwards ladder between used rooms 
	*/
	for(var i=0; i<slices.length-1; i++){ 
		var things = sort.slice(slices[i], slices[i+1]);
		var firstItem = things[0];
		var firstPred = Array.from(dag.get_vertex_by_name(firstItem).pred).map((x) => x.name) 
		things = new Set(things);

		var mazeSize = Math.floor(Math.sqrt(things.size) + 2);
		if(things.size > 50){
			mazeSize = 5; // DEBUG
			console.log("DEBUG MODE ON");
		}
		roomSizes.push(mazeSize);
		var result = compileOne(dag, name +" " + i , things, firstPred, dictionary,int_, seed + "compile1" + i, themes[i],i, i==slices.length-2, mazeSize)
		// "things", "firstItem", "firstPred" are all sets of strings
		addObject(rooms, result[0])
		addObject(items, result[1])
		dictionary= result[2] // dictionary is updated instead of merged
		unused.push(result[3])
		addObject(itemData, result[4])
		addObject(itemHeldBy, result[5])
		addObject(maps, {[result[6].name] : result[6]})
		//requirements for first object in chunk is also requirement for everything in the chunk
		for(var vertex of things){
			for(var vertex2 of firstPred){
				newDag.add_edge(vertex2, vertex)
			}
		}
		
		 
		if(i != 0){
			// add connection
			// choose a random room in this piece and a random unused room in the previous piece
			var room1NamePre = undefined;
			var counter = 0;
			while(room1NamePre == undefined){
				counter++;
				var section = randint(0, i , seed + "add choice" + i + "attempt " + counter);
				if(unused[section].size != 0){
					room1NamePre = choice(unused[section],seed + "add choice room" + i + "attempt " + counter);
				}
			}
			var room1Name = `${name} ${section} ${room1NamePre}`;
			var room2Name = choice(result[3], seed + "add choice 2 " + i);
			////console.log(room1Name)
			room2Name = `${name} ${i} ${room2Name}`;
			// add a connection
			var loc1 = chooseXY(room1Name, seed + "place 1 " + i)
			loc1[0] += randint(-20, 20, seed + " random shift " + i);
			loc1[1] += randint(-20, 20, seed + " random shift 2 " + i);
			var loc2 = chooseXY(room2Name, seed + "place 2 " + i)
			loc2[0] += randint(-20, 20, seed + " random shift 3 " + i);
			loc2[1] += randint(-20, 20, seed + " random shift 4 " + i);
			// get portal data.
			var portalSourceData = makeItemData("portal", themes[section], seed + " portal " + i);
			var portalSourceImages = getImage(portalSourceData);
			
			var portalDestData = makeItemData("portal", themes[section], seed + " portal dest" + i);
			var portalDestImages = getImage(portalDestData);
			// make a requirements array
			var reqs = Array.from(dag.get_vertex_by_name(firstItem).prev).map((x) => dictionary[x.name])
			
			// add source portal
			var sourcePortal = new entity("slice " + i + " portal start", "portal", loc1[0], loc1[1], loc1[0]+portalSourceData.width, loc1[1]+portalSourceData.height,"Portal is activated by $1",[room2Name, loc2[0]-30, loc2[1]-30], new Set(reqs),  undefined);
			
			rooms[room1Name].entities.add(sourcePortal)
			
			// add portal indicator
			rooms[room1Name].reqImgs.add(new reqImg([
			{requirements: new Set(reqs), image:portalSourceImages[1]},
			{requirements: [], image:portalSourceImages[0]},
			,],loc1[0], loc1[1])) 
			
			// add destination portal
			var destPortal = new entity("slice " + i + " portal end","portal", loc2[0], loc2[1], loc2[0]+portalDestData.width, loc2[1]+portalDestData.height,"",[room1Name, loc1[0]-30, loc1[1]-30], [], portalDestImages[1] );
			rooms[room2Name].entities.add(destPortal)
			
			portalRooms.add(room1Name);
			portalRooms.add(room2Name);

			//record this portal in the list of portals
			var room1Split = room1Name.split(" ");
			var room2Split = room2Name.split(" ");
			portals.push({source:sourcePortal, destination:destPortal, sourceChunk : section, destChunk : i, sourceX : parseInt(room1Split[room1Split.length-2]), sourceY : parseInt(room1Split[room1Split.length-1]) , destX : parseInt(room2Split[room2Split.length-2]), destY : parseInt(room2Split[room2Split.length-1])})
			//adjust dag
			//if "forward" portal (chunk X -> chunk Y) is placed in chunk X, then, requirements for first object in chunk X is also a requirement for every item in chunk Y
			
			var firstOfSourcePiece = sort[slices[section]]
			var firstOfSourcePred = dag.get_vertex_by_name(firstOfSourcePiece).prev
			for(var vertex of things){
				for(var vertex2 of firstOfSourcePred){
					newDag.add_edge(vertex2.name, vertex)
				}
			}
		}
		

	}

	// add in root room
	var unusedStart = choice(unused[0], seed + " choose unused");
	rooms["root"]  = rootRoom(`${name} 0 ${unusedStart}`)
	// add backwards edges
	console.log([rooms, items, dictionary, itemData, itemHeldBy, themes, sort,portals, newDag, sort[sort.length-1],roomSizes])
	
	
	for(var i=0; i<backEdges; i++){
		var pairs = findBackwardsEdge(newDag, sort, slices);
		pairs = pairs.filter(function(pair){
			return itemHeldBy[pair[0]].holderType != "item"
		})
		
		// choose a pair of edges
		if(pairs.length == 0){
			break;
		}
		var chosenPair = choice(pairs, seed + " backwards edge " + i);
		console.log(chosenPair);
		newDag.add_edge(chosenPair[1], chosenPair[0]);
		
		// chosenPair[1] is now a pre-requisite for chosenPair[0]
		var itemName1 = dictionary[chosenPair[1]];
		// get what is holding chosenPair[0]
		var holderObj = itemHeldBy[chosenPair[0]].holderObj
		switch(itemHeldBy[chosenPair[0]].holderType){
			case "monster":
				for(var monsterA of holderObj){
					monsterA.reqs.add(itemName1);
				}
			break;
			case "item":
				throw new Error("this is not supposed to happen");
			break;
			case "npc":
				holderObj.data[1].requirements.push(itemName1);
				holderObj.data[2].displayString = processString("This statue is activated by $1", holderObj.data[1].requirements);
			break;
			case "chest": // only exception to the rule that keys open chests.
				holderObj.reqs.add(itemName1)
			break;
		}
	}
	
	
	console.log([rooms, items, dictionary, itemData, itemHeldBy, themes, sort,portals, newDag, sort[sort.length-1],roomSizes])
	// add hint strings.
	var signs = addHintStrings(rooms, items, dictionary, itemData, itemHeldBy, themes, sort,portals, newDag, sort[sort.length-1],roomSizes, slices, seed + " hint strings ");
	var counter = 0;
	// add signs
	for(var sign of signs){
		counter ++;
		var room_ = sign[0];
		var loc = chooseXY(room_, seed + " add sign " + counter)
		loc[0] += randint(-50, -30, seed + " add sign shift x " + counter);
		loc[1] += randint(-50, -30, seed + " add sign shift y " + counter);
		var signEntity = new entity("sign entity " + room_ + " " + counter, "npc", loc[0], loc[1], loc[0]+80, loc[1]+80, "", [{"requirements":[dictionary[sign[2]]], "displayString" : "(You already have this)" + sign[1], "items":[], showItems : [] } ,{"requirements":[], "displayString" : sign[1], "items":[], showItems : [] } ],"", "./images/signpost.png");
		rooms[room_].entities.add(signEntity);
	}
	var allHintStringsVar = allHintStrings(rooms, items, dictionary, itemData, itemHeldBy, themes, sort,portals, newDag, sort[sort.length-1],roomSizes, slices)
	console.log(["compile done", Date.now()]);
	
	
	// final room
	var finalRoomName = name + " " + (slices.length-2) + " " + choice(unused[unused.length-1], seed + " choose final room");
	// add in cage
	rooms[finalRoomName].imgs.add(new img("./images/cage.png", 100, 100));
	// add in monster
	rooms[finalRoomName].monsters.add([600, 400, new monster("boss", "Anna must be here!", ["./images/boss.png","./images/boss_attack.png"], [],7, 150, 150)]);
	return [new gameData(rooms, items, finalRoomName), newDag, dictionary, itemHeldBy,allHintStringsVar, maps, portalRooms];
}