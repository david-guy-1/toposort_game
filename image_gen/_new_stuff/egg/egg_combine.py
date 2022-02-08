
import cv2
import numpy as np
import sys


sys.path.append("D:/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *


forbiddenPairs = ["blue water", "red fire" ,"green leaf", "yellow lightning"]

for color in ["blue","green","red","yellow","gray3","cyan"]:
    for marking in ["m1.png", "m2.png", "m3.png", "m4.png"]:
        egg = toColorBrightness(cv2.imread("egg.png",cv2.IMREAD_UNCHANGED), colors[color][0], colors[color][1], colors[color][2])
        marking_img = cv2.imread(marking,cv2.IMREAD_UNCHANGED)
        filler = cv2.imread("egg_filler.png",cv2.IMREAD_UNCHANGED)
        #transform the egg's color
        addTransparent(egg, marking_img)
        addTransparent(filler, egg)
        if(color == "gray3"):
            color2 = "gray"
        else:
            color2 = color
        cv2.imwrite("./output/egg_" + color + "_" + marking[0:2] + ".png",filler)
