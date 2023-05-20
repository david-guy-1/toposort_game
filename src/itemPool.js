import {choice} from "./random.js";
import {loadImage} from "./canvasDrawing.js";
import {themeData} from "./themeData.js";
// CTRL-F waypoint
// root for images are:

/*
for keys, swordUp, miscItems : images/items
for monsters: images/monsters
for chests : images/chests
for npcs : images/npcs
for portals : images/portals

root is handled in getImage function , don't need to handle it anywhere else 
*/
//waypoint
var usedItems = new Set()

//name, image, subtype1 (possibly), subtype2 (possibly), color (possibly) (cannot match theme's background color)

// non-items must also have a "width" and "height"

// monsters must also have a "speed"


//waypoint keyItems
export var keyItems = {
 "blue key" : { 
                "name" : "blue key" , 
                "image" : "key_blue_key.png",
                "subtype1" : "key",
                "subtype2" : "key",
                "color": "blue"
                 },

                
 "blue magic key" : { 
                "name" : "blue magic key" , 
                "image" : "key_blue_magic key.png",
                "subtype1" : "key",
                "subtype2" : "magic key",
                "color": "blue"
                 },

                
 "blue spiked key" : { 
                "name" : "blue spiked key" , 
                "image" : "key_blue_spiked key.png",
                "subtype1" : "key",
                "subtype2" : "spiked key",
                "color": "blue"
                 },

                
 "blue triangle key" : { 
                "name" : "blue triangle key" , 
                "image" : "key_blue_triangle key.png",
                "subtype1" : "key",
                "subtype2" : "triangle key",
                "color": "blue"
                 },

                
 "green key" : { 
                "name" : "green key" , 
                "image" : "key_green_key.png",
                "subtype1" : "key",
                "subtype2" : "key",
                "color": "green"
                 },

                
 "green magic key" : { 
                "name" : "green magic key" , 
                "image" : "key_green_magic key.png",
                "subtype1" : "key",
                "subtype2" : "magic key",
                "color": "green"
                 },

                
 "green spiked key" : { 
                "name" : "green spiked key" , 
                "image" : "key_green_spiked key.png",
                "subtype1" : "key",
                "subtype2" : "spiked key",
                "color": "green"
                 },

                
 "green triangle key" : { 
                "name" : "green triangle key" , 
                "image" : "key_green_triangle key.png",
                "subtype1" : "key",
                "subtype2" : "triangle key",
                "color": "green"
                 },

                
 "red key" : { 
                "name" : "red key" , 
                "image" : "key_red_key.png",
                "subtype1" : "key",
                "subtype2" : "key",
                "color": "red"
                 },

                
 "red magic key" : { 
                "name" : "red magic key" , 
                "image" : "key_red_magic key.png",
                "subtype1" : "key",
                "subtype2" : "magic key",
                "color": "red"
                 },

                
 "red spiked key" : { 
                "name" : "red spiked key" , 
                "image" : "key_red_spiked key.png",
                "subtype1" : "key",
                "subtype2" : "spiked key",
                "color": "red"
                 },

                
 "red triangle key" : { 
                "name" : "red triangle key" , 
                "image" : "key_red_triangle key.png",
                "subtype1" : "key",
                "subtype2" : "triangle key",
                "color": "red"
                 },

                
 "purple key" : { 
                "name" : "purple key" , 
                "image" : "key_purple_key.png",
                "subtype1" : "key",
                "subtype2" : "key",
                "color": "purple"
                 },

                
 "purple magic key" : { 
                "name" : "purple magic key" , 
                "image" : "key_purple_magic key.png",
                "subtype1" : "key",
                "subtype2" : "magic key",
                "color": "purple"
                 },

                
 "purple spiked key" : { 
                "name" : "purple spiked key" , 
                "image" : "key_purple_spiked key.png",
                "subtype1" : "key",
                "subtype2" : "spiked key",
                "color": "purple"
                 },

                
 "purple triangle key" : { 
                "name" : "purple triangle key" , 
                "image" : "key_purple_triangle key.png",
                "subtype1" : "key",
                "subtype2" : "triangle key",
                "color": "purple"
                 },

                
 "cyan key" : { 
                "name" : "cyan key" , 
                "image" : "key_cyan_key.png",
                "subtype1" : "key",
                "subtype2" : "key",
                "color": "cyan"
                 },

                
 "cyan magic key" : { 
                "name" : "cyan magic key" , 
                "image" : "key_cyan_magic key.png",
                "subtype1" : "key",
                "subtype2" : "magic key",
                "color": "cyan"
                 },

                
 "cyan spiked key" : { 
                "name" : "cyan spiked key" , 
                "image" : "key_cyan_spiked key.png",
                "subtype1" : "key",
                "subtype2" : "spiked key",
                "color": "cyan"
                 },

                
 "cyan triangle key" : { 
                "name" : "cyan triangle key" , 
                "image" : "key_cyan_triangle key.png",
                "subtype1" : "key",
                "subtype2" : "triangle key",
                "color": "cyan"
                 },

                
 "yellow key" : { 
                "name" : "yellow key" , 
                "image" : "key_yellow_key.png",
                "subtype1" : "key",
                "subtype2" : "key",
                "color": "yellow"
                 },

                
 "yellow magic key" : { 
                "name" : "yellow magic key" , 
                "image" : "key_yellow_magic key.png",
                "subtype1" : "key",
                "subtype2" : "magic key",
                "color": "yellow"
                 },

                
 "yellow spiked key" : { 
                "name" : "yellow spiked key" , 
                "image" : "key_yellow_spiked key.png",
                "subtype1" : "key",
                "subtype2" : "spiked key",
                "color": "yellow"
                 },

                
 "yellow triangle key" : { 
                "name" : "yellow triangle key" , 
                "image" : "key_yellow_triangle key.png",
                "subtype1" : "key",
                "subtype2" : "triangle key",
                "color": "yellow"
                 },

                
 "silver key" : { 
                "name" : "silver key" , 
                "image" : "key_silver_key.png",
                "subtype1" : "key",
                "subtype2" : "key",
                "color": "silver"
                 },

                
 "silver magic key" : { 
                "name" : "silver magic key" , 
                "image" : "key_silver_magic key.png",
                "subtype1" : "key",
                "subtype2" : "magic key",
                "color": "silver"
                 },

                
 "silver spiked key" : { 
                "name" : "silver spiked key" , 
                "image" : "key_silver_spiked key.png",
                "subtype1" : "key",
                "subtype2" : "spiked key",
                "color": "silver"
                 },

                
 "silver triangle key" : { 
                "name" : "silver triangle key" , 
                "image" : "key_silver_triangle key.png",
                "subtype1" : "key",
                "subtype2" : "triangle key",
                "color": "silver"
                 },
				 
}

