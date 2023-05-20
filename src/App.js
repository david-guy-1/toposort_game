import {compile} from "./compile.js";
import dag from "./dag.js";
import game from "./game.js";
import GameDisplay from "./GameDisplay.js";
import React from 'react';
import makeDag from './makeDag';
import {getImageForItem, loadAll} from "./itemPool.js"
import {sha256} from "./random.js";
const cytoscape = require("cytoscape");
const _ = require("lodash");

class App extends React.Component {
	constructor(props){
		super(props)
		this.state = {mode : "menu"}
		this.clicked = this.clicked.bind(this);
		this.back = this.back.bind(this);
		this.win = this.win.bind(this);
		
		this.iconRef = React.createRef();
		this.graphRef = React.createRef();
		this.sortRef = React.createRef();
		Set.prototype.toJSON = function(){
			return Array.from(this);
		}

		//debug
		var dag_ = makeDag(50, "some_seed2");
		var dag_ = makeDag(50, "some_seed2");
		console.log(JSON.stringify(dag_));
		//var dag_ = new dag([1,2,3,4,5, 6,"x1", "x2", "x3",7,"y1","y2","y3","y4","y5",8,9,10,11,12,13,14,15,"w1","w2","z"], [[1,2],[1,3],[2,3],[3,4],[2,5],[3,5],["x1","x2"], ["x2","4"], [2,"x3"], ["x3","6"], [5, 6], [4, "z"], [6,7],["y1","y3"],["y2","y3"],["y3","x3"],["y2", "y4"],[6, "y4"],["y4", "y5"],[7,10],["y5",10],[7,8],["y5",8],["y2",9],[10,11], [9, 11], [8, 12], [11,12],[6,13],[4,13],[10,14],[13,15],[14,15],["w1","w2"],["w2",9],[12,"z"],[15,"z"]])

		//compile(dag_, Math.random() + " ")
		
	}
	clicked(size){
		this.size = size; 
		this.setState({mode:"make seed"})
	}
	startGame(size, seed){
		// set data;
		
		//		console.log(this.iconRef.current.value);
		
		
		this.seed = seed;
		this.size = size;
		// get a dag
		switch(size){
			case "tiny":
				var dag_ = makeDag(10, this.seed + " " + size);
				var compileResult = compile(dag_, this.seed + " " + size, this.seed + " name " , 3, 4, 0);
			break;
			case "small":
				var dag_ = makeDag(20, this.seed + " " + size);
				var compileResult = compile(dag_, this.seed + " " + size, this.seed + " name " , 4, 6, 2);
			break;
			case "medium":
				var dag_ = makeDag(30, this.seed + " " + size);
				var compileResult = compile(dag_, this.seed + " " + size, this.seed + " name " , 5, 8, 5);
			break;
			case "large":
				var dag_ = makeDag(50, this.seed + " " + size);
				var compileResult = compile(dag_, this.seed + " " + size, this.seed + " name " , 6, 13, 10);
			break;
			case "huge":
				var dag_ = makeDag(80, this.seed + " " + size);
				var compileResult = compile(dag_, this.seed + " " + size, this.seed + " name " , 9, 18, 30);
			break;
			case "giant":
				var dag_ = makeDag(150, this.seed + " " + size);
				var compileResult = compile(dag_, this.seed + " " + size, this.seed + " name " , 12, 27, 60);
			break;
			case "debug":
				var dag_ = makeDag(180, this.seed + " " + size);
				var compileResult = compile(dag_, this.seed + " " + size, this.seed + " name " , 180, 180);
			break;
			
			
		}
		this.itemHeldBy = compileResult[3];
		this.dictionary = compileResult[2];
		this.hintStrings = compileResult[4];
		this.maps = compileResult[5]; 
		this.portalRooms = compileResult[6]; 
		this.reverseDictionary = [];
		for(var key of Object.keys(this.dictionary)){
			this.reverseDictionary[this.dictionary[key]] = key;
		}
		this.dag = compileResult[1];
		this.game = new game(compileResult[0], this.dag, this.reverseDictionary, this.hintStrings, this.maps);
		
		
		// DEBUG!!!
		// b tiny
		
		//this.win(72.37,["blue star", "cyan water scroll", "purple apple book", "silver wand", "silver flower", "yellow flower", "blue orb with explosion", "purple orb with leaf", "cyan key"],[3520, 13370, 22295, 43621, 50345, 52670, 59220, 63919, 69195]);
		//return;
		
		// end debug
		
		this.setState({mode:"game"})
	}
	back(){
		if(this.state.mode !== "win" && window.confirm("Are you sure?")){
			this.setState({mode:"menu"})
		}
		if(this.state.mode == "win"){
			this.setState({mode:"menu"});
		}
	}
	win(time, sort,times){
		this.time = time;
		this.sort = sort;
		this.times = times;
		this.setState({mode:"win"})
	}
	componentDidUpdate(){
		if(this.state.mode == "graph"){
			// render the graph!
			var cy = cytoscape({
			container: this.graphRef.current,
			  
			style: [
				{
					selector: 'node',
					style: {
						label: 'data(id)'
					}
				}, {
					selector:"edge",
					style:{
					"curve-style":"straight",
						"mid-target-arrow-color":"red",
						"mid-target-arrow-shape":"triangle",
						"target-arrow-color":"red",
						"target-arrow-shape":"triangle"			
					}
				
				}]
				
			});
			
			// make the graph
			var lst = [];
			//vertices
			// display is 1000x650
			var multiplier = 960 / (this.dag.vertices.size + 1);
			var index = 0;
			for(var vertex of this.dag.vertices){
				lst.push({ group: 'nodes', data: { id: vertex.next.size == 0 ? "Anna" : this.dictionary[vertex.name] }, position: { x: (vertex.next.size == 0 ? this.sort.length : this.sort.indexOf(this.dictionary[vertex.name]))*multiplier+20, y: Math.random() * 630 + 10 }, style : {
					"background-image":vertex.next.size == 0? undefined : require("./images/items/" + getImageForItem(this.dictionary[vertex.name])),"background-fit": "cover cover"
				}	})
			}
			//edges
			for(var v of  this.dag.vertices){
				for(var w of v.next){
					lst.push({ group: 'edges', data: { id: v.name + " " + w.name, source: this.dictionary[v.name], target: this.dictionary[w.name]  == undefined ? "Anna" : this.dictionary[w.name]} } );
				}
			}
			// render it
			cy.add(lst);
			cy.resize();
			cy.mount();
			console.log(lst)
			
		} 
	}
	render(){
		
		//styles for menu icons
		var titleStyle = {"position":"absolute", "width":600, "height":60, "left":300, "fontSize":30, top:70, color:"white"}
			
		var buttonStyle = {"position":"absolute", "width":300, "height":60, "left":300, "fontSize":30, }
			var styles = [];
			for (var i=0;  i<6; i++){
				styles.push(_.clone(buttonStyle));
				var thisStyle = styles[styles.length-1];
				thisStyle.top = 150 + i*70;
				
			}
			
			
		switch(this.state.mode){
			case "menu":
			
			return <div>
			
			
			<img src={require("./images/menu.png")} style={{position:"absolute", top:0, left:0,"zIndex":-1}} /> 
			<div style={titleStyle}>The Magical Cave Adventure</div><br />
			<button style={styles[0]} onClick={() => this.clicked("tiny")}>Start (tiny)</button><br />
			<button style={styles[1]} onClick={() => this.clicked("small")}>Start (small)</button><br />
			 <button style={styles[2]} onClick={() => this.clicked("medium")}>Start (medium)</button><br />
			 <button style={styles[3]} onClick={() => this.clicked("large")}>Start (large)</button><br />
			<button style={styles[4]} onClick={() => this.clicked("huge")}>Start (huge)</button><br />
			<button style={styles[5]} onClick={() => this.clicked("giant")}>Start (giant)</button><br />
			
				{/*		<button onClick={() => this.clicked("debug")}>Start (debug)</button><br />*/}
			</div>
			break;
			case "make seed":
			
			return <div>
			<img src={require("./images/menu.png")} style={{position:"absolute", top:0, left:0,"zIndex":-1}} /> 
			<div style={titleStyle}>Enter a seed, or leave blank to randomly generate seed </div>
			<textarea ref={this.iconRef} style={styles[0]} id="seed"></textarea> 
			<button style={styles[4]}  onClick={function(){
				var seed = this.iconRef.current.value;
				if(seed.length == 0){
					// generate a seed
					seed = sha256(Date.now().toString());
				} 
				this.startGame(this.size , seed);
				
			}.bind(this)}>Start</button><br />
			
			<button style={styles[5]}  onClick={() => this.setState({mode:"menu"}) }>Back</button><br />
			</div>
			break;
			case "game":
			return <div>
			<GameDisplay dag_={this.dag} game={this.game} back={this.back} win={this.win} seed={this.seed} size={this.size} maps={this.maps} portalRooms={this.portalRooms}/>
				
			</div>
			break;
			case "win": // win screen
			// win screen image is 1000x654
			// box start is 135, 130
			// and end is 470, 378
			// render below this mark
				return <div>
				<img src={require("./images/win.png")} style={{position:"absolute", top:0, left:0}} />
				<h2 style={{position:"absolute", top:165, left:170}}>You have rescued Anna! </h2>
				<h4 style={{position:"absolute", top:210, left:150}}>Your time : {Math.floor(this.time.toString())} seconds</h4>
				<button style={{position:"absolute", top:260, left:150, width:150, height:25}} onClick={() => this.setState({mode : "graph"}) } >View dependencies </button>
				<button style={{position:"absolute", top:294, left:150, width:150, height:25}} onClick={() => this.setState({mode : "sort"})}>View order collected </button>
				
				<button style={{position:"absolute", top:330, left:150, width:150, height:25}} onClick={this.back}>Main menu</button>
				
				</div>
			break;
			case "graph":
				return <div>
				<div ref={this.graphRef} style={{position:"absolute", top:10, left:10, width:1000, height:650}} ></div> 
				<div style={{position:"absolute", top:660, left:100, width:150, height:40}} >You can drag things with your mouse</div>
				<button style={{position:"absolute", top:660, left:500, width:150, height:40}}onClick={() => this.setState({mode : "win"})}>Go back</button>
				</div>
			break;
			case "sort":
				return <div>
				<button style={{position:"absolute", top:600, left:500, width:150, height:40}}  onClick={() => this.setState({mode : "win"})}>Go back</button>
				<div style={{position:"absolute", top:10, left:10, width:1000, height:550 , overflow:"scroll"}}><table style={{marginLeft:"auto", marginRight : "auto", borderCollapse:"collapse"}}><tbody>
				
				{
					// edges
					function(){
						var lst = [];
						var borderObj = {"border-left":"1px solid black","border-right":"1px solid black"};
						var borderObjLast = {"border-left":"1px solid black","border-right":"1px solid black","border-bottom":"1px solid black"};
						var borderObjFirst = {"border-left":"1px solid black","border-right":"1px solid black","border-top":"1px solid black",backgroundColor:"#ffcccc" ,"border-bottom":"1px solid black"};
						
						lst.push(<tr><td style={borderObjFirst}>Index</td> <td style={borderObjFirst}></td><td style={borderObjFirst}>Item</td><td style={borderObjFirst}>Time obtained</td><td style={borderObjFirst}>Location</td></tr>)
						for(var i=0; i<this.sort.length; i++){
							var sortItem = this.sort[i];
							var theTime = this.times[i];
							lst.push(<tr><td style={borderObj}>{i+1}</td> <td style={borderObj}> <img src={require("./images/items/" + getImageForItem(sortItem))} /></td><td style={borderObj}> {sortItem}</td><td style={borderObj}>{Math.floor(theTime/1000)}</td><td style={borderObj}>{this.itemHeldBy[this.reverseDictionary[sortItem]].theme}</td></tr>);
						}
						// last element
						lst.push(<tr><td style={borderObjLast}>{this.sort.length+1}</td> <td style={borderObjLast}></td><td style={borderObjLast}>Anna</td><td style={borderObjLast}>{Math.floor(this.time)}</td><td style={borderObjLast}></td></tr>);
						return lst;
					}.bind(this)()
				}
				
				
					</tbody></table></div>
				
				</div>
				
			
			break;
		}
		
	}
	componentDidMount(){
		setTimeout(loadAll, 50);
		
	}
}

export default App;