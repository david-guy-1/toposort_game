import React from 'react';
import * as d from "./canvasDrawing.js";
import game from "./game.js";
import * as l from "./lines.js"
//import data1 from "./data.js";
import {getImage} from "./compile.js";
import dag from "./dag.js";
import processString from "./processString.js";
import {keyItems, miscItems} from "./itemPool.js";
import * as anim from "./animations.js";
import draw from "./process_draws.js"
import _ from "lodash";
// tentative name : The Cave Rescue Adventure

class GameDisplay extends React.Component {
	constructor(props){
		super(props);
		// props is dag and game (game is gameData object)
		this.state = {text_ : ""};
		console.log(keyItems.length);
		this.lowerCanvas = React.createRef();
		this.upperCanvas = React.createRef();
		this.itemCanvas = React.createRef();
		this.particleCanvas = React.createRef();
		this.playerCanvas = React.createRef();
		this.topCanvas = React.createRef();
		this.inventoryCanvas = React.createRef();
		this.mapCanvas = React.createRef();
		
		this.lastRendered = Date.now();
		this.fps = 40;
		//var dagA = new dag([1,2,3,4,5, 6,"x1", "x2", "x3","z"], [[1,2],[1,3],[2,3],[3,4],[2,5],[3,5],["x1","x2"], ["x2","4"], [2,"x3"], ["x3","6"], [5, 6], [4, "z"], [6,"z"]])
		
		//console.log(dagA.output());
		//console.log(dagA.toposort().toString());
		//window.dag = dagA;
		//this.game = new game(compile(dagA, 3));
		
		this.dag_ = this.props.dag;
		this.game = this.props.game;
		this.maps = this.props.maps;
		this.portalRooms = this.props.portalRooms;
		this.back = this.props.back;
		this.win = this.props.win;
		this.setMusic = this.props.setMusic
		this.music = undefined;
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
		this.lastDisplayedItems = Date.now();
		this.showMap = true; 
		this.animations = [];
		
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
		<img style={{position:"absolute", top:0, left:0, zIndex:-1}} src="./images/game_background.png"/> 
			
		<div id="seed" style={{position:"absolute", top:10, left:40, zIndex:0, width:950}} ref={this.topCanvas}>{`seed:"${this.props.seed}" size:${this.props.size} ` }</div>
			
		<div id="topCanvas" style={{position:"absolute", top:30, left:30, zIndex:0, width:940}} ref={this.topCanvas}>{this.state.text_}</div>
		
		
		<canvas width={990} height={600} id="lowerCanvas" style={{position:"absolute", top:80, left:0, zIndex:0}} ref={this.lowerCanvas}/>
		<canvas width={990} height={600} id="upperCanvas" style={{position:"absolute", top:80, left:0, zIndex:1, border:"1px solid black"}}ref={this.upperCanvas}/>
		<canvas width={990} height={600} id="particleCanvas" style={{position:"absolute", top:80, left:0, zIndex:1, border:"1px solid black"}}ref={this.particleCanvas}/>
		<canvas width={990} height={600} id="playerCanvas" style={{position:"absolute", top:80, left:0, zIndex:2, border:"1px solid black"}}ref={this.playerCanvas}/>
		<canvas width={90} height={600} id="itemCanvas" style={{position:"absolute", top:80, left:1005, zIndex:2}} ref={this.itemCanvas}/>
		<canvas width={80} height={80} id="mapCanvas" style={{position:"absolute", top:80, left:910, zIndex:3, border:"1px solid black", display : this.showMap ? "" : "none"}}ref={this.mapCanvas}/>

		<canvas width={720} height={45} ref={this.inventoryCanvas} onMouseMove = {this.mouseOverInv} id="inventoryCanvas" style={{position:"absolute", top:690, left:70,  border:"1px solid black", zIndex:0}} />
		
		<img src="./images/scroll_left.png" onMouseOver = {function(){this.inventoryScrollDirection="left"}.bind(this)} onMouseOut = {function(){this.inventoryScrollDirection=undefined}.bind(this)} id="scrollLeft" style={{position:"absolute", top:690, left:20,  border:"1px solid black", zIndex:0}} />
		
		<img src="./images/scroll_right.png" onMouseOver = {function(){this.inventoryScrollDirection="right"}.bind(this)} onMouseOut = {function(){this.inventoryScrollDirection=undefined}.bind(this)} id="scrollRight" style={{position:"absolute", top:690, left:800,  border:"1px solid black", zIndex:0}} />

		
		<button  onClick={this.back} id="backButton" style={{position:"absolute", top:690, left:850, width:100 ,height:20 ,border:"1px solid black", zIndex:0}}>Back</button>
		<button  onClick={this.hint} id="backButton" style={{position:"absolute", top:710, left:850, width:100 ,height:20 ,border:"1px solid black", zIndex:0}}>I'm stuck</button>
		<button  onClick={function(){this.showMap = !this.showMap; this.forceUpdate()}.bind(this)} id="backButton" style={{position:"absolute", top:730, left:850, width:100 ,height:20 ,border:"1px solid black", zIndex:0}}>Toggle map</button>
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
   	displayItems(lst){

		var now = Date.now();
		if(now - this.lastDisplayedItems  < 100){
			return;
		}
		var ic2 = this.itemCanvas.current.getContext("2d");
		ic2.clearRect(0,0,1000,1000);
		
		var inventoryNames = [...this.game.inventory].map((x) => x[0]);
		this.lastDisplayedItems = now; 
		var drawY = 10; 
		for(var item of lst){
			var itemPath = keyItems[item] == undefined ? getImage({"type":"misc", "image":miscItems[item].image})  : getImage({"type":"key", "image":keyItems[item].image}); 
			d.drawImage(ic2 ,itemPath, 5, drawY);
			if(inventoryNames.indexOf(item) !== -1){
				d.drawImage(ic2,"./images/checkmark.png", 50, drawY);
			}
			drawY += 50;
		}
	}
	
	update(events){
		/* eventList is an array of objects
		items -> list of items
		entitiesActivated -> list of entities
		entitiesFailed -> list of entities
		npcChat -> list of strings (what npcs have said)
		monstersAttacked -> list of numbers (indices of attacked monsters)
		monstersFailed -> list of numbers (indices of monsters failed to attack)
		dropped -> boolean (if monster dropped)
		newRoom -> new room (if applicable)
		*/		
		var now = Date.now();
		var pc = this.playerCanvas.current.getContext("2d");
		var uc = this.upperCanvas.current.getContext("2d");
		var lc = this.lowerCanvas.current.getContext("2d");
		var ic = this.inventoryCanvas.current.getContext("2d");
		var mc = this.mapCanvas.current.getContext("2d");
		var pac = this.particleCanvas.current.getContext("2d");
		var ic2 = this.itemCanvas.current.getContext("2d");
		// clear everything
		pc.clearRect(0,0,1000,1000);
		uc.clearRect(0,0,1000,1000);
		if(now - this.lastDisplayedItems  > 2000){
			ic2.clearRect(0,0,1000,1000);
		}
		var level = this.game.getLevel();
		//this.displayText("abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcd")
//d.drawImage(uc,"./images/green_potion.png", 400, 400);
	
		//draw the player
		//sizes are 40x80 not attacking, and 80x80 attacking
		
		if(level.facingDirection == "left" && this.mouseDown == false){
			d.drawImage(pc, "./images/player_l.png", level.x - 20, level.y - 40) 
		} else if(level.facingDirection == "left" && this.mouseDown == true){
			d.drawImage(pc, "./images/player_l_attack.png", level.x - 60, level.y - 40) 
		} else if(level.facingDirection == "right" && this.mouseDown == false){
			d.drawImage(pc, "./images/player_r.png", level.x - 20, level.y - 40) 
		} else if(level.facingDirection == "right" && this.mouseDown == true){
			d.drawImage(pc, "./images/player_r_attack.png", level.x - 20, level.y - 40) 
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
					d.drawImage(uc, item.monster.img[1], item.x, item.y);
				} else {
					d.drawImage(uc, item.monster.img[0], item.x, item.y);
				}
				
			}
		}
		//draw the entities
		for(var item of level.entities){
				d.drawImage(uc, item.img, item.tlx, item.tly);
		}		
		// important: draw image AFTER drawing monsters and entities
		//draw the imgs
		for(var item of level.imgs){
			if(item.whenDraw != "always"){
				if(this.game.meetRequirements(item.reqs) == (item.whenDraw == "met")){
					d.drawImage(uc, item.img, item.x, item.y);
				}
			} else {
				d.drawImage(uc, item.img, item.x, item.y);
			}
				
		}		

