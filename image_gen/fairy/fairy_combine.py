
import cv2
import numpy as np
import sys

sys.path.append("C:/Users/theleader/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *

print(""" "fairy": {
            "name" : "fairy",
            "speed" : 4,
            "width": 70,
            "height" : 70,
            "images" : [
            """)


for color in ["blue","green","red","yellow","purple","black","white"]:
            base = cv2.imread("fairy.png",cv2.IMREAD_UNCHANGED)
            fill = cv2.imread("fairy_fill.png",cv2.IMREAD_UNCHANGED)
            addTransparent(base, toColorBrightness(fill, colors[color][0], colors[color][1], colors[color][2]))
            cv2.imwrite("output/fairy_" + color +".png", base)

            name = f"{color} fairy"
            print(f"""  {{ "link" : "fairy_{color}.png", "color":"{color}"}},""")

print("""
            ]
        } ,

""")
