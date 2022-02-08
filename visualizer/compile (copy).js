import room from "./room.js";
import item from "./item.js";
import entity from "./entity.js";
import monster from "./monster.js";
import img from "./img.js";
import reqImg from "./reqImg.js";
//import dag from "./dag.js";
import gameData from "./gameData.js";
import {union} from "./lines.js";
import {processString} from "./canvasDrawing.js";

const _ = require("lodash");

function random(seed){ // [0 to 1), must maintain its own state and not return the same result every time.
// must have up to a billion states.
	if(seed == undefined){
		throw new Error("seed is undefined")
	}
	return Math.random();
}


function randint(low, high, seed) {
    //returns a number from [low, high)
    if (high < low) {
        throw "high smaller than low";
    }
    return Math.floor(random(seed)*1000000, seed) % (high - low) + low;
}

function choice(list, seed) {
    if (list instanceof Set) {
        list = [...list];
    }
    if (list.length == 0) {
        throw "choice with empty list";
    }
    return list[randint(0, list.length, seed)];
}
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
			if(random(seed)< wallDensity){
				// add a wall
				var n = randint(0,3,seed) // 0,1,2
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



// inputs are destinations, if they are undefined then that indicates a wall in that area.
// otherwise, they have to be of the form {destination : string, reqs : list of strings}
// if reqs is empty, then no wall image is made. Otherwise, wall images are made with a door somewhere
// (not too close to the edge, of course) 
export function walledRoom(name, left=undefined, right=undefined, up=undefined, down=undefined, seed = ""){
// constants
	var wallImgSize = [80,80]; // width, height
	/*
	these three can be constructed from some "theme".
	*/
	var wallImgString = {left:"./images/dirt_wall.png",right:"./images/dirt_wall.png",up:"./images/dirt_wall.png",down:"./images/dirt_wall.png"};
	var wallImgStringDoor = {left:"./images/dirt_wall_door.png",right:"./images/dirt_wall_door.png",up:"./images/dirt_wall_door.png",down:"./images/dirt_wall_door.png"};
	var imagePool = new Set(["./images/flower.png", "./images/rock.png"])

	// room size is 1000 x 600
	//walls are just quadruples : tlx tly brx bry
	var walls = new Set();
	var imgs = new Set();
	var entities = new Set();
	
	// left
	
	if(left == undefined){
		//draw left side
		walls.add([50, 0, 50, 600])
		for(var i=0; i <= 600; i += wallImgSize[1]){
			imgs.add(new img(wallImgString.left, 50-wallImgSize[0], i))
		}
	} else if (left.reqs.length != 0){
		walls.add([50, 0, 50, 600])
		var timesLooped = Math.floor(600 / wallImgSize[1]) + 1;
		var index = randint(1, timesLooped-1, seed);
		
		for(var i=0; i <= 600; i += wallImgSize[1]){
			if(i == index * wallImgSize[1]){
				entities.add(new entity(name + " left door", "portal", 0, i, 80, i+wallImgSize[1], "", [left.destination, 900, 300],left.reqs,undefined))
				imgs.add(new img(wallImgStringDoor.left, 50-wallImgSize[0], i))
			} else {
				imgs.add(new img(wallImgString.left, 50-wallImgSize[0], i))
			}
		}
	} else {
		entities.add(new entity(name + " left door", "portal", 0, 0, 80, 600, "", [left.destination, 900, 300],[],undefined))
	}
	

	//right
	
	if(right == undefined){
		//draw right side
		walls.add([950, 0, 950, 600])
		for(var i=0; i <= 600; i += wallImgSize[1]){
			imgs.add(new img(wallImgString.right, 950, i))
		}
	} else if (right.reqs.length != 0){
		walls.add([950, 0, 950, 600])
		var timesLooped = Math.floor(600 / wallImgSize[1]) + 1;
		var index = randint(1, timesLooped-1, seed);
		
		for(var i=0; i <= 600; i += wallImgSize[1]){
			if(i == index * wallImgSize[1]){
				entities.add(new entity(name + " right door", "portal", 920, i, 1000, i+wallImgSize[1], "", [right.destination, 100, 300],right.reqs,undefined))
				imgs.add(new img(wallImgStringDoor.right, 950, i))
			} else {
				imgs.add(new img(wallImgString.right,950, i))
			}
		}
	}else {
		entities.add(new entity(name + " right door", "portal", 920, 0, 1000, 600, "", [right.destination, 100, 300],[],undefined))
	}
	
	//up
	
	if(up == undefined){
		//draw up side
		walls.add([0, 25, 1000, 25])
		for(var i=0; i <= 1000; i += wallImgSize[0]){
			imgs.add(new img(wallImgString.up, i, 25-wallImgSize[1]))
		}
	} else if (up.reqs.length != 0){
		walls.add([0, 25, 1000, 25])
		var timesLooped = Math.floor(1000 / wallImgSize[0]) + 1;
		var index = randint(1, timesLooped-1, seed);
		
		for(var i=0; i <= 1000; i += wallImgSize[0]){
			if(i == index * wallImgSize[0]){
				entities.add(new entity(name + " up door", "portal",  i,0, i+wallImgSize[0], 45,"", [up.destination, 500, 530],up.reqs,undefined))
				imgs.add(new img(wallImgStringDoor.up, i, 25-wallImgSize[1]))
			} else {
				imgs.add(new img(wallImgString.up, i, 25-wallImgSize[1]))
			}
		}
	}else {
		entities.add(new entity(up + " up door", "portal", 0, 0, 1000, 45, "", [up.destination, 500, 530],[],undefined))
	}
	
		//down
	
	if(down == undefined){
		//draw down side
		walls.add([0, 575, 1000, 575])
		for(var i=0; i <= 1000; i += wallImgSize[0]){
			imgs.add(new img(wallImgString.down, i, 575))
		}
	} else if (down.reqs.length != 0){
		walls.add([0, 575, 1000, 575])
		var timesLooped = Math.floor(1000 / wallImgSize[0]) + 1;
		var index = randint(1, timesLooped-1, seed);
		
		for(var i=0; i <= 1000; i += wallImgSize[0]){
			if(i == index * wallImgSize[0]){
				entities.add(new entity(name + " down door", "portal", i,555, i+wallImgSize[0], 600,"", [down.destination, 500, 70],down.reqs,undefined))
				imgs.add(new img(wallImgStringDoor.down, i, 575))
			} else {
				imgs.add(new img(wallImgString.down, i, 575))
			}
		}
	}else {
		entities.add(new entity(up + " down door", "portal", 0, 555, 1000, 600, "", [down.destination, 500, 70],[],undefined))
	}
	// randomly add images
	var numImages = randint(0, 3, seed)
	for(var i=0; i<numImages; i++){
		imgs.add(new img(choice(imagePool, seed), randint(100, 900, seed), randint(100, 500, seed)))
	}
	
	return new room(name, entities, walls, imgs, [], [],[], "./images/cave1.png");
}


export function rootRoom(dest){
	return new room("root", 
	[new entity("root portal", "portal", 600, 300, 800, 400,"", [dest, 500, 300], [], "./images/cave.png")], // entities - "1 1 1" or "gen"
	[], // walls
	[new img("./images/flower.png", 100, 100),new img("./images/flower.png", 200, 200), new img("./images/flower.png", 300, 300)], // images
	[], // reqImgs
	[], // monsters
	[], // drops
	"./images/outside.png", //background
	)
}
 


function chooseXY(name,seed){
	return [randint(100, 900,seed), randint(100, 500,seed)]
	
} // returns a suitable area for items
// guarantee : 100x100 region (50 on both sides) will not overlap with any 100x100 region centered
// on something returned by chooseXYBlock
function chooseXYBlock(name,seed){
	
	
} // returns a suitable area for walls.
// no guarantee on item being surrounded though, so do not call more than 3 times with same name

/* for each vertex, assign it a "source" and a "type"

source is "item" "chest", "monster", "npc", "portal"
type is "key", "sword buff", "misc" (amulet, scroll, etc.)

a "prev" is a truePrev in compileOne. 

rules : 
first of each partition must be portal
chest -> one prev and must be of type key
monster -> prev cannot be key


key -> can be used for chest or portal
sword buff -> can only be used if immediate successors are monsters.

	var assignmentsSource = {};
	var assignmentsType = {};
*/
// dag, list of string, list of numbers

// returns a list of vertices that have this vertex as truePrev
function getProportions(assignmentsSource,assignmentsType){
	var proSource = {"item":0, "chest":0, "monster":0, "npc":0};
	var proType = {"key":0, "sword buff":0, "misc":0};
	var count1 = 0;
	for(var item of Object.keys(assignmentsSource)){
		if(assignmentsSource[item] != "portal"){
			count1 += 1
			proSource[assignmentsSource[item]] = proSource[assignmentsSource[item]] == undefined? 1 : proSource[assignmentsSource[item]]+1
		}
	}
	var count2 = 0;
	for(var item of Object.keys(assignmentsType)){
		count2 += 1
		proType[assignmentsType[item]] = proType[assignmentsType[item]] == undefined? 1 : proType[assignmentsType[item]]+1
	}
	for(var item of Object.keys(proSource)){
		proSource[item] = proSource[item] / count1
	}
		for(var item of Object.keys(proType)){
		proType[item] = proType[item] / count2
	}
	return [proSource, proType];
	
}

function getTrueNext(dag, vertex, truePrevs){
	var trueNext = new Set();
	for(var nextV of new Set(Array.from(dag.get_vertex_by_name(vertex).next).map((x) => x.name))){
		if(truePrevs[nextV].has(vertex)){
			trueNext.add(nextV);
		}
	}
	return trueNext;
}
function interpret(dag, sort, partition, seed){
	var truePrevs = {};
	var trueNexts = {};
	var assignmentsSource = {};
	var assignmentsType = {};
	// initialize previous list
	for(var vertex of sort){
		truePrevs[vertex] = new Set(Array.from(dag.get_vertex_by_name(vertex).prev).map((x) => x.name))
	}

	for(var i=0; i<partition.length-1; i++){
		var thisPart = sort.slice(partition[i], partition[i+1]);
		var firstPred = new Set(Array.from(dag.get_vertex_by_name(thisPart[0]).pred).map((x) => x.name));
		firstPred.add(thisPart[0]); 
		// firstPred = things we can assume we have in this partition
		for(var vertex of thisPart){
			for(var preVertex of firstPred){
				truePrevs[vertex].delete(preVertex);
			}
		}
	}
	for(var vertex of sort){
		trueNexts[vertex] = getTrueNext(dag, vertex, truePrevs);
	}	
	// now truePrevs and trueNexts are done
	
	// first, all paritition elements are portals
	for(var i=0; i<partition.length-1; i++){
		assignmentsSource[sort[partition[i]]] = "portal";
	}
	// next, everything with no prev is an item
	// note that items can be reassigned as monsters if necessary (shouldn't be though)
	for(var i=0; i<sort.length; i++){
		var item_ = sort[i]
		if(assignmentsSource[item_] == undefined && truePrevs[item_].size == 0){
			assignmentsSource[item_] = "item"
		}
	}
	// if, for all of vertex's next :
	// the type is portal or (it's source is unassigned and this is the only prev)
	// then we can assign it as key
	for(var vertex of sort){
		if(assignmentsType[vertex] != undefined){
			continue;
		}
		var canKey = true;
		for(var nextV of trueNexts[vertex]){
			if(!(assignmentsSource[nextV] == "portal" || (assignmentsSource[nextV] == undefined && truePrevs[nextV].size == 1))){
				canKey = false;
				break;
			}
		}
		// assign this type as key, and all others as chests
		if(canKey){
			assignmentsType[vertex] = "key"
			for(var nextV of trueNexts[vertex]){
				if(assignmentsSource[nextV] == undefined){
					assignmentsSource[nextV] = "chest";
				}
			}
		}
	}
	
	// if, for all of vertex's next
	// none of its truePrev is key
	// then source is monster
	for(var vertex of sort){
		if(assignmentsSource[vertex] != undefined){
			continue;
		}	
		var canMonster = true;
		for(var nextV in trueNexts[vertex]){
			var noTruePrevKey = true;
			for(var prevV in truePrevs[nextV]){
				if(assignmentsType[prevV] == "key"){
					noTruePrevKey = false;
					break;
				}
			}
			if(noTruePrevKey == false){
				canMonster = false;
				break;
			}
		}
		if(canMonster){
			assignmentsSource[vertex] = "monster";
		}
	}
	// if it's not assigned
	// and all nexts are "monster"
	// then it's type is sword buff
	for(var vertex of sort){
		if(assignmentsType[vertex] != undefined){
			continue;
		}
		var canBuff = true;
		for(var nextV in trueNexts[vertex]){
			if(assignmentsSource[nextV] != "monster"){
				 canBuff=false;
				 break;
			}
		}
		if(canBuff){
			assignmentsType[vertex] = "sword buff"
		}
	}
	
	// assign everything else "npc" and "misc"
	for(var vertex of sort){
		if(assignmentsSource[vertex] == undefined){
			assignmentsSource[vertex] = "npc"
		}	
		if(assignmentsType[vertex] == undefined){
			assignmentsType[vertex] = "misc"
		}
	}
	
	// weakening rules:
	// type : anything can be weakened to misc (even keys opening chests)
	// source : anything other than portal can be weakened to npc
	// chest/key pair can be weakened to monster/buff pair
	// a healthy mix of types is : 10% key, 20% sword buff 70% misc
	// and sources are : 10% chest, balance between monster and npc
	
	// too many chests -> turn them into monster/buff pairs or npc/misc pairs (whichever is less)
	var pro = getProportions(assignmentsSource,assignmentsType)[0];
	var loopCount = 0;
	while(pro["chest"] > 0.3){
		loopCount += 1;
		if(loopCount > sort.length){
			break
		}
		var chest = choice(sort.filter((x) => assignmentsSource[x] == "chest"), seed);
		var key = Array.from(truePrevs[chest])[0]
		var less = pro["monster"] < pro["npc"] ? "monster" : "npc";
		if(less == "monster"){
			assignmentsType[key] = "sword buff";
			assignmentsSource[chest] = "monster";
		} else {
			assignmentsType[key] = "misc";
			assignmentsSource[chest] = "npc";
		}
	}
	// weaken types to misc
	var pro = getProportions(assignmentsSource,assignmentsType)[1];
	var desiredProsType = {
		"key" : 0.1,
		"sword buff" : 0.2,
		"misc":0.7,
	}
	// turn types into misc
	var loopCount = 0;
	while(pro["misc"] < 0.65){
		// don't loop forever
		loopCount += 1;
		if(loopCount > sort.length){
			break
		}
		
		pro = getProportions(assignmentsSource,assignmentsType)[1];
		// choose the highest difference and reduce that.
		var highestType = undefined;
		var highestValue = -999;
		for(var type of ["key", "sword buff", "misc"]){
			var value = pro[type] - desiredProsType[type]
			if(value > highestValue){
				highestValue = value;
				highestType = type;
			}
		}
		// now turn it into misc
		var turnTo = choice(sort.filter((x) => assignmentsType[x] == highestType), seed);
		assignmentsType[turnTo] = "misc"
	}
	// balance sources between monster and npc
	// remember : sword buff -> monster.
	var pro = getProportions(assignmentsSource,assignmentsType)[0]
	var loopCount = 0;
	while(Math.abs(pro["monster"]- pro["npc"])/ (pro["monster"] + pro["npc"]) > 0.2){
		// don't loop forever
		loopCount += 1;
		if(loopCount > sort.length){
			break
		}
		pro = getProportions(assignmentsSource,assignmentsType)[0];
		if(pro["monster"] > pro["npc"]){
			var turnTo = choice(sort.filter((x) => assignmentsSource[x] == "monster"), seed);
			// check no sword buff pre-req
			if(Array.from(truePrevs[turnTo]).map((x) => assignmentsType[x]).indexOf("sword buff") == -1 ){
				assignmentsSource[turnTo] = "npc"
			}
		} else if(pro["monster"] < pro["npc"]){
			var turnTo = choice(sort.filter((x) => assignmentsSource[x] == "npc"), seed);
			assignmentsSource[turnTo] = "monster"
		} else { // exactly balanced
			break
		}
		
	}	
	return [assignmentsSource,assignmentsType];
}


// come up with a clever name for this vertex. Maybe it's a sword. maybe it's a potion. 
function getName(dag, vertexName){
	return "item_" + vertexName
}



// turns a dag into a gameData object
//renders one "piece" of the DAG
// renders only vertices in renderThese
// renderThese and assumeHas are both sets of strings.
// assumeHas vertices have already been collected by the time we get here

// dag size should be around 6
var dungeonSize = 4; // constant , I think
export function compileOne(dag, name, renderThese, assumeHas,dict, seed, last=false){
	// first, check none of these items have been rendered before
	for(var item_ of renderThese){
		console.log(item_)
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
	while(result == undefined || result.size < 4){
		var maze = generateMaze(size, size, last ? 0.3 : 0.6, seed);
		result = bfs(size, size, maze, start, start)[0]; 
	}
	console.log(result.size)
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
		rooms[name + " " + x + " " + y] = walledRoom(name + " " + x + " " + y, moves[0], moves[1], moves[2], moves[3])
		items[name + " " + x + " " + y] = [];
	}
	var vertexList = dag.get_vertices();
	// used or unused
	// "result" still exists
	//NONE of these have names at the start
	var cannotUse = choice(result, seed); // a room that cannot be used so 
	var unused = _.cloneDeep(result);
	var used = new Set()
	//do not render any items for the last vertex
	if(last){
		return [rooms, items, dictionary, unused];
	}
	// all vertex lists are names (strings) not vertex objects
	var unAdded = new Set(renderThese)
	while(unAdded.size != 0){
		var vertex = choice(unAdded,seed);
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
		unAdded.delete(vertex);
		// try to render this vertex. 
		//get "true" predecessors (remove vertices in assumeHas);
		var vertexObj = dag.get_vertex_by_name(vertex);
		var truePrev = new Set(Array.from(vertexObj.prev).map((x) => x.name));
		for(var item_ of assumeHas){
			truePrev.delete(item_);
		}
		
		// choose a room to add it in
		var roomToAdd0 = undefined;
		while(roomToAdd0 == undefined || roomToAdd0 == cannotUse){
			roomToAdd0 = choice(result, seed)
		}
		used.add(roomToAdd0);
		unused.delete(roomToAdd0);
		var roomToAdd = name + " " + roomToAdd0;
		
		//choose where in the room to add it
		var location_ = chooseXY(roomToAdd, seed);
		// come up with a name for this item
		var itemName = getName(dag, vertex)
		dictionary[vertex] = itemName
		
		// initialize last variables before adding item
		var reqString = Array.from(truePrev).map((x) => dictionary[x]);
		var itemToAdd = new item(itemName, "./images/green_potion.png", location_[0]+randint(-10, 10,seed), location_[1]+randint(-10, 10,seed), "You got $1")
		
		// choose how to add the item
		var choice_ = new Set()
		
		if(rooms[roomToAdd].monsters.size == 0 && random(seed) < 0.5){
				choice_.add("monster")
		}
		if(truePrev.size == 0){
			// make an item instance
			choice_.add("item")
		} else if(truePrev.size == 1){
			//make it a chest
			choice_.add("chest")
		} else {
			choice_.add("npc")
		}
		// now add the item
		// assert: item = no prev, chest = 1 prev.
		switch(choice(choice_, seed)){ // here we just choose randomly. There might be a smarter way.
			case "item":
				items[roomToAdd].push(itemToAdd)
			break;
			case "chest":
				rooms[roomToAdd].entities.add(new entity(roomToAdd + " chest " + rooms[roomToAdd].entities.size, "chest", location_[0]-20, location_[1]-20, location_[0]+20, location_[1]+20, "You need $1", [itemToAdd], [dictionary[Array.from(truePrev)[0]]],  "./images/chest.png"))  
			break;
			case "monster":
				var monsterCount = randint(2, 5, seed);
				for(var i=0; i<monsterCount; i++){
					rooms[roomToAdd].monsters.add([location_[0]+randint(-30,30,seed), location_[1]+randint(-30,30,seed), new monster(roomToAdd + " monster " + i, "You need $1 to kill this monster", "./images/lizardman.png", reqString, 3, 40, 40)])
					rooms[roomToAdd].drops.add(itemToAdd);
				}
			break;
			case "npc":
				var entityName = roomToAdd + " npc " + rooms[roomToAdd].entities.size
				var npcData = [{"requirements" : reqString, "displayString" : "Here you go!", items:[itemToAdd]},{"requirements" : [], "displayString" : processString("I want $1", reqString), "items":[]}] 
				rooms[roomToAdd].entities.add(new entity(entityName, "npc",  location_[0]-20, location_[1]-20, location_[0]+20, location_[1]+20, "", npcData, [], "./images/npc_1.png"));
			break;
			default:
				throw new Error("adding item failed")
		}
	}
	
	return [rooms, items,dictionary, unused];
	
}


export function compile(dag, seed){

	var rooms = {"root":rootRoom(`slice 0 ${Math.floor(dungeonSize/2)} ${Math.floor(dungeonSize/2)}`)}; 	
	var items = {"root":[]};
	var dictionary  = {}
	var unused = [];
	var sort = dag.toposort();
	var slices = [];
	for(var i=0; i<sort.length-1; i += randint(6, 8, seed)){
		slices.push(i)
	}
	slices.push(sort.length-1) // last element must be in its own section
	slices.push(sort.length) 
	var int_ = interpret(dag, sort, slices, seed);
	// since slicing adds new edges, clone the dag and mutate it.
	
	var newDag = _.cloneDeep(dag);
	
	/*
	given a piece:
	assume you have everything needed for the first item of the piece
	render the entire piece (including the first item)
	if not the first piece: 
		if an unused room exists in both:
			choose an unused room in ANY previous piece and an unused room in this piece
			connect them using a portal whose requirements are the first item's prev.
		if no unused room exists in one of them:
			add a downwards ladder between used rooms 
	*/
	for(var i=0; i<slices.length-1; i++){
		var things = sort.slice(slices[i], slices[i+1]);
		var firstItem = things[0];
		var firstPred = new Set(Array.from(dag.get_vertex_by_name(firstItem).pred).map((x) => x.name))
		things = new Set(things);
		var result = compileOne(dag, "slice " + i , things, firstPred, dictionary, seed, i==slices.length-2)
		// "things", "firstItem", "firstPred" are all sets of strings
		console.log(result);
		addObject(rooms, result[0])
		addObject(items, result[1])
		dictionary= result[2]
		
		//requirements for first object in chunk is also requirement for everything in the chunk
		for(var vertex of things){
			for(var vertex2 of firstPred){
				newDag.add_edge(vertex2, vertex)
			}
		}
		
		// add unused later. 
		if(i != 0){
			// add connection
			// choose a random room in this piece and a random unused room in the previous piece
			var room1NamePre = undefined;
			while(room1NamePre == undefined){
				var section = randint(0, i , seed);
				if(unused[section].size != 0){
					room1NamePre = choice(unused[section],seed);
				}
			}
			var room1Name = "slice " + section + " " + room1NamePre;
			var room2Name = choice(result[3], seed);
			console.log(room1Name)
			// remove unused from both of them
			unused[section].delete(room1NamePre)
			result[3].delete(room2Name)
			room2Name = "slice " + i + " " + room2Name;
			// add a connection
			var loc1 = chooseXY(room1Name, seed);
			var loc2 = chooseXY(room2Name, seed);
			var reqs = Array.from(dag.get_vertex_by_name(firstItem).prev).map((x) => dictionary[x.name])
			rooms[room1Name].entities.add(new entity("slice " + i + " portal start", "portal", loc1[0], loc1[1], loc1[0]+50, loc1[1]+50,"Portal is activated by $1",[room2Name, loc2[0]-50, loc2[1]-50], new Set(reqs), "./shapes/green_circle.png"))
			rooms[room2Name].entities.add(new entity("slice " + i + " portal end","portal", loc2[0], loc2[1], loc2[0]+50, loc2[1]+50,"",[room1Name, loc1[0]-50, loc1[1]-50], [], "./shapes/green_circle.png"))
		
			//if "forward" portal (chunk X -> chunk Y) is placed in chunk X, then, requirements for first object in chunk X is also a requirement for every item in chunk Y
			
			var firstOfSourcePiece = sort[slices[section]]
			var firstOfSourcePred = dag.get_vertex_by_name(firstOfSourcePiece).prev
			for(var vertex of things){
				for(var vertex2 of firstOfSourcePred){
					newDag.add_edge(vertex2.name, vertex)
				}
			}
		}
		
		unused.push(result[3])
	}
	
	for(var vertex of sort){
		newDag.get_vertex_by_name(vertex).name = vertex + " " + int_[0][vertex] + " " + int_[1][vertex]
	}
	console.log(newDag.output());
	
	return [new gameData(rooms, items,"slice " + (slices.length-2) + " " + choice(unused[unused.length-1], seed)), newDag];
}