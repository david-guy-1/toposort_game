
import cv2
import numpy as np
import sys


sys.path.append("C:/Users/theleader/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *


forbiddenPairs = ["blue water", "red fire" ,"green leaf", "yellow lightning"]

for scrollColor in ["blue","green","red","yellow","gray3","cyan"]:
    for symbol in ["fire","leaf", "lightning","water","spiral"]:
        if(forbiddenPairs.count(scrollColor + " " + symbol) > 0):
            continue
        else:
            scroll = toColorBrightness(cv2.imread("scroll.png",cv2.IMREAD_UNCHANGED), colors[scrollColor][0], colors[scrollColor][1], colors[scrollColor][2])
            symbol_ = cv2.imread(symbol + ".png",cv2.IMREAD_UNCHANGED)


            addTransparent(scroll, symbol_)            
            cv2.imwrite("../output/scroll_" + scrollColor + "_" + symbol + ".png", scroll) #gem color , circle color
#            print(scroll)
            if(scrollColor == "gray3"):
                scrollColor2 = "gray"
            else:
                scrollColor2 = scrollColor
            name = f"{scrollColor2} {symbol} scroll"
            print(f""" "{name}" : {{ 
                "name" : "{name}" , 
                "image" : "scroll_{scrollColor}_{symbol}.png",
                "subtype1" : "scroll",
                "subtype2" : "{symbol}",
                "color": "{scrollColor2}"
                 }},

                """)