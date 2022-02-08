
import cv2
import numpy as np
import sys

sys.path.append("C:/Users/theleader/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *

print(""" "chicken": {
            "name" : "chicken",
            "speed" : 2,
            "width": 70,
            "height" : 70,
            "images" : [
            """)


for color in ["blue","green","yellow","purple","white",]:
            base = cv2.imread("chicken.png",cv2.IMREAD_UNCHANGED)
            fill = cv2.imread("chicken_fill.png",cv2.IMREAD_UNCHANGED)
            addTransparent(base, toColorBrightness(fill, colors[color][0], colors[color][1], colors[color][2]))
            cv2.imwrite("output/chicken_" + color +".png", base)

            name = f"{color} chicken"
            print(f"""  {{ "link" : "chicken_{color}.png", "color":"{color}"}},""")

print("""
            ]
        } ,

""")
