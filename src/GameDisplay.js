import React from 'react';
import * as d from "./canvasDrawing.js";
import game from "./game.js";
import * as l from "./lines.js"
//import data1 from "./data.js";
import {compile} from "./compile.js";
import dag from "./dag.js";
import processString from "./processString.js";


// tentative name : The Cave Rescue Adventure

class GameDisplay extends React.Component {
	constructor(props){
		super(props);
		// props is dag and game (game is gameData object)
		this.state = {text_ : ""};
		
		this.lowerCanvas = React.createRef();
		this.upperCanvas = React.createRef();
		this.playerCanvas = React.createRef();
		this.topCanvas = React.createRef();
		this.inventoryCanvas = React.createRef();
		
		this.lastRendered = Date.now();
		this.fps = 40;
		//var dagA = new dag([1,2,3,4,5, 6,"x1", "x2", "x3","z"], [[1,2],[1,3],[2,3],[3,4],[2,5],[3,5],["x1","x2"], ["x2","4"], [2,"x3"], ["x3","6"], [5, 6], [4, "z"], [6,"z"]])
		
		//console.log(dagA.output());
		//console.log(dagA.toposort().toString());
		//window.dag = dagA;
		//this.game = new game(compile(dagA, 3));
		
		this.dag_ = this.props.dag;
		this.game = this.props.game;
		this.back = this.props.back;
		this.win = this.props.win;
		this.mouseX = 0;
		this.mouseY = 0;
		this.mouseDown = false;
		this.mouseMove = this.mouseMove.bind(this);
		this.mouseOverInv = this.mouseOverInv.bind(this)
		this.hint = this.hint.bind(this)
		this.currentRoom = ""
		this.inventoryScroll = 0;
		this.inventoryScrollDirection = undefined;
		this.damagedLastAttack = false;
		this.attackedIndex = []; // indices of damaged monsters
		this.invNames = [];
		
	}
	mouseMove(e){
		this.mouseX = e.pageX;
		this.mouseY = e.pageY;
	}
	hint(){
		var string = this.game.hintAtRandom();
		if(string == undefined){
			this.displayText("There are no more hints available");
		}else{
			this.displayText(string);
		}
	}
	mouseOverInv(e){
		var x = Math.floor((e.nativeEvent.offsetX+this.inventoryScroll) / 40);
		if(x >= 0 && this.invNames[x] != undefined){
			this.displayText(this.invNames[x]);
		}
	}
	render(){
		this.dag_ = this.props.dag;
		this.game = this.props.game;
		
	  return (
		<div className="App" onMouseMove={this.mouseMove} onMouseDown={function(){this.mouseDown = true;}.bind(this)} onMouseUp={function(){this.mouseDown = false;}.bind(this)}>
		<img style={{position:"absolute", top:0, left:0, zIndex:-1}} src={require("./images/game_background.png")} /> 
			
		<div id="seed" style={{position:"absolute", top:10, left:40, zIndex:0, width:950}} ref={this.topCanvas}>{`seed:"${this.props.seed}" size:${this.props.size} ` }</div>
			
		<div id="topCanvas" style={{position:"absolute", top:30, left:30, zIndex:0, width:940}} ref={this.topCanvas}>{this.state.text_}</div>
		
		
		<canvas width={990} height={600} id="lowerCanvas" style={{position:"absolute", top:80, left:0, zIndex:0}} ref={this.lowerCanvas}/>
		<canvas width={990} height={600} id="upperCanvas" style={{position:"absolute", top:80, left:0, zIndex:1, border:"1px solid black"}}ref={this.upperCanvas}/>
		<canvas width={990} height={600} id="playerCanvas" style={{position:"absolute", top:80, left:0, zIndex:2, border:"1px solid black"}}ref={this.playerCanvas}/>
		
		<canvas width={720} height={45} ref={this.inventoryCanvas} onMouseMove = {this.mouseOverInv} id="inventoryCanvas" style={{position:"absolute", top:690, left:70,  border:"1px solid black", zIndex:0}} />
		
		<img src={require("./images/scroll_left.png")} onMouseOver = {function(){this.inventoryScrollDirection="left"}.bind(this)} onMouseOut = {function(){this.inventoryScrollDirection=undefined}.bind(this)} id="scrollLeft" style={{position:"absolute", top:690, left:20,  border:"1px solid black", zIndex:0}} />
		
		<img src={require("./images/scroll_right.png")} onMouseOver = {function(){this.inventoryScrollDirection="right"}.bind(this)} onMouseOut = {function(){this.inventoryScrollDirection=undefined}.bind(this)} id="scrollRight" style={{position:"absolute", top:690, left:800,  border:"1px solid black", zIndex:0}} />

		
		<button  onClick={this.back} id="backButton" style={{position:"absolute", top:690, left:850, width:100 ,height:30 ,border:"1px solid black", zIndex:0}}>Back</button>
		<button  onClick={this.hint} id="backButton" style={{position:"absolute", top:720, left:850, width:100 ,height:30 ,border:"1px solid black", zIndex:0}}>I'm stuck</button>
		</div>
	  );
	}
	componentDidMount(){
		console.log("componentDidMount called");
		this.setWin = false;
		this.interval_ = setInterval(this.gameLoop.bind(this), 1000/this.fps)
	}
	displayText(t){
		this.setState({text_ : t});
	}
   
	
	update(events){
		/* eventList is an array of objects
		items -> list of items
		entitiesActivated -> list of entities
		entitiesFailed -> list of entities
		npcChat -> list of strings (what npcs have said)
		monstersAttacked -> list of numbers (indices of attacked monsters)
		monstersFailed -> list of numbers (indices of monsters failed to attack)
		newRoom -> new room (if applicable)
		*/		
		var pc = this.playerCanvas.current.getContext("2d");
		var uc = this.upperCanvas.current.getContext("2d");
		var lc = this.lowerCanvas.current.getContext("2d");
		var ic = this.inventoryCanvas.current.getContext("2d");
		// clear everything
		pc.clearRect(0,0,1000,1000);
		uc.clearRect(0,0,1000,1000);
		var level = this.game.getLevel();
		//this.displayText("abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcd")
//d.drawImageStr(uc,"./images/green_potion.png", 400, 400);
	
		//draw the player
		//sizes are 40x80 not attacking, and 80x80 attacking
		
		if(level.facingDirection == "left" && this.mouseDown == false){
			d.drawImageStr(pc, "./images/player_l.png", level.x - 20, level.y - 40) 
		} else if(level.facingDirection == "left" && this.mouseDown == true){
			d.drawImageStr(pc, "./images/player_l_attack.png", level.x - 60, level.y - 40) 
		} else if(level.facingDirection == "right" && this.mouseDown == false){
			d.drawImageStr(pc, "./images/player_r.png", level.x - 20, level.y - 40) 
		} else if(level.facingDirection == "right" && this.mouseDown == true){
			d.drawImageStr(pc, "./images/player_r_attack.png", level.x - 20, level.y - 40) 
		} 

		// get indices of attacked monsters
		var attackedIndex = [];
		for(var event_ of events){
			if(event_.attackedThisTick){
				attackedIndex = attackedIndex.concat(event_.monstersAttacked);
				this.attackedIndex = attackedIndex;
			}
		}
		
			
			
			

		
		// draw the monsters;
		for(var item of level.getMonsters()){
			if(item.hp > 0){
				if(this.attackedIndex.indexOf(item.index) != -1 && this.mouseDown){
					d.drawImageStr(uc, item.monster.img[1], item.x, item.y);
				} else {
					d.drawImageStr(uc, item.monster.img[0], item.x, item.y);
				}
				
			}
		}
		//draw the entities
		for(var item of level.entities){
				d.drawImageStr(uc, item.img, item.tlx, item.tly);
		}		
		// important: draw image AFTER drawing monsters and entities
		//draw the imgs
		for(var item of level.imgs){
			if(item.whenDraw != "always"){
				if(this.game.meetRequirements(item.reqs) == (item.whenDraw == "met")){
					d.drawImageStr(uc, item.img, item.x, item.y);
				}
			} else {
				d.drawImageStr(uc, item.img, item.x, item.y);
			}
				
		}		

		//draw the imgs
	//	console.log(level.reqImgs);
		for(var item of level.reqImgs){
			for(var check of item.data){
				if(this.game.meetRequirements(check.requirements)){
					d.drawImageStr(uc, check.image, item.x, item.y);
					break;
				}
			}
		}		
		
		//draw the items (important: at the very end);
		for(var item of this.game.getLevel().items){
			d.drawImageStr(uc, item.image, item.x,item.y); 
		}		

		
		//draw the background;
		if(this.currentRoom != this.game.getLocation()){
			this.currentRoom = this.game.getLocation();
			var lc = this.lowerCanvas.current.getContext("2d");
			lc.clearRect(0,0,1000,1000);
			d.drawImageStr(lc, level.background, 0, 0);
		}
		// display the things that happened
		/*
					"items" : a,
			"entitiesActivated" : b[0],
			"entitiesFailed" : b[1],
			"npcChat" : b[2]
			"monstersAttacked" : c == undefined ? [] : c[0],
			"monstersFailed" : c == undefined ? [] : c[1],
			"newRoom"  : d,
			
		*/
		
		for(var event_ of events){
			// items
			for(var item of event_.items){
				this.displayText(processString(item.displayString, [item.name]))
			}
			for(var item of event_.entitiesFailed){
				this.displayText(processString(item.displayString, item.reqs))
			}
			for(var item of event_.npcChat){
				this.displayText(item)
			}
			// draw the blood if attack dealt damage
			if(event_.attackedThisTick){
				var damaged = false;
				this.damagedLastAttack = false;
				for(var item of event_.monstersAttacked){
					if(item.length != 0){
						damaged = true;
						this.damagedLastAttack = true;
						break;
					}
				}
			} else {
				var damaged = this.damagedLastAttack;
			}
			
			if(damaged && this.mouseDown){
				if(level.facingDirection == "left"){
					d.drawImageStr(pc, "./images/glow_left.png", level.x - 60, level.y - 40) 
				}
				if(level.facingDirection == "right"){
					d.drawImageStr(pc, "./images/glow_right.png", level.x - 20, level.y - 40) 
				}
				
			}
			for(var index of event_.monstersFailed){
				var item = this.game.getLevel().monsters[index]
				if(item != undefined){
					this.displayText(processString(item.displayString, item.reqs))
				}
			}
		}
		// inventory
		//this.invNames = [];
		ic.clearRect(0, 0, 1000, 1000);
		// ordering must be consistent
		for(var item of this.game.inventory){
			if(this.invNames.indexOf(item[0]) == -1){
				this.invNames.push(item[0]);
			}
			
			d.drawImageStr(ic, item[1], 40*this.invNames.indexOf(item[0])-this.inventoryScroll, 0)
		}
	}
	inventoryScrollFn(direction, speed){
		var holdable = 720 / 40  // inventoryCanvas width / image size;
		//compute maximum size
		var maxSize = Math.max(0, 40 * (this.game.inventory.size - holdable))
		if(direction == "left"){
			this.inventoryScroll -= speed;
			if(this.inventoryScroll < 0){
				this.inventoryScroll = 0;
			}
		} else if(direction == "right"){
			this.inventoryScroll += speed;
			if(this.inventoryScroll > maxSize){
				this.inventoryScroll = maxSize;
			}
		} else {
			throw new Error("can't scroll " + direction.toString);
		}
	}
	gameLoop(){
		var interval = 1000/this.fps;
		var now = Date.now();
		//console.log(this);
		var events = []
		while(this.lastRendered < now){
			events.push(this.game.tick(this.mouseX, this.mouseY, this.mouseDown));
			this.lastRendered += interval;
		}
		this.update(events);
		// check if we won
		if(this.game.completedMonsters.has(this.game.gameData.finalRoom) && this.setWin == false){
			this.setWin = true;
			setTimeout(() => this.win(Math.floor(Date.now() - this.game.startTime)/1000, this.game.sort, this.game.times), 1000);
		}			
		if(this.inventoryScrollDirection != undefined){
			this.inventoryScrollFn(this.inventoryScrollDirection, 5);
		}
	}
	componentWillUnmount(){
		clearInterval(this.interval_);
	}
}

export default GameDisplay;


/*

def struct(name, items):
	print("class " + name + "{")
	print("    constructor(" + ",".join(items) + "){")
	for i in items:
		print("        this."+i+" = " + i)
	print("    }")
	print("}")
	print("export default " + name)
*/