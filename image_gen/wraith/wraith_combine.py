
import cv2
import numpy as np
import sys

sys.path.append("C:/Users/theleader/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *

print(""" "wraith": {
            "name" : "wraith",
            "speed" : 4,
            "width": 70,
            "height" : 70,
            "images" : [
            """)


for color in ["blue","green","red","yellow","purple"]:
            base = cv2.imread("wraith.png",cv2.IMREAD_UNCHANGED)
            fill = cv2.imread("wraith_fill.png",cv2.IMREAD_UNCHANGED)
            addTransparent(base, toColorBrightness(fill, colors[color][0], colors[color][1], colors[color][2]))
            cv2.imwrite("output/wraith_" + color +".png", base)

            name = f"{color} wraith"
            print(f"""  {{ "link" : "wraith_{color}.png", "color":"{color}"}},""")

print("""
            ]
        } ,

""")
