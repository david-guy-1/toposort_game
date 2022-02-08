// root is images

/*

list of things a theme should contain:

name

background image

wall and door images for all 4 directions

list of decoration images

list of blocking decorations : list of images, and list of walls. bounding box is 100x100

list of non-item entities that can spawn here (chest, monster category, npc)

description for hint strings. "the <item> is in <description>"

---

theme should also contain a "background color". the item pool contains data about colors. They must not match so the item doesn't blend in with the background. 

monster "categories" needed. 

chest and npc items can be shared between themes.

*/

// returns a list of walls given the corners
function wallFromCorners(corners){
	var walls = []
	for(var i=0; i<corners.length-1; i++){
			walls.push([corners[i][0],corners[i][1],corners[i+1][0],corners[i+1][1]]);
	}
	var n = corners.length;
	walls.push([corners[n-1][0], corners[n-1][1], corners[0][0], corners[0][1]]);
	return walls;
	
}
export var themeData = {
	"cave":{
		"name":"cave",
		"description":"a muddy cave",
		"background":"themes/cave/cave.png",
		"bgColor":"brown",
		"wallImgString":{left:["themes/cave/cave_wall_l.png"],right:["themes/cave/cave_wall_r.png"],up:["themes/cave/cave_wall_u.png"],down:["themes/cave/cave_wall_d.png"]},
		
		"decorations":["themes/cave/mud_puddle.png", "themes/cave/rock.png"],
		
		// blockingDecorations is a list. each item in the list is an object with keys "images" and "walls"
		// "images" -> triples : xshift, yshift, image
		// walls -> quadruples[x1, y1, x2, y2]
		// must fit in 100x100 bounding block
		"blockingDecorations" :[
		{"images" : 
			[[10, 10, "themes/cave/stone.png"]],
		 "walls" : wallFromCorners([[7,15],[33,2],[56,3],[61,37],[53,72],[5,75],[16,35]])
		}, {
			"images":[[0, 0, "themes/cave/dirt_mound.png"]],
			"walls":wallFromCorners([[10,52],[24,20],[42,12],[60,18],[71,59],[41,67],[22,66]])
		}
		],		
		
		
		"chests":[],
		"monsters":[],
		"npcs":[],
		"portals":[],
		
		
	},

	"chaos":{
		"name":"chaos",
		"description":"a twisted world",
		"background":"themes/chaos/chaos.png",
		"bgColor":"purple",
		"wallImgString":{left:["themes/chaos/chaos_wall_l.png"],right:["themes/chaos/chaos_wall_r.png"],up:["themes/chaos/chaos_wall_u.png"],down:["themes/chaos/chaos_wall_d.png"]},

		"decorations":["themes/chaos/blister.png","themes/chaos/black_hole.png"],
		
		"blockingDecorations" :[{
			"images":[[0, 0,"themes/chaos/chaos_line.png"]],
			"walls":wallFromCorners([[12,20],[22,10],[54,7],[60,52],[41,73],[8,69],[40,59],[41,20]])
		}],		
		
		"chests":[],
		"monsters":[],
		"npcs":[],
		"portals":[],
		
		
	},
	
	"swamp":{
		"name":"swamp",
		"description":"a dangerous swamp",
		"background":"themes/swamp/swamp.png",
		"bgColor":"green",
		"wallImgString":{left:["themes/swamp/swamp_wall_l.png"],right:["themes/swamp/swamp_wall_r.png"],up:["themes/swamp/swamp_wall_u.png"],down:["themes/swamp/swamp_wall_d.png"]},

		"decorations":["themes/swamp/grass.png","themes/swamp/puddle.png"],
		
		"blockingDecorations" :[],		
		
		"chests":[],
		"monsters":[],
		"npcs":[],
		"portals":[],
		
		
	},
	
	
	"icy":{
		"name":"icy",
		"description":"an icy cavern",
		"background":"themes/icy/icy.png",
		"bgColor":"cyan",
		"wallImgString":{left:["themes/icy/icy_wall_l.png"],right:["themes/icy/icy_wall_r.png"],up:["themes/icy/icy_wall_u.png"],down:["themes/icy/icy_wall_d.png"]},
		
		"decorations":["themes/icy/snow_mound.png","themes/icy/blue_fire.png"],
		"blockingDecorations" :[{
			"images":[[0, 0,"themes/icy/ice_crack.png"]],
			"walls":wallFromCorners([[16,10],[25,37],[10,64],[40,50],[67,75],[71,36]])
		}],		
		
		
		"chests":[],
		"monsters":[],
		"npcs":[],
		"portals":[],
		
		
	},


	"volcano":{
		"name":"volcano",
		"description":"a fiery volcano",
		"background":"themes/volcano/volcano.png",
		"bgColor":"red",
		"wallImgString":{left:["themes/volcano/volcano_wall_l.png"],right:["themes/volcano/volcano_wall_r.png"],up:["themes/volcano/volcano_wall_u.png"],down:["themes/volcano/volcano_wall_d.png"]},
		
		"decorations":["themes/volcano/rock.png","themes/volcano/red_blob.png"],
		"blockingDecorations" :[{
			"images":[[0, 0,"themes/volcano/lava_pool.png"]],
			"walls":wallFromCorners([[4,71],[33,11],[61,3],[92,46],[90,84],[87,90],[49,91]])
		}],		
		
		
		"chests":[],
		"monsters":[],
		"npcs":[],
		"portals":[],
		
		
	},
	
	"space":{
		"name":"space",
		"description":"a cosmic void",
		"background":"themes/space/space.png",
		"bgColor":"black",
		"wallImgString":{left:["themes/space/space_wall_l.png"],right:["themes/space/space_wall_r.png"],up:["themes/space/space_wall_u.png"],down:["themes/space/space_wall_d.png"]},
		
		"decorations":["themes/space/planet.png","themes/space/star.png"],
		"blockingDecorations" :[],		
		
		
		"chests":[],
		"monsters":[],
		"npcs":[],
		"portals":[],
		
		
	},
}

/*
blank theme data:

	"":{
		"name":"",
		"background":"",
		"bgColor":"",
		"wallImgString":{left:"",right:"",up:"",down:""},
		"wallImgDoor": {left:"",right:"",up:"",down:""},
		"decorations":[""],
		
		"blockingDecorations" :[
		{"images" : 
			[],
		 "walls" : wallFromCorners([])
		}
		],		
		
		"chests":[],
		"monsters":[],
		"npcs":[],
		"portals":[],
		
		
	}
	
	
*/


/*
rules :

7 themes

each theme must have 2 decorations , 1 blocking decoration, (maybe) 2 npcs, and 1 portal.
*/
export default themeData;