import {random, randint, choice, reset_, shuffle } from "./random.js"
import themeData from "./themeData.js";
import {aAn} from "./processString.js";

// in all of these, vertices are passed in as strings and use source (non-dictionary) names.


function angleToDirection(angle){
	// 0 to 2pi, re-index so slightly below rightward is zero
	angle += Math.PI /8; 
	if(angle < 0){
		angle += 2*Math.PI; 
	}
	return ["east","northeast","north","northwest","west","southwest","south","southeast","east"][Math.floor(angle / (Math.PI / 4))]
}

// returns a string describing this vertex's location
//does not work for the final vertex
function chooseString(data, vertex){
	var [rooms, items, dictionary, itemData, itemHeldBy, themes, sort,portals, newDag, finalVertex,roomSizes, slices] = data;
	// first, get what chunk it's in and the theme, and the relative location
	var chunk = itemHeldBy[vertex].slice;
	var theme = themes[chunk];
	var heldBy = itemHeldBy[vertex];
	var x  = heldBy.x;
	var y = heldBy.y;
	var halfSize = heldBy.size / 2;
	var angle = -Math.atan2(y - halfSize,  x-halfSize); // negative since atan2 uses up = positive y
	// but here we have up = negative y
	var direction = angleToDirection(angle);
	//determine if it's a portal - characterized by its previous (in the sort) item being in a different chunk.

	var portal = sort[0] != vertex && slices.indexOf(sort.indexOf(vertex)) != -1;
	
	if(portal){ // a portal, things above is for an item in the destination
		var thisPortal = portals[chunk-1];
		var sourceChunk = portals[chunk-1].sourceChunk;
		var sourceTheme = themes[sourceChunk];
		var destTheme = theme;
		
		// compute direction 
		var halfSize = roomSizes[sourceChunk]/2
		var angle = -Math.atan2(thisPortal.sourceY - halfSize,thisPortal.sourceX - halfSize); 
		return `A portal to ${themeData[destTheme].description} is in ${themeData[sourceTheme].description}, in the ${angleToDirection(angle)} area`;
		
	} else { // not a portal
		var postText = "";
		switch(heldBy.holderType){
			case "monster":
				postText = `held by ${aAn(heldBy.data.name)}`;
			break;
			case "npc":
				postText = `contained in ${aAn(heldBy.data.color)} statue`;		
			break;
			case "item":
				postText = `on the ground`;
			break;
			case "chest":
				postText = `locked in ${aAn(heldBy.data.color)} chest`;				
			break;
		}
		
		
		return `The ${dictionary[vertex]} is in the ${direction} part of ${themeData[theme].description}, ${postText}`;
	}
}

//returns a list of vertices that this vertex can hint at
// rules : this chunk or next chunk
// cannot hint at this the vertex's predecessors or itself
// vertex should not be final vertex, since then there's nothing to hint at
function getCandidates(data, vertex){
	var [rooms, items, dictionary, itemData, itemHeldBy, themes, sort,portals, newDag, finalVertex,roomSizes, slices] = data;
	if(vertex == finalVertex){
		throw new Error("can't hint at final vertex ");
	}
	// get vertices in this chunk or next chunk
	var thisChunk = itemHeldBy[vertex].slice;
	var validSet = sort.slice(slices[thisChunk], slices[thisChunk+2]);
	var predSet = new Set(Array.from(newDag.get_vertex_by_name(vertex).pred).map((x) => x.name));
	validSet = validSet.filter((x) => !predSet.has(x) && x != vertex && x != finalVertex);
	return validSet;
	
}
export function allHintStrings(rooms, items, dictionary, itemData, itemHeldBy, themes, sort,portals, newDag, finalVertex,roomSizes, slices){
	var data = [rooms, items, dictionary, itemData, itemHeldBy, themes, sort,portals, newDag, finalVertex,roomSizes, slices];
	var strings = {};
	for(var vertex of sort){
		if(vertex == sort[sort.length-1]){
			continue;
		}
		strings[vertex] = chooseString(data, vertex);
	}
	return strings;
}

export function addHintStrings(rooms, items, dictionary, itemData, itemHeldBy, themes, sort,portals, newDag, finalVertex,roomSizes, slices, seed){
	// first, get all of the NPCs and portals
	var data = [rooms, items, dictionary, itemData, itemHeldBy, themes, sort,portals, newDag, finalVertex,roomSizes, slices];
	var npcVertices = sort.filter((x) => x != sort[sort.length-1] && itemHeldBy[x].holderType == "npc");
	var portalVertices = slices.filter((x) => x != 0 && x != slices[slices.length-1]  && x != slices[slices.length-2]).map(x => sort[x]);
	var validVertices = npcVertices.concat(portalVertices);
	
	var alreadyHinted = new Set();
	
	// make npc vertices hint at things
	var counter = 0;
	for(var vertex of npcVertices){
		counter ++;
		// choose a vertex to hint at
		var candidates = getCandidates(data, vertex).filter((x) => !alreadyHinted.has(x));
		if(candidates.length == 0){
			continue;
		}
		var toHintAt = choice(candidates, seed + " npc choice " + counter);
		alreadyHinted.add(toHintAt);
		var hintString = chooseString(data, toHintAt);
		// make NPC hint at this
		itemHeldBy[vertex].holderObj.data[0].displayString = "Statue says : " + hintString;
		itemHeldBy[vertex].holderObj.data = [{requirements: itemHeldBy[vertex].holderObj.data[0].requirements.concat([dictionary[toHintAt]]),
		displayString: "(You already have this)" + "Statue says : " + hintString,
		items : []}].concat(itemHeldBy[vertex].holderObj.data);
	}
	//split the rooms by chunk
	var roomsByChunk = [];
	for(var i=0; i<slices.length-2; i++){
		roomsByChunk.push([]);
	}
	for(var roomName of Object.keys(rooms)){
		if(roomName == "root"){
			continue;
		}
		var splitName = roomName.split(" ");
		var chunk = parseInt(splitName[splitName.length-3]);
		if(chunk == slices.length-2){
			continue;
		}
		roomsByChunk[chunk].push(roomName);
	}
	//place the signposts
	var output = [] // pairs of room, hintString to be added in that room;
	for(var chunkIndex = 0; chunkIndex <slices.length-2; chunkIndex++){
		for(var i=0; i<roomSizes[chunkIndex]; i++){
			var thisSeed = seed + " sign placement " + chunkIndex + " " + i;
			// choose a room
			var chosenRoom = choice(roomsByChunk[chunkIndex], thisSeed + " choose room");
			// choose a vertex to hint at
			var candidates = getCandidates(data, [sort[0]].concat(portalVertices)[chunkIndex]).filter((x) => !alreadyHinted.has(x));
			if(candidates.length == 0){
				continue;
			}
			var toHintAt = choice(candidates, thisSeed + " portal choice " + counter);
			alreadyHinted.add(toHintAt);
			var hintString = chooseString(data, toHintAt);	
			output.push([chosenRoom, "The sign says: " + hintString, toHintAt]);
		}
	}
	return output;
}

export default addHintStrings;