//waypoint miscItems
export var miscItems = {


 "blue orb with dagger" : { 
                "name" : "blue orb with dagger" , 
                "image" : "orb_blue_dagger.png",
                "subtype1" : "orb",
                "subtype2" : "dagger",
                "color": "blue"
                 },

                
 "blue orb with gem" : { 
                "name" : "blue orb with gem" , 
                "image" : "orb_blue_gem.png",
                "subtype1" : "orb",
                "subtype2" : "gem",
                "color": "blue"
                 },

                
 "blue orb with flame" : { 
                "name" : "blue orb with flame" , 
                "image" : "orb_blue_flame.png",
                "subtype1" : "orb",
                "subtype2" : "flame",
                "color": "blue"
                 },

                
 "blue orb with ghost" : { 
                "name" : "blue orb with ghost" , 
                "image" : "orb_blue_ghost.png",
                "subtype1" : "orb",
                "subtype2" : "ghost",
                "color": "blue"
                 },

                
 "blue orb with explosion" : { 
                "name" : "blue orb with explosion" , 
                "image" : "orb_blue_explosion.png",
                "subtype1" : "orb",
                "subtype2" : "explosion",
                "color": "blue"
                 },

                
 "blue orb with leaf" : { 
                "name" : "blue orb with leaf" , 
                "image" : "orb_blue_leaf.png",
                "subtype1" : "orb",
                "subtype2" : "leaf",
                "color": "blue"
                 },

                
 "blue orb with bomb" : { 
                "name" : "blue orb with bomb" , 
                "image" : "orb_blue_bomb.png",
                "subtype1" : "orb",
                "subtype2" : "bomb",
                "color": "blue"
                 },

                
 "green orb with dagger" : { 
                "name" : "green orb with dagger" , 
                "image" : "orb_green_dagger.png",
                "subtype1" : "orb",
                "subtype2" : "dagger",
                "color": "green"
                 },

                
 "green orb with gem" : { 
                "name" : "green orb with gem" , 
                "image" : "orb_green_gem.png",
                "subtype1" : "orb",
                "subtype2" : "gem",
                "color": "green"
                 },

                
 "green orb with flame" : { 
                "name" : "green orb with flame" , 
                "image" : "orb_green_flame.png",
                "subtype1" : "orb",
                "subtype2" : "flame",
                "color": "green"
                 },

                
 "green orb with ghost" : { 
                "name" : "green orb with ghost" , 
                "image" : "orb_green_ghost.png",
                "subtype1" : "orb",
                "subtype2" : "ghost",
                "color": "green"
                 },

                
 "green orb with explosion" : { 
                "name" : "green orb with explosion" , 
                "image" : "orb_green_explosion.png",
                "subtype1" : "orb",
                "subtype2" : "explosion",
                "color": "green"
                 },

                
 "green orb with bomb" : { 
                "name" : "green orb with bomb" , 
                "image" : "orb_green_bomb.png",
                "subtype1" : "orb",
                "subtype2" : "bomb",
                "color": "green"
                 },

                
 "red orb with dagger" : { 
                "name" : "red orb with dagger" , 
                "image" : "orb_red_dagger.png",
                "subtype1" : "orb",
                "subtype2" : "dagger",
                "color": "red"
                 },

                
 "red orb with gem" : { 
                "name" : "red orb with gem" , 
                "image" : "orb_red_gem.png",
                "subtype1" : "orb",
                "subtype2" : "gem",
                "color": "red"
                 },

                
 "red orb with ghost" : { 
                "name" : "red orb with ghost" , 
                "image" : "orb_red_ghost.png",
                "subtype1" : "orb",
                "subtype2" : "ghost",
                "color": "red"
                 },

                
 "red orb with leaf" : { 
                "name" : "red orb with leaf" , 
                "image" : "orb_red_leaf.png",
                "subtype1" : "orb",
                "subtype2" : "leaf",
                "color": "red"
                 },

                
 "red orb with bomb" : { 
                "name" : "red orb with bomb" , 
                "image" : "orb_red_bomb.png",
                "subtype1" : "orb",
                "subtype2" : "bomb",
                "color": "red"
                 },

                
 "purple orb with dagger" : { 
                "name" : "purple orb with dagger" , 
                "image" : "orb_purple_dagger.png",
                "subtype1" : "orb",
                "subtype2" : "dagger",
                "color": "purple"
                 },

                
 "purple orb with gem" : { 
                "name" : "purple orb with gem" , 
                "image" : "orb_purple_gem.png",
                "subtype1" : "orb",
                "subtype2" : "gem",
                "color": "purple"
                 },

                
 "purple orb with flame" : { 
                "name" : "purple orb with flame" , 
                "image" : "orb_purple_flame.png",
                "subtype1" : "orb",
                "subtype2" : "flame",
                "color": "purple"
                 },

                
 "purple orb with ghost" : { 
                "name" : "purple orb with ghost" , 
                "image" : "orb_purple_ghost.png",
                "subtype1" : "orb",
                "subtype2" : "ghost",
                "color": "purple"
                 },

                
 "purple orb with explosion" : { 
                "name" : "purple orb with explosion" , 
                "image" : "orb_purple_explosion.png",
                "subtype1" : "orb",
                "subtype2" : "explosion",
                "color": "purple"
                 },

                
 "purple orb with leaf" : { 
                "name" : "purple orb with leaf" , 
                "image" : "orb_purple_leaf.png",
                "subtype1" : "orb",
                "subtype2" : "leaf",
                "color": "purple"
                 },

                
 "purple orb with bomb" : { 
                "name" : "purple orb with bomb" , 
                "image" : "orb_purple_bomb.png",
                "subtype1" : "orb",
                "subtype2" : "bomb",
                "color": "purple"
                 },

                
 "cyan orb with dagger" : { 
                "name" : "cyan orb with dagger" , 
                "image" : "orb_cyan_dagger.png",
                "subtype1" : "orb",
                "subtype2" : "dagger",
                "color": "cyan"
                 },

                
 "cyan orb with gem" : { 
                "name" : "cyan orb with gem" , 
                "image" : "orb_cyan_gem.png",
                "subtype1" : "orb",
                "subtype2" : "gem",
                "color": "cyan"
                 },

                
 "cyan orb with flame" : { 
                "name" : "cyan orb with flame" , 
                "image" : "orb_cyan_flame.png",
                "subtype1" : "orb",
                "subtype2" : "flame",
                "color": "cyan"
                 },

                
 "cyan orb with ghost" : { 
                "name" : "cyan orb with ghost" , 
                "image" : "orb_cyan_ghost.png",
                "subtype1" : "orb",
                "subtype2" : "ghost",
                "color": "cyan"
                 },

                
 "cyan orb with explosion" : { 
                "name" : "cyan orb with explosion" , 
                "image" : "orb_cyan_explosion.png",
                "subtype1" : "orb",
                "subtype2" : "explosion",
                "color": "cyan"
                 },

                
 "cyan orb with leaf" : { 
                "name" : "cyan orb with leaf" , 
                "image" : "orb_cyan_leaf.png",
                "subtype1" : "orb",
                "subtype2" : "leaf",
                "color": "cyan"
                 },

                
 "cyan orb with bomb" : { 
                "name" : "cyan orb with bomb" , 
                "image" : "orb_cyan_bomb.png",
                "subtype1" : "orb",
                "subtype2" : "bomb",
                "color": "cyan"
                 },

                
 "yellow orb with dagger" : { 
                "name" : "yellow orb with dagger" , 
                "image" : "orb_yellow_dagger.png",
                "subtype1" : "orb",
                "subtype2" : "dagger",
                "color": "yellow"
                 },

                
 "yellow orb with gem" : { 
                "name" : "yellow orb with gem" , 
                "image" : "orb_yellow_gem.png",
                "subtype1" : "orb",
                "subtype2" : "gem",
                "color": "yellow"
                 },

                
 "yellow orb with flame" : { 
                "name" : "yellow orb with flame" , 
                "image" : "orb_yellow_flame.png",
                "subtype1" : "orb",
                "subtype2" : "flame",
                "color": "yellow"
                 },

                
 "yellow orb with ghost" : { 
                "name" : "yellow orb with ghost" , 
                "image" : "orb_yellow_ghost.png",
                "subtype1" : "orb",
                "subtype2" : "ghost",
                "color": "yellow"
                 },

                
 "yellow orb with explosion" : { 
                "name" : "yellow orb with explosion" , 
                "image" : "orb_yellow_explosion.png",
                "subtype1" : "orb",
                "subtype2" : "explosion",
                "color": "yellow"
                 },

                
 "yellow orb with leaf" : { 
                "name" : "yellow orb with leaf" , 
                "image" : "orb_yellow_leaf.png",
                "subtype1" : "orb",
                "subtype2" : "leaf",
                "color": "yellow"
                 },

                
 "yellow orb with bomb" : { 
                "name" : "yellow orb with bomb" , 
                "image" : "orb_yellow_bomb.png",
                "subtype1" : "orb",
                "subtype2" : "bomb",
                "color": "yellow"
                 },

                
 "silver orb with dagger" : { 
                "name" : "silver orb with dagger" , 
                "image" : "orb_silver_dagger.png",
                "subtype1" : "orb",
                "subtype2" : "dagger",
                "color": "silver"
                 },

                
 "silver orb with gem" : { 
                "name" : "silver orb with gem" , 
                "image" : "orb_silver_gem.png",
                "subtype1" : "orb",
                "subtype2" : "gem",
                "color": "silver"
                 },

                
 "silver orb with flame" : { 
                "name" : "silver orb with flame" , 
                "image" : "orb_silver_flame.png",
                "subtype1" : "orb",
                "subtype2" : "flame",
                "color": "silver"
                 },

                
 "silver orb with ghost" : { 
                "name" : "silver orb with ghost" , 
                "image" : "orb_silver_ghost.png",
                "subtype1" : "orb",
                "subtype2" : "ghost",
                "color": "silver"
                 },

                
 "silver orb with explosion" : { 
                "name" : "silver orb with explosion" , 
                "image" : "orb_silver_explosion.png",
                "subtype1" : "orb",
                "subtype2" : "explosion",
                "color": "silver"
                 },

                
 "silver orb with leaf" : { 
                "name" : "silver orb with leaf" , 
                "image" : "orb_silver_leaf.png",
                "subtype1" : "orb",
                "subtype2" : "leaf",
                "color": "silver"
                 },

                
 "silver orb with bomb" : { 
                "name" : "silver orb with bomb" , 
                "image" : "orb_silver_bomb.png",
                "subtype1" : "orb",
                "subtype2" : "bomb",
                "color": "silver"
                 },
				 
				 
 "red ring with blue gem" : { 
                "name" : "red ring with blue gem" , 
                "image" : "ring_blue_red.png",
                "subtype1" : "ring",
                "subtype2" : "blue",
                "color": "red"
                 },

                
 "silver ring with blue gem" : { 
                "name" : "silver ring with blue gem" , 
                "image" : "ring_blue_silver.png",
                "subtype1" : "ring",
                "subtype2" : "blue",
                "color": "silver"
                 },

                
 "yellow ring with blue gem" : { 
                "name" : "yellow ring with blue gem" , 
                "image" : "ring_blue_yellow.png",
                "subtype1" : "ring",
                "subtype2" : "blue",
                "color": "yellow"
                 },

                
 "black ring with blue gem" : { 
                "name" : "black ring with blue gem" , 
                "image" : "ring_blue_black.png",
                "subtype1" : "ring",
                "subtype2" : "blue",
                "color": "black"
                 },

                
 "cyan ring with blue gem" : { 
                "name" : "cyan ring with blue gem" , 
                "image" : "ring_blue_cyan.png",
                "subtype1" : "ring",
                "subtype2" : "blue",
                "color": "cyan"
                 },

                
 "red ring with green gem" : { 
                "name" : "red ring with green gem" , 
                "image" : "ring_green_red.png",
                "subtype1" : "ring",
                "subtype2" : "green",
                "color": "red"
                 },

                
 "silver ring with green gem" : { 
                "name" : "silver ring with green gem" , 
                "image" : "ring_green_silver.png",
                "subtype1" : "ring",
                "subtype2" : "green",
                "color": "silver"
                 },

                
 "yellow ring with green gem" : { 
                "name" : "yellow ring with green gem" , 
                "image" : "ring_green_yellow.png",
                "subtype1" : "ring",
                "subtype2" : "green",
                "color": "yellow"
                 },

                
 "black ring with green gem" : { 
                "name" : "black ring with green gem" , 
                "image" : "ring_green_black.png",
                "subtype1" : "ring",
                "subtype2" : "green",
                "color": "black"
                 },

                
 "cyan ring with green gem" : { 
                "name" : "cyan ring with green gem" , 
                "image" : "ring_green_cyan.png",
                "subtype1" : "ring",
                "subtype2" : "green",
                "color": "cyan"
                 },

                
 "silver ring with red gem" : { 
                "name" : "silver ring with red gem" , 
                "image" : "ring_red_silver.png",
                "subtype1" : "ring",
                "subtype2" : "red",
                "color": "silver"
                 },

                
 "yellow ring with red gem" : { 
                "name" : "yellow ring with red gem" , 
                "image" : "ring_red_yellow.png",
                "subtype1" : "ring",
                "subtype2" : "red",
                "color": "yellow"
                 },

                
 "black ring with red gem" : { 
                "name" : "black ring with red gem" , 
                "image" : "ring_red_black.png",
                "subtype1" : "ring",
                "subtype2" : "red",
                "color": "black"
                 },

                
 "cyan ring with red gem" : { 
                "name" : "cyan ring with red gem" , 
                "image" : "ring_red_cyan.png",
                "subtype1" : "ring",
                "subtype2" : "red",
                "color": "cyan"
                 },

                
 "red ring with purple gem" : { 
                "name" : "red ring with purple gem" , 
                "image" : "ring_purple_red.png",
                "subtype1" : "ring",
                "subtype2" : "purple",
                "color": "red"
                 },

                
 "silver ring with purple gem" : { 
                "name" : "silver ring with purple gem" , 
                "image" : "ring_purple_silver.png",
                "subtype1" : "ring",
                "subtype2" : "purple",
                "color": "silver"
                 },

                
 "yellow ring with purple gem" : { 
                "name" : "yellow ring with purple gem" , 
                "image" : "ring_purple_yellow.png",
                "subtype1" : "ring",
                "subtype2" : "purple",
                "color": "yellow"
                 },

                
 "black ring with purple gem" : { 
                "name" : "black ring with purple gem" , 
                "image" : "ring_purple_black.png",
                "subtype1" : "ring",
                "subtype2" : "purple",
                "color": "black"
                 },

                
 "cyan ring with purple gem" : { 
                "name" : "cyan ring with purple gem" , 
                "image" : "ring_purple_cyan.png",
                "subtype1" : "ring",
                "subtype2" : "purple",
                "color": "cyan"
                 },

                
 "red ring with black gem" : { 
                "name" : "red ring with black gem" , 
                "image" : "ring_black_red.png",
                "subtype1" : "ring",
                "subtype2" : "black",
                "color": "red"
                 },

                
 "silver ring with black gem" : { 
                "name" : "silver ring with black gem" , 
                "image" : "ring_black_silver.png",
                "subtype1" : "ring",
                "subtype2" : "black",
                "color": "silver"
                 },

                
 "yellow ring with black gem" : { 
                "name" : "yellow ring with black gem" , 
                "image" : "ring_black_yellow.png",
                "subtype1" : "ring",
                "subtype2" : "black",
                "color": "yellow"
                 },

                
 "cyan ring with black gem" : { 
                "name" : "cyan ring with black gem" , 
                "image" : "ring_black_cyan.png",
                "subtype1" : "ring",
                "subtype2" : "black",
                "color": "cyan"
                 },

                
 "red ring with cyan gem" : { 
                "name" : "red ring with cyan gem" , 
                "image" : "ring_cyan_red.png",
                "subtype1" : "ring",
                "subtype2" : "cyan",
                "color": "red"
                 },

                
 "silver ring with cyan gem" : { 
                "name" : "silver ring with cyan gem" , 
                "image" : "ring_cyan_silver.png",
                "subtype1" : "ring",
                "subtype2" : "cyan",
                "color": "silver"
                 },

                
 "yellow ring with cyan gem" : { 
                "name" : "yellow ring with cyan gem" , 
                "image" : "ring_cyan_yellow.png",
                "subtype1" : "ring",
                "subtype2" : "cyan",
                "color": "yellow"
                 },

                
 "black ring with cyan gem" : { 
                "name" : "black ring with cyan gem" , 
                "image" : "ring_cyan_black.png",
                "subtype1" : "ring",
                "subtype2" : "cyan",
                "color": "black"
                 },

 "blue fire scroll" : { 
                "name" : "blue fire scroll" , 
                "image" : "scroll_blue_fire.png",
                "subtype1" : "scroll",
                "subtype2" : "fire",
                "color": "blue"
                 },

                
 "blue leaf scroll" : { 
                "name" : "blue leaf scroll" , 
                "image" : "scroll_blue_leaf.png",
                "subtype1" : "scroll",
                "subtype2" : "leaf",
                "color": "blue"
                 },

                
 "blue lightning scroll" : { 
                "name" : "blue lightning scroll" , 
                "image" : "scroll_blue_lightning.png",
                "subtype1" : "scroll",
                "subtype2" : "lightning",
                "color": "blue"
                 },

                
 "blue spiral scroll" : { 
                "name" : "blue spiral scroll" , 
                "image" : "scroll_blue_spiral.png",
                "subtype1" : "scroll",
                "subtype2" : "spiral",
                "color": "blue"
                 },

                
 "green fire scroll" : { 
                "name" : "green fire scroll" , 
                "image" : "scroll_green_fire.png",
                "subtype1" : "scroll",
                "subtype2" : "fire",
                "color": "green"
                 },

                
 "green lightning scroll" : { 
                "name" : "green lightning scroll" , 
                "image" : "scroll_green_lightning.png",
                "subtype1" : "scroll",
                "subtype2" : "lightning",
                "color": "green"
                 },

                
 "green water scroll" : { 
                "name" : "green water scroll" , 
                "image" : "scroll_green_water.png",
                "subtype1" : "scroll",
                "subtype2" : "water",
                "color": "green"
                 },

                
 "green spiral scroll" : { 
                "name" : "green spiral scroll" , 
                "image" : "scroll_green_spiral.png",
                "subtype1" : "scroll",
                "subtype2" : "spiral",
                "color": "green"
                 },

                
 "red leaf scroll" : { 
                "name" : "red leaf scroll" , 
                "image" : "scroll_red_leaf.png",
                "subtype1" : "scroll",
                "subtype2" : "leaf",
                "color": "red"
                 },

                
 "red lightning scroll" : { 
                "name" : "red lightning scroll" , 
                "image" : "scroll_red_lightning.png",
                "subtype1" : "scroll",
                "subtype2" : "lightning",
                "color": "red"
                 },

                
 "red water scroll" : { 
                "name" : "red water scroll" , 
                "image" : "scroll_red_water.png",
                "subtype1" : "scroll",
                "subtype2" : "water",
                "color": "red"
                 },

                
 "red spiral scroll" : { 
                "name" : "red spiral scroll" , 
                "image" : "scroll_red_spiral.png",
                "subtype1" : "scroll",
                "subtype2" : "spiral",
                "color": "red"
                 },

                
 "yellow fire scroll" : { 
                "name" : "yellow fire scroll" , 
                "image" : "scroll_yellow_fire.png",
                "subtype1" : "scroll",
                "subtype2" : "fire",
                "color": "yellow"
                 },

                
 "yellow leaf scroll" : { 
                "name" : "yellow leaf scroll" , 
                "image" : "scroll_yellow_leaf.png",
                "subtype1" : "scroll",
                "subtype2" : "leaf",
                "color": "yellow"
                 },

                
 "yellow water scroll" : { 
                "name" : "yellow water scroll" , 
                "image" : "scroll_yellow_water.png",
                "subtype1" : "scroll",
                "subtype2" : "water",
                "color": "yellow"
                 },

                
 "yellow spiral scroll" : { 
                "name" : "yellow spiral scroll" , 
                "image" : "scroll_yellow_spiral.png",
                "subtype1" : "scroll",
                "subtype2" : "spiral",
                "color": "yellow"
                 },

                
 "silver fire scroll" : { 
                "name" : "silver fire scroll" , 
                "image" : "scroll_gray3_fire.png",
                "subtype1" : "scroll",
                "subtype2" : "fire",
                "color": "silver"
                 },

                
 "silver leaf scroll" : { 
                "name" : "silver leaf scroll" , 
                "image" : "scroll_gray3_leaf.png",
                "subtype1" : "scroll",
                "subtype2" : "leaf",
                "color": "silver"
                 },

                
 "silver lightning scroll" : { 
                "name" : "silver lightning scroll" , 
                "image" : "scroll_gray3_lightning.png",
                "subtype1" : "scroll",
                "subtype2" : "lightning",
                "color": "silver"
                 },

                
 "silver water scroll" : { 
                "name" : "silver water scroll" , 
                "image" : "scroll_gray3_water.png",
                "subtype1" : "scroll",
                "subtype2" : "water",
                "color": "silver"
                 },

                
 "silver spiral scroll" : { 
                "name" : "silver spiral scroll" , 
                "image" : "scroll_gray3_spiral.png",
                "subtype1" : "scroll",
                "subtype2" : "spiral",
                "color": "silver"
                 },

                
 "cyan fire scroll" : { 
                "name" : "cyan fire scroll" , 
                "image" : "scroll_cyan_fire.png",
                "subtype1" : "scroll",
                "subtype2" : "fire",
                "color": "cyan"
                 },

                
 "cyan leaf scroll" : { 
                "name" : "cyan leaf scroll" , 
                "image" : "scroll_cyan_leaf.png",
                "subtype1" : "scroll",
                "subtype2" : "leaf",
                "color": "cyan"
                 },

                
 "cyan lightning scroll" : { 
                "name" : "cyan lightning scroll" , 
                "image" : "scroll_cyan_lightning.png",
                "subtype1" : "scroll",
                "subtype2" : "lightning",
                "color": "cyan"
                 },

                
 "cyan water scroll" : { 
                "name" : "cyan water scroll" , 
                "image" : "scroll_cyan_water.png",
                "subtype1" : "scroll",
                "subtype2" : "water",
                "color": "cyan"
                 },

                
 "cyan spiral scroll" : { 
                "name" : "cyan spiral scroll" , 
                "image" : "scroll_cyan_spiral.png",
                "subtype1" : "scroll",
                "subtype2" : "spiral",
                "color": "cyan"
                 },

 "blue apple book" : { 
                "name" : "blue apple book" , 
                "image" : "book_blue_apple.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "blue"
                 },

                 


 "blue lemon book" : { 
                "name" : "blue lemon book" , 
                "image" : "book_blue_lemon.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "blue"
                 },

                 


 "blue tree book" : { 
                "name" : "blue tree book" , 
                "image" : "book_blue_tree.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "blue"
                 },

                 


 "blue volcano book" : { 
                "name" : "blue volcano book" , 
                "image" : "book_blue_volcano.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "blue"
                 },

                 


 "blue sparkle book" : { 
                "name" : "blue sparkle book" , 
                "image" : "book_blue_sparkle.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "blue"
                 },

                 


 "green apple book" : { 
                "name" : "green apple book" , 
                "image" : "book_green_apple.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "green"
                 },

                 


 "green lemon book" : { 
                "name" : "green lemon book" , 
                "image" : "book_green_lemon.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "green"
                 },

                 


 "green volcano book" : { 
                "name" : "green volcano book" , 
                "image" : "book_green_volcano.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "green"
                 },

                 


 "green sparkle book" : { 
                "name" : "green sparkle book" , 
                "image" : "book_green_sparkle.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "green"
                 },

                 


 "red lemon book" : { 
                "name" : "red lemon book" , 
                "image" : "book_red_lemon.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "red"
                 },

                 


 "red tree book" : { 
                "name" : "red tree book" , 
                "image" : "book_red_tree.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "red"
                 },

                 


 "red sparkle book" : { 
                "name" : "red sparkle book" , 
                "image" : "book_red_sparkle.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "red"
                 },

                 


 "yellow apple book" : { 
                "name" : "yellow apple book" , 
                "image" : "book_yellow_apple.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "yellow"
                 },

                 


 "yellow tree book" : { 
                "name" : "yellow tree book" , 
                "image" : "book_yellow_tree.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "yellow"
                 },

                 


 "yellow volcano book" : { 
                "name" : "yellow volcano book" , 
                "image" : "book_yellow_volcano.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "yellow"
                 },

                 


 "yellow sparkle book" : { 
                "name" : "yellow sparkle book" , 
                "image" : "book_yellow_sparkle.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "yellow"
                 },

                 


 "black apple book" : { 
                "name" : "black apple book" , 
                "image" : "book_black_apple.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "black"
                 },

                 


 "black lemon book" : { 
                "name" : "black lemon book" , 
                "image" : "book_black_lemon.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "black"
                 },

                 


 "black tree book" : { 
                "name" : "black tree book" , 
                "image" : "book_black_tree.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "black"
                 },

                 


 "black volcano book" : { 
                "name" : "black volcano book" , 
                "image" : "book_black_volcano.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "black"
                 },

                 


 "black sparkle book" : { 
                "name" : "black sparkle book" , 
                "image" : "book_black_sparkle.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "black"
                 },

                 


 "purple apple book" : { 
                "name" : "purple apple book" , 
                "image" : "book_purple_apple.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "purple"
                 },

                 


 "purple lemon book" : { 
                "name" : "purple lemon book" , 
                "image" : "book_purple_lemon.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "purple"
                 },

                 


 "purple tree book" : { 
                "name" : "purple tree book" , 
                "image" : "book_purple_tree.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "purple"
                 },

                 


 "purple volcano book" : { 
                "name" : "purple volcano book" , 
                "image" : "book_purple_volcano.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "purple"
                 },
				 
 "blue amulet" : { 
                "name" : "blue amulet" , 
                "image" : "amulet_blue.png",
                "subtype1" : "amulet",
                "subtype2" : "",
                "color": "blue"
                 },



 "green amulet" : { 
                "name" : "green amulet" , 
                "image" : "amulet_green.png",
                "subtype1" : "amulet",
                "subtype2" : "",
                "color": "green"
                 },



 "red amulet" : { 
                "name" : "red amulet" , 
                "image" : "amulet_red.png",
                "subtype1" : "amulet",
                "subtype2" : "",
                "color": "red"
                 },



 "yellow amulet" : { 
                "name" : "yellow amulet" , 
                "image" : "amulet_yellow.png",
                "subtype1" : "amulet",
                "subtype2" : "",
                "color": "yellow"
                 },



 "black amulet" : { 
                "name" : "black amulet" , 
                "image" : "amulet_black.png",
                "subtype1" : "amulet",
                "subtype2" : "",
                "color": "black"
                 },
 "blue star" : { 
                "name" : "blue star" , 
                "image" : "star_blue.png",
                "subtype1" : "star",
                "subtype2" : "",
                "color": "blue"
                 },



 "green star" : { 
                "name" : "green star" , 
                "image" : "star_green.png",
                "subtype1" : "star",
                "subtype2" : "",
                "color": "green"
                 },



 "red star" : { 
                "name" : "red star" , 
                "image" : "star_red.png",
                "subtype1" : "star",
                "subtype2" : "",
                "color": "red"
                 },



 "yellow star" : { 
                "name" : "yellow star" , 
                "image" : "star_yellow.png",
                "subtype1" : "star",
                "subtype2" : "",
                "color": "yellow"
                 },



 "black star" : { 
                "name" : "black star" , 
                "image" : "star_black.png",
                "subtype1" : "star",
                "subtype2" : "",
                "color": "black"
                 },



 "purple star" : { 
                "name" : "purple star" , 
                "image" : "star_purple.png",
                "subtype1" : "star",
                "subtype2" : "",
                "color": "purple"
                 },



 "silver star" : { 
                "name" : "silver star" , 
                "image" : "star_silver.png",
                "subtype1" : "star",
                "subtype2" : "",
                "color": "silver"
                 },				 
				 
 "blue flower" : { 
                "name" : "blue flower" , 
                "image" : "flower_blue.png",
                "subtype1" : "flower",
                "subtype2" : "",
                "color": "blue"
                 },



 "green flower" : { 
                "name" : "green flower" , 
                "image" : "flower_green.png",
                "subtype1" : "flower",
                "subtype2" : "",
                "color": "green"
                 },



 "red flower" : { 
                "name" : "red flower" , 
                "image" : "flower_red.png",
                "subtype1" : "flower",
                "subtype2" : "",
                "color": "red"
                 },



 "yellow flower" : { 
                "name" : "yellow flower" , 
                "image" : "flower_yellow.png",
                "subtype1" : "flower",
                "subtype2" : "",
                "color": "yellow"
                 },



 "black flower" : { 
                "name" : "black flower" , 
                "image" : "flower_black.png",
                "subtype1" : "flower",
                "subtype2" : "",
                "color": "black"
                 },



 "purple flower" : { 
                "name" : "purple flower" , 
                "image" : "flower_purple.png",
                "subtype1" : "flower",
                "subtype2" : "",
                "color": "purple"
                 },



 "silver flower" : { 
                "name" : "silver flower" , 
                "image" : "flower_silver.png",
                "subtype1" : "flower",
                "subtype2" : "",
                "color": "silver"
                 },

 "blue potion" : { 
                "name" : "blue potion" , 
                "image" : "potion_blue.png",
                "subtype1" : "potion",
                "subtype2" : "",
                "color": "blue"
                 },



 "green potion" : { 
                "name" : "green potion" , 
                "image" : "potion_green.png",
                "subtype1" : "potion",
                "subtype2" : "",
                "color": "green"
                 },



 "red potion" : { 
                "name" : "red potion" , 
                "image" : "potion_red.png",
                "subtype1" : "potion",
                "subtype2" : "",
                "color": "red"
                 },



 "yellow potion" : { 
                "name" : "yellow potion" , 
                "image" : "potion_yellow.png",
                "subtype1" : "potion",
                "subtype2" : "",
                "color": "yellow"
                 },



 "black potion" : { 
                "name" : "black potion" , 
                "image" : "potion_black.png",
                "subtype1" : "potion",
                "subtype2" : "",
                "color": "black"
                 },



 "purple potion" : { 
                "name" : "purple potion" , 
                "image" : "potion_purple.png",
                "subtype1" : "potion",
                "subtype2" : "",
                "color": "purple"
                 },



 "silver potion" : { 
                "name" : "silver potion" , 
                "image" : "potion_silver.png",
                "subtype1" : "potion",
                "subtype2" : "",
                "color": "silver"
                 },
				 
 "blue coin" : { 
                "name" : "blue coin" , 
                "image" : "coin_blue.png",
                "subtype1" : "coin",
                "subtype2" : "",
                "color": "blue"
                 },



 "green coin" : { 
                "name" : "green coin" , 
                "image" : "coin_green.png",
                "subtype1" : "coin",
                "subtype2" : "",
                "color": "green"
                 },



 "red coin" : { 
                "name" : "red coin" , 
                "image" : "coin_red.png",
                "subtype1" : "coin",
                "subtype2" : "",
                "color": "red"
                 },



 "yellow coin" : { 
                "name" : "yellow coin" , 
                "image" : "coin_yellow.png",
                "subtype1" : "coin",
                "subtype2" : "",
                "color": "yellow"
                 },

 "purple coin" : { 
                "name" : "purple coin" , 
                "image" : "coin_purple.png",
                "subtype1" : "coin",
                "subtype2" : "",
                "color": "purple"
                 },



 "silver coin" : { 
                "name" : "silver coin" , 
                "image" : "coin_silver.png",
                "subtype1" : "coin",
                "subtype2" : "",
                "color": "silver"
                 },
 "blue wand" : { 
                "name" : "blue wand" , 
                "image" : "wand_blue.png",
                "subtype1" : "wand",
                "subtype2" : "",
                "color": "blue"
                 },



 "green wand" : { 
                "name" : "green wand" , 
                "image" : "wand_green.png",
                "subtype1" : "wand",
                "subtype2" : "",
                "color": "green"
                 },



 "red wand" : { 
                "name" : "red wand" , 
                "image" : "wand_red.png",
                "subtype1" : "wand",
                "subtype2" : "",
                "color": "red"
                 },



 "yellow wand" : { 
                "name" : "yellow wand" , 
                "image" : "wand_yellow.png",
                "subtype1" : "wand",
                "subtype2" : "",
                "color": "yellow"
                 },



 "purple wand" : { 
                "name" : "purple wand" , 
                "image" : "wand_purple.png",
                "subtype1" : "wand",
                "subtype2" : "",
                "color": "purple"
                 },



 "silver wand" : { 
                "name" : "silver wand" , 
                "image" : "wand_silver.png",
                "subtype1" : "wand",
                "subtype2" : "",
                "color": "silver"
                 },
 "blue leaf" : { 
                "name" : "blue leaf" , 
                "image" : "leaf_blue.png",
                "subtype1" : "leaf",
                "subtype2" : "",
                "color": "blue"
                 },



 "green leaf" : { 
                "name" : "green leaf" , 
                "image" : "leaf_green.png",
                "subtype1" : "leaf",
                "subtype2" : "",
                "color": "green"
                 },



 "red leaf" : { 
                "name" : "red leaf" , 
                "image" : "leaf_red.png",
                "subtype1" : "leaf",
                "subtype2" : "",
                "color": "red"
                 },



 "yellow leaf" : { 
                "name" : "yellow leaf" , 
                "image" : "leaf_yellow.png",
                "subtype1" : "leaf",
                "subtype2" : "",
                "color": "yellow"
                 },



 "purple leaf" : { 
                "name" : "purple leaf" , 
                "image" : "leaf_purple.png",
                "subtype1" : "leaf",
                "subtype2" : "",
                "color": "purple"
                 },



 "silver leaf" : { 
                "name" : "silver leaf" , 
                "image" : "leaf_silver.png",
                "subtype1" : "leaf",
                "subtype2" : "",
                "color": "silver"
                 },
 "blue gem" : { 
                "name" : "blue gem" , 
                "image" : "gem_blue.png",
                "subtype1" : "gem",
                "subtype2" : "",
                "color": "blue"
                 },



 "green gem" : { 
                "name" : "green gem" , 
                "image" : "gem_green.png",
                "subtype1" : "gem",
                "subtype2" : "",
                "color": "green"
                 },



 "red gem" : { 
                "name" : "red gem" , 
                "image" : "gem_red.png",
                "subtype1" : "gem",
                "subtype2" : "",
                "color": "red"
                 },



 "yellow gem" : { 
                "name" : "yellow gem" , 
                "image" : "gem_yellow.png",
                "subtype1" : "gem",
                "subtype2" : "",
                "color": "yellow"
                 },



 "purple gem" : { 
                "name" : "purple gem" , 
                "image" : "gem_purple.png",
                "subtype1" : "gem",
                "subtype2" : "",
                "color": "purple"
                 },



 "silver gem" : { 
                "name" : "silver gem" , 
                "image" : "gem_silver.png",
                "subtype1" : "gem",
                "subtype2" : "", 
                "color": "silver"
                 },

}

