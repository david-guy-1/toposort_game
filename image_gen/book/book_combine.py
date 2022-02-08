
import cv2
import numpy as np
import sys

sys.path.append("C:/Users/theleader/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *


forbiddenPairs = ["red apple", "yellow lemon", "green tree", "red volcano", "purple sparkle"]
for color in ["blue","green","red","yellow","black","purple"]:
    for icon in ["apple","lemon","tree","volcano","sparkle"]:
        if(forbiddenPairs.count(color + " " + icon) > 0):
            continue
        else:
            base = cv2.imread("base.png",cv2.IMREAD_UNCHANGED)
            filler = cv2.imread("filler.png",cv2.IMREAD_UNCHANGED)
            icon_ = cv2.imread(icon+".png", cv2.IMREAD_UNCHANGED)
            addTransparent(base, toColorBrightness(filler, colors[color][0], colors[color][1], colors[color][2]))
            addTransparent(base, icon_)            
            cv2.imwrite(f"output/book_{color}_{icon}.png", base) #gem color , circle color
            name = f"{color} {icon} book"
            print(f"""

 "{name}" : {{ 
                "name" : "{name}" , 
                "image" : "book_{color}_{icon}.png",
                "subtype1" : "book",
                "subtype2" : "icon",
                "color": "{color}"
                 }},

                 """)
