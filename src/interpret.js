import {random, randint, choice, reset_, shuffle } from "./random.js"

/* for each vertex, assign it a "source" and a "type"

source is "item" "chest", "monster", "npc", "portal"
type is "key", "misc" (amulet, scroll, etc.)

a "prev" is a truePrev in compileOne. 

rules : 
first of each partition must be portal
chest -> one prev and must be of type key
monster -> prev cannot be key


key -> can be used for chest or portal


	var assignmentsSource = {};
	var assignmentsType = {};
*/



// dag, list of string, list of numbers

// returns a list of vertices that have this vertex as truePrev


export function getProportions(assignmentsSource,assignmentsType){
	var proSource = {"item":0, "chest":0, "monster":0, "npc":0};
	var proType = {"key":0, "misc":0};
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
export function interpret(dag, sort, partition, seed){
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
	// a healthy mix of types is : 10% key, 90% misc
	// and sources are : 10% chest, balance between monster and npc
	
	// too many chests -> turn them into monster/buff pairs or npc/misc pairs (whichever is less)
	var pro = getProportions(assignmentsSource,assignmentsType)[0];
	var loopCount = 0;
	while(pro["chest"] > 0.1){
		loopCount += 1;
		if(loopCount > 2*sort.length){
			console.log("breaking interpret 1")
			break
		}
		var chest = choice(sort.filter((x) => assignmentsSource[x] == "chest"), seed + " chest clear" + loopCount);
		var key = Array.from(truePrevs[chest])[0]
		var less = pro["monster"] < pro["npc"] ? "monster" : "npc";
		assignmentsType[key] = "misc";
		if(less == "monster"){
			assignmentsSource[chest] = "monster";
		} else {
			assignmentsSource[chest] = "npc";
		}
		pro = getProportions(assignmentsSource,assignmentsType)[0];
	}

	// keys should be <0.12 of all items
	
	var pro = getProportions(assignmentsSource,assignmentsType)[1];
	var validKeys = new Set(sort.filter((x) => assignmentsType[x] == "key").filter(function(x){
		return Array.from(trueNexts[x]).every((x) => assignmentsSource[x] != "chest");
	}))
	var counter = 0;
	while(pro["key"] > 0.12 && validKeys.size != 0){
		// turn a key into a misc
		counter ++;
		var keyChoice = choice(validKeys, seed + "key to misc" + counter);
		assignmentsType[keyChoice] = "misc";
		validKeys.delete(keyChoice);
		pro = getProportions(assignmentsSource,assignmentsType)[1];
	}
	
	// balance sources between monster and npc
	var pro = getProportions(assignmentsSource,assignmentsType)[0]
	var loopCount = 0;
	while(Math.abs(pro["monster"]- pro["npc"])/ (pro["monster"] + pro["npc"]) > 0.2){
		// don't loop forever
		loopCount += 1;
		if(loopCount > 2*sort.length){
			break
		}
		pro = getProportions(assignmentsSource,assignmentsType)[0];
		if(pro["monster"] > pro["npc"]){
			var turnTo = choice(sort.filter((x) => assignmentsSource[x] == "monster"), seed + " swap monster" + loopCount);
			assignmentsSource[turnTo] = "npc"
			
		} else if(pro["monster"] < pro["npc"]){
			var turnTo = choice(sort.filter((x) => assignmentsSource[x] == "npc"), seed + " swap npc" + loopCount);
			assignmentsSource[turnTo] = "monster"
		} else { // exactly balanced
			break
		}
		pro = getProportions(assignmentsSource,assignmentsType)[0];
	}	
	return [assignmentsSource,assignmentsType];
}

export default interpret;