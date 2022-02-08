
import cv2
import numpy as np
import sys

sys.path.append("C:/Users/theleader/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *

print (""" "goblin": {
            "name" : "goblin",
            "speed" : 3,
            "width": 80,
            "height" : 80,
            "images" : [ 
""")

for color in ["blue","green","red","yellow","black"]:
            goblin = cv2.imread("goblin.png",cv2.IMREAD_UNCHANGED)
            cover = cv2.imread("goblin_cover.png",cv2.IMREAD_UNCHANGED)
            addTransparent(goblin, toColor(cover, colors[color][0], colors[color][1], colors[color][2]))
            cv2.imwrite("../../src/images/monsters/goblin_" + color +".png", goblin)
            
            print(f""" {{ "link" : "goblin_{color}.png", "color":"{color}"}},  """)

print("""
            ]
        } """)