import sys
import cv2
import numpy as np


sys.path.append("C:/Users/theleader/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *


for color in ["blue","green","red","purple","cyan","yellow","silver"]:
    for kind in ["key", "magic key", "spiked key", "triangle key"]:

            
            keyImg = cv2.imread(kind +".png",cv2.IMREAD_UNCHANGED)
            keyImg = toColor(keyImg, colors[color][0], colors[color][1], colors[color][2])
            #and write it
            cv2.imwrite("output/key_" + color + "_" + kind + ".png", keyImg)
            
            #object pool
            
            #name, image, subtype1, subtype2 (possibly), color (cannot match theme's background color)
            name = f"{color} {kind}"
            
            print(f""" "{name}" : {{ 
                "name" : "{name}" , 
                "image" : "key_{color}_{kind}.png",
                "subtype1" : "key",
                "subtype2" : "{kind}",
                "color": "{color}"
                 }},

                """)
