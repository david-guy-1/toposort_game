
import cv2
import numpy as np
import sys

sys.path.append("C:/Users/theleader/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *



for color in ["blue","green","red","yellow","purple"]:
            base = cv2.imread("hooded_guy.png",cv2.IMREAD_UNCHANGED)
            fill = cv2.imread("hooded_guy_fill.png",cv2.IMREAD_UNCHANGED)
            addTransparent(base, toColorBrightness(fill, colors[color][0], colors[color][1], colors[color][2]))
            cv2.imwrite("output/hooded_guy_" + color +".png", base)

            name = f"{color} hooded guy"
            print(f""" "{name}" : {{ 
                "name" : "{name}" , 
                "image" : "hooded_guy_{color}.png",
                "subtype1" : "",
                "color": "{color}",
		width : 70,
		height : 70,
                 }},

                """)
