import dag from "./dag.js";

import {random, randint, choice, reset_} from "./random.js"

const _ = require("lodash");

// source and target are vertex instances
function addEdgeSmart(dag_, source, target, seed){
			if(target.succ.has(source)){
				return; // no cycles
			}
			var addEdgeDet = random(seed + " add edge ");
			switch(target.prev.size){
				case 0:
						dag_.add_edge(source.name, target.name);
				break;
				case 1:
					if(addEdgeDet < 0.4){
						dag_.add_edge(source.name, target.name);
					}
				break;
				case 2:
					if(addEdgeDet < 0.2){
						dag_.add_edge(source.name, target.name);
					}
				break;
				default:
					if(addEdgeDet < 0.1){
						dag_.add_edge(source.name, target.name);
					}
				break;
			}	
}
export function makeDag(vertices, seed){
	console.log(["start make dag", Date.now()]);
	reset_(); // random.reset 
	if(vertices < 3){
		throw new Error("vertices less than 3");
	}
	var dag_ = new dag([],[]);
	// add in vertices.
	for(var i=0; i<vertices;i++){
		dag_.add_vertex("x" + i.toString());
	}

	
	// add in edges at random 
	for(var i=0; i<3*vertices;i++){
		var source = choice(dag_.vertices, seed + " choose random 0 " + i);
		if(source.name == "x" + (vertices-1)){ // can't add to final vertex
			continue;
		}
		var target = choice(dag_.vertices, seed + " choose random 1 " + i);
		addEdgeSmart(dag_, source, target, seed + " " + i);
	}
	console.log(["add edges done", Date.now()]);
	
	var finalName = "x" + (vertices-1);

	var counter = 1;
	// make all vertices a predecessor of the final vertex
	while(dag_.get_vertex_by_name(finalName).pred.size != vertices-1){
		counter += 1
		var finalPredNames = Array.from(dag_.get_vertex_by_name(finalName).pred).map((x) => x.name);
		finalPredNames.push(finalName);
		// choose a vertex at random
		var source = choice(Array.from(dag_.vertices).map((x) => x.name).filter((x) => finalPredNames.indexOf(x) == -1), seed + " make pred " + counter);
		var target = choice(finalPredNames, seed + " make pred 2 " +counter);
		if(! dag_.get_vertex_by_name(target).succ.has(dag_.get_vertex_by_name(source))){
			dag_.add_edge(source, target);
		}
	
	}
	console.log(["all dag pred", Date.now()]);
	return dag_;
}

/*
export function makeDag(seed){
	if(seed == undefined){
		throw new Error("seed undefined");
	}
	return  new dag([1,2,3,4,5, 6,"x1", "x2", "x3",7,"y1","y2","y3","y4","y5",8,9,10,11,12,13,14,15,"w1","w2","z"], [[1,2],[1,3],[2,3],[3,4],[2,5],[3,5],["x1","x2"], ["x2","4"], [2,"x3"], ["x3","6"], [5, 6], [4, "z"], [6,7],["y1","y3"],["y2","y3"],["y3","x3"],["y2", "y4"],[6, "y4"],["y4", "y5"],[7,10],["y5",10],[7,8],["y5",8],["y2",9],[10,11], [9, 11], [8, 12], [11,12],[6,13],[4,13],[10,14],[13,15],[14,15],["w1","w2"],["w2",9],[12,"z"],[15,"z"]]);
}
*/

export default makeDag;