//waypoint monsterClasses


export var monsterClasses = {
	 "goblin": {
            "name" : "goblin",
            "speed" : 3,
            "width": 80,
            "height" : 80,
            "images" : [ 

 { "link" : ["goblin_blue.png", "goblin_blue_attack.png"], "color":"blue"},  
 { "link" : ["goblin_green.png", "goblin_green_attack.png"], "color":"green"},  
 { "link" : ["goblin_red.png", "goblin_red_attack.png"], "color":"red"},  
 { "link" : ["goblin_yellow.png", "goblin_yellow_attack.png"], "color":"yellow"},  
 { "link" : ["goblin_black.png", "goblin_black_attack.png"], "color":"black"},  

            ]
        } ,
		
	"fairy": {
            "name" : "fairy",
            "speed" : 4,
            "width": 70,
            "height" : 70,
            "images" : [
            
  { "link" : ["fairy_blue.png", "fairy_blue_attack.png"], "color":"blue"},
  { "link" : ["fairy_green.png", "fairy_green_attack.png"], "color":"green"},
  { "link" : ["fairy_red.png", "fairy_red_attack.png"], "color":"red"},
  { "link" : ["fairy_yellow.png", "fairy_yellow_attack.png"], "color":"yellow"},
  { "link" : ["fairy_purple.png", "fairy_purple_attack.png"], "color":"purple"},
  { "link" : ["fairy_black.png", "fairy_black_attack.png"], "color":"black"},
  { "link" : ["fairy_white.png", "fairy_white_attack.png"], "color":"white"},

            ]
        } ,

 "wraith": {
            "name" : "wraith",
            "speed" : 4,
            "width": 70,
            "height" : 70,
            "images" : [
            
  { "link" : ["wraith_blue.png", "wraith_blue_attack.png"], "color":"blue"},
  { "link" : ["wraith_green.png", "wraith_green_attack.png"], "color":"green"},
  { "link" : ["wraith_red.png", "wraith_red_attack.png"], "color":"red"},
  { "link" : ["wraith_yellow.png", "wraith_yellow_attack.png"], "color":"yellow"},
  { "link" : ["wraith_purple.png", "wraith_purple_attack.png"], "color":"purple"},

            ]
        } ,

 "magic_sword": {
            "name" : "magic sword",
            "speed" : 4,
            "width": 70,
            "height" : 70,
            "images" : [
            
  { "link" : ["magic_sword_blue.png", "magic_sword_blue_attack.png"], "color":"blue"},
  { "link" : ["magic_sword_green.png", "magic_sword_green_attack.png"], "color":"green"},
  { "link" : ["magic_sword_red.png", "magic_sword_red_attack.png"], "color":"red"},
  { "link" : ["magic_sword_yellow.png", "magic_sword_yellow_attack.png"], "color":"yellow"},
  { "link" : ["magic_sword_purple.png", "magic_sword_purple_attack.png"], "color":"purple"},
  { "link" : ["magic_sword_white.png", "magic_sword_white_attack.png"], "color":"white"},
  { "link" : ["magic_sword_black.png", "magic_sword_black_attack.png"], "color":"black"},

            ]
        } ,

 "chicken": {
            "name" : "chicken",
            "speed" : 2,
            "width": 70,
            "height" : 70,
            "images" : [
            
  { "link" : ["chicken_blue.png", "chicken_blue_attack.png"], "color":"blue"},
  { "link" : ["chicken_green.png", "chicken_green_attack.png"], "color":"green"},
  { "link" : ["chicken_yellow.png", "chicken_yellow_attack.png"], "color":"yellow"},
  { "link" : ["chicken_purple.png", "chicken_purple_attack.png"], "color":"purple"},
  { "link" : ["chicken_white.png", "chicken_white_attack.png"], "color":"white"},

            ]
        } ,

 "blob": {
            "name" : "blob",
            "speed" : 2,
            "width": 70,
            "height" : 70,
            "images" : [
            
  { "link" : ["blob_blue.png", "blob_blue_attack.png"], "color":"blue"},
  { "link" : ["blob_green.png", "blob_green_attack.png"], "color":"green"},
  { "link" : ["blob_yellow.png", "blob_yellow_attack.png"], "color":"yellow"},
  { "link" : ["blob_purple.png", "blob_purple_attack.png"], "color":"purple"},
  { "link" : ["blob_white.png", "blob_white_attack.png"], "color":"white"},
  { "link" : ["blob_black.png", "blob_black_attack.png"], "color":"black"},
  { "link" : ["blob_red.png", "blob_red_attack.png"], "color":"red"},

            ]
        } ,
 "living armor": {
            "name" : "living armor",
            "speed" : 1.2,
            "width": 80,
            "height" : 80,
            "images" : [ 

 { "link" : ["living_armor_blue.png" ,"living_armor_blue_attack.png"], "color":"blue"},  
 { "link" : ["living_armor_green.png" ,"living_armor_green_attack.png"], "color":"green"},  
 { "link" : ["living_armor_red.png" ,"living_armor_red_attack.png"], "color":"red"},  
 { "link" : ["living_armor_yellow.png" ,"living_armor_yellow_attack.png"], "color":"yellow"},  
 { "link" : ["living_armor_black.png" ,"living_armor_black_attack.png"], "color":"black"},  
 { "link" : ["living_armor_white.png" ,"living_armor_white_attack.png"], "color":"white"},  
 { "link" : ["living_armor_purple.png" ,"living_armor_purple_attack.png"], "color":"purple"},  

            ]
        } ,
		
	 "wisp": {
            "name" : "wisp",
            "speed" : 3.2,
            "width": 80,
            "height" : 80,
            "images" : [ 

 { "link" : ["wisp_blue.png" ,"wisp_blue_attack.png"], "color":"blue"},  
 { "link" : ["wisp_green.png" ,"wisp_green_attack.png"], "color":"green"},  
 { "link" : ["wisp_red.png" ,"wisp_red_attack.png"], "color":"red"},  
 { "link" : ["wisp_yellow.png" ,"wisp_yellow_attack.png"], "color":"yellow"},  
 { "link" : ["wisp_white.png" ,"wisp_white_attack.png"], "color":"white"},  
 { "link" : ["wisp_purple.png" ,"wisp_purple_attack.png"], "color":"purple"},  

            ]
        }, 

 "dragon": {
            "name" : "dragon",
            "speed" : 3,
            "width": 80,
            "height" : 80,
            "images" : [ 

 { "link" : ["dragon_blue.png" ,"dragon_blue_attack.png"], "color":"blue"},  
 { "link" : ["dragon_green.png" ,"dragon_green_attack.png"], "color":"green"},  
 { "link" : ["dragon_red.png" ,"dragon_red_attack.png"], "color":"red"},  
 { "link" : ["dragon_yellow.png" ,"dragon_yellow_attack.png"], "color":"yellow"},  
 { "link" : ["dragon_white.png" ,"dragon_white_attack.png"], "color":"white"},  
 { "link" : ["dragon_purple.png" ,"dragon_purple_attack.png"], "color":"purple"},  
 { "link" : ["dragon_black.png" ,"dragon_black_attack.png"], "color":"black"},  

            ]
        }, 		
		
 "insect": {
            "name" : "insect",
            "speed" : 4,
            "width": 80,
            "height" : 80,
            "images" : [ 

 { "link" : ["insect_blue.png" ,"insect_blue_attack.png"], "color":"blue"},  
 { "link" : ["insect_green.png" ,"insect_green_attack.png"], "color":"green"},  
 { "link" : ["insect_red.png" ,"insect_red_attack.png"], "color":"red"},  
 { "link" : ["insect_yellow.png" ,"insect_yellow_attack.png"], "color":"yellow"},  
 { "link" : ["insect_white.png" ,"insect_white_attack.png"], "color":"white"},  
 { "link" : ["insect_purple.png" ,"insect_purple_attack.png"], "color":"purple"},  
 { "link" : ["insect_black.png" ,"insect_black_attack.png"], "color":"black"},  

            ]
        }, 		
		
		
	 "tree": {
            "name" : "tree",
            "speed" : 0.3,
            "width": 80,
            "height" : 80,
            "images" : [ 

 { "link" : ["tree_blue.png" ,"tree_blue_attack.png"], "color":"blue"},  
 { "link" : ["tree_green.png" ,"tree_green_attack.png"], "color":"green"},  
 { "link" : ["tree_red.png" ,"tree_red_attack.png"], "color":"red"},  
 { "link" : ["tree_yellow.png" ,"tree_yellow_attack.png"], "color":"yellow"},  
 { "link" : ["tree_white.png" ,"tree_white_attack.png"], "color":"white"},  
 { "link" : ["tree_purple.png" ,"tree_purple_attack.png"], "color":"purple"},  
 { "link" : ["tree_black.png" ,"tree_black_attack.png"], "color":"black"},  

            ]
        }, 	
		
		
		
		
}


