
import cv2
import numpy as np
import sys

sys.path.append("C:/Users/theleader/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *

print (""" "tree": {
            "name" : "tree",
            "speed" : 0.3,
            "width": 80,
            "height" : 80,
            "images" : [ 
""")

for color in ["blue","green","red","yellow","white","purple","black"]:
            base = cv2.imread("base.png",cv2.IMREAD_UNCHANGED)
            cover = cv2.imread("cover.png",cv2.IMREAD_UNCHANGED)
            addTransparent(base, toColorBrightness(cover, colors[color][0], colors[color][1], colors[color][2]))
            cv2.imwrite("output/tree_" + color +".png", base)
            
            print(f""" {{ "link" : ["tree_{color}.png" ,"tree_{color}_attack.png"], "color":"{color}"}},  """)

print("""
            ]
        }, """)
