import sys
import cv2
import numpy as np


sys.path.append("C:/Users/theleader/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *


for gemColor in ["blue","green","red","purple","black","cyan"]:
    for circleColor in ["red","silver","yellow","black","cyan"]:
        if(gemColor == circleColor):
            continue
        else:
            
            ring = cv2.imread("ring.png",cv2.IMREAD_UNCHANGED)
            ringBase = cv2.imread("ring_base.png",cv2.IMREAD_UNCHANGED)
            
            circlePart = cv2.imread("ring_green.png",cv2.IMREAD_UNCHANGED)
            gemPart = cv2.imread("ring_red.png",cv2.IMREAD_UNCHANGED)
            #first, start with the ring, (it contains the transparency information)

            #then, transform the parts and add them to the ring
            addTransparent(ring, toColor(gemPart, colors[gemColor][0], colors[gemColor][1], colors[gemColor][2]))
            addTransparent(ring, toColor(circlePart, colors[circleColor][0], colors[circleColor][1], colors[circleColor][2]))
            #finally add the baseRing to the ring
            addTransparent(ring, ringBase)
            #and write it
            cv2.imwrite("output/ring_" + gemColor + "_" + circleColor + ".png", ring) #gem color , circle color
            
            #object pool
            
            #name, image, subtype1, subtype2 (possibly), color (cannot match theme's background color)
            name = f"{circleColor} ring with {gemColor} gem"
            print(f""" "{name}" : {{ 
                "name" : "{name}" , 
                "image" : "ring_{gemColor}_{circleColor}.png",
                "subtype1" : "ring",
                "subtype2" : "{gemColor}",
                "color": "{circleColor}"
                 }},

                """)