//waypoint chestItems
export var chestItems = {

 	"blue chest" : {
		name : "blue chest",
		image : "chest_blue.png",
		subtype1 : "",
		color : "blue",
		width : 80,
		height : 80,
	},



 	"green chest" : {
		name : "green chest",
		image : "chest_green.png",
		subtype1 : "",
		color : "green",
		width : 80,
		height : 80,
	},



 	"red chest" : {
		name : "red chest",
		image : "chest_red.png",
		subtype1 : "",
		color : "red",
		width : 80,
		height : 80,
	},



 	"yellow chest" : {
		name : "yellow chest",
		image : "chest_yellow.png",
		subtype1 : "",
		color : "yellow",
		width : 80,
		height : 80,
	},



 	"purple chest" : {
		name : "purple chest",
		image : "chest_purple.png",
		subtype1 : "",
		color : "purple",
		width : 80,
		height : 80,
	},



 	"silver chest" : {
		name : "silver chest",
		image : "chest_silver.png",
		subtype1 : "",
		color : "silver",
		width : 80,
		height : 80,
	},
	
}

//waypoint npcItems
export var npcItems = {

	
	 "blue hooded guy" : { 
                "name" : "blue hooded guy" , 
                "image" : "hooded_guy_blue.png",
                "subtype1" : "",
                "color": "blue",
		width : 70,
		height : 70,
                 },

                
 "green hooded guy" : { 
                "name" : "green hooded guy" , 
                "image" : "hooded_guy_green.png",
                "subtype1" : "",
                "color": "green",
		width : 70,
		height : 70,
                 },

                
 "red hooded guy" : { 
                "name" : "red hooded guy" , 
                "image" : "hooded_guy_red.png",
                "subtype1" : "",
                "color": "red",
		width : 70,
		height : 70,
                 },

                
 "yellow hooded guy" : { 
                "name" : "yellow hooded guy" , 
                "image" : "hooded_guy_yellow.png",
                "subtype1" : "",
                "color": "yellow",
		width : 70,
		height : 70,
                 },

                
 "purple hooded guy" : { 
                "name" : "purple hooded guy" , 
                "image" : "hooded_guy_purple.png",
                "subtype1" : "",
                "color": "purple",
		width : 70,
		height : 70,
                 },
	
 "blue devil face" : { 
                "name" : "blue devil face" , 
                "image" : "devil_face_blue.png",
                "subtype1" : "",
                "color": "blue",
		width : 60,
		height : 60,
                 },

                
 "green devil face" : { 
                "name" : "green devil face" , 
                "image" : "devil_face_green.png",
                "subtype1" : "",
                "color": "green",
		width : 60,
		height : 60,
                 },

                
 "red devil face" : { 
                "name" : "red devil face" , 
                "image" : "devil_face_red.png",
                "subtype1" : "",
                "color": "red",
		width : 60,
		height : 60,
                 },

                
 "yellow devil face" : { 
                "name" : "yellow devil face" , 
                "image" : "devil_face_yellow.png",
                "subtype1" : "",
                "color": "yellow",
		width : 60,
		height : 60,
                 },

                
 "purple devil face" : { 
                "name" : "purple devil face" , 
                "image" : "devil_face_purple.png",
                "subtype1" : "",
                "color": "purple",
		width : 60,
		height : 60,
                 },

                
 "white devil face" : { 
                "name" : "white devil face" , 
                "image" : "devil_face_white.png",
                "subtype1" : "",
                "color": "white",
		width : 60,
		height : 60,
                 },

                
 "black devil face" : { 
                "name" : "black devil face" , 
                "image" : "devil_face_black.png",
                "subtype1" : "",
                "color": "black",
		width : 60,
		height : 60,
                 },

}

