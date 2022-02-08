
import cv2
import numpy as np
import sys

sys.path.append("C:/Users/theleader/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *



for color in ["blue","green","red","yellow","black","purple","silver"]:
            base = cv2.imread("base.png",cv2.IMREAD_UNCHANGED)
            filler = cv2.imread("filler.png",cv2.IMREAD_UNCHANGED)
            addTransparent(base, toColorBrightness(filler, colors[color][0], colors[color][1], colors[color][2]))
            cv2.imwrite("output/star_" + color +".png", base) #gem color , circle color
            print(f"""
 "{color} star" : {{ 
                "name" : "{color} star" , 
                "image" : "star_{color}.png",
                "subtype1" : "star",
                "subtype2" : "",
                "color": "{color}"
                 }},

""")
