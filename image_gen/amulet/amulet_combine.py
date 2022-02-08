
import cv2
import numpy as np
import sys

sys.path.append("C:/Users/theleader/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *



for color in ["blue","green","red","yellow","black"]:
            amulet = cv2.imread("amulet.png",cv2.IMREAD_UNCHANGED)
            gem = cv2.imread("gem.png",cv2.IMREAD_UNCHANGED)
            addTransparent(amulet, toColorBrightness(gem, colors[color][0], colors[color][1], colors[color][2]))
            cv2.imwrite("output/amulet_" + color +".png", amulet) #gem color , circle color
            print(f"""
 "{color} amulet" : {{ 
                "name" : "{color} amulet" , 
                "image" : "amulet_{color}.png",
                "subtype1" : "amulet",
                "subtype2" : "",
                "color": "{color}"
                 }},

""")