//waypoint portals
export var portals = {
	"chaos door" : {
		name : "chaos door",
		image : ["chaos_door_locked.png", "chaos_door.png"],
		subtype1 : "",
		color : "red", // color should be the same for both locked and unlocked
		width : 80,
		height : 80,
	},
	"icy door" : {
		name : "icy door",
		image : ["icy_door_locked.png", "icy_door.png"],
		subtype1 : "",
		color : "blue", // color should be the same for both locked and unlocked
		width : 80,
		height : 80,
	},
	"swamp door" : {
		name : "swamp door",
		image : ["swamp_door_locked.png", "swamp_door.png"],
		subtype1 : "",
		color : "green", // color should be the same for both locked and unlocked
		width : 80,
		height : 80,
	},
	
	"black_tunnel" : {
		name : "black_tunnel",
		image : ["black_tunnel_locked.png", "black_tunnel.png"],
		subtype1 : "",
		color : "black", // color should be the same for both locked and unlocked
		width : 80,
		height : 80,
	}
}

// waypoint functions


/*  get an item at random from the given list, but cannot use color
 "prefer" is a list or set of strings. We want to choose from these whenever possible
 these functions all return triples [name  (only the name) of the item, whether or not we've seen it before, the value itself]
 returned values are always added to the list of seen items

get a key from obj. Let v = obj[key]
guarantee : v.color is not the color input
tries to choose from "prefer" if possible
repeat : if set to true, allow repeats to get a "prefer".
*/
export function getObj(obj,color, prefer, seed, repeat){
	// make it a set
	if(Array.isArray(prefer)){
		prefer = new Set(prefer);
	}
	var choices = Object.keys(obj).filter((x) => obj[x].color != color);
		
	if(repeat == false){
		var unseenChoices = choices.filter((x) => !usedItems.has(x));
		var unseenPreferredChoices = unseenChoices.filter((x) => prefer.has(x));
		var seen = false;
		if(unseenPreferredChoices.length != 0){
			var chosen = choice(unseenPreferredChoices, seed)
		} else if(unseenChoices.length != 0){
			var chosen = choice(unseenChoices, seed)
		}else if(choices.length != 0){
			var chosen = choice(choices, seed)
			seen = true;
			console.log("warning : getObj repeat false but forced to repeat");
		} else {
			throw new Error("cannot choose item")
		}
	} else if (repeat == true){
		var preferredChoices = choices.filter((x) => prefer.has(x));
		var unseenPreferredChoices = preferredChoices.filter((x) => !usedItems.has(x));		
	
		var seen = false;
		if(unseenPreferredChoices.length != 0){
			var chosen = choice(unseenPreferredChoices, seed)
		} else if(preferredChoices.length != 0){
			seen = true;
			var chosen = choice(preferredChoices, seed)
		}else if(choices.length != 0){
			var chosen = choice(choices, seed)
			
		} else {
			throw new Error("cannot choose item")
		}
	
	}
	
	usedItems.add(chosen)
	return [chosen , seen, obj[chosen]]
		
}