		//draw the imgs
	//	console.log(level.reqImgs);
		for(var item of level.reqImgs){
			for(var check of item.data){
				if(this.game.meetRequirements(check.requirements)){
					d.drawImage(uc, check.image, item.x, item.y);
					break;
				}
			}
		}		
		
		//draw the items (important: at the very end);
		for(var item of this.game.getLevel().items){
			d.drawImage(uc, item.image, item.x,item.y); 
			d.drawRectangle2(uc, item.x, item.y, 40, 40, "red", 2);
		}		

		
		//draw the background;
		if(this.currentRoom != this.game.getLocation()){
			this.currentRoom = this.game.getLocation();
			var lc = this.lowerCanvas.current.getContext("2d");
			lc.clearRect(0,0,1000,1000);
			d.drawImage(lc, level.background, 0, 0);
		}

		// draw the map 
		for(var event_ of events){
			if(event_.newRoom !== undefined){
				// draw only if we go to a new room . 
				var mapCoords = [80, 80]
				var roomObj  =this.game.gameData.rooms[this.currentRoom];
				if(roomObj.map !== undefined){
					var thisMap = this.maps[roomObj.map];
					// first coord is left/right, second is up/down 
					d.drawRectangle(mc, 0, 0, mapCoords[0], mapCoords[1], "black",1, true);
					var size = [mapCoords[0] / thisMap.size[0],mapCoords[1] / thisMap.size[1]] 
					for(var i=0; i < thisMap.size[0]; i++){
						for(var j=0 ; j < thisMap.size[1]; j++){
							var drawName = thisMap.rooms[`${i} ${j}`];
							var color = "#333333"
							// if it's undefined, this is an unreachable room, does not exist in gameData
							if(drawName !== undefined){
								// portal
								if(this.portalRooms.has(drawName)){
									color = "#a032a8";
								}
								
								// incomplete room
								if(!this.game.isRoomCompleted(drawName)){
									color = "#519e3c";
								}

								// current room
								if(this.currentRoom == drawName){
									color = "#aa3333";
								}
							}

		
							// unfinished rooms 
							// entities are portal, npc or chest
							// also monsters and items
		
							d.drawRectangle2(mc, size[0]*i, size[1]*j, size[0]-4, size[1]-4, color, 1, true);
						}
					}
					// walls
					for(var wall of thisMap.maze){
						var wallX = size[0] * (wall[0]+1)
						var wallY = size[1] * (wall[1]+1) 
						if(wall[2] == "right"){
							d.drawLine(mc, wallX, wallY - size[1] , wallX , wallY, "#756b44",4)
						} else {
							d.drawLine(mc, wallX-size[0], wallY  , wallX , wallY, "#756b44", 4)
							
						}
						
					}
				}
		
			}
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
				this.displayItems(item.reqs);
			}
			for(var item of event_.npcChat){
				this.displayText(item)
			}
			if(event_.npcShowItems.length != 0){
				this.displayItems(event_.npcShowItems)
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
					d.drawImage(pc, "./images/glow_left.png", level.x - 60, level.y - 40) 
				}
				if(level.facingDirection == "right"){
					d.drawImage(pc, "./images/glow_right.png", level.x - 20, level.y - 40) 
				}
				
			}
			for(var index of event_.monstersFailed){
				var item = this.game.getLevel().monsters[index]
				if(item != undefined){
					this.displayText(processString(item.displayString, item.reqs))
					this.displayItems(item.reqs);
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
			
			d.drawImage(ic, item[1], 40*this.invNames.indexOf(item[0])-this.inventoryScroll, 0)
		}
		// update music
		if(this.music != level.music){
			this.music = level.music;
			this.setMusic(level.music);
		}
		// finally do animations
		var lst = [];
		for(var event_ of events){
			if(event_.itemsAdded.length != 0){ // entities
				anim.spawn_stars(this.animations, level.x, level.y);
			}
			if(event_["dropped"] == true) { // enemy
				for(var i=0; i<100; i++){
					anim.spawn_circle(this.animations, level.x, level.y, "hsl("+ Math.random() * 360 + ", 100%, 90%)", 7, 150)
				}
			} 
		}
		var portals = [...level.entities].filter((x) => x.type == "portal" && x.isEdgeWall == false && x.name != "root portal");
		for(var portal of portals){
			var isOpen = this.game.meetRequirements(portal.reqs);
			if(isOpen){
				anim.spawn_circle(this.animations, (portal.brx-portal.tlx)/2 + portal.tlx, (portal.bry-portal.tly)/2 + portal.tly)
			}
		}
		anim.add_drawings(lst, this.animations);
		pac.clearRect(0, 0, 1000, 1000);
		draw(lst, pac);

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
			anim.update_all(this.animations);
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