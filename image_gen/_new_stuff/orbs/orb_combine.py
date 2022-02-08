import sys
import cv2
import numpy as np


sys.path.append("D:/Desktop/games/toposort_game/image_gen")
#print(sys.path)
from base import *

forbiddenPairs = ["red explosion" , "red flame", "green leaf"]
for orb in ["blue","green","red","purple","cyan","yellow","silver"]:
    for insideObj in ["dagger","gem","flame","ghost","explosion", "leaf", "bomb"]:
        if(forbiddenPairs.count(orb + " " + insideObj) > 0):
            continue
        else:
            
            orbImg = cv2.imread("orb.png",cv2.IMREAD_UNCHANGED)
            orbReplace = cv2.imread("orb_replace.png",cv2.IMREAD_UNCHANGED)
            inside = cv2.imread(insideObj + ".png", cv2.IMREAD_UNCHANGED);
            #print(inside)
            #color the orb orb
            addTransparent(orbImg, toColor(orbReplace, colors[orb][0], colors[orb][1], colors[orb][2]))
            #add inside object
            addTransparent(orbImg, inside)
            #and write it
            cv2.imwrite("output/orb_" + orb + "_" + insideObj + ".png", orbImg) #gem color , circle color
            #cv2.imwrite("output/a.png", orbImg) #gem color , circle color
            
            #object pool
            
            #name, image, subtype1, subtype2 (possibly), color (cannot match theme's background color)
            name = f"{orb} orb with {insideObj}"
            
            print(f""" "{name}" : {{ 
                "name" : "{name}" , 
                "image" : "orb_{orb}_{insideObj}.png",
                "subtype1" : "orb",
                "subtype2" : "{insideObj}",
                "color": "{orb}"
                 }},

                """)