export function getMiscItem(color, prefer, seed){
	return getObj(miscItems, color, prefer, seed, false);
}

export function getMonster(color, prefer, seed){
	return getObj(monsterClasses, color, prefer, seed, true);
}

export function getChest(color, prefer, seed){
	return getObj(chestItems, color, prefer, seed, true);
}


export function getNpc(color, prefer, seed){
	return getObj(npcItems, color, prefer, seed, true);
}


export function getPortal(color, prefer, seed){
	return getObj(portals, color, prefer, seed, true);
}

export function getKey(color, prefer, seed){
	return getObj(keyItems, color, prefer, seed, false);
}

export function getImageForItem(name){
	if(keyItems[name] == undefined){
		return miscItems[name]["image"];
	} else {
		return keyItems[name]["image"];
	}
}

//getObj(obj,color, prefer, seed, repeat){
export function reset_(){
	usedItems = new Set()
	
}

export function loadAll(){
	// base items
	var baseImages = ["checkmark.png", "background.png", "cave.png",  "exclam.png", "glow_left.png", "glow_right.png","menu.png", "outside.png", "player_l.png", "player_l_attack.png", "player_r.png", "player_r_attack.png", "question.png", "scroll_left.png", "scroll_right.png", "signpost.png", "win.png", "cage.png", "boss_attack.png", "boss.png"];
	for(var image_ of  baseImages){
		loadImage("./images/" + image_)
	}
	// keys
	var keyImages =  Object.keys(keyItems).map((x) => keyItems[x].image);
	for(var image_ of  keyImages){
		loadImage("./images/items/" + image_)
	}	
	// items
	var miscImages =  Object.keys(miscItems).map((x) => miscItems[x].image);
	for(var image_ of  miscImages){
		loadImage("./images/items/" + image_)
	}	
	//monsters
	var monsterClassImages =  Object.keys(monsterClasses).map((x) => monsterClasses[x].images);
	for(var monster of  monsterClassImages){
		for(var image_ of monster){
			loadImage("./images/monsters/" + image_.link[0]);
			loadImage("./images/monsters/" + image_.link[1]);
		}
	}		
	//chest
	var chestImages =  Object.keys(chestItems).map((x) => chestItems[x].image);
	for(var image_ of  chestImages){
		loadImage("./images/chests/" + image_)
	}	
	//npcs
	var npcImages =  Object.keys(npcItems).map((x) => npcItems[x].image);
	for(var image_ of  npcImages){
		loadImage("./images/npcs/" + image_)
	}		
	//portal
	var portalImages =  Object.keys(portals).map((x) => portals[x].image);
	for(var image_ of  portalImages){
		loadImage("./images/portals/" + image_[0])
		loadImage("./images/portals/" + image_[1])
	}		
	
	// themes
	
	for(var theme of Object.keys(themeData)){
		var theme = themeData[theme];
		//background
		loadImage("./images/" + theme.background);
		//walls
		loadImage("./images/" + theme.wallImgString.left);
		loadImage("./images/" + theme.wallImgString.right);
		loadImage("./images/" + theme.wallImgString.up);
		loadImage("./images/" + theme.wallImgString.down);
		// decorations
		for(var decoration of theme.decorations){
			loadImage("./images/" + decoration);
		}
		//blocking decoratiosn
		for(var bd of theme.blockingDecorations){
			for(var image_ of bd.images){
				loadImage("./images/" + image_[2]);
			}
		}
	}